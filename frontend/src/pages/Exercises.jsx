import React, { useState } from 'react';
import axios from 'axios';
import { useNotification } from '../context/NotificationContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaDumbbell, FaPlay, FaPlus } from 'react-icons/fa';
import API_URL from '../apiConfig';

const Exercises = () => {
    const { showNotification } = useNotification();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [logDetails, setLogDetails] = useState({ sets: 3, reps: 10 });

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setError("");
        setResults([]);
        setSelectedExercise(null);

        try {
            const response = await axios.post(`${API_URL}/api/exercises`, { query });
            setResults(Array.isArray(response.data) ? response.data : [response.data]);
        } catch (err) {
            console.error(err);
            setError("Failed to find exercise details. Try another keyword.");
        } finally {
            setLoading(false);
        }
    };

    const addToGoal = async (exercise) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`${API_URL}/api/user/log/exercise`, {
                name: exercise.name,
                sets: logDetails.sets,
                reps: logDetails.reps
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.data.success) {
                showNotification(`${exercise.name} added to dashboard!`, 'success');
            }
        } catch (err) {
            console.error(err);
            showNotification('Failed to add exercise', 'error');
        }
    };

    return (
        <div className="space-y-6 pb-20">
            <h2 className="text-2xl md:text-3xl font-black text-gray-800 dark:text-white flex items-center gap-3">
                <FaDumbbell className="text-primary text-3xl md:text-4xl" />
                Find Exercises
            </h2>

            <form onSubmit={handleSearch} className="relative max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 mx-auto">
                <div className="flex items-center px-4 py-3">
                    <FaSearch className="text-gray-400 mr-3" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search body parts (Chest, Abs) or Equipment (Dumbbell)..."
                        className="flex-1 bg-transparent border-none outline-none text-gray-700 dark:text-gray-200 placeholder-gray-400"
                    />
                    <button
                        type="submit"
                        disabled={loading || !query.trim()}
                        className="bg-primary text-white px-6 py-2 rounded-xl font-medium hover:bg-orange-600 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </div>
            </form>

            <div className="max-w-6xl mx-auto">
                {error && <p className="text-red-500 text-center">{error}</p>}

                {!selectedExercise && results.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {results.map((ex, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                                onClick={() => setSelectedExercise(ex)}
                            >
                                <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                                    <FaDumbbell size={24} />
                                </div>
                                <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{ex.name}</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">Click to view steps and add to your daily goals.</p>
                            </motion.div>
                        ))}
                    </div>
                )}

                <AnimatePresence>
                    {selectedExercise && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700"
                        >
                            <div className="flex justify-between items-center bg-gradient-to-r from-primary to-orange-500 p-4 md:p-6 text-white text-xl md:text-3xl font-bold">
                                <h3 className="line-clamp-1">{selectedExercise.name}</h3>
                                <button onClick={() => setSelectedExercise(null)} className="text-xs md:text-base font-normal bg-white/20 px-3 md:px-4 py-1 rounded-full hover:bg-white/30 transition-colors whitespace-nowrap ml-2">Back</button>
                            </div>

                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h4 className="text-xl font-bold flex items-center gap-2 text-gray-700 dark:text-gray-200">
                                            <FaPlay className="text-red-500" /> Video Guide
                                        </h4>
                                        <a
                                            href={`https://www.youtube.com/watch?v=${selectedExercise.videoId || 'dQw4w9WgXcQ'}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs font-bold text-red-500 hover:underline flex items-center gap-1"
                                        >
                                            Open in YouTube
                                        </a>
                                    </div>
                                    <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center relative border-4 border-white dark:border-gray-600">
                                        <iframe
                                            width="100%"
                                            height="100%"
                                            src={`https://www.youtube.com/embed/${selectedExercise.videoId || 'dQw4w9WgXcQ'}`}
                                            frameBorder="0"
                                            allowFullScreen
                                            title="Exercise Video"
                                            className="absolute inset-0 w-full h-full"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-xl font-bold text-gray-700 dark:text-gray-200">How to perform</h4>
                                    <ol className="space-y-3 relative border-l-2 border-gray-200 dark:border-gray-700 ml-3 pl-5">
                                        {selectedExercise.steps?.map((step, idx) => (
                                            <li key={idx} className="relative">
                                                <span className="absolute -left-[29px] top-1 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-white dark:ring-gray-800">
                                                    {idx + 1}
                                                </span>
                                                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{step}</p>
                                            </li>
                                        ))}
                                    </ol>

                                    <div className="pt-6 border-t border-gray-100 dark:border-gray-700 mt-6">
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Sets</label>
                                                <input
                                                    type="number"
                                                    value={logDetails.sets}
                                                    onChange={(e) => setLogDetails({ ...logDetails, sets: parseInt(e.target.value) })}
                                                    className="w-full bg-gray-50 dark:bg-gray-700 p-2 rounded-lg border-none focus:ring-2 focus:ring-primary text-gray-700 dark:text-white"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Reps</label>
                                                <input
                                                    type="number"
                                                    value={logDetails.reps}
                                                    onChange={(e) => setLogDetails({ ...logDetails, reps: parseInt(e.target.value) })}
                                                    className="w-full bg-gray-50 dark:bg-gray-700 p-2 rounded-lg border-none focus:ring-2 focus:ring-primary text-gray-700 dark:text-white"
                                                />
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => addToGoal(selectedExercise)}
                                            className="w-full bg-primary text-white flex items-center justify-center gap-2 py-3 rounded-xl hover:bg-orange-600 transition-colors"
                                        >
                                            <FaPlus /> Add to Dashboard
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Exercises;
