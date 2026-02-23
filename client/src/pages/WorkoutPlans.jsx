import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNotification } from '../context/NotificationContext';
import { motion } from 'framer-motion';
import { FaSearch, FaClipboardList, FaPlus, FaCheck, FaLock, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import API_URL from '../apiConfig';

const WorkoutPlans = () => {
    const { showNotification } = useNotification();
    const navigate = useNavigate();

    const [query, setQuery] = useState(() => localStorage.getItem('workout_query') || "");
    const [results, setResults] = useState(() => {
        const savedResults = localStorage.getItem('workout_results');
        return savedResults ? JSON.parse(savedResults) : [];
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setError("");
        localStorage.setItem('workout_query', query);

        try {
            const response = await axios.post(`${API_URL}/api/workout-plans`, { query });
            const data = response.data;
            setResults(data);
            localStorage.setItem('workout_results', JSON.stringify(data));
        } catch (err) {
            console.error(err);
            setError("Failed to generate workout plan. Try another keyword.");
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setQuery("");
        setResults([]);
        setError("");
        localStorage.removeItem('workout_query');
        localStorage.removeItem('workout_results');
    };

    const addToGoal = async (exercise) => {
        const token = localStorage.getItem('token');
        if (!token) {
            showNotification('Please login to add exercises to your dashboard', 'error');
            navigate('/auth');
            return;
        }

        try {
            const res = await axios.post(`${API_URL}/api/user/log/exercise`, {
                name: exercise.name,
                sets: exercise.sets,
                reps: exercise.reps
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.data.success) {
                showNotification(`${exercise.name} added to dashboard!`, 'success');
            }
        } catch (err) {
            console.error(err);
            if (err.response?.status === 403) {
                showNotification('Session expired. Please login again.', 'error');
                navigate('/auth');
            } else {
                showNotification('Failed to add exercise', 'error');
            }
        }
    };

    const addAllToGoal = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            showNotification('Please login to add exercises', 'error');
            navigate('/auth');
            return;
        }

        try {
            const res = await axios.post(`${API_URL}/api/user/log/exercises/bulk`, {
                exercises: results.map(ex => ({
                    name: ex.name,
                    sets: ex.sets,
                    reps: ex.reps
                }))
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.data.success) {
                showNotification(`Entire workout plan added to dashboard!`, 'success');
            }
        } catch (err) {
            console.error(err);
            if (err.response?.status === 403) {
                showNotification('Session expired. Please login again.', 'error');
                navigate('/auth');
            } else {
                showNotification('Failed to add exercises. Please try again.', 'error');
            }
        }
    };

    return (
        <div className="space-y-6 pb-20">
            <h2 className="text-2xl md:text-3xl font-black text-gray-800 dark:text-white flex items-center gap-3">
                <FaClipboardList className="text-primary text-3xl md:text-4xl" />
                Workout Plans
            </h2>

            <form onSubmit={handleSearch} className="relative max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 mx-auto">
                <div className="flex items-center px-4 py-3">
                    <FaSearch className="text-gray-400 mr-3" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="What kind of plan do you want? (e.g., '30 min fat burn')"
                        className="flex-1 bg-transparent border-none outline-none text-gray-700 dark:text-gray-200 placeholder-gray-400"
                    />
                    {(query || results.length > 0) && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="mr-3 text-gray-400 hover:text-red-500 transition-colors"
                            title="Clear Search"
                        >
                            <FaTimes />
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={loading || !query.trim()}
                        className="bg-primary text-white px-6 py-2 rounded-xl font-medium hover:bg-orange-600 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Generating...' : 'Generate Plan'}
                    </button>
                </div>
            </form>

            <div className="max-w-4xl mx-auto">
                {!isLoggedIn && (
                    <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 p-4 rounded-2xl mb-6 flex items-center gap-4 text-orange-700 dark:text-orange-300">
                        <FaLock />
                        <p className="text-sm font-medium">You are currently searching as a Guest. <strong>Login</strong> to add these exercises to your daily dashboard.</p>
                        <button onClick={() => navigate('/auth')} className="ml-auto bg-orange-500 text-white px-4 py-1 rounded-lg text-xs font-bold">Login</button>
                    </div>
                )}

                {error && <p className="text-red-500 text-center">{error}</p>}

                {results.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700"
                    >
                        <div className="flex justify-between items-center bg-gradient-to-r from-primary to-orange-500 p-4 md:p-6 text-white font-bold">
                            <h3 className="text-lg md:text-xl">Workout Plan Results</h3>
                            <button
                                onClick={addAllToGoal}
                                className="bg-white text-primary px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm hover:bg-gray-100 transition-colors flex items-center gap-2 whitespace-nowrap ml-2"
                            >
                                <FaCheck /> Add All
                            </button>
                        </div>

                        <div className="p-4 md:p-6">
                            <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                                {results.map((ex, idx) => (
                                    <motion.li
                                        key={idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="py-4 flex justify-between items-center group"
                                    >
                                        <div>
                                            <h4 className="text-lg font-bold text-gray-800 dark:text-white">{ex.name}</h4>
                                            <p className="text-sm text-primary font-medium">Sets: {ex.sets} • Reps: {ex.reps}</p>
                                        </div>
                                        <button
                                            onClick={() => addToGoal(ex)}
                                            className="w-10 h-10 bg-gray-50 dark:bg-gray-700 text-gray-400 hover:bg-primary hover:text-white rounded-xl flex items-center justify-center transition-all"
                                            title="Add Exercise"
                                        >
                                            <FaPlus />
                                        </button>
                                    </motion.li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default WorkoutPlans;
