import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Flame, Mail, Lock, User, Eye, EyeOff, ArrowRight, ShieldCheck, AlertCircle, Zap } from 'lucide-react';
import API_URL from '../apiConfig';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';

const Auth = () => {
    const navigate = useNavigate();
    const location = useLocation();

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
        <div className="min-h-screen bg-[#FAFAFC] text-slate-800 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[160px] pointer-events-none -z-10" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md"
            >
                {/* Brand Header */}
                <div 
                    onClick={() => navigate('/')} 
                    className="flex flex-col items-center gap-2 mb-8 cursor-pointer group"
                >
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center shadow-sunrise-orange group-hover:scale-105 transition-transform">
                        <Flame className="w-7 h-7 text-white fill-white" />
                    </div>
                    <span className="text-3xl font-black text-slate-900 tracking-tight font-display">
                        Fit<span className="text-orange-600">Genix</span>
                    </span>
                </div>

                {/* Card */}
                <Card className="sunrise-card-active border-2 border-orange-500 bg-white shadow-sunrise-card">
                    <CardHeader className="text-center pb-4">
                        <CardTitle className="text-2xl font-black text-slate-900 font-display uppercase tracking-wide">
                            {authMode === 'login' ? 'WELCOME BACK' : 'CREATE ACCOUNT'}
                        </CardTitle>
                        <CardDescription className="font-mono text-slate-500">
                            {authMode === 'login' 
                                ? 'Sign in to access your fitness dashboard' 
                                : 'Start your high-energy fitness transformation'}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <Tabs value={authMode} onValueChange={handleTabChange}>
                            <TabsList className="grid grid-cols-2 mb-6 bg-slate-100 border border-slate-200">
                                <TabsTrigger value="login" className="font-mono text-xs uppercase">Sign In</TabsTrigger>
                                <TabsTrigger value="signup" className="font-mono text-xs uppercase">Sign Up</TabsTrigger>
                            </TabsList>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-600 p-3.5 rounded-xl flex items-center gap-2 text-xs font-mono mb-4">
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <TabsContent value="signup" className="space-y-4 mt-0">
                                    <div>
                                        <label className="block text-xs font-mono uppercase text-slate-600 mb-1.5">Full Name</label>
                                        <Input
                                            type="text"
                                            name="name"
                                            placeholder="John Doe"
                                            startIcon={<User className="w-4 h-4" />}
                                            value={formData.name}
                                            onChange={handleChange}
                                            required={authMode === 'signup'}
                                            className="bg-slate-50"
                                        />
                                    </div>
                                </TabsContent>

                                <div>
                                    <label className="block text-xs font-mono uppercase text-slate-600 mb-1.5">Email Address</label>
                                    <Input
                                        type="email"
                                        name="email"
                                        placeholder="you@example.com"
                                        startIcon={<Mail className="w-4 h-4" />}
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="bg-slate-50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-mono uppercase text-slate-600 mb-1.5">Password</label>
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="••••••••"
                                        startIcon={<Lock className="w-4 h-4" />}
                                        endIcon={
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="focus:outline-none hover:text-orange-600 transition-colors p-1"
                                                title={showPassword ? "Hide password" : "Show password"}
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="w-4 h-4 text-orange-600" />
                                                ) : (
                                                    <Eye className="w-4 h-4 text-slate-400" />
                                                )}
                                            </button>
                                        }
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        className="bg-slate-50"
                                    />
                                </div>

                                <TabsContent value="signup" className="space-y-4 mt-0">
                                    <div>
                                        <label className="block text-xs font-mono uppercase text-slate-600 mb-1.5">Confirm Password</label>
                                        <Input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            placeholder="••••••••"
                                            startIcon={<Lock className="w-4 h-4" />}
                                            endIcon={
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="focus:outline-none hover:text-orange-600 transition-colors p-1"
                                                    title={showConfirmPassword ? "Hide password" : "Show password"}
                                                >
                                                    {showConfirmPassword ? (
                                                        <EyeOff className="w-4 h-4 text-orange-600" />
                                                    ) : (
                                                        <Eye className="w-4 h-4 text-slate-400" />
                                                    )}
                                                </button>
                                            }
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            required={authMode === 'signup'}
                                            className="bg-slate-50"
                                        />
                                    </div>
                                </TabsContent>

                                <Button
                                    type="submit"
                                    variant="glow"
                                    disabled={loading}
                                    className="w-full mt-2 gap-2 h-13 text-base font-black font-mono"
                                >
                                    <span>{loading ? 'AUTHENTICATING...' : (authMode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT')}</span>
                                    <ArrowRight className="w-5 h-5" />
                                </Button>
                            </form>
                        </Tabs>
                    </CardContent>

                    <CardFooter className="flex justify-center border-t border-slate-100 pt-4 text-xs font-mono text-slate-400">
                        <div className="flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            <span>256-bit Encrypted Security</span>
                        </div>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
};

export default Auth;
