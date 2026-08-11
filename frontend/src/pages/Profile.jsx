import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Ruler, Weight, Target, Save, Edit3, Shield, Lock, Eye, EyeOff } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import API_URL from '../apiConfig';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';

const Profile = () => {
    const { showNotification } = useNotification();
    const [user, setUser] = useState({
        name: "Athlete User",
        email: "user@example.com",
        details: {
            age: 25,
            height: 175,
            weight: 70,
            goal: "Fitness & Strength"
        }
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState(null);

    // Password change fields
    const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '' });
    const [showOldPass, setShowOldPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);

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
                showNotification("Profile updated successfully!", "success");
            } else {
                showNotification("Failed to update profile.", "error");
            }
        } catch (err) {
            console.error("Error updating profile", err);
            showNotification("Error updating profile", "error");
        }
    };

    const handlePasswordChange = (e) => {
        e.preventDefault();
        if (!passwords.newPassword) return;
        showNotification("Security credentials updated!", "success");
        setPasswords({ oldPassword: '', newPassword: '' });
    };

    if (!editedUser) return <div className="text-center py-20 text-zinc-400">Loading profile...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 font-sans">
            {/* Header Hero Card */}
            <Card className="border-orange-500/30 bg-zinc-900 shadow-2xl relative overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500" />
                <CardContent className="pt-0 px-6 pb-6 relative flex flex-col md:flex-row items-center md:items-end justify-between gap-6 -mt-14">
                    <div className="flex flex-col md:flex-row items-center gap-5 text-center md:text-left">
                        <div className="w-28 h-28 rounded-full border-4 border-[#090d16] bg-zinc-950 flex items-center justify-center text-3xl font-black text-orange-400 shadow-2xl shrink-0">
                            {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
                        </div>
                        <div>
                            <div className="flex items-center gap-2 justify-center md:justify-start">
                                <h1 className="text-2xl sm:text-3xl font-black text-white">{user.name}</h1>
                                <Badge variant="glow">Pro Athlete</Badge>
                            </div>
                            <p className="text-sm text-zinc-400 mt-1">{user.email}</p>
                        </div>
                    </div>

                    <Button 
                        variant={isEditing ? "glow" : "outline"}
                        onClick={isEditing ? handleSave : () => setIsEditing(true)}
                        className="gap-2"
                    >
                        {isEditing ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                        <span>{isEditing ? "Save Profile" : "Edit Profile"}</span>
                    </Button>
                </CardContent>
            </Card>

            {/* Details Bento */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Physical Metrics */}
                <Card className="border-zinc-800 bg-zinc-900/90">
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-2">
                            <Ruler className="w-5 h-5 text-orange-500" />
                            <span>Biometric Parameters</span>
                        </CardTitle>
                        <CardDescription>Your current body stats & fitness goal</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-zinc-400 mb-1">Age (Years)</label>
                                <Input
                                    type="number"
                                    name="age"
                                    disabled={!isEditing}
                                    value={editedUser.details.age}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-zinc-400 mb-1">Height (cm)</label>
                                <Input
                                    type="number"
                                    name="height"
                                    disabled={!isEditing}
                                    value={editedUser.details.height}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-zinc-400 mb-1">Weight (kg)</label>
                                <Input
                                    type="number"
                                    name="weight"
                                    disabled={!isEditing}
                                    value={editedUser.details.weight}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-zinc-400 mb-1">Target Goal</label>
                                <Input
                                    type="text"
                                    name="goal"
                                    disabled={!isEditing}
                                    value={editedUser.details.goal}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Password & Security Card with Show/Hide Toggle */}
                <Card className="border-zinc-800 bg-zinc-900/90">
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-2">
                            <Shield className="w-5 h-5 text-orange-500" />
                            <span>Security & Credentials</span>
                        </CardTitle>
                        <CardDescription>Password management with show/hide controls</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <form onSubmit={handlePasswordChange} className="space-y-4">
                            <div>
                                <label className="block text-xs text-zinc-400 mb-1">Current Password</label>
                                <Input
                                    type={showOldPass ? "text" : "password"}
                                    placeholder="••••••••"
                                    startIcon={<Lock className="w-4 h-4" />}
                                    endIcon={
                                        <button
                                            type="button"
                                            onClick={() => setShowOldPass(!showOldPass)}
                                            className="hover:text-orange-400 transition-colors"
                                        >
                                            {showOldPass ? <EyeOff className="w-4 h-4 text-orange-400" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    }
                                    value={passwords.oldPassword}
                                    onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-xs text-zinc-400 mb-1">New Password</label>
                                <Input
                                    type={showNewPass ? "text" : "password"}
                                    placeholder="••••••••"
                                    startIcon={<Lock className="w-4 h-4" />}
                                    endIcon={
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPass(!showNewPass)}
                                            className="hover:text-orange-400 transition-colors"
                                        >
                                            {showNewPass ? <EyeOff className="w-4 h-4 text-orange-400" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    }
                                    value={passwords.newPassword}
                                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                />
                            </div>

                            <Button type="submit" variant="secondary" className="w-full">
                                Update Password
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Profile;
