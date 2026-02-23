import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import API_URL from '../apiConfig';

const Onboarding = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        age: '',
        height: '',
        weight: '',
        goal: 'Health Maintenance'
    });

    const goals = [
        "Muscle Gain",
        "Weight Loss",
        "Diet and Nutrition",
        "Health Maintenance"
    ];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/user/details`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                const user = JSON.parse(localStorage.getItem('user'));
                user.details = formData;
                user.isNewUser = false;
                localStorage.setItem('user', JSON.stringify(user));

                navigate('/dashboard');
            } else {
                console.error("Failed to save details");
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-light dark:bg-dark text-secondary dark:text-light flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700"
            >
                <h2 className="text-3xl font-bold text-center mb-6 text-primary">Tell us about yourself</h2>
                <p className="text-center text-gray-500 mb-8">We need some details to personalize your plan.</p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Age</label>
                            <input
                                type="number"
                                name="age"
                                placeholder="e.g. 25"
                                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                                value={formData.age}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Height (cm)</label>
                            <input
                                type="number"
                                name="height"
                                placeholder="e.g. 175"
                                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                                value={formData.height}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Weight (kg)</label>
                            <input
                                type="number"
                                name="weight"
                                placeholder="e.g. 70"
                                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                                value={formData.weight}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Goal Weight (kg)</label>
                            <input
                                type="number"
                                name="goalWeight"
                                placeholder="e.g. 65"
                                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                                value={formData.goalWeight}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Main Aim</label>
                        <select
                            name="goal"
                            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
                            value={formData.goal}
                            onChange={handleChange}
                        >
                            {goals.map((goal) => (
                                <option key={goal} value={goal}>{goal}</option>
                            ))}
                        </select>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="btn-primary w-full mt-4"
                    >
                        Continue to Dashboard
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

export default Onboarding;
