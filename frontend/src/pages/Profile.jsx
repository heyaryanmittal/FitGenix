import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaRulerVertical, FaWeight, FaBullseye, FaEdit, FaSave } from 'react-icons/fa';
import { useNotification } from '../context/NotificationContext';
import API_URL from '../apiConfig';

const Profile = () => {
    const { showNotification } = useNotification();
    const [user, setUser] = useState({
        name: "Guest User",
        email: "guest@example.com",
        details: {
            age: 0,
            height: 0,
            weight: 0,
            goal: "Select a goal"
        }
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            if (!parsedUser.details) {
                parsedUser.details = { age: 25, height: 175, weight: 70, goal: "Fitness" };
            }
            setUser(parsedUser);
            setEditedUser(parsedUser);
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name in editedUser.details) {
            setEditedUser({
                ...editedUser,
                details: { ...editedUser.details, [name]: value }
            });
        } else {
            setEditedUser({ ...editedUser, [name]: value });
        }
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/user/details`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(editedUser.details)
            });

            if (res.ok) {
                setUser(editedUser);
                localStorage.setItem('user', JSON.stringify(editedUser));
                setIsEditing(false);
                showNotification("Profile updated!", "success");
            } else {
                showNotification("Failed to update profile.", "error");
            }
        } catch (err) {
            console.error("Error updating profile", err);
            showNotification("Error updating profile", "error");
        }
    };

    if (!editedUser) return <div>Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-3xl p-4 md:p-8 shadow-lg border border-gray-100 dark:border-gray-700 relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-24 md:h-32 bg-gradient-to-r from-primary to-orange-400 opacity-90"></div>

                <div className="relative pt-12 md:pt-16 px-2 md:px-4 flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-6">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white dark:border-gray-800 bg-gray-200 flex items-center justify-center text-3xl md:text-4xl font-bold text-gray-500 shadow-xl z-10 overflow-hidden">
                        {user.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="flex-1 text-center md:text-left mb-2 z-10">
                        <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white leading-tight">{user.name}</h1>
                        <p className="text-white/90 md:text-gray-500 dark:text-gray-400 font-bold text-sm">{user.email}</p>
                    </div>

                    <div className="z-10 mb-2 md:mb-4 w-full md:w-auto">
                        {isEditing ? (
                            <button
                                onClick={handleSave}
                                className="w-full md:w-auto flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 md:py-2 rounded-xl font-bold transition-all shadow-lg shadow-green-500/30"
                            >
                                <FaSave /> Save Changes
                            </button>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="w-full md:w-auto flex items-center justify-center gap-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-white px-6 py-3 md:py-2 rounded-xl font-bold hover:shadow-lg transition-all border border-gray-200 dark:border-gray-600"
                            >
                                <FaEdit /> Edit Profile
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 shadow-md border border-gray-100 dark:border-gray-700"
                >
                    <h3 className="text-lg md:text-xl font-black mb-6 flex items-center gap-2 text-gray-800 dark:text-white">
                        <FaUser className="text-primary" /> Profile Details
                    </h3>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Full Name</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="name"
                                    value={editedUser.name}
                                    onChange={handleChange}
                                    className="w-full p-3 rounded-xl border-2 border-gray-100 dark:border-gray-700 dark:bg-gray-900 focus:outline-none focus:border-primary transition-all font-bold"
                                />
                            ) : (
                                <p className="text-lg font-black text-gray-800 dark:text-gray-200">{user.name}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Email Address</label>
                            <p className="text-base md:text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2 break-all">
                                <FaEnvelope className="text-gray-400 flex-shrink-0" /> {user.email}
                            </p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 shadow-md border border-gray-100 dark:border-gray-700"
                >
                    <h3 className="text-lg md:text-xl font-black mb-6 flex items-center gap-2 text-gray-800 dark:text-white">
                        <FaBullseye className="text-primary" /> Body & Goals
                    </h3>

                    <div className="grid grid-cols-2 gap-4 md:gap-6">
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-2xl">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">Age</label>
                            {isEditing ? (
                                <input
                                    type="number"
                                    name="age"
                                    value={editedUser.details?.age}
                                    onChange={handleChange}
                                    className="w-full p-0 bg-transparent border-b-2 border-gray-200 focus:outline-none focus:border-primary text-xl font-black"
                                />
                            ) : (
                                <p className="text-xl md:text-2xl font-black text-gray-800 dark:text-white">{user.details?.age} <span className="text-xs font-bold text-gray-500">yrs</span></p>
                            )}
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-2xl">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">Weight</label>
                            {isEditing ? (
                                <input
                                    type="number"
                                    name="weight"
                                    value={editedUser.details?.weight}
                                    onChange={handleChange}
                                    className="w-full p-0 bg-transparent border-b-2 border-gray-200 focus:outline-none focus:border-primary text-xl font-black"
                                />
                            ) : (
                                <p className="text-xl md:text-2xl font-black text-gray-800 dark:text-white flex items-center gap-1">
                                    {user.details?.weight} <span className="text-xs font-bold text-gray-500">kg</span>
                                </p>
                            )}
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-2xl">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">Height</label>
                            {isEditing ? (
                                <input
                                    type="number"
                                    name="height"
                                    value={editedUser.details?.height}
                                    onChange={handleChange}
                                    className="w-full p-0 bg-transparent border-b-2 border-gray-200 focus:outline-none focus:border-primary text-xl font-black"
                                />
                            ) : (
                                <p className="text-xl md:text-2xl font-black text-gray-800 dark:text-white flex items-center gap-1">
                                    {user.details?.height} <span className="text-xs font-bold text-gray-500">cm</span>
                                </p>
                            )}
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-2xl relative">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">Primary Goal</label>
                            {isEditing ? (
                                <div className="relative group">
                                    <select
                                        name="goal"
                                        value={editedUser.details?.goal}
                                        onChange={handleChange}
                                        className="w-full p-2 bg-white dark:bg-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-0 appearance-none cursor-pointer font-black text-xs text-gray-800 dark:text-white transition-all"
                                    >
                                        <option value="Muscle Gain">Muscle Gain</option>
                                        <option value="Weight Loss">Weight Loss</option>
                                        <option value="Maintenance">Maintenance</option>
                                        <option value="Endurance">Endurance</option>
                                    </select>
                                </div>
                            ) : (
                                <p className="text-sm font-black text-primary leading-tight">
                                    {user.details?.goal}
                                </p>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Profile;
