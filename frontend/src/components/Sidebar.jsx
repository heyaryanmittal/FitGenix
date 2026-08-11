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
  Flame
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
        <aside className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-orange-500/15 shadow-xl z-40 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 md:translate-x-0 md:static p-5 flex flex-col h-full overflow-hidden`}>
            
            {/* Header */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                <div 
                    onClick={() => handleNavigation('/dashboard')} 
                    className="flex items-center gap-2.5 cursor-pointer select-none"
                >
                    <div className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-sunrise-orange">
                        <Flame className="w-5 h-5 fill-white" />
                    </div>
                    <span className="text-xl font-black tracking-tight text-slate-900 font-display">
                        Fit<span className="text-orange-600">Genix</span>
                    </span>
                </div>
                <button
                    onClick={toggleSidebar}
                    className="md:hidden p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-900"
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
                            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                                isActive
                                    ? 'bg-orange-500 text-white shadow-sunrise-orange font-bold'
                                    : 'text-slate-600 hover:bg-orange-50 hover:text-orange-600'
                            }`}
                        >
                            <span className={isActive ? "text-white" : "text-slate-500"}>
                                {item.icon}
                            </span>
                            <span className="tracking-wide">{item.name}</span>
                        </button>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="pt-4 border-t border-slate-100">
                <div className="bg-orange-50 rounded-xl p-3 border border-orange-100 text-center">
                    <p className="text-[11px] font-semibold text-orange-700">FitGenix Engine</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">&copy; 2026 FitGenix AI</p>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
