import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const showNotification = useCallback((message, type = 'success', duration = 1500) => {
        const id = Date.now();
        setNotifications((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, duration);
    }, []);

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3">
                <AnimatePresence>
                    {notifications.map((n) => (
                        <motion.div
                            key={n.id}
                            initial={{ opacity: 0, x: 50, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9, x: 20 }}
                            className={`px-6 py-4 rounded-2xl shadow-2xl border flex items-center gap-3 min-w-[280px] backdrop-blur-md ${n.type === 'success'
                                ? 'bg-green-500/90 border-green-400 text-white'
                                : 'bg-red-500/90 border-red-400 text-white'
                                }`}
                        >
                            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center font-bold">
                                {n.type === 'success' ? '✓' : '!'}
                            </div>
                            <p className="font-bold text-sm tracking-wide">{n.message}</p>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext);
