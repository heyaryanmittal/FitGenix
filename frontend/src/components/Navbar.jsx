import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, LogOut, User, Menu, X, Sun, Moon } from 'lucide-react';
import { Button } from './ui/button';
import { useTheme } from '../context/ThemeContext';

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
    const navigate = useNavigate();
    const { isDark, toggleTheme } = useTheme();
    const [user] = useState(() => {
        const stored = localStorage.getItem('user');
        return stored ? JSON.parse(stored) : null;
    });

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <nav className="sticky top-0 w-full bg-white/90 dark:bg-[#0A0D14]/90 backdrop-blur-2xl border-b border-orange-500/15 dark:border-orange-500/30 px-4 md:px-8 py-3 flex justify-between items-center z-30 shadow-sm dark:shadow-2xl transition-colors duration-300">
            <div className="flex items-center gap-3">
                <button
                    onClick={toggleSidebar}
                    className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:text-orange-600 dark:hover:text-white active:scale-95 transition-transform"
                >
                    {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
                <div 
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 cursor-pointer group"
                >
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center shadow-sunrise-orange group-hover:scale-105 transition-transform">
                        <Flame className="w-5 h-5 text-white fill-white" />
                    </div>
                    <span className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-white font-display">
                        Fit<span className="text-orange-600">Genix</span>
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 font-mono">
                {/* Theme Toggle Button */}
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-amber-400 hover:scale-105 active:scale-95 transition-all shadow-sm"
                    title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                    {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
                </button>

                {user && (
                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-[#05070B] border border-slate-200 dark:border-orange-500/30">
                        <div className="w-6 h-6 rounded-full bg-orange-500/20 border border-orange-500/50 flex items-center justify-center font-bold text-xs text-orange-600 dark:text-orange-400">
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                            <span className="text-orange-600 dark:text-orange-400">{user.name}</span>
                        </span>
                    </div>
                )}

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/dashboard/profile')}
                    className="gap-2 text-xs h-9 px-3"
                >
                    <User className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    <span className="hidden sm:inline">Profile</span>
                </Button>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    title="Sign Out"
                    className="h-9 w-9 p-0 text-slate-500 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/10"
                >
                    <LogOut className="w-4 h-4" />
                </Button>
            </div>
        </nav>
    );
};

export default Navbar;
