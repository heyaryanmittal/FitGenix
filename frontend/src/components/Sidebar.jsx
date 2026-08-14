import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Dumbbell, 
  ClipboardList, 
  Utensils, 
  Calendar, 
  Settings, 
  User,
  X, 
  Flame,
  Sparkles
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
        { name: "My Athlete Profile", path: "/dashboard/profile", icon: <User className="w-4 h-4" /> },
        { name: "Settings", path: "/settings", icon: <Settings className="w-4 h-4" /> },
    ];

    const handleNavigation = (path) => {
        navigate(path);
        if (window.innerWidth < 768) {
            toggleSidebar();
        }
    };

    return (
        <aside className={`fixed inset-y-0 left-0 w-64 bg-white dark:bg-[#0F172A] border-r border-slate-200 dark:border-slate-800/80 shadow-xl z-40 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 md:translate-x-0 md:static p-5 flex flex-col h-full overflow-hidden`}>
            
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div 
                    onClick={() => handleNavigation('/dashboard')} 
                    className="flex items-center gap-2.5 cursor-pointer select-none"
                >
                    <div className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
                        <Flame className="w-5 h-5 fill-white" />
                    </div>
                    <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white font-display">
                        Fit<span className="text-orange-600">Genix</span>
                    </span>
                </div>
                <button
                    onClick={toggleSidebar}
                    className="md:hidden p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Menu */}
            <nav className="flex-1 space-y-1.5 overflow-y-auto scrollbar-hide">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <button
                            key={item.path}
                            onClick={() => handleNavigation(item.path)}
                            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                                isActive
                                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25 font-bold'
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-orange-500/10 hover:text-orange-600 dark:hover:text-orange-400'
                            }`}
                        >
                            <span className={isActive ? "text-white" : "text-slate-500 dark:text-slate-400"}>
                                {item.icon}
                            </span>
                            <span className="tracking-wide">{item.name}</span>
                        </button>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-500/10 dark:to-amber-500/10 rounded-xl p-3 border border-orange-100 dark:border-orange-500/20 flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-orange-500 text-white flex items-center justify-center shrink-0">
                        <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div>
                        <p className="text-[11px] font-bold text-orange-700 dark:text-orange-400">FitGenix AI v2.5</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500">Groq Engine Active</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;

