import React, { useState } from 'react';
import axios from 'axios';
import { useNotification } from '../context/NotificationContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUtensils, FaSearch, FaFire, FaPlus } from 'react-icons/fa';
import API_URL from '../apiConfig';

const Diet = () => {
    const { showNotification } = useNotification();
    const [query, setQuery] = useState("");
    const [servingSize, setServingSize] = useState("1 cup");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [mealType, setMealType] = useState("Breakfast");

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setError("");

        try {
            const response = await axios.post(`${API_URL}/api/diet`, { query, servingSize });
            setResult(response.data);
        } catch (err) {
            console.error(err);
            setError("Failed to get nutritional info.");
        } finally {
            setLoading(false);
        }
    };

    const addToMeal = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`${API_URL}/api/user/log/food`, {
                mealType: mealType,
                foodItem: {
                    name: result.name,
                    calories: parseInt(result.calories) || 0,
                    protein: result.protein,
                    carbs: result.carbs,
                    fats: result.fats
                }
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.data.success) {
                showNotification(`${result.name} added to ${mealType}!`, 'success');
            }
        } catch (err) {
            console.error(err);
            showNotification('Failed to add food', 'error');
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-black text-gray-800 dark:text-white flex items-center gap-3">
                <FaUtensils className="text-green-500 text-3xl md:text-4xl" />
                <div className="leading-tight">
                    Diet and Nutrition
                </div>
            </h2>

            <form onSubmit={handleSearch} className="max-w-2xl mx-auto space-y-4 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Food Item (e.g. Oatmeal, Chicken Breast)"
                            className="w-full pl-10 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <div className="w-full md:w-32">
                        <input
                            type="text"
                            value={servingSize}
                            onChange={(e) => setServingSize(e.target.value)}
                            placeholder="Qty (1 cup)"
                            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading || !query.trim()}
                        className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Analyzing...' : 'Analyze'}
                    </button>
                </div>
            </form>

            <div className="max-w-4xl mx-auto">
                <AnimatePresence>
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden mt-8 border border-gray-100 dark:border-gray-700"
                        >
                            <div className="bg-gradient-to-r from-green-500 to-teal-400 p-4 md:p-6 text-white text-center">
                                <h3 className="text-xl md:text-3xl font-bold">{result.name}</h3>
                                <p className="text-sm opacity-90">{servingSize}</p>
                            </div>

                            <div className="p-4 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between border-b pb-2 border-gray-200 dark:border-gray-700">
                                        <span className="text-gray-600 dark:text-gray-400 font-medium">Calories</span>
                                        <span className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-1">
                                            <FaFire className="text-orange-500" />
                                            {result.calories}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 text-center">
                                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl">
                                            <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-1">Protein</p>
                                            <p className="text-lg font-bold text-blue-800 dark:text-blue-200">{result.protein}</p>
                                        </div>
                                        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-xl">
                                            <p className="text-xs text-yellow-600 dark:text-yellow-400 font-semibold mb-1">Carbs</p>
                                            <p className="text-lg font-bold text-yellow-800 dark:text-yellow-200">{result.carbs}</p>
                                        </div>
                                        <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-xl">
                                            <p className="text-xs text-red-600 dark:text-red-400 font-semibold mb-1">Fats</p>
                                            <p className="text-lg font-bold text-red-800 dark:text-red-200">{result.fats}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-gray-500 mb-2">Vitamins & Minerals</p>
                                        <div className="flex flex-wrap gap-2">
                                            {result.vitamins?.map((vit, idx) => (
                                                <span key={idx} className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full text-xs font-medium">
                                                    {vit}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-700/30 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                                <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Add to Daily Log</h4>

                                <div className="space-y-4">
                                    <label className="block text-sm font-medium text-gray-500">Select Meal</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['Breakfast', 'Lunch', 'Snacks', 'Dinner'].map((meal) => (
                                            <button
                                                key={meal}
                                                onClick={() => setMealType(meal)}
                                                className={`py-2 px-4 rounded-lg text-sm font-medium transition-colors ${mealType === meal
                                                    ? 'bg-green-600 text-white'
                                                    : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                                                    }`}
                                            >
                                                {meal}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        onClick={addToMeal}
                                        className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 mt-4 shadow-lg shadow-green-600/20"
                                    >
                                        <FaPlus /> Add to {mealType}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Diet;
