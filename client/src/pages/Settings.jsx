import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLock, FaFileContract, FaToggleOn, FaToggleOff } from 'react-icons/fa';

const Settings = () => {
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
                <FaLock className="text-gray-500" />
                Settings
            </h2>

            <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700">
                <button
                    onClick={() => setActiveTab('account')}
                    className={`pb-3 px-4 text-sm font-medium transition-colors ${activeTab === 'account' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 dark:text-gray-400'}`}
                >
                    Account Security
                </button>
                <button
                    onClick={() => setActiveTab('legal')}
                    className={`pb-3 px-4 text-sm font-medium transition-colors ${activeTab === 'legal' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 dark:text-gray-400'}`}
                >
                    Terms & Conditions
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 border border-gray-100 dark:border-gray-700 min-h-[400px]">
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
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Current Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={passwordData.current}
                                        onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                                        className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">New Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={passwordData.new}
                                        onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                                        className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Confirm New Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={passwordData.confirm}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                                        className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                                <button type="submit" className="btn-primary w-full py-3 rounded-xl mt-4">
                                    Update Password
                                </button>
                            </form>
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
                                <FaFileContract /> Terms of Service
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
