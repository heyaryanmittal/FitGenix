import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Flame, 
  Brain, 
  Dumbbell, 
  Utensils, 
  AlertTriangle, 
  ArrowRight, 
  Star, 
  Zap, 
  ShieldCheck, 
  Activity, 
  Sparkles,
  Users,
  Award,
  ChevronRight,
  TrendingUp,
  ShieldAlert
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';

const LandingPage = () => {
    const navigate = useNavigate();

    const handleAuth = (mode = 'login') => {
        navigate(`/auth?mode=${mode}`);
    };

    const stats = [
        { label: "Active Athletes", value: "25,000+", icon: <Users className="w-4 h-4 text-orange-600" /> },
        { label: "AI Recommendations", value: "1.2M+", icon: <Brain className="w-4 h-4 text-orange-600" /> },
        { label: "User Satisfaction", value: "99.4%", icon: <Star className="w-4 h-4 text-orange-600" /> },
        { label: "Form Accuracy", value: "98.8%", icon: <ShieldCheck className="w-4 h-4 text-orange-600" /> },
    ];

    return (
        <div className="min-h-screen bg-[#FAFAFC] text-slate-800 font-sans selection:bg-orange-500/20 selection:text-orange-600 relative overflow-hidden">
            
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-orange-500/10 rounded-full blur-[160px] pointer-events-none -z-10" />
            <div className="absolute top-[800px] right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[180px] pointer-events-none -z-10" />

            {/* ── TOP NAVBAR ── */}
            <header className="sticky top-0 z-50 w-full border-b border-orange-500/15 bg-white/85 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    
                    {/* Brand */}
                    <div 
                        onClick={() => navigate('/')} 
                        className="flex items-center gap-3 cursor-pointer group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center shadow-sunrise-orange group-hover:scale-105 transition-transform">
                            <Flame className="w-6 h-6 text-white fill-white" />
                        </div>
                        <span className="text-2xl font-extrabold tracking-tight text-slate-900 font-display">
                            Fit<span className="text-orange-600">Genix</span>
                        </span>
                    </div>

                    {/* Nav Links */}
                    <nav className="hidden md:flex items-center gap-8 text-xs font-mono tracking-wider font-bold text-slate-600 uppercase">
                        <a href="#features" className="hover:text-orange-600 transition-colors">Features</a>
                        <a href="#ai-coach" className="hover:text-orange-600 transition-colors">AI Coaching</a>
                        <a href="#demo" className="hover:text-orange-600 transition-colors">Interactive Demo</a>
                        <a href="#reviews" className="hover:text-orange-600 transition-colors">Athletes</a>
                    </nav>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleAuth('login')}
                            className="hidden sm:inline-flex font-mono"
                        >
                            Sign In
                        </Button>
                        <Button 
                            variant="glow" 
                            size="sm" 
                            onClick={() => handleAuth('signup')}
                            className="gap-2 font-mono"
                        >
                            <span>Sign Up Free</span>
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </header>

            {/* ── HERO SECTION ── */}
            <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    
                    {/* Hero Left Content */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="lg:col-span-7 space-y-8"
                    >
                        <h1 className="text-5xl sm:text-6xl xl:text-7xl font-black text-slate-900 tracking-tight font-display uppercase leading-[1.05]">
                            RISE & CONQUER <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500">
                                YOUR FITNESS GOALS.
                            </span>
                        </h1>

                        <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed max-w-2xl">
                            Transform your health with hyper-personalized nutrition plans, adaptive workout split generators, and 24/7 AI coaching in an optimistic, high-energy environment.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 pt-2">
                            <Button 
                                size="lg" 
                                variant="glow" 
                                onClick={() => handleAuth('signup')}
                                className="text-base gap-2 px-9 h-14 font-mono font-black"
                            >
                                <span>GET STARTED FREE</span>
                                <ArrowRight className="w-5 h-5" />
                            </Button>
                            <Button 
                                size="lg" 
                                variant="outline" 
                                onClick={() => handleAuth('login')}
                                className="text-base gap-2 h-14 font-mono"
                            >
                                <Activity className="w-5 h-5 text-orange-600" />
                                <span>EXISTING ATHLETE SIGN IN</span>
                            </Button>
                        </div>

                        {/* Telemetry Stats */}
                        <div className="pt-6 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {stats.map((stat, i) => (
                                <div key={i} className="flex flex-col">
                                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono mb-1">
                                        {stat.icon}
                                        <span>{stat.label}</span>
                                    </div>
                                    <span className="text-2xl font-black text-slate-900 font-mono">{stat.value}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Hero Right Bento Telemetry Mockup */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="lg:col-span-5 relative"
                    >
                        <div className="relative mx-auto max-w-md lg:max-w-none">
                            <Card className="sunrise-card-active border-2 border-orange-500 relative overflow-hidden">
                                <div className="p-6 space-y-6">
                                    {/* Header */}
                                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-orange-100 border border-orange-200 flex items-center justify-center font-black text-orange-600 font-mono">
                                                FG
                                            </div>
                                            <div>
                                                <h4 className="font-black text-slate-900 text-sm font-display">AI Fitness Companion</h4>
                                                <p className="text-xs text-emerald-600 font-mono flex items-center gap-1">
                                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Active & Monitoring
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Calorie Ring Summary */}
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-slate-500 font-mono uppercase">Daily Calorie Target</p>
                                            <p className="text-2xl font-black text-slate-900 font-mono">2,400 <span className="text-xs text-orange-600 font-normal">kcal</span></p>
                                        </div>
                                        <div className="w-12 h-12 rounded-full border-4 border-orange-500 border-t-amber-400 flex items-center justify-center font-bold text-xs text-orange-600 font-mono">
                                            80%
                                        </div>
                                    </div>

                                    {/* Macro Telemetry Chips */}
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                                            <span className="text-[10px] text-slate-500 font-mono uppercase">PROTEIN</span>
                                            <p className="text-sm font-black text-slate-900 font-mono mt-0.5">145g</p>
                                        </div>
                                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                                            <span className="text-[10px] text-slate-500 font-mono uppercase">CARBS</span>
                                            <p className="text-sm font-black text-slate-900 font-mono mt-0.5">210g</p>
                                        </div>
                                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                                            <span className="text-[10px] text-slate-500 font-mono uppercase">FATS</span>
                                            <p className="text-sm font-black text-slate-900 font-mono mt-0.5">52g</p>
                                        </div>
                                    </div>

                                    {/* AI Insight Chip */}
                                    <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl flex items-start gap-3">
                                        <Brain className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                                        <p className="text-xs text-slate-700 leading-relaxed font-sans">
                                            <strong className="text-orange-600 font-bold">Coach Advice:</strong> Hit your remaining 15g protein target with post-workout whey or Greek yogurt.
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer className="border-t border-slate-200 bg-white py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-500 font-mono">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white font-bold">
                            <Flame className="w-5 h-5 fill-white" />
                        </div>
                        <span className="text-lg font-extrabold text-slate-900 font-display">FitGenix</span>
                    </div>
                    <p>&copy; 2026 FitGenix AI. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
