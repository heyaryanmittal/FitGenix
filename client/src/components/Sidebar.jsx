import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHome, FaDumbbell, FaUtensils, FaInfoCircle, FaCog, FaClipboardList, FaCalendarAlt } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    const menuItems = [
        { name: "Home", path: "/dashboard", icon: <FaHome size={20} /> },
        { name: "Exercises", path: "/exercises", icon: <FaDumbbell size={20} /> },
        { name: "Workout Plans", path: "/workout-plans", icon: <FaClipboardList size={20} /> },
        { name: "Diet and\nNutrition", path: "/diet", icon: <FaUtensils size={20} /> },
        { name: "Meal\nPlanner", path: "/meal-planner", icon: <FaCalendarAlt size={20} /> },
        { name: "Settings", path: "/settings", icon: <FaCog size={20} /> },
    ];

    const handleNavigation = (path) => {
        navigate(path);
        if (window.innerWidth < 768) {
            toggleSidebar();
        }
    };

    return (
        <aside className={`fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-xl z-40 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-all duration-500 md:translate-x-0 md:static p-6 flex flex-col h-full overflow-hidden`}>



            <nav className="flex-1 flex flex-col gap-2 overflow-y-auto overflow-x-hidden scrollbar-hide">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <motion.button
                            key={item.path}
                            onClick={() => handleNavigation(item.path)}
                            className={`flex items-center gap-4 px-4 py-3 rounded-xl text-left font-medium transition-all ${isActive
                                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                                }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {item.icon}
                            <span className="whitespace-pre-line leading-tight">{item.name}</span>
                        </motion.button>
                    );
                })}
            </nav>

            <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-800">
                <div className="mt-4 text-center text-xs text-gray-400">
                    &copy; 2026 FitGenix v1.0
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
