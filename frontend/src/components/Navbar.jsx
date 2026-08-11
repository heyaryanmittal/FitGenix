import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, LogOut, User, Menu, X, Cpu } from 'lucide-react';
import { Button } from './ui/button';

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
    const navigate = useNavigate();
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
        <nav className="sticky top-0 w-full bg-[#0A0D14]/90 backdrop-blur-2xl border-b border-orange-500/30 px-4 md:px-8 py-3 flex justify-between items-center z-30 shadow-2xl">
            <div className="flex items-center gap-3">
                <button
                    onClick={toggleSidebar}
                    className="md:hidden p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white active:scale-95 transition-transform"
                >
                    {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
                <div 
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 cursor-pointer group"
                >
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-600 via-primary to-cyan-400 flex items-center justify-center shadow-copper-glow group-hover:scale-105 transition-transform">
                        <Flame className="w-5 h-5 text-white fill-white" />
                    </div>
                    <span className="text-xl md:text-2xl font-black tracking-tight text-white font-display">
                        Fit<span className="text-primary copper-glow-text">Genix</span>
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-3 md:gap-5 font-mono">
                {user && (
                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#05070B] border border-orange-500/30">
                        <div className="w-6 h-6 rounded-full bg-orange-500/20 border border-orange-500/50 flex items-center justify-center font-bold text-xs text-orange-400">
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <span className="text-xs font-semibold text-zinc-300">
                            <span className="text-orange-400">{user.name}</span>
                        </span>
                    </div>
                )}

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/dashboard/profile')}
                    className="gap-2 text-xs h-9 px-3"
                >
                    <User className="w-4 h-4 text-orange-400" />
                    <span className="hidden sm:inline">Profile</span>
                </Button>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    title="Sign Out"
                    className="h-9 w-9 p-0 text-zinc-400 hover:text-red-400 hover:bg-red-500/10"
                >
                    <LogOut className="w-4 h-4" />
                </Button>
            </div>
        </nav>
    );
};

export default Navbar;
