require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const Groq = require('groq-sdk');

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey123";

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });

app.get('/', (req, res) => {
    res.send('FitGenix API is running');
});

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    details: {
        age: { type: Number, default: 0 },
        height: { type: Number, default: 0 },
        weight: { type: Number, default: 0 },
        goalWeight: { type: Number, default: 0 },
        goal: { type: String, default: "Health Maintenance" },
    },
    dailyLogs: [{
        date: { type: String, required: true },
        exercises: [{
            name: String,
            sets: { type: Number, default: 0 },
            reps: { type: Number, default: 0 },
            completed: { type: Boolean, default: false }
        }],
        nutrition: {
            breakfast: [{ name: String, calories: Number, protein: String, carbs: String, fats: String }],
            lunch: [{ name: String, calories: Number, protein: String, carbs: String, fats: String }],
            dinner: [{ name: String, calories: Number, protein: String, carbs: String, fats: String }],
            snacks: [{ name: String, calories: Number, protein: String, carbs: String, fats: String }]
        },
        water: { type: Number, default: 0 }
    }],
    goals: {
        workouts: { type: Number, default: 5 },
        calories: { type: Number, default: 2500 },
        protein: { type: Number, default: 150 },
        carbs: { type: Number, default: 250 }
    }
});

const User = mongoose.model('User', userSchema);


app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: "Email already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            details: {},
            dailyLogs: []
        });

        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, SECRET_KEY, { expiresIn: '7d' });

        res.status(201).json({
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                details: newUser.details,
                isNewUser: true
            }
        });

    } catch (err) {
        console.error("Signup Error:", err);
        res.status(500).json({ error: "Server Error during signup" });
    }
});


app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '7d' });

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                details: user.details,
                isNewUser: user.details.age === 0
            }
        });

    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ error: "Server Error: " + err.message });
    }
});

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};


app.post('/api/user/details', authenticateToken, async (req, res) => {
    try {
        const { age, height, weight, goalWeight, goal } = req.body;
        await User.findByIdAndUpdate(req.user.id, {
            details: { age, height, weight, goalWeight, goal }
        });
        res.json({ success: true, message: "Profile updated" });
    } catch (err) {
        res.status(500).json({ error: "Failed to update profile" });
    }
});

app.get('/api/dashboard', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const { date } = req.query;
        const targetDate = date || new Date().toISOString().split('T')[0];

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];

        const originalLogCount = user.dailyLogs.length;
        user.dailyLogs = user.dailyLogs.filter(log => log.date >= sevenDaysAgoStr);
        if (user.dailyLogs.length !== originalLogCount) {
            await user.save();
        }

        let targetLog = user.dailyLogs.find(log => log.date === targetDate);
        if (!targetLog && targetDate === new Date().toISOString().split('T')[0]) {
            targetLog = { date: targetDate, exercises: [], nutrition: { breakfast: [], lunch: [], dinner: [], snacks: [] }, water: 0 };
            user.dailyLogs.push(targetLog);
            await user.save();
        }

        res.json({ user, todayLog: targetLog });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch dashboard" });
    }
});

// Log Exercise
app.post('/api/user/log/exercise', authenticateToken, async (req, res) => {
    try {
        const { name, sets, reps } = req.body;
        const today = new Date().toISOString().split('T')[0];
        const user = await User.findById(req.user.id);

        let todayLog = user.dailyLogs.find(log => log.date === today);
        if (!todayLog) {
            todayLog = { date: today, exercises: [], nutrition: { breakfast: [], lunch: [], dinner: [], snacks: [] }, water: 0 };
            user.dailyLogs.push(todayLog);
        }

        todayLog.exercises.push({ name, sets: sets || 0, reps: reps || 0, completed: false });
        await user.save();

        res.json({ success: true, todayLog });
    } catch (err) {
        console.error("Single Log Error:", err);
        res.status(500).json({ error: "Failed to log exercise" });
    }
});

// Bulk Log Exercises
app.post('/api/user/log/exercises/bulk', authenticateToken, async (req, res) => {
    try {
        const { exercises } = req.body;
        const today = new Date().toISOString().split('T')[0];
        const user = await User.findById(req.user.id);

        let todayLog = user.dailyLogs.find(log => log.date === today);
        if (!todayLog) {
            todayLog = { date: today, exercises: [], nutrition: { breakfast: [], lunch: [], dinner: [], snacks: [] }, water: 0 };
            user.dailyLogs.push(todayLog);
            todayLog = user.dailyLogs[user.dailyLogs.length - 1];
        }

        exercises.forEach(ex => {
            todayLog.exercises.push({
                name: ex.name,
                sets: ex.sets || 0,
                reps: ex.reps || 0,
                completed: false
            });
        });

        await user.save();
        res.json({ success: true, message: `${exercises.length} exercises added` });
    } catch (err) {
        console.error("Bulk Log Error:", err);
        res.status(500).json({ error: "Failed to log exercises in bulk" });
    }
});

// Log Food
app.post('/api/user/log/food', authenticateToken, async (req, res) => {
    try {
        const { mealType, foodItem } = req.body;
        const today = new Date().toISOString().split('T')[0];
        const user = await User.findById(req.user.id);

        let todayLog = user.dailyLogs.find(log => log.date === today);
        if (!todayLog) {
            todayLog = { date: today, exercises: [], nutrition: { breakfast: [], lunch: [], dinner: [], snacks: [] }, water: 0 };
            user.dailyLogs.push(todayLog);
        }

        const type = mealType.toLowerCase();
        if (todayLog.nutrition[type]) {
            todayLog.nutrition[type].push(foodItem);
            await user.save();
            res.json({ success: true, todayLog });
        } else {
            res.status(400).json({ error: "Invalid meal type" });
        }
    } catch (err) {
        res.status(500).json({ error: "Failed to log food" });
    }
});

// Toggle Exercise Completion
app.post('/api/user/log/exercise/toggle', authenticateToken, async (req, res) => {
    try {
        const { date, exerciseId } = req.body;
        const user = await User.findById(req.user.id);
        const log = user.dailyLogs.find(l => l.date === date);
        if (!log) return res.status(404).json({ error: "Log not found" });

        const exercise = log.exercises.id(exerciseId);
        if (!exercise) return res.status(404).json({ error: "Exercise not found" });

        exercise.completed = !exercise.completed;
        await user.save();
        res.json({ success: true, completed: exercise.completed });
    } catch (err) {
        res.status(500).json({ error: "Failed to toggle exercise" });
    }
});

// Delete Exercise
app.post('/api/user/log/exercise/delete', authenticateToken, async (req, res) => {
    try {
        const { date, exerciseId } = req.body;
        const user = await User.findById(req.user.id);
        const log = user.dailyLogs.find(l => l.date === date);
        if (!log) return res.status(404).json({ error: "Log not found" });

        log.exercises.pull(exerciseId);
        await user.save();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete exercise" });
    }
});

// Update User Goals
app.post('/api/user/goals', authenticateToken, async (req, res) => {
    try {
        const { workouts, calories, protein, carbs } = req.body;
        const user = await User.findById(req.user.id);

        if (workouts !== undefined) user.goals.workouts = workouts;
        if (calories !== undefined) user.goals.calories = calories;
        if (protein !== undefined) user.goals.protein = protein;
        if (carbs !== undefined) user.goals.carbs = carbs;

        await user.save();
        res.json({ success: true, goals: user.goals });
    } catch (err) {
        res.status(500).json({ error: "Failed to update goals" });
    }
});

const youtube = require('youtube-search-api');

const apiKeys = [
    process.env.GROQ_API_KEY,
    process.env.GROQ_API_KEY_BACKUP1,
    process.env.GROQ_API_KEY_BACKUP2
].filter(key => key);

let currentKeyIndex = 0;

function getGroqClient() {
    if (apiKeys.length === 0) return null;
    const apiKey = apiKeys[currentKeyIndex];
    return new Groq({ apiKey });
}

async function getGroqCompletion(messages) {
    if (apiKeys.length === 0) {
        throw new Error("No Groq API keys configured.");
    }

    for (let attempts = 0; attempts < apiKeys.length; attempts++) {
        try {
            const groq = getGroqClient();
            console.log(`Using Groq Key Index: ${currentKeyIndex}`);

            return await groq.chat.completions.create({
                messages: messages,
                model: "llama-3.3-70b-versatile",
            });
        } catch (error) {
            console.error(`Groq Error (Key Index ${currentKeyIndex}):`, error.message);

            currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;

            if (attempts === apiKeys.length - 1) {
                console.error("All Groq API keys failed.");
                throw error;
            }
        }
    }
}

app.post('/api/chatbot', async (req, res) => {
    const { message } = req.body;
    try {
        const completion = await getGroqCompletion([
            {
                role: "system",
                content: `You are FitGenix AI — a friendly, smart fitness and nutrition assistant.

Your communication style MUST follow these rules strictly:

TONE:
- Friendly, supportive, human-like.
- No robotic or textbook explanations.
- Avoid long paragraphs.

ANSWER LENGTH LOGIC:
1. If the question is SIMPLE (calories, definition, quick fact, yes/no):
   → Give ONLY 1–2 short lines.
   → No long explanations.
   Example: "1 cup cooked white rice has about 200–210 calories."

2. If the question is MODERATE or LONG:
   → First write 2–3 short lines as a mini paragraph.
   → Then give MAXIMUM 3 bullet points only.
   → End with a 1–2 line summary.

FORMATTING RULES:
- Never give long numbered lists.
- Never exceed 3 bullet points.
- Prefer short, readable sentences.
- Avoid repeating the same information.
- Do NOT include disclaimers unless health risk is involved.

FITNESS CONTEXT:
- Focus on practical fitness, nutrition, workouts, and lifestyle advice.
- Give actionable answers, not theory-heavy content.

Always prioritize clarity, minimal length, and friendly readability over detailed explanations.`
            },
            { role: "user", content: message }
        ]);
        const reply = completion.choices[0]?.message?.content || "No response generated.";
        res.json({ reply });
    } catch (error) {
        console.error("Chatbot Route Error:", error.message);
        res.status(500).json({ error: "AI Service Unavailable. Please check API Key." });
    }
});

app.post('/api/exercises', async (req, res) => {
    const { query } = req.body;
    try {
        const completion = await getGroqCompletion([
            { role: "system", content: "You are a world-class fitness coach. If the user searches for a body part or equipment, return exactly 6 matching exercises. Return ONLY valid JSON as an array of objects: [{ \"name\": \"Exercise Name\", \"steps\": [\"Step 1\", \"Step 2\"] }]. Do NOT include video IDs." },
            { role: "user", content: `Provide 6 highly relevant exercises for: ${query}` }
        ]);
        const content = completion.choices[0]?.message?.content;
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            let exercises = JSON.parse(jsonMatch[0]);

            // For each exercise, perform a real-time YouTube search to find the best tutorial ID
            const enrichedExercises = await Promise.all(exercises.map(async (ex) => {
                try {
                    const searchResults = await youtube.GetListByKeyword(`${ex.name} gym exercise tutorial`, false, 1);
                    const videoId = searchResults.items[0]?.id || "dQw4w9WgXcQ";
                    return { ...ex, videoId };
                } catch (searchError) {
                    console.error(`YouTube search failed for ${ex.name}`, searchError);
                    return { ...ex, videoId: "dQw4w9WgXcQ" };
                }
            }));

            res.json(enrichedExercises);
        } else {
            throw new Error("Invalid AI JSON format");
        }
    } catch (error) {
        console.error("Exercise AI Error:", error.message);
        const mockResults = Array.from({ length: 6 }).map((_, i) => ({
            name: `${query} Exercise ${i + 1}`,
            steps: ["Step 1: Focus on form.", "Step 2: Control the weight.", "Step 3: Breathe properly."],
            videoId: "dQw4w9WgXcQ"
        }));
        res.json(mockResults);
    }
});



app.post('/api/diet', async (req, res) => {
    const { query, servingSize } = req.body;
    try {
        const completion = await getGroqCompletion([
            { role: "system", content: "You are a nutritionist. Return ONLY valid JSON: { \"name\": \"Val\", \"calories\": 100, \"protein\": \"10g\", \"carbs\": \"20g\", \"fats\": \"5g\" }." },
            { role: "user", content: `Nutritional info for ${query} serving ${servingSize}` }
        ]);
        const content = completion.choices[0]?.message?.content;
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            res.json(JSON.parse(jsonMatch[0]));
        } else {
            throw new Error("Invalid AI JSON");
        }
    } catch (error) {
        console.error("Diet AI Fallback:", error.message);
        res.json({
            name: query,
            calories: 250,
            protein: "15g",
            carbs: "30g",
            fats: "10g",
            note: "Estimated values (AI Unavailable)"
        });
    }
});


app.post('/api/workout-plans', async (req, res) => {
    const { query } = req.body;
    try {
        const completion = await getGroqCompletion([
            {
                role: "system",
                content: `You are a professional fitness personal trainer. 
                Based on the user's request, generate a highly relevant workout plan.
                Return ONLY valid JSON as an array of objects: 
                [{ "name": "Exercise Name", "sets": 3, "reps": 12 }].
                Include exactly 5-8 exercises that fit the user's goal perfectly.
                No extra text, no conversation, just the JSON array.`
            },
            { role: "user", content: `Create a workout plan for: ${query}` }
        ]);

        const content = completion.choices[0]?.message?.content;
        const jsonMatch = content.match(/\[[\s\S]*\]/);

        if (jsonMatch) {
            let workoutPlan = JSON.parse(jsonMatch[0]);
            res.json(workoutPlan);
        } else {
            throw new Error("Invalid AI JSON format");
        }
    } catch (error) {
        console.error("Workout Plan AI Error:", error.message);
        const mockPlan = [
            { name: "Push Ups", sets: 3, reps: 15 },
            { name: "Bodyweight Squats", sets: 3, reps: 20 },
            { name: "Plank", sets: 3, reps: 60 },
            { name: "Lunges", sets: 3, reps: 12 },
            { name: "Mountain Climbers", sets: 3, reps: 30 }
        ];
        res.json(mockPlan);
    }
});


if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
