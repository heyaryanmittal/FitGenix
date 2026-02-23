import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotification } from '../context/NotificationContext';
import { FaTrash } from 'react-icons/fa';
import API_URL from '../apiConfig';

const Modal = ({ isOpen, onClose, title, children }) => (
    <AnimatePresence>
        {isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl max-w-sm w-full border border-gray-100 dark:border-gray-700"
                >
                    <h3 className="text-2xl font-black mb-6 text-gray-800 dark:text-white">{title}</h3>
                    {children}
                    <button
                        onClick={onClose}
                        className="mt-6 w-full py-3 text-gray-400 font-bold hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    >
                        Cancel
                    </button>
                </motion.div>
            </div>
        )}
    </AnimatePresence>
);

const Home = () => {
    const { showNotification } = useNotification();
    const [quote, setQuote] = useState("");
    const [author, setAuthor] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [data, setData] = useState(() => {
        const dateKey = new Date().toISOString().split('T')[0];
        const saved = localStorage.getItem(`dashboard_cache_${dateKey}`);
        return saved ? JSON.parse(saved) : null;
    });
    const [loading, setLoading] = useState(!data);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGoal, setEditingGoal] = useState({ key: '', label: '', value: 0 });

    const quotes = [
        { text: "The last three or four reps is what makes the muscle grow. This area of pain divides the champion from someone else who is not a champion.", author: "Arnold Schwarzenegger" },
        { text: "I hated every minute of training, but I said, 'Don't quit. Suffer now and live the rest of your life as a champion.'", author: "Muhammad Ali" },
        { text: "I’ve failed over and over and over again in my life. And that is why I succeed.", author: "Michael Jordan" },
        { text: "If you think lifting is dangerous, try being weak. Being weak is dangerous.", author: "Bret Contreras" },
        { text: "If you want to be the best, you have to do things that other people aren't willing to do.", author: "Michael Phelps" },
        { text: "Pain is temporary. Quitting lasts forever.", author: "Lance Armstrong" },
        { text: "Gold medals aren't really made of gold. They're made of sweat, determination, and a hard-to-find alloy called guts.", author: "Dan Gable" },
        { text: "The difference between the impossible and the possible lies in a person's determination.", author: "Tommy Lasorda" },
        { text: "Excellence is not a singular act, but a habit. You are what you repeatedly do.", author: "Shaquille O'Neal" },
        { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky" },
        { text: "Don't count the days, make the days count.", author: "Muhammad Ali" },
        { text: "Winners never quit and quitters never win.", author: "Vince Lombardi" },
        { text: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke" },
        { text: "Strength does not come from winning. Your struggles develop your strengths.", author: "Arnold Schwarzenegger" },
        { text: "It's hard to beat a person who never gives up.", author: "Babe Ruth" },
        { text: "What makes you differ is how you recover.", author: "Usain Bolt" },
        { text: "The more I practice the luckier I get.", author: "Gary Player" },
        { text: "A champion is someone who gets up when they can't.", author: "Jack Dempsey" },
        { text: "You have to expect things of yourself before you can do them.", author: "Michael Jordan" },
        { text: "Age is no barrier. It’s a limitation you put on your mind.", author: "Jackie Joyner-Kersee" },
        { text: "The only way to prove that you’re a good sport is to lose.", author: "Ernie Banks" },
        { text: "The more difficult the victory, the greater the happiness in winning.", author: "Pelé" },
        { text: "Resting is not a sign of weakness; it's a part of the process of getting stronger.", author: "Rich Froning Jr." },
        { text: "The mindset of a champion is to be the best and to never settle for anything less.", author: "Serena Williams" },
        { text: "There may be people that have more talent than you, but there's no excuse for anyone to work harder than you do.", author: "Derek Jeter" }
    ];

    const last7Days = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0];
    }).reverse();

    const fetchData = async () => {
        if (!data) setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/dashboard?date=${selectedDate}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await res.json();
            if (res.ok) {
                setData(result);
                localStorage.setItem(`dashboard_cache_${selectedDate}`, JSON.stringify(result));
            }
        } catch (err) {
            console.error("Failed to load dashboard", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        setQuote(quotes[randomIndex].text);
        setAuthor(quotes[randomIndex].author);
    }, []);

    useEffect(() => {
        fetchData();
    }, [selectedDate]);

    const toggleExercise = async (id) => {
        const oldData = { ...data };
        const updatedExercises = data.todayLog.exercises.map(ex =>
            ex._id === id ? { ...ex, completed: !ex.completed } : ex
        );
        setData({ ...data, todayLog: { ...data.todayLog, exercises: updatedExercises } });

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/user/log/exercise/toggle`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ date: selectedDate, exerciseId: id })
            });
            if (!res.ok) throw new Error();
            showNotification('Status updated', 'success');
        } catch (err) {
            setData(oldData);
            showNotification('Error updating status', 'error');
        }
    };

    const deleteExercise = async (id) => {
        const oldData = { ...data };
        const updatedExercises = data.todayLog.exercises.filter(ex => ex._id !== id);
        setData({ ...data, todayLog: { ...data.todayLog, exercises: updatedExercises } });

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/user/log/exercise/delete`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ date: selectedDate, exerciseId: id })
            });
            if (!res.ok) throw new Error();
            showNotification('Exercise deleted', 'success');
        } catch (err) {
            setData(oldData);
            showNotification('Error deleting exercise', 'error');
        }
    };

    const updateGoal = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/user/goals`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ [editingGoal.key]: parseInt(editingGoal.value) })
            });
            if (res.ok) {
                setIsModalOpen(false);
                fetchData();
                showNotification(`${editingGoal.label} updated successfully!`, 'success');
            }
        } catch (err) {
            console.error("Failed to update goal", err);
            showNotification('Failed to update goal', 'error');
        }
    };

    const openGoalModal = (key, label, currentValue) => {
        setEditingGoal({ key, label, value: currentValue });
        setIsModalOpen(true);
    };

    const { todayLog, user } = data || {};
    const exercises = todayLog?.exercises || [];
    const nutrition = todayLog?.nutrition || { breakfast: [], lunch: [], dinner: [], snacks: [] };
    const goals = user?.goals || { workouts: 5, calories: 2500, protein: 150, carbs: 250 };

    const uniqueExerciseNames = [...new Set(exercises.map(ex => ex.name.toLowerCase().trim()))];
    const totalWorkouts = uniqueExerciseNames.length;

    const completedUniqueExercises = [...new Set(
        exercises.filter(ex => ex.completed).map(ex => ex.name.toLowerCase().trim())
    )];
    const workoutsDone = completedUniqueExercises.length;

    const totals = React.useMemo(() => {
        let calories = 0, protein = 0, carbs = 0;
        if (!nutrition) return { calories: 0, protein: 0, carbs: 0 };
        ['breakfast', 'lunch', 'dinner', 'snacks'].forEach(mealType => {
            if (nutrition[mealType]) {
                nutrition[mealType].forEach(item => {
                    calories += item.calories || 0;
                    protein += parseInt(item.protein) || 0;
                    carbs += parseInt(item.carbs) || 0;
                });
            }
        });
        return { calories, protein, carbs };
    }, [nutrition]);

    return (
        <div className="space-y-6 pb-12">
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={`Set Daily ${editingGoal.label}`}
            >
                <form onSubmit={updateGoal} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Maximum Value</label>
                        <input
                            type="number"
                            value={editingGoal.value}
                            onChange={(e) => setEditingGoal({ ...editingGoal, value: e.target.value })}
                            className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-primary text-xl font-black text-gray-800 dark:text-white"
                            autoFocus
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-primary text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        Save Goal
                    </button>
                </form>
            </Modal>

            <div className="bg-gradient-to-r from-primary to-orange-500 rounded-2xl p-6 text-white shadow-md overflow-hidden relative">
                <div className="relative z-10 flex flex-col items-center text-center space-y-3">
                    <p className="opacity-95 max-w-3xl text-sm md:text-lg font-bold italic leading-relaxed">"{quote}"</p>
                    <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] opacity-80">— {author}</p>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full transform translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4 md:mb-6 text-center md:text-left">Weekly Progress</h3>
                <div className="flex justify-between md:justify-center items-center gap-2 md:gap-14 overflow-x-auto pb-2 scrollbar-hide">
                    {last7Days.map((date) => {
                        const isSelected = date === selectedDate;
                        const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
                        const dayNum = new Date(date).getDate();

                        return (
                            <button
                                key={date}
                                onClick={() => setSelectedDate(date)}
                                className={`flex flex-col items-center min-w-[40px] md:min-w-[45px] p-2 rounded-2xl transition-all ${isSelected
                                    ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105'
                                    : 'bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <span className={`text-[8px] md:text-[10px] font-bold uppercase ${isSelected ? 'opacity-80' : 'opacity-60'}`}>{dayName}</span>
                                <span className="text-sm md:text-base font-black">{dayNum}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-md border border-gray-100 dark:border-gray-700">
                    <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-2">
                        <span className="w-2 h-8 bg-primary rounded-full"></span>
                        Exercises log
                    </h3>

                    <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                        {loading && !data ? (
                            <p className="text-gray-400 text-sm italic">Loading exercises...</p>
                        ) : exercises.length === 0 ? (
                            <p className="text-gray-500 text-sm italic">No activities recorded for this day.</p>
                        ) : (
                            exercises.map((ex, idx) => (
                                <div key={idx} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-2xl flex justify-between items-center group">
                                    <div className="flex-1">
                                        <p className={`font-bold transition-all ${ex.completed ? 'text-gray-400 line-through' : 'text-gray-800 dark:text-gray-200'}`}>{ex.name}</p>
                                        <p className="text-xs text-primary font-bold">Sets: {ex.sets} • Reps: {ex.reps}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => deleteExercise(ex._id)}
                                            className="w-8 h-8 rounded-xl border-2 border-transparent text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                                            title="Delete exercise"
                                        >
                                            <FaTrash size={14} />
                                        </button>
                                        <button
                                            onClick={() => toggleExercise(ex._id)}
                                            className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${ex.completed ? 'bg-primary border-primary text-white shadow-lg shadow-primary/40' : 'border-gray-300 dark:border-gray-600 hover:border-primary'}`}
                                        >
                                            {ex.completed ? <span className="text-lg font-bold">✓</span> : null}
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-md border border-gray-100 dark:border-gray-700">
                    <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-2">
                        <span className="w-2 h-8 bg-accent rounded-full"></span>
                        Daily Progress
                    </h3>

                    <div className="space-y-6">
                        <div className="group">
                            <div className="flex justify-between mb-2">
                                <span className="text-sm font-bold text-gray-600 dark:text-gray-400 group-hover:text-primary transition-colors">Workouts Done</span>
                                <span className="text-sm font-black text-primary">{workoutsDone} / {totalWorkouts}</span>
                            </div>
                            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min((workoutsDone / (totalWorkouts || 1)) * 100, 100)}%` }}
                                    className="bg-primary h-full rounded-full shadow-lg"
                                />
                            </div>
                        </div>

                        <div className="cursor-pointer group" onClick={() => openGoalModal('calories', 'Calories Limit', goals.calories)}>
                            <div className="flex justify-between mb-2">
                                <span className="text-sm font-bold text-gray-600 dark:text-gray-400 group-hover:text-rose-500 transition-colors">Total Calories ✎</span>
                                <span className="text-sm font-black text-rose-500">{totals.calories} / {goals.calories} kcal</span>
                            </div>
                            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min((totals.calories / (goals.calories || 1)) * 100, 100)}%` }}
                                    className="bg-rose-500 h-full rounded-full shadow-lg"
                                />
                            </div>
                        </div>

                        <div className="cursor-pointer group" onClick={() => openGoalModal('protein', 'Protein Goal', goals.protein)}>
                            <div className="flex justify-between mb-2">
                                <span className="text-sm font-bold text-gray-600 dark:text-gray-400 group-hover:text-blue-500 transition-colors">Protein Intake ✎</span>
                                <span className="text-sm font-black text-blue-500">{totals.protein}g / {goals.protein}g</span>
                            </div>
                            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min((totals.protein / (goals.protein || 1)) * 100, 100)}%` }}
                                    className="bg-blue-500 h-full rounded-full shadow-lg"
                                />
                            </div>
                        </div>

                        <div className="cursor-pointer group" onClick={() => openGoalModal('carbs', 'Carbs Goal', goals.carbs)}>
                            <div className="flex justify-between mb-2">
                                <span className="text-sm font-bold text-gray-600 dark:text-gray-400 group-hover:text-orange-400 transition-colors">Carbs Intake ✎</span>
                                <span className="text-sm font-black text-orange-400">{totals.carbs}g / {goals.carbs}g</span>
                            </div>
                            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min((totals.carbs / (goals.carbs || 1)) * 100, 100)}%` }}
                                    className="bg-orange-400 h-full rounded-full shadow-lg"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-md border border-gray-100 dark:border-gray-700">
                    <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-2">
                        <span className="w-2 h-8 bg-green-500 rounded-full"></span>
                        Meal Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {['breakfast', 'lunch', 'snacks', 'dinner'].map((meal, idx) => (
                            <div key={idx} className="bg-gray-50 dark:bg-gray-700/50 p-4 md:p-6 rounded-2xl border border-transparent hover:border-green-500 transition-all group">
                                <h4 className="font-black text-gray-800 dark:text-white mb-3 md:mb-4 capitalize text-base md:text-lg border-b border-gray-200 dark:border-gray-600 pb-2">{meal}</h4>
                                <div className="space-y-3">
                                    {loading && !data ? (
                                        <div className="h-10 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg"></div>
                                    ) : nutrition[meal]?.length > 0 ? (
                                        nutrition[meal].map((item, i) => (
                                            <div key={i} className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                                                <p className="font-bold text-sm md:text-base line-clamp-1">• {item.name}</p>
                                                <p className="opacity-80 font-medium text-[10px] md:text-xs ml-4 bg-white/50 dark:bg-gray-800/50 px-2 py-1 rounded inline-block">
                                                    Cal: <span className="text-rose-500 font-bold">{item.calories}</span> |
                                                    P: <span className="text-blue-500 font-bold">{item.protein}</span> |
                                                    C: <span className="text-orange-400 font-bold">{item.carbs}</span>
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-[10px] md:text-xs text-gray-400 italic">No {meal} tracked</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
