import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, 
  Palette, 
  Sun, 
  Moon, 
  Shield, 
  Bell, 
  Bot, 
  FileText, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Sliders 
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useNotification } from '../context/NotificationContext';
import API_URL from '../apiConfig';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

const Settings = () => {
    const { theme, setTheme, isDark } = useTheme();
    const { showNotification } = useNotification();

    const [activeTab, setActiveTab] = useState('appearance');

    // Account security
    const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
    const [showPass, setShowPass] = useState(false);
    const [loadingPass, setLoadingPass] = useState(false);

    // AI Coach configuration state
    const [aiTone, setAiTone] = useState(() => localStorage.getItem('ai_tone') || 'encouraging');
    const [aiAutoTips, setAiAutoTips] = useState(true);

    // Notification toggles
    const [notifs, setNotifs] = useState({
        dailyReminder: true,
        hydrationAlerts: true,
        weeklyDigest: true
    });

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordData.new !== passwordData.confirm) {
            showNotification("New passwords do not match!", "error");
            return;
        }
        if (passwordData.new.length < 6) {
            showNotification("New password must be at least 6 characters", "error");
            return;
        }

        setLoadingPass(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/user/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword: passwordData.current,
                    newPassword: passwordData.new
                })
            });
            const result = await res.json();
            if (result.success) {
                showNotification("Password updated successfully!", "success");
                setPasswordData({ current: '', new: '', confirm: '' });
            } else {
                showNotification(result.error || "Failed to update password", "error");
            }
        } catch (err) {
            showNotification("Server error changing password", "error");
        } finally {
            setLoadingPass(false);
        }
    };

    const handleSaveAiSettings = (tone) => {
        setAiTone(tone);
        localStorage.setItem('ai_tone', tone);
        showNotification(`AI Coach personality set to ${tone.toUpperCase()}`, 'success');
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 font-sans pb-12 text-slate-800 dark:text-slate-100">
            
            {/* Header */}
            <div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white font-display flex items-center gap-3">
                    <Sliders className="w-8 h-8 text-orange-500" />
                    <span>Application Settings</span>
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Manage interface appearance, AI assistant personality, notifications, and security preferences.
                </p>
            </div>

            {/* Tabbed Navigation Bar */}
            <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto scrollbar-hide pb-1">
                <button
                    onClick={() => setActiveTab('appearance')}
                    className={`pb-3 px-4 text-xs font-mono font-bold transition-all shrink-0 rounded-t-xl ${
                        activeTab === 'appearance'
                            ? 'border-b-2 border-orange-500 text-orange-600 dark:text-orange-400 bg-orange-50/50 dark:bg-orange-500/10'
                            : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                >
                    🎨 Interface & Theme
                </button>
                <button
                    onClick={() => setActiveTab('ai_coach')}
                    className={`pb-3 px-4 text-xs font-mono font-bold transition-all shrink-0 rounded-t-xl ${
                        activeTab === 'ai_coach'
                            ? 'border-b-2 border-orange-500 text-orange-600 dark:text-orange-400 bg-orange-50/50 dark:bg-orange-500/10'
                            : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                >
                    🤖 AI Assistant Settings
                </button>
                <button
                    onClick={() => setActiveTab('notifications')}
                    className={`pb-3 px-4 text-xs font-mono font-bold transition-all shrink-0 rounded-t-xl ${
                        activeTab === 'notifications'
                            ? 'border-b-2 border-orange-500 text-orange-600 dark:text-orange-400 bg-orange-50/50 dark:bg-orange-500/10'
                            : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                >
                    🔔 Notifications & Alerts
                </button>
                <button
                    onClick={() => setActiveTab('security')}
                    className={`pb-3 px-4 text-xs font-mono font-bold transition-all shrink-0 rounded-t-xl ${
                        activeTab === 'security'
                            ? 'border-b-2 border-orange-500 text-orange-600 dark:text-orange-400 bg-orange-50/50 dark:bg-orange-500/10'
                            : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                >
                    🔒 Account Security
                </button>
                <button
                    onClick={() => setActiveTab('legal')}
                    className={`pb-3 px-4 text-xs font-mono font-bold transition-all shrink-0 rounded-t-xl ${
                        activeTab === 'legal'
                            ? 'border-b-2 border-orange-500 text-orange-600 dark:text-orange-400 bg-orange-50/50 dark:bg-orange-500/10'
                            : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                >
                    📜 Terms & Disclaimer
                </button>
            </div>

            {/* Main Content Area */}
            <Card className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 min-h-[420px] transition-all">
                <AnimatePresence mode="wait">
                    
                    {/* TAB 1: APPEARANCE & THEME */}
                    {activeTab === 'appearance' && (
                        <motion.div
                            key="appearance"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="space-y-6"
                        >
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 font-display">
                                    <Palette className="w-5 h-5 text-orange-500" /> Interface Theme Mode
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    Customize visual theme across FitGenix web components.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-xl pt-2">
                                {/* Light Mode Option Card */}
                                <div 
                                    onClick={() => setTheme('light')}
                                    className={`p-5 rounded-3xl border-2 cursor-pointer transition-all flex items-center gap-4 ${
                                        theme === 'light' 
                                            ? 'border-orange-500 bg-orange-50/60 dark:bg-orange-500/10 shadow-lg scale-102' 
                                            : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:border-orange-300'
                                    }`}
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-xl shrink-0">
                                        <Sun className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white text-base font-display">Sunrise Light</h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">High contrast, energetic bright UI.</p>
                                    </div>
                                </div>

                                {/* Dark Mode Option Card */}
                                <div 
                                    onClick={() => setTheme('dark')}
                                    className={`p-5 rounded-3xl border-2 cursor-pointer transition-all flex items-center gap-4 ${
                                        theme === 'dark' 
                                            ? 'border-orange-500 bg-orange-50/60 dark:bg-orange-500/10 shadow-lg scale-102' 
                                            : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:border-orange-300'
                                    }`}
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-slate-800 text-amber-400 flex items-center justify-center font-bold text-xl shrink-0">
                                        <Moon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white text-base font-display">Deep Slate Dark</h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Minimalist sleek dark workspace mode.</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* TAB 2: AI ASSISTANT SETTINGS */}
                    {activeTab === 'ai_coach' && (
                        <motion.div
                            key="ai_coach"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            className="space-y-6"
                        >
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 font-display">
                                    <Bot className="w-5 h-5 text-orange-500" /> AI Coach Persona & Mode
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    Choose how FitGenix AI formats tips and insights for your daily training.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl pt-2">
                                {/* Option 1 */}
                                <div 
                                    onClick={() => handleSaveAiSettings('encouraging')}
                                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all space-y-2 ${
                                        aiTone === 'encouraging' 
                                            ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-500/10' 
                                            : 'border-slate-200 dark:border-slate-800'
                                    }`}
                                >
                                    <Sparkles className="w-6 h-6 text-orange-500" />
                                    <h4 className="font-bold text-sm font-display">Encouraging Mentor</h4>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Supportive tone focused on building habits and positive feedback.</p>
                                </div>

                                {/* Option 2 */}
                                <div 
                                    onClick={() => handleSaveAiSettings('strict')}
                                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all space-y-2 ${
                                        aiTone === 'strict' 
                                            ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-500/10' 
                                            : 'border-slate-200 dark:border-slate-800'
                                    }`}
                                >
                                    <Bot className="w-6 h-6 text-amber-500" />
                                    <h4 className="font-bold text-sm font-display">Strict Trainer</h4>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Direct, high-accountability advice to crush targets fast.</p>
                                </div>

                                {/* Option 3 */}
                                <div 
                                    onClick={() => handleSaveAiSettings('data')}
                                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all space-y-2 ${
                                        aiTone === 'data' 
                                            ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-500/10' 
                                            : 'border-slate-200 dark:border-slate-800'
                                    }`}
                                >
                                    <Sliders className="w-6 h-6 text-emerald-500" />
                                    <h4 className="font-bold text-sm font-display">Sports Scientist</h4>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Data-heavy macro percentages, metabolic metrics, and recovery indices.</p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* TAB 3: NOTIFICATIONS */}
                    {activeTab === 'notifications' && (
                        <motion.div
                            key="notifications"
                            initial={{ opacity: 0, x: -15 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 15 }}
                            className="space-y-6"
                        >
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 font-display">
                                    <Bell className="w-5 h-5 text-orange-500" /> Notification Preferences
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    Control in-app alerts, streak notifications, and water reminders.
                                </p>
                            </div>

                            <div className="space-y-4 max-w-lg">
                                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                                    <div>
                                        <p className="font-bold text-sm font-display">Daily Workout Reminders</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Alert me to log active exercise sessions.</p>
                                    </div>
                                    <input 
                                        type="checkbox"
                                        checked={notifs.dailyReminder}
                                        onChange={() => setNotifs({ ...notifs, dailyReminder: !notifs.dailyReminder })}
                                        className="w-5 h-5 accent-orange-500 rounded cursor-pointer"
                                    />
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                                    <div>
                                        <p className="font-bold text-sm font-display">Hydration Level Alerts</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Prompt +500ml water logs during afternoon training.</p>
                                    </div>
                                    <input 
                                        type="checkbox"
                                        checked={notifs.hydrationAlerts}
                                        onChange={() => setNotifs({ ...notifs, hydrationAlerts: !notifs.hydrationAlerts })}
                                        className="w-5 h-5 accent-orange-500 rounded cursor-pointer"
                                    />
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                                    <div>
                                        <p className="font-bold text-sm font-display">Weekly AI Progress Report</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Summary digest of macros, streak, and recovery.</p>
                                    </div>
                                    <input 
                                        type="checkbox"
                                        checked={notifs.weeklyDigest}
                                        onChange={() => setNotifs({ ...notifs, weeklyDigest: !notifs.weeklyDigest })}
                                        className="w-5 h-5 accent-orange-500 rounded cursor-pointer"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* TAB 4: ACCOUNT SECURITY */}
                    {activeTab === 'security' && (
                        <motion.div
                            key="security"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-6"
                        >
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 font-display">
                                    <Shield className="w-5 h-5 text-orange-500" /> Change Account Password
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    Update security credentials for your FitGenix athlete account.
                                </p>
                            </div>

                            <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                                <div>
                                    <label className="block text-xs font-mono font-bold text-slate-500 dark:text-slate-400 mb-1">Current Password</label>
                                    <Input
                                        type="password"
                                        required
                                        value={passwordData.current}
                                        onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                                        className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-mono font-bold text-slate-500 dark:text-slate-400 mb-1">New Password</label>
                                    <Input
                                        type="password"
                                        required
                                        value={passwordData.new}
                                        onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                                        className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-mono font-bold text-slate-500 dark:text-slate-400 mb-1">Confirm New Password</label>
                                    <Input
                                        type="password"
                                        required
                                        value={passwordData.confirm}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                                        className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                                    />
                                </div>
                                <Button type="submit" disabled={loadingPass} variant="glow" className="w-full mt-2 font-mono text-xs">
                                    {loadingPass ? "Updating Security..." : "Update Account Password"}
                                </Button>
                            </form>
                        </motion.div>
                    )}

                    {/* TAB 5: TERMS & LEGAL */}
                    {activeTab === 'legal' && (
                        <motion.div
                            key="legal"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 font-display">
                                <FileText className="w-5 h-5 text-orange-500" /> Terms of Service & Health Disclaimer
                            </h3>
                            <div className="prose dark:prose-invert max-w-none text-xs text-slate-600 dark:text-slate-300 h-[300px] overflow-y-auto pr-4 space-y-4">
                                <p><strong>1. Introduction</strong><br />Welcome to FitGenix. By accessing our platform, you agree to be bound by these Terms and Conditions.</p>
                                <p><strong>2. Health & Medical Disclaimer</strong><br />FitGenix provides AI-assisted fitness, exercise, and nutritional guidance for general wellness purposes only. Always consult a physician before beginning any new training program.</p>
                                <p><strong>3. AI Engine Integrity</strong><br />Insights are generated using Groq Llama-3.3 models based on your input parameters. Values are estimates to support your training routine.</p>
                                <p className="text-[11px] text-slate-400 mt-6 font-mono">FitGenix Engine Version 2.5.0 • Updated February 2026</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Card>
        </div>
    );
};

export default Settings;

