import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Flame, Mail, Lock, User, Eye, EyeOff, ArrowRight, ShieldCheck, AlertCircle, Sun, Moon } from 'lucide-react';
import API_URL from '../apiConfig';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useTheme } from '../context/ThemeContext';

const Auth = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isDark, toggleTheme } = useTheme();

    const searchParams = new URLSearchParams(location.search);
    const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';

    const [authMode, setAuthMode] = useState(initialMode);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const mode = params.get('mode') === 'signup' ? 'signup' : 'login';
        setAuthMode(mode);
    }, [location.search]);

    const handleTabChange = (val) => {
        setAuthMode(val);
        setError('');
        setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const isLogin = authMode === 'login';

        if (!isLogin && formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        const endpoint = isLogin ? `${API_URL}/api/login` : `${API_URL}/api/register`;
        const payload = isLogin
            ? { email: formData.email, password: formData.password }
            : { name: formData.name, email: formData.email, password: formData.password };

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                if (data.user.isNewUser) {
                    navigate('/user-details');
                } else {
                    navigate('/dashboard');
                }
            } else {
                setError(data.error || "Authentication failed. Please check your credentials.");
            }
        } catch (error) {
            console.error("Auth Error:", error);
            setError("Server connection failed. Please ensure the backend is running.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FAFAFC] dark:bg-[#0A0D14] text-slate-800 dark:text-slate-100 flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden font-sans transition-colors duration-300">
            
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-orange-500/10 rounded-full blur-[160px] pointer-events-none -z-10" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[180px] pointer-events-none -z-10" />

            {/* ── TOP HEADER BAR WITH DAY/NIGHT SWITCHER ── */}
            <header className="w-full max-w-6xl mx-auto flex items-center justify-between py-4 z-20">
                <div 
                    onClick={() => navigate('/')} 
                    className="flex items-center gap-3 cursor-pointer group"
                >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center shadow-sunrise-orange group-hover:scale-105 transition-transform">
                        <Flame className="w-6 h-6 text-white fill-white" />
                    </div>
                    <span className="text-2xl font-black text-slate-900 dark:text-white font-display">
                        Fit<span className="text-orange-600">Genix</span>
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    {/* Day / Night Mode Toggle Button (Icon Only) */}
                    <button
                        onClick={toggleTheme}
                        className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-amber-400 hover:scale-105 active:scale-95 transition-all shadow-sm flex items-center justify-center"
                        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    >
                        {isDark ? (
                            <Sun className="w-5 h-5 text-amber-400" />
                        ) : (
                            <Moon className="w-5 h-5 text-slate-700" />
                        )}
                    </button>
                </div>
            </header>

            {/* ── CENTERED AUTHENTICATION CARD ── */}
            <main className="flex-1 flex items-center justify-center py-8 z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-md"
                >
                    <Card className="sunrise-card-active border-2 border-orange-500 bg-white dark:bg-slate-900/95 shadow-sunrise-card dark:shadow-2xl transition-all duration-300">
                        <CardHeader className="text-center pb-4 pt-6">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={authMode}
                                    initial={{ opacity: 0, y: -6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 6 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <CardTitle className="text-2xl font-black text-slate-900 dark:text-white font-display uppercase tracking-wide">
                                        {authMode === 'login' ? 'WELCOME BACK' : 'CREATE ACCOUNT'}
                                    </CardTitle>
                                    <CardDescription className="font-mono text-slate-500 dark:text-slate-400 mt-1">
                                        {authMode === 'login' 
                                            ? 'Sign in to access your intelligent fitness telemetry' 
                                            : 'Start your high-energy fitness transformation'}
                                    </CardDescription>
                                </motion.div>
                            </AnimatePresence>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <Tabs value={authMode} onValueChange={handleTabChange}>
                                <TabsList className="grid grid-cols-2 mb-6 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                    <TabsTrigger value="login" className="font-mono text-xs font-bold uppercase tracking-wider transition-all">Sign In</TabsTrigger>
                                    <TabsTrigger value="signup" className="font-mono text-xs font-bold uppercase tracking-wider transition-all">Sign Up</TabsTrigger>
                                </TabsList>

                                {error && (
                                    <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-3.5 rounded-xl flex items-center gap-2 text-xs font-mono mb-4">
                                        <AlertCircle className="w-4 h-4 shrink-0" />
                                        <span>{error}</span>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={authMode}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.25, ease: "easeInOut" }}
                                            className="space-y-4"
                                        >
                                            {authMode === 'signup' && (
                                                <div>
                                                    <label className="block text-xs font-mono font-bold uppercase text-slate-600 dark:text-slate-300 mb-1.5">Full Name</label>
                                                    <Input
                                                        type="text"
                                                        name="name"
                                                        placeholder="John Doe"
                                                        startIcon={<User className="w-4 h-4 text-orange-500" />}
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                        required={authMode === 'signup'}
                                                        className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700"
                                                    />
                                                </div>
                                            )}

                                            <div>
                                                <label className="block text-xs font-mono font-bold uppercase text-slate-600 dark:text-slate-300 mb-1.5">Email Address</label>
                                                <Input
                                                    type="email"
                                                    name="email"
                                                    placeholder="you@example.com"
                                                    startIcon={<Mail className="w-4 h-4 text-orange-500" />}
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                    className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-mono font-bold uppercase text-slate-600 dark:text-slate-300 mb-1.5">Password</label>
                                                <Input
                                                    type={showPassword ? "text" : "password"}
                                                    name="password"
                                                    placeholder="••••••••"
                                                    startIcon={<Lock className="w-4 h-4 text-orange-500" />}
                                                    endIcon={
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            className="focus:outline-none hover:text-orange-600 transition-colors p-1"
                                                            title={showPassword ? "Hide password" : "Show password"}
                                                        >
                                                            {showPassword ? (
                                                                <EyeOff className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                                                            ) : (
                                                                <Eye className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                                                            )}
                                                        </button>
                                                    }
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    required
                                                    className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700"
                                                />
                                            </div>

                                            {authMode === 'signup' && (
                                                <div>
                                                    <label className="block text-xs font-mono font-bold uppercase text-slate-600 dark:text-slate-300 mb-1.5">Confirm Password</label>
                                                    <Input
                                                        type={showConfirmPassword ? "text" : "password"}
                                                        name="confirmPassword"
                                                        placeholder="••••••••"
                                                        startIcon={<Lock className="w-4 h-4 text-orange-500" />}
                                                        endIcon={
                                                            <button
                                                                type="button"
                                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                                className="focus:outline-none hover:text-orange-600 transition-colors p-1"
                                                                title={showConfirmPassword ? "Hide password" : "Show password"}
                                                            >
                                                                {showConfirmPassword ? (
                                                                    <EyeOff className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                                                                ) : (
                                                                    <Eye className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                                                                )}
                                                            </button>
                                                        }
                                                        value={formData.confirmPassword}
                                                        onChange={handleChange}
                                                        required={authMode === 'signup'}
                                                        className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700"
                                                    />
                                                </div>
                                            )}

                                            <Button
                                                type="submit"
                                                variant="glow"
                                                disabled={loading}
                                                className="w-full mt-3 gap-2 h-13 text-base font-black font-mono shadow-sunrise-orange"
                                            >
                                                <span>{loading ? 'AUTHENTICATING...' : (authMode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT')}</span>
                                                <ArrowRight className="w-5 h-5" />
                                            </Button>
                                        </motion.div>
                                    </AnimatePresence>
                                </form>
                            </Tabs>
                        </CardContent>

                        <CardFooter className="flex justify-center border-t border-slate-100 dark:border-slate-800 pt-4 pb-6 text-xs font-mono text-slate-400 dark:text-slate-500">
                            <div className="flex items-center gap-1.5">
                                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                <span>256-bit Encrypted Security</span>
                            </div>
                        </CardFooter>
                    </Card>
                </motion.div>
            </main>

            {/* Footer Copy */}
            <footer className="text-center py-4 text-xs font-mono text-slate-400 dark:text-slate-500 z-10">
                &copy; 2026 FitGenix AI. All rights reserved.
            </footer>
        </div>
    );
};

export default Auth;
