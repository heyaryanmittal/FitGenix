import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Ruler, 
  Weight, 
  Target, 
  Save, 
  Edit3, 
  Shield, 
  Lock, 
  Eye, 
  EyeOff, 
  Award, 
  Flame, 
  CheckCircle2, 
  Zap, 
  Activity 
} from 'lucide-react';
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
            goalWeight: 68,
            goal: "Fitness & Muscle Gain"
        }
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState(null);

    // Password change fields
    const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '' });
    const [showOldPass, setShowOldPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [changingPass, setChangingPass] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            if (!parsedUser.details) {
                parsedUser.details = { age: 25, height: 175, weight: 70, goalWeight: 68, goal: "Fitness & Muscle Gain" };
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
                showNotification("Athlete Profile updated successfully!", "success");
            } else {
                showNotification("Failed to update profile.", "error");
            }
        } catch (err) {
            console.error("Error updating profile", err);
            showNotification("Error updating profile", "error");
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (!passwords.oldPassword || !passwords.newPassword) {
            showNotification("Please fill in both current and new password", "error");
            return;
        }
        if (passwords.newPassword.length < 6) {
            showNotification("New password must be at least 6 characters", "error");
            return;
        }

        setChangingPass(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/user/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword: passwords.oldPassword,
                    newPassword: passwords.newPassword
                })
            });

            const result = await res.json();
            if (result.success) {
                showNotification("Password updated successfully!", "success");
                setPasswords({ oldPassword: '', newPassword: '' });
            } else {
                showNotification(result.error || "Failed to change password", "error");
            }
        } catch (err) {
            console.error("Password change error:", err);
            showNotification("Error connecting to server", "error");
        } finally {
            setChangingPass(false);
        }
    };

    if (!editedUser) return <div className="text-center py-20 text-slate-400 font-mono">Loading profile data...</div>;

    // Calculate BMI
    const hM = (editedUser.details.height || 175) / 100;
    const wKg = editedUser.details.weight || 70;
    const bmi = (wKg / (hM * hM)).toFixed(1);

    return (
        <div className="max-w-5xl mx-auto space-y-8 font-sans pb-12 text-slate-800 dark:text-slate-100">
            
            {/* ── HEADER HERO COVER CARD ── */}
            <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl rounded-3xl relative overflow-hidden">
                <div className="h-36 bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 relative">
                    <div className="absolute inset-0 bg-black/10" />
                    <Badge className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white border-white/30 font-mono text-xs">
                        ATHLETE ID #7729
                    </Badge>
                </div>
                
                <CardContent className="pt-0 px-6 sm:px-8 pb-6 relative flex flex-col md:flex-row items-center md:items-end justify-between gap-6 -mt-16">
                    <div className="flex flex-col md:flex-row items-center gap-5 text-center md:text-left">
                        <div className="w-28 h-28 rounded-3xl border-4 border-white dark:border-slate-900 bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-4xl font-black text-white shadow-2xl shrink-0">
                            {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2.5 justify-center md:justify-start">
                                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-display">{user.name}</h1>
                                <Badge variant="glow">PRO ATHLETE</Badge>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center md:justify-start gap-1 font-mono">
                                <Mail className="w-3.5 h-3.5 text-orange-500" /> {user.email}
                            </p>
                        </div>
                    </div>

                    <Button 
                        variant={isEditing ? "glow" : "outline"}
                        onClick={isEditing ? handleSave : () => setIsEditing(true)}
                        className="gap-2 shrink-0 font-mono text-xs"
                    >
                        {isEditing ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                        <span>{isEditing ? "Save Profile Changes" : "Edit Biometrics"}</span>
                    </Button>
                </CardContent>
            </Card>

            {/* ── DETAILS & SECURITY BENTO GRID ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Column: Biometrics & Target Goals (8 Cols) */}
                <div className="lg:col-span-7 space-y-6">
                    <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-3xl">
                        <CardHeader>
                            <CardTitle className="text-xl flex items-center gap-2 font-display">
                                <Ruler className="w-5 h-5 text-orange-500" />
                                <span>Biometric Parameters & Metrics</span>
                            </CardTitle>
                            <CardDescription>Your height, weight, target goal, and calculated BMI</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            
                            {/* Live Calculated Stats Pills */}
                            <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-center font-mono">
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase font-bold">BMI Ratio</p>
                                    <p className="text-lg font-black text-orange-600 dark:text-orange-400">{bmi}</p>
                                </div>
                                <div className="border-x border-slate-200 dark:border-slate-700">
                                    <p className="text-[10px] text-slate-400 uppercase font-bold">Category</p>
                                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">Normal Range</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase font-bold">Target Diff</p>
                                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                                        {(wKg - (editedUser.details.goalWeight || 68)).toFixed(1)} kg
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold font-mono text-slate-500 dark:text-slate-400 mb-1.5">Age (Years)</label>
                                    <Input
                                        type="number"
                                        name="age"
                                        disabled={!isEditing}
                                        value={editedUser.details.age}
                                        onChange={handleChange}
                                        className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold font-mono text-slate-500 dark:text-slate-400 mb-1.5">Height (cm)</label>
                                    <Input
                                        type="number"
                                        name="height"
                                        disabled={!isEditing}
                                        value={editedUser.details.height}
                                        onChange={handleChange}
                                        className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold font-mono text-slate-500 dark:text-slate-400 mb-1.5">Current Weight (kg)</label>
                                    <Input
                                        type="number"
                                        name="weight"
                                        disabled={!isEditing}
                                        value={editedUser.details.weight}
                                        onChange={handleChange}
                                        className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold font-mono text-slate-500 dark:text-slate-400 mb-1.5">Target Weight (kg)</label>
                                    <Input
                                        type="number"
                                        name="goalWeight"
                                        disabled={!isEditing}
                                        value={editedUser.details.goalWeight || 68}
                                        onChange={handleChange}
                                        className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold font-mono text-slate-500 dark:text-slate-400 mb-1.5">Primary Fitness Goal</label>
                                <Input
                                    type="text"
                                    name="goal"
                                    disabled={!isEditing}
                                    value={editedUser.details.goal}
                                    onChange={handleChange}
                                    className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Athlete Achievement Badges Card */}
                    <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-3xl">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center gap-2 font-display">
                                <Award className="w-5 h-5 text-amber-500" />
                                <span>Athlete Milestones & Badges</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                <div className="p-3 rounded-2xl bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 text-center space-y-1">
                                    <Flame className="w-6 h-6 text-orange-500 mx-auto" />
                                    <p className="text-xs font-bold text-slate-900 dark:text-white">15 Day Streak</p>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Consistency Master</p>
                                </div>
                                <div className="p-3 rounded-2xl bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 text-center space-y-1">
                                    <Zap className="w-6 h-6 text-cyan-500 mx-auto" />
                                    <p className="text-xs font-bold text-slate-900 dark:text-white">Hydration Pro</p>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400">3.0L Water Target</p>
                                </div>
                                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-center space-y-1 col-span-2 sm:col-span-1">
                                    <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto" />
                                    <p className="text-xs font-bold text-slate-900 dark:text-white">AI Meal Plan</p>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400">7-Day Macro Plan</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Security & Credentials (5 Cols) */}
                <div className="lg:col-span-5 space-y-6">
                    <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-3xl">
                        <CardHeader>
                            <CardTitle className="text-xl flex items-center gap-2 font-display">
                                <Shield className="w-5 h-5 text-orange-500" />
                                <span>Security & Credentials</span>
                            </CardTitle>
                            <CardDescription>Password management with show/hide controls</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handlePasswordChange} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-mono font-bold text-slate-500 dark:text-slate-400 mb-1">Current Password</label>
                                    <div className="relative">
                                        <Input
                                            type={showOldPass ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={passwords.oldPassword}
                                            onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
                                            className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowOldPass(!showOldPass)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-orange-500"
                                        >
                                            {showOldPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-mono font-bold text-slate-500 dark:text-slate-400 mb-1">New Password</label>
                                    <div className="relative">
                                        <Input
                                            type={showNewPass ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={passwords.newPassword}
                                            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                            className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPass(!showNewPass)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-orange-500"
                                        >
                                            {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                <Button 
                                    type="submit" 
                                    variant="secondary" 
                                    disabled={changingPass}
                                    className="w-full mt-2 font-mono text-xs"
                                >
                                    {changingPass ? "Updating Password..." : "Update Security Password"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Profile;

