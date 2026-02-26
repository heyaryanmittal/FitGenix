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
    },
    mealPlan: {
        type: Map,
        of: new mongoose.Schema({
            breakfast: [{ name: String, calories: Number, protein: String, carbs: String, fats: String, notes: String }],
            lunch: [{ name: String, calories: Number, protein: String, carbs: String, fats: String, notes: String }],
            dinner: [{ name: String, calories: Number, protein: String, carbs: String, fats: String, notes: String }],
            snacks: [{ name: String, calories: Number, protein: String, carbs: String, fats: String, notes: String }]
        }, { _id: false }),
        default: {}
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

        res.json({ success: true, data: { user, todayLog: targetLog } });
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


// ─── Meal Planner Routes ────────────────────────────────────────────────────

// GET current meal plan
app.get('/api/meal-plan', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).lean(); // .lean() returns plain JS objects, not Mongoose docs
        // mealPlan is stored as a Map — convert to plain object
        let plan = {};
        if (user.mealPlan) {
            // With .lean(), Map becomes a plain object already; just force serialize to strip any leftover doc artifacts
            plan = JSON.parse(JSON.stringify(user.mealPlan));
        }
        res.json({ success: true, mealPlan: plan });
    } catch (err) {
        console.error('Get Meal Plan Error:', err);
        res.status(500).json({ error: 'Failed to fetch meal plan' });
    }
});

// SAVE / overwrite full meal plan
app.post('/api/meal-plan/save', authenticateToken, async (req, res) => {
    try {
        const { mealPlan } = req.body;
        const user = await User.findById(req.user.id);

        // Mongoose Map needs .set() or direct assignment + markModified
        user.mealPlan = mealPlan;
        user.markModified('mealPlan');

        // Find today's plan and sync it to todayLog
        const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        const todayPlan = mealPlan[todayName];

        if (todayPlan) {
            const todayStr = new Date().toISOString().split('T')[0];
            let logIndex = user.dailyLogs.findIndex(log => {
                const d = new Date(log.date);
                return !isNaN(d) && d.toISOString().split('T')[0] === todayStr;
            });

            if (logIndex === -1) {
                user.dailyLogs.push({ date: new Date(), exercises: [], nutrition: { breakfast: [], lunch: [], snacks: [], dinner: [] } });
                logIndex = user.dailyLogs.length - 1;
            }

            const todayLog = user.dailyLogs[logIndex];
            if (!todayLog.nutrition) todayLog.nutrition = { breakfast: [], lunch: [], snacks: [], dinner: [] };

            ['breakfast', 'lunch', 'snacks', 'dinner'].forEach(mealType => {
                const planned = todayPlan[mealType] || [];
                const logged = todayLog.nutrition[mealType] || [];

                planned.forEach(pItem => {
                    const exists = logged.some(lItem => lItem.name === pItem.name);
                    if (!exists) {
                        logged.push({
                            name: pItem.name,
                            calories: Number(pItem.calories) || 0,
                            protein: String(pItem.protein || '0g'),
                            carbs: String(pItem.carbs || '0g'),
                            fats: String(pItem.fats || '0g')
                        });
                    }
                });
                // Ensure Mongoose tracks the nested change
                todayLog.nutrition[mealType] = logged;
            });
            user.markModified('dailyLogs');
        }

        await user.save();
        res.json({ success: true });
    } catch (err) {
        console.error('Save Meal Plan Error:', err);
        res.status(500).json({ error: `Failed to save: ${err.message}` });
    }
});

// AI-GENERATE meal plan
app.post('/api/meal-plan/generate', authenticateToken, async (req, res) => {
    const { preferences, calorieGoal, dietType, dietPreference, allergies, days, startDay } = req.body;
    try {
        const user = await User.findById(req.user.id);
        const userCalories = calorieGoal || user?.goals?.calories || 2000;

        const dayList = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        const startIndex = startDay ? dayList.indexOf(startDay.toLowerCase()) : 0;
        const totalDays = Math.min(parseInt(days) || 7, 7);

        // Select 'n' days starting from startIndex, wrapping around if needed
        const allDays = [];
        for (let i = 0; i < totalDays; i++) {
            allDays.push(dayList[(startIndex + i) % 7]);
        }

        // Split into smaller batches to avoid token/rate limits and ensures higher quality
        const batchSize = 2; // Generate 2 days at a time for maximum reliability
        const batches = [];
        for (let i = 0; i < allDays.length; i += batchSize) {
            batches.push(allDays.slice(i, i + batchSize));
        }

        const systemPrompt = `You are an expert sports dietitian. Return ONLY valid compact JSON — no markdown, no explanation.
Format: an object with day-name keys. Each day: breakfast, lunch, dinner, snacks — arrays of food items.
Each food item: {"name":"...","calories":300,"protein":"25g","carbs":"30g","fats":"8g","notes":"tip"}.`;

        const mergedPlan = {};

        for (const batch of batches) {
            const userPrompt = `Create a meal plan ONLY for: ${batch.join(', ')}.
Daily target: ~${userCalories} kcal. 
Diet Style: ${dietType || 'balanced'}. 
Preference: ${dietPreference === 'veg' ? 'STRICT VEGETARIAN (No meat/fish/egg)' : 'NON-VEGETARIAN (Can include meat/fish/egg)'}.
Goals: ${preferences || 'general fitness'}. Avoid: ${allergies || 'none'}.
Return exactly ${batch.length} keys: ${batch.join(', ')}. No extra text.`;

            const completion = await getGroqCompletion([
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ]);

            const content = (completion.choices[0]?.message?.content || '').trim();
            let batchPlan = null;

            // Strip markdown code fences if model wrapped in ```json
            const stripped = content.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
            const jsonMatch = stripped.match(/\{[\s\S]*\}/);

            if (jsonMatch) {
                try {
                    batchPlan = JSON.parse(jsonMatch[0]);
                } catch (_) {
                    // Attempt recovery: trim to last complete day by finding last "}," pattern
                    try {
                        const raw = jsonMatch[0];
                        const lastComplete = raw.lastIndexOf(']\n  }');
                        if (lastComplete > 0) {
                            const repaired = raw.substring(0, lastComplete + 4) + '\n}';
                            batchPlan = JSON.parse(repaired);
                        }
                    } catch (recoverErr) {
                        console.error('JSON recovery failed for batch:', batch.join(', '));
                    }
                }
            }

            if (batchPlan) {
                Object.assign(mergedPlan, batchPlan);
            } else {
                throw new Error(`AI failed to generate a valid plan for: ${batch.join(', ')}. Please try again.`);
            }
        }

        res.json({ success: true, mealPlan: mergedPlan });
    } catch (err) {
        console.error('Generate Meal Plan Error:', err.message);
        res.status(500).json({ error: `AI generation failed: ${err.message}` });
    }
});

// SUGGEST ALTERNATIVE for a food item
app.post('/api/meal-plan/suggest-alternative', authenticateToken, async (req, res) => {
    const { foodItem, dietType, allergies } = req.body;
    try {
        const prompt = `You are a dietitian. The user wants a flexible alternative for this food: "${foodItem.name}".
Diet: ${dietType || 'balanced'}. Allergies to avoid: ${allergies || 'none'}.
The original has ${foodItem.calories} kcal, ${foodItem.protein} protein, ${foodItem.carbs} carbs, ${foodItem.fats} fats.
Return ONLY valid JSON for one replacement item: {"name":"...", "calories":123, "protein":"12g", "carbs":"15g", "fats":"4g", "notes":"Short suggestion why this works"}`;

        const completion = await getGroqCompletion([{ role: 'user', content: prompt }]);
        const content = (completion.choices[0]?.message?.content || '').trim();
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("Invalid AI response");

        res.json({ success: true, alternative: JSON.parse(jsonMatch[0]) });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE individual meal item from MEAL PLAN
app.delete('/api/meal-plan/item', authenticateToken, async (req, res) => {
    const { day, mealType, itemName } = req.body;
    try {
        const user = await User.findById(req.user.id);
        const dayKey = day.toLowerCase().trim();

        if (user.mealPlan && user.mealPlan.has(dayKey)) {
            const dayPlan = user.mealPlan.get(dayKey);
            if (dayPlan && dayPlan[mealType]) {
                // Filter out the specific item
                dayPlan[mealType] = dayPlan[mealType].filter(item => item.name !== itemName);
                user.mealPlan.set(dayKey, dayPlan);
                user.markModified('mealPlan');
                await user.save();
                return res.json({ success: true });
            }
        }
        res.status(404).json({ error: 'Item not found in meal plan' });
    } catch (err) {
        console.error('Delete Meal Plan Item Error:', err);
        res.status(500).json({ error: err.message });
    }
});

// DELETE individual meal item from dashboard (tracked items)
app.delete('/api/dashboard/meal-item', authenticateToken, async (req, res) => {
    const { date, mealType, itemName } = req.body;
    try {
        const user = await User.findById(req.user.id);
        const targetDate = new Date(date).toISOString().split('T')[0];

        const log = user.dailyLogs.find(l => {
            const d = (l.date instanceof Date) ? l.date : new Date(l.date);
            return !isNaN(d) && d.toISOString().split('T')[0] === targetDate;
        });

        if (log && log.nutrition && log.nutrition[mealType]) {
            log.nutrition[mealType] = log.nutrition[mealType].filter(item => item.name !== itemName);
            user.markModified('dailyLogs');
            await user.save();
            res.json({ success: true });
        } else {
            res.status(404).json({ error: 'Item not found' });
        }
    } catch (err) {
        console.error('Delete Meal Item Error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ─────────────────────────────────────────────────────────────────────────────

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
