import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLock, FaFileContract, FaPalette, FaSun, FaMoon, FaLaptop } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const Settings = () => {
    const { theme, setTheme, isDark, toggleTheme } = useTheme();
    const [activeTab, setActiveTab] = useState('account');
    const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });

    const handlePasswordChange = (e) => {
        e.preventDefault();
        if (passwordData.new !== passwordData.confirm) {
            alert("New passwords do not match!");
            return;
        }
        alert("Password updated successfully!");
        setPasswordData({ current: '', new: '', confirm: '' });
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <FaLock className="text-orange-500" />
                Settings
            </h2>

            <div className="flex gap-2 sm:gap-4 border-b border-gray-200 dark:border-gray-700 overflow-x-auto scrollbar-hide">
                <button
                    onClick={() => setActiveTab('account')}
                    className={`pb-3 px-4 text-sm font-medium transition-colors shrink-0 ${activeTab === 'account' ? 'border-b-2 border-orange-500 text-orange-500 font-bold' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                >
                    Account Security
                </button>
                <button
                    onClick={() => setActiveTab('appearance')}
                    className={`pb-3 px-4 text-sm font-medium transition-colors shrink-0 ${activeTab === 'appearance' ? 'border-b-2 border-orange-500 text-orange-500 font-bold' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                >
                    Appearance & Theme
                </button>
                <button
                    onClick={() => setActiveTab('legal')}
                    className={`pb-3 px-4 text-sm font-medium transition-colors shrink-0 ${activeTab === 'legal' ? 'border-b-2 border-orange-500 text-orange-500 font-bold' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                >
                    Terms & Conditions
                </button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 min-h-[400px] transition-colors duration-300">
                <AnimatePresence mode="wait">
                    {activeTab === 'account' && (
                        <motion.div
                            key="account"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-6"
                        >
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Change Password</h3>
                            <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Current Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={passwordData.current}
                                        onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                                        className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">New Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={passwordData.new}
                                        onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                                        className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Confirm New Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={passwordData.confirm}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                                        className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                                <button type="submit" className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-sunrise-orange transition-all mt-4">
                                    Update Password
                                </button>
                            </form>
                        </motion.div>
                    )}

                    {activeTab === 'appearance' && (
                        <motion.div
                            key="appearance"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="space-y-6"
                        >
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                    <FaPalette className="text-orange-500" /> Interface Theme
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Customize your visual experience across FitGenix. Select Light, Dark, or System mode.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg pt-2">
                                {/* Light Mode Option Card */}
                                <div 
                                    onClick={() => setTheme('light')}
                                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4 ${
                                        theme === 'light' 
                                            ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-500/10 shadow-md' 
                                            : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-orange-300'
                                    }`}
                                >
                                    <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-xl shrink-0">
                                        <FaSun />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white text-base">Sunrise Light</h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Bright, energetic high-contrast look.</p>
                                    </div>
                                </div>

                                {/* Dark Mode Option Card */}
                                <div 
                                    onClick={() => setTheme('dark')}
                                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4 ${
                                        theme === 'dark' 
                                            ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-500/10 shadow-md' 
                                            : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-orange-300'
                                    }`}
                                >
                                    <div className="w-12 h-12 rounded-xl bg-slate-800 text-amber-400 flex items-center justify-center font-bold text-xl shrink-0">
                                        <FaMoon />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white text-base">Deep Slate Dark</h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Sleek dark theme optimized for low light.</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'legal' && (
                        <motion.div
                            key="legal"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                <FaFileContract className="text-orange-500" /> Terms of Service
                            </h3>
                            <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 h-[300px] overflow-y-auto pr-4 custom-scrollbar">
                                <p><strong>1. Introduction</strong><br />Welcome to FitGenix. By accessing our website, you agree to be bound by these Terms and Conditions.</p>
                                <p><strong>2. Health Disclaimer</strong><br />FitGenix provides fitness and nutritional information for educational purposes only. You should consult your physician or other health care professional before starting this or any other fitness program to determine if it is right for your needs.</p>
                                <p><strong>3. User Accounts</strong><br />You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.</p>
                                <p><strong>4. Privacy Policy</strong><br />Your use of the website is also subject to our Privacy Policy. Please review our Privacy Policy, which also governs the website and informs users of our data collection practices.</p>
                                <p><strong>5. AI Generated Content</strong><br />Some content on this platform is generated by Artificial Intelligence. While we strive for accuracy, AI responses may occasionally be incorrect or misleading. Always verify critical health information.</p>
                                <p className="text-sm text-gray-400 mt-8">Last updated: February 2026</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Settings;
