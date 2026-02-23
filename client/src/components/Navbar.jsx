import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSun, FaMoon, FaUserCircle, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('user');
        return stored ? JSON.parse(stored) : null;
    });

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    const toggleTheme = () => {
        setDarkMode(!darkMode);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <nav className="sticky top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 md:px-6 py-4 flex justify-between items-center z-30 shadow-sm transition-colors duration-300">
            <div className="flex items-center gap-3">
                <button
                    onClick={toggleSidebar}
                    className="md:hidden p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 active:scale-90 transition-transform"
                >
                    {isSidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
                </button>
                <h1 className="text-xl md:2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary to-orange-500 cursor-pointer tracking-tight" onClick={() => navigate('/dashboard')}>
                    FitGenix
                </h1>
            </div>

            <div className="flex items-center gap-3 md:gap-6">
                {user && (
                    <span className="hidden md:block font-medium text-gray-700 dark:text-gray-300">
                        Welcome, <span className="text-primary font-bold">{user.name}</span>
                    </span>
                )}

                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleTheme}
                    className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-yellow-500 dark:text-yellow-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                    {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
                </motion.button>

                <div className="relative group">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"
                        onClick={() => navigate('/dashboard/profile')}
                    >
                        <FaUserCircle size={28} />
                    </motion.button>
                </div>

                <motion.button
                    whileHover={{ scale: 1.1, color: '#FF4500' }}
                    onClick={handleLogout}
                    className="text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors"
                    title="Logout"
                >
                    <FaSignOutAlt size={24} />
                </motion.button>
            </div>
        </nav>
    );
};

export default Navbar;
