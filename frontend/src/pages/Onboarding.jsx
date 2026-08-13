import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Flame, ChevronDown, Sun, Moon, ArrowRight } from 'lucide-react';
import API_URL from '../apiConfig';
import { Button } from '../components/ui/button';
import { useTheme } from '../context/ThemeContext';

const Onboarding = () => {
    const navigate = useNavigate();
    const { isDark, toggleTheme } = useTheme();

    const [formData, setFormData] = useState({
        age: '',
        height: '',
        weight: '',
        goalWeight: '',
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
        <div className="min-h-screen bg-[#FAFAFC] dark:bg-[#0A0D14] text-slate-800 dark:text-slate-100 flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden font-sans transition-colors duration-300">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-orange-500/10 rounded-full blur-[160px] pointer-events-none -z-10" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[180px] pointer-events-none -z-10" />

            {/* ── TOP HEADER BAR WITH LOGO AND DAY/NIGHT SWITCHER ── */}
            <header className="w-full max-w-6xl mx-auto flex items-center justify-between py-4 z-20">
                <div 
                    onClick={() => navigate('/')} 
                    className="flex items-center gap-3 cursor-pointer group"
                >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center shadow-sunrise-orange group-hover:scale-105 transition-transform">
                        <Flame className="w-6 h-6 text-white fill-white" />
                    </div>
                    <span className="text-2xl font-black text-slate-900 dark:text-white font-display">
                        Fit<span className="text-orange-600">Genix</span>
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    {/* Day / Night Mode Toggle Button */}
                    <button
                        type="button"
                        onClick={toggleTheme}
                        className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-amber-400 hover:scale-105 active:scale-95 transition-all shadow-sm flex items-center justify-center"
                        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    >
                        {isDark ? (
                            <Sun className="w-5 h-5 text-amber-400" />
                        ) : (
                            <Moon className="w-5 h-5 text-slate-700" />
                        )}
                    </button>
                </div>
            </header>

            {/* ── ONBOARDING CARD CONTAINER ── */}
            <main className="flex-1 flex items-center justify-center py-8 z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-xl"
                >
                    <div className="bg-white dark:bg-slate-900/95 rounded-3xl p-6 sm:p-10 border-2 border-orange-500 shadow-sunrise-card dark:shadow-2xl space-y-6">
                        <div className="text-center space-y-2">
                            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase font-display tracking-tight">
                                Tell us about <span className="text-orange-600">yourself</span>
                            </h2>
                            <p className="text-sm font-mono text-slate-500 dark:text-slate-400">
                                We need some details to personalize your training telemetry.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-xs font-mono font-bold uppercase text-slate-600 dark:text-slate-300 mb-1.5">Age</label>
                                    <input
                                        type="number"
                                        name="age"
                                        placeholder="e.g. 20"
                                        className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        value={formData.age}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-mono font-bold uppercase text-slate-600 dark:text-slate-300 mb-1.5">Height (cm)</label>
                                    <input
                                        type="number"
                                        name="height"
                                        placeholder="e.g. 175"
                                        className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        value={formData.height}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-mono font-bold uppercase text-slate-600 dark:text-slate-300 mb-1.5">Weight (kg)</label>
                                    <input
                                        type="number"
                                        name="weight"
                                        placeholder="e.g. 70"
                                        className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        value={formData.weight}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-mono font-bold uppercase text-slate-600 dark:text-slate-300 mb-1.5">Goal Weight (kg)</label>
                                    <input
                                        type="number"
                                        name="goalWeight"
                                        placeholder="e.g. 65"
                                        className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        value={formData.goalWeight}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Main Aim Select Box with Dropdown Arrow Icon */}
                            <div>
                                <label className="block text-xs font-mono font-bold uppercase text-slate-600 dark:text-slate-300 mb-1.5">Main Aim</label>
                                <div className="relative">
                                    <select
                                        name="goal"
                                        className="w-full p-3.5 pr-10 rounded-xl border-2 border-orange-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none cursor-pointer"
                                        value={formData.goal}
                                        onChange={handleChange}
                                    >
                                        {goals.map((goal) => (
                                            <option key={goal} value={goal} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
                                                {goal}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="w-5 h-5 text-orange-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>
                            </div>

                            {/* Flat Clean CTA Button */}
                            <div className="pt-2">
                                <Button
                                    type="submit"
                                    size="default"
                                    className="w-full gap-2.5 py-3.5 text-base sm:text-lg font-extrabold bg-orange-600 hover:bg-orange-700 text-white rounded-xl border-none shadow-none focus:outline-none focus:ring-0 active:scale-100"
                                >
                                    <span>Continue to Dashboard</span>
                                    <ArrowRight className="w-5 h-5" />
                                </Button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </main>

            {/* Footer Copy */}
            <footer className="text-center py-4 text-xs font-mono text-slate-400 dark:text-slate-500 z-10">
                &copy; 2026 FitGenix AI. All rights reserved.
            </footer>
        </div>
    );
};

export default Onboarding;
