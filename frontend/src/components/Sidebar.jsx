import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Dumbbell, 
  ClipboardList, 
  Utensils, 
  Calendar, 
  Settings, 
  X, 
  Flame,
  Cpu
} from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { name: "Home Dashboard", path: "/dashboard", icon: <Home className="w-4 h-4" /> },
        { name: "Exercises & Form", path: "/exercises", icon: <Dumbbell className="w-4 h-4" /> },
        { name: "Workout Plans", path: "/workout-plans", icon: <ClipboardList className="w-4 h-4" /> },
        { name: "Diet & Nutrition", path: "/diet", icon: <Utensils className="w-4 h-4" /> },
        { name: "7-Day Meal Planner", path: "/meal-planner", icon: <Calendar className="w-4 h-4" /> },
        { name: "Settings", path: "/settings", icon: <Settings className="w-4 h-4" /> },
    ];

    const handleNavigation = (path) => {
        navigate(path);
        if (window.innerWidth < 768) {
            toggleSidebar();
        }
    };

    return (
        <aside className={`fixed inset-y-0 left-0 w-64 bg-[#0A0D14] border-r border-orange-500/30 shadow-2xl z-40 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 md:translate-x-0 md:static p-5 flex flex-col h-full overflow-hidden`}>
            
            {/* Header */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-800">
                <div 
                    onClick={() => handleNavigation('/dashboard')} 
                    className="flex items-center gap-2.5 cursor-pointer select-none"
                >
                    <div className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-copper-glow">
                        <Flame className="w-5 h-5 fill-white" />
                    </div>
                    <span className="text-xl font-black tracking-tight text-white font-display">
                        Fit<span className="text-primary copper-glow-text">Genix</span>
                    </span>
                </div>
                <button
                    onClick={toggleSidebar}
                    className="md:hidden p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Menu */}
            <nav className="flex-1 space-y-1.5 overflow-y-auto scrollbar-hide font-mono">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <button
                            key={item.path}
                            onClick={() => handleNavigation(item.path)}
                            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                                isActive
                                    ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-copper-glow'
                                    : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                            }`}
                        >
                            <span className={isActive ? "text-white" : "text-zinc-500"}>
                                {item.icon}
                            </span>
                            <span className="tracking-wide">{item.name}</span>
                        </button>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="pt-4 border-t border-zinc-800">
                <div className="bg-[#05070B] rounded-xl p-3 border border-orange-500/30 text-center font-mono">
                    <p className="text-[11px] font-bold text-cyan-400 flex items-center justify-center gap-1">
                        <Cpu className="w-3 h-3 animate-pulse" /> Cyber Engine v2.0
                    </p>
                    <p className="text-[10px] text-zinc-500 mt-0.5">&copy; 2026 FitGenix AI</p>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
