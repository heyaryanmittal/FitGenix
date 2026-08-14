import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Flame, 
  LogOut, 
  User, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  Search, 
  Bell, 
  Settings, 
  ChevronDown, 
  Sparkles,
  Dumbbell,
  Utensils
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useNotification } from '../context/NotificationContext';

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
    const navigate = useNavigate();
    const { isDark, toggleTheme } = useTheme();
    const { showNotification } = useNotification();
    const [user] = useState(() => {
        const stored = localStorage.getItem('user');
        return stored ? JSON.parse(stored) : null;
    });

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchOpen, setSearchOpen] = useState(false);

    const dropdownRef = useRef(null);
    const notifRef = useRef(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setIsNotificationOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        showNotification("Logged out successfully", "success");
        navigate('/');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        const q = searchQuery.toLowerCase();
        if (q.includes('exercise') || q.includes('workout') || q.includes('gym')) {
            navigate('/exercises');
        } else if (q.includes('diet') || q.includes('food') || q.includes('calorie') || q.includes('meal')) {
            navigate('/diet');
        } else if (q.includes('plan') || q.includes('7-day')) {
            navigate('/meal-planner');
        } else if (q.includes('setting')) {
            navigate('/settings');
        } else if (q.includes('profile')) {
            navigate('/dashboard/profile');
        } else {
            navigate('/dashboard');
        }
        setSearchQuery('');
        setSearchOpen(false);
    };

    return (
        <nav className="sticky top-0 w-full bg-white/90 dark:bg-[#0A0D14]/90 backdrop-blur-2xl border-b border-slate-200/80 dark:border-orange-500/20 px-4 md:px-8 py-3 flex justify-between items-center z-30 shadow-sm transition-colors duration-300">
            
            {/* Left: Mobile Menu & Brand */}
            <div className="flex items-center gap-3">
                <button
                    onClick={toggleSidebar}
                    className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:text-orange-600 dark:hover:text-white active:scale-95 transition-transform"
                    aria-label="Toggle Navigation Menu"
                >
                    {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
                <div 
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2.5 cursor-pointer group"
                >
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-500 via-amber-500 to-orange-600 flex items-center justify-center shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
                        <Flame className="w-5 h-5 text-white fill-white" />
                    </div>
                    <span className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-white font-display">
                        Fit<span className="text-orange-600">Genix</span>
                    </span>
                </div>
            </div>

            {/* Center: Global Search Bar (Hidden on Mobile) */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center relative w-72 lg:w-96">
                <Search className="w-4 h-4 absolute left-3 text-slate-400 dark:text-slate-500 pointer-events-none" />
                <input
                    type="text"
                    placeholder="Search workouts, diet, planners..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all font-sans"
                />
            </form>

            {/* Right: Actions, Theme, Notifications & User Dropdown */}
            <div className="flex items-center gap-2 sm:gap-3">
                
                {/* Mobile Search Button */}
                <button
                    onClick={() => setSearchOpen(!searchOpen)}
                    className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
                >
                    <Search className="w-4 h-4" />
                </button>

                {/* Theme Toggle Button */}
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-amber-400 hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer"
                    title={isDark ? "Switch to Sunrise Light" : "Switch to Deep Dark"}
                >
                    {isDark ? <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" /> : <Moon className="w-4 h-4 text-slate-700" />}
                </button>

                {/* Notifications Trigger Bell */}
                <div className="relative" ref={notifRef}>
                    <button
                        onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 relative transition-all cursor-pointer"
                        title="Notifications"
                    >
                        <Bell className="w-4 h-4" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                    </button>

                    {/* Notifications Dropdown */}
                    {isNotificationOpen && (
                        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 z-50 text-xs space-y-3">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                                <span className="font-bold text-slate-900 dark:text-white font-display">Notifications</span>
                                <span className="px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 font-mono font-bold text-[10px]">2 New</span>
                            </div>
                            <div className="space-y-2">
                                <div className="p-2.5 rounded-xl bg-orange-50/60 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20">
                                    <p className="font-bold text-slate-800 dark:text-slate-200">🔥 Streak Maintained!</p>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">You logged 15 consecutive days on FitGenix.</p>
                                </div>
                                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                    <p className="font-bold text-slate-800 dark:text-slate-200">🤖 AI Insight Ready</p>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Check your daily AI recommendations on the dashboard.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* User Profile Dropdown Menu */}
                {user ? (
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-2 p-1.5 pl-2 pr-3 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-orange-400 dark:hover:border-orange-500 transition-all cursor-pointer"
                        >
                            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center font-black text-xs text-white shadow-sm">
                                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <span className="hidden sm:inline text-xs font-bold text-slate-800 dark:text-slate-200 font-display">
                                {user.name?.split(' ')[0] || 'Athlete'}
                            </span>
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                        </button>

                        {/* Dropdown Card */}
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50 text-xs">
                                <div className="px-3 py-2.5 border-b border-slate-100 dark:border-slate-800">
                                    <p className="font-bold text-slate-900 dark:text-white text-sm">{user.name}</p>
                                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                                    <span className="mt-1 inline-block px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 text-[10px] font-mono font-bold">
                                        Pro Athlete
                                    </span>
                                </div>
                                <div className="py-1.5 space-y-0.5">
                                    <button
                                        onClick={() => { navigate('/dashboard/profile'); setIsDropdownOpen(false); }}
                                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-orange-50 dark:hover:bg-orange-500/10 hover:text-orange-600 dark:hover:text-orange-400 transition-colors font-medium"
                                    >
                                        <User className="w-4 h-4 text-orange-500" /> My Profile
                                    </button>
                                    <button
                                        onClick={() => { navigate('/settings'); setIsDropdownOpen(false); }}
                                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-orange-50 dark:hover:bg-orange-500/10 hover:text-orange-600 dark:hover:text-orange-400 transition-colors font-medium"
                                    >
                                        <Settings className="w-4 h-4 text-slate-400" /> Account Settings
                                    </button>
                                    <button
                                        onClick={() => { navigate('/meal-planner'); setIsDropdownOpen(false); }}
                                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-orange-50 dark:hover:bg-orange-500/10 hover:text-orange-600 dark:hover:text-orange-400 transition-colors font-medium"
                                    >
                                        <Utensils className="w-4 h-4 text-emerald-500" /> 7-Day Meal Planner
                                    </button>
                                </div>
                                <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors font-bold"
                                    >
                                        <LogOut className="w-4 h-4" /> Sign Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <button
                        onClick={() => navigate('/auth')}
                        className="px-4 py-2 rounded-xl bg-orange-600 text-white font-bold text-xs hover:bg-orange-500 transition-all shadow-md"
                    >
                        Sign In
                    </button>
                )}
            </div>

            {/* Expandable Mobile Search Bar */}
            {searchOpen && (
                <div className="absolute top-full left-0 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-3 md:hidden z-20">
                    <form onSubmit={handleSearch} className="flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="Search workouts, diet, settings..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700"
                        />
                        <button type="submit" className="px-3 py-2 rounded-xl bg-orange-500 text-white text-xs font-bold">
                            Go
                        </button>
                    </form>
                </div>
            )}
        </nav>
    );
};

export default Navbar;

