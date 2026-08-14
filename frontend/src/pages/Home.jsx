import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotification } from '../context/NotificationContext';
import { 
  Sun,
  Flame, 
  Trash2, 
  Droplet, 
  Dumbbell, 
  Brain, 
  Plus, 
  Edit3, 
  Activity,
  X,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Zap,
  Award,
  ChevronRight,
  TrendingUp,
  Target
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../apiConfig';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress, CircularProgress } from '../components/ui/progress';
import { Input } from '../components/ui/input';

const QUOTES = [
    { text: "Every morning brings new potential, but only effort converts it into reality.", author: "FitGenix AI Coach" },
    { text: "Small daily improvements over time lead to stunning long-term results.", author: "Robin Sharma" },
    { text: "Energy flows where attention goes. Focus on your strength.", author: "Tony Robbins" },
    { text: "You don't have to be extreme, just consistent.", author: "FitGenix Coach" }
];

const Home = () => {
    const { showNotification } = useNotification();
    const navigate = useNavigate();
    const [quote, setQuote] = useState("");
    const [author, setAuthor] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [data, setData] = useState(() => {
        const dateKey = new Date().toISOString().split('T')[0];
        const saved = localStorage.getItem(`dashboard_cache_${dateKey}`);
        return saved ? JSON.parse(saved) : null;
    });
    const [loading, setLoading] = useState(!data);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGoal, setEditingGoal] = useState({ key: '', label: '', value: 0 });

    // AI Insight state
    const [aiInsight, setAiInsight] = useState(null);
    const [aiLoading, setAiLoading] = useState(false);

    const last7Days = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0];
    }).reverse();

    const calculateTotals = (todayLog) => {
        let calories = 0, protein = 0, carbs = 0, fats = 0;
        if (todayLog && todayLog.nutrition) {
            ['breakfast', 'lunch', 'dinner', 'snacks'].forEach(meal => {
                (todayLog.nutrition[meal] || []).forEach(item => {
                    calories += Number(item.calories) || 0;
                    protein += parseInt(item.protein) || 0;
                    carbs += parseInt(item.carbs) || 0;
                    fats += parseInt(item.fats) || 0;
                });
            });
        }
        return { calories, protein, carbs, fats };
    };

    const fetchDashboard = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/dashboard?date=${selectedDate}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await res.json();
            if (result.success) {
                const todayLog = result.data.todayLog || {};
                const user = result.data.user || {};
                const totals = calculateTotals(todayLog);

                const formattedData = {
                    user,
                    totalConsumed: totals.calories,
                    waterIntake: todayLog.water || 0,
                    workoutsCompleted: (todayLog.exercises || []).filter(e => e.completed).length,
                    goals: user.goals || { calories: 2000, water: 3.0, protein: 150, carbs: 250, fats: 65 },
                    macros: { protein: totals.protein, carbs: totals.carbs, fats: totals.fats },
                    trackedMeals: todayLog.nutrition || { breakfast: [], lunch: [], dinner: [], snacks: [] }
                };

                setData(formattedData);
                localStorage.setItem(`dashboard_cache_${selectedDate}`, JSON.stringify(formattedData));
                return formattedData;
            }
        } catch (err) {
            console.error('Fetch dashboard error:', err);
        }
        return null;
    };

    const fetchAiInsight = async (currentData) => {
        setAiLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/dashboard/ai-insight`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    date: selectedDate,
                    totalConsumed: currentData?.totalConsumed || 0,
                    waterIntake: currentData?.waterIntake || 0,
                    macros: currentData?.macros || { protein: 0, carbs: 0, fats: 0 }
                })
            });
            const result = await res.json();
            if (result.success) {
                setAiInsight(result.insight);
            }
        } catch (err) {
            console.error("Fetch AI insight error:", err);
        } finally {
            setAiLoading(false);
        }
    };

    useEffect(() => {
        const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
        setQuote(randomQuote.text);
        setAuthor(randomQuote.author);

        let isMounted = true;
        const load = async () => {
            setLoading(true);
            const freshData = await fetchDashboard();
            if (isMounted && freshData) {
                fetchAiInsight(freshData);
            }
            if (isMounted) setLoading(false);
        };

        load();
        return () => { isMounted = false; };
    }, [selectedDate]);

    // Interactive Water Log Handler (+250ml, +500ml)
    const handleAddWater = async (amountLiters) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/user/log/water`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ date: selectedDate, amount: amountLiters, mode: 'add' })
            });

            const result = await res.json();
            if (result.success) {
                showNotification(`Added +${amountLiters * 1000}ml water! 💧`, 'success');
                const fresh = await fetchDashboard();
                if (fresh) fetchAiInsight(fresh);
            }
        } catch (err) {
            console.error("Water add error:", err);
            showNotification("Failed to update water intake", "error");
        }
    };

    const handleSaveGoal = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/user/goals`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ [editingGoal.key]: Number(editingGoal.value) })
            });
            const result = await res.json();
            if (result.success) {
                setIsModalOpen(false);
                showNotification(`Updated ${editingGoal.label} target successfully!`, 'success');
                fetchDashboard();
            }
        } catch (err) {
            console.error('Update goal error:', err);
            showNotification('Failed to update goal', 'error');
        }
    };

    const handleDeleteMealItem = async (mealType, itemName) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/dashboard/meal-item`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ date: selectedDate, mealType, itemName })
            });

            const result = await res.json();
            if (result.success) {
                showNotification(`Deleted ${itemName} from ${mealType}`, 'success');
                fetchDashboard();
            } else {
                showNotification(result.error || 'Failed to delete item', 'error');
            }
        } catch (err) {
            console.error('Delete item error:', err);
            showNotification('Error deleting item', 'error');
        }
    };

    if (loading && !data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[500px] space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-500 flex items-center justify-center animate-spin">
                    <Sparkles className="w-6 h-6" />
                </div>
                <p className="font-mono text-xs text-slate-500 dark:text-slate-400 animate-pulse">Initializing FitGenix Engine...</p>
            </div>
        );
    }

    const isCalorieDanger = data && data.totalConsumed > (data.goals?.calories || 2000);
    const isProteinDanger = data && data.macros?.protein > (data.goals?.protein || 150);

    return (
        <div className="space-y-8 font-sans max-w-7xl mx-auto pb-12 text-slate-800 dark:text-slate-100">
            
            {/* ── HERO BANNER: RISE AND CONQUER YOUR GOALS ── */}
            <div className="relative rounded-3xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white p-6 sm:p-10 overflow-hidden shadow-2xl shadow-orange-500/20">
                <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/20 rounded-full blur-[90px] pointer-events-none" />
                
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <Badge className="bg-white/20 backdrop-blur-md text-white border-white/30 px-3 py-1 font-bold tracking-wide">
                                🌅 MORNING STREAK: 15 DAYS
                            </Badge>
                            <Badge className="bg-amber-400/30 text-amber-100 border-amber-300/40 px-2.5 py-0.5 font-mono text-[11px]">
                                PRO ATHLETE
                            </Badge>
                        </div>

                        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-display uppercase leading-tight">
                            RISE & CONQUER <br />YOUR FITNESS GOALS
                        </h1>

                        <p className="text-sm sm:text-base text-white/90 font-medium max-w-xl">
                            Welcome back, <strong className="text-white font-bold">{data?.user?.name || 'Athlete'}</strong>! Your AI readiness score is <span className="font-mono font-bold underline text-amber-200">{aiInsight?.readinessScore || 95}%</span> today.
                        </p>
                    </div>

                    {/* Date Selector Pill Strip */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide bg-white/15 backdrop-blur-md p-2 rounded-2xl border border-white/25">
                        {last7Days.map((d) => {
                            const isSelected = selectedDate === d;
                            const dayLabel = new Date(d).toLocaleDateString('en-US', { weekday: 'short' });
                            const dateNum = new Date(d).getDate();
                            return (
                                <button
                                    key={d}
                                    onClick={() => setSelectedDate(d)}
                                    className={`px-4 py-2.5 rounded-xl text-center transition-all min-w-[56px] ${
                                        isSelected
                                            ? 'bg-white text-orange-600 font-black shadow-lg scale-105'
                                            : 'text-white/80 hover:text-white hover:bg-white/10'
                                    }`}
                                >
                                    <p className="text-[10px] uppercase font-mono font-bold">{dayLabel}</p>
                                    <p className="text-base font-black font-display">{dateNum}</p>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ── REAL-TIME FITGENIX AI INSIGHTS HUB CARD ── */}
            <Card className="border border-orange-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center shadow-lg shadow-orange-500/30">
                            <Brain className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg font-bold text-white font-display">FitGenix AI Coach Insights</h3>
                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono border border-emerald-500/30">
                                    LIVE ANALYTICS
                                </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5">Automated performance & nutrition analysis for {selectedDate}</p>
                        </div>
                    </div>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => fetchAiInsight(data)}
                        disabled={aiLoading}
                        className="bg-slate-800/80 border-slate-700 text-white hover:bg-slate-700 gap-2 text-xs h-9 px-3"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${aiLoading ? 'animate-spin text-orange-400' : ''}`} />
                        <span>Refresh AI Analysis</span>
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                    {/* Advice 1: Summary */}
                    <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/60 space-y-1.5">
                        <div className="flex items-center gap-2 text-orange-400 text-xs font-mono font-bold uppercase">
                            <Zap className="w-4 h-4" /> Performance Status
                        </div>
                        <p className="text-xs text-slate-200 leading-relaxed">
                            {aiLoading ? "Generating AI analysis..." : aiInsight?.summary || "Keep up the momentum! You are on track with your physical conditioning."}
                        </p>
                    </div>

                    {/* Advice 2: Nutrition & Water */}
                    <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/60 space-y-1.5">
                        <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase">
                            <Droplet className="w-4 h-4" /> Hydration & Macro Advice
                        </div>
                        <p className="text-xs text-slate-200 leading-relaxed">
                            {aiLoading ? "Analyzing nutrition..." : `${aiInsight?.nutritionAdvice || ''} ${aiInsight?.hydrationAdvice || ''}`}
                        </p>
                    </div>

                    {/* Advice 3: Action Item */}
                    <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/60 space-y-1.5">
                        <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold uppercase">
                            <Target className="w-4 h-4" /> Coach Recommendation
                        </div>
                        <p className="text-xs text-slate-200 leading-relaxed">
                            {aiLoading ? "Calculating recovery metrics..." : aiInsight?.actionableTip || "Ensure you sleep 8 hours tonight to optimize muscle repair."}
                        </p>
                    </div>
                </div>
            </Card>

            {/* ── MACRO DANGER ALERT BANNER ── */}
            <AnimatePresence>
                {(isCalorieDanger || isProteinDanger) && (
                    <motion.div
                        initial={{ opacity: 0, y: -15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        className="bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800 p-5 rounded-2xl shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 border border-red-200 flex items-center justify-center shrink-0">
                                <ShieldAlert className="w-7 h-7" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-red-700 dark:text-red-400 font-display uppercase tracking-wide flex items-center gap-2">
                                    <span>⚠️ MACRO TARGET EXCEEDED</span>
                                    <Badge variant="destructive">ALERT</Badge>
                                </h4>
                                <p className="text-xs text-red-800 dark:text-red-300 font-mono mt-0.5">
                                    {isCalorieDanger && `Calories over target by +${data.totalConsumed - data.goals.calories} kcal. `}
                                    {isProteinDanger && `Protein target passed.`}
                                </p>
                            </div>
                        </div>
                        <Button 
                            variant="danger" 
                            size="sm" 
                            onClick={() => navigate('/diet')}
                            className="shrink-0"
                        >
                            Adjust Meals in Diet
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── MOTIVATIONAL QUOTE CARD ── */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 border-l-4 border-l-orange-500 flex items-start gap-4 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
                    <Sun className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-slate-700 dark:text-slate-200 italic font-medium leading-relaxed font-display">"{quote}"</p>
                    <p className="text-xs font-mono font-bold text-orange-600 dark:text-orange-400 mt-1">— {author}</p>
                </div>
            </div>

            {/* ── KINETIC STAT CARDS ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* 1. Calorie Goal Card */}
                <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-3xl">
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                            <CardDescription className="text-slate-500 dark:text-slate-400 font-mono uppercase font-bold text-[11px]">Daily Calorie Goal</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center py-4 space-y-3">
                        <CircularProgress value={data?.totalConsumed || 0} max={data?.goals?.calories || 2000} size={130} strokeWidth={11}>
                            <p className="text-2xl font-black text-slate-900 dark:text-white font-mono">{data?.totalConsumed || 0}</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">/ {data?.goals?.calories || 2000} kcal</p>
                        </CircularProgress>

                        <button 
                            onClick={() => { setEditingGoal({ key: 'calories', label: 'Calories', value: data?.goals?.calories || 2000 }); setIsModalOpen(true); }}
                            className="text-xs text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1 font-bold font-mono"
                        >
                            <Edit3 className="w-3.5 h-3.5" /> Edit Calorie Target
                        </button>
                    </CardContent>
                </Card>

                {/* 2. Interactive Water Hydration Card (+250ml, +500ml) */}
                <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-3xl">
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                            <CardDescription className="text-slate-500 dark:text-slate-400 font-mono uppercase font-bold text-[11px]">Hydration Level</CardDescription>
                            <div className="w-8 h-8 rounded-xl bg-cyan-50 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                                <Droplet className="w-4 h-4" />
                            </div>
                        </div>
                        <CardTitle className="text-3xl font-black text-slate-900 dark:text-white font-mono mt-2">
                            {data?.waterIntake || 0}
                            <span className="text-sm text-slate-500 dark:text-slate-400 font-normal"> / {data?.goals?.water || 3.0} L</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-2 space-y-3">
                        <Progress value={data?.waterIntake || 0} max={data?.goals?.water || 3.0} indicatorClassName="from-cyan-500 to-blue-500" />
                        
                        {/* Quick Action Water Log Buttons */}
                        <div className="flex items-center gap-2 pt-1">
                            <button
                                onClick={() => handleAddWater(0.25)}
                                className="flex-1 py-1.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 text-[11px] font-mono font-bold hover:bg-cyan-100 transition-colors"
                            >
                                +250ml 💧
                            </button>
                            <button
                                onClick={() => handleAddWater(0.5)}
                                className="flex-1 py-1.5 rounded-xl bg-cyan-500 text-white text-[11px] font-mono font-bold hover:bg-cyan-600 transition-colors shadow-sm"
                            >
                                +500ml 💧
                            </button>
                        </div>
                    </CardContent>
                </Card>

                {/* 3. Workouts Card */}
                <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-3xl">
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                            <CardDescription className="text-slate-500 dark:text-slate-400 font-mono uppercase font-bold text-[11px]">Active Training</CardDescription>
                            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                                <Dumbbell className="w-4 h-4" />
                            </div>
                        </div>
                        <CardTitle className="text-3xl font-black text-slate-900 dark:text-white font-mono mt-2">
                            {data?.workoutsCompleted || 0}
                            <span className="text-sm text-slate-500 dark:text-slate-400 font-normal"> / 5 Sessions</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 flex flex-col gap-2">
                        <Badge variant="success" className="w-fit flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Hypertrophy Phase</span>
                        </Badge>
                        <button 
                            onClick={() => navigate('/exercises')}
                            className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-bold font-mono mt-1"
                        >
                            <Plus className="w-3.5 h-3.5" /> Log New Exercise
                        </button>
                    </CardContent>
                </Card>

                {/* 4. AI Health Score Card */}
                <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-3xl">
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                            <CardDescription className="text-slate-500 dark:text-slate-400 font-mono uppercase font-bold text-[11px]">AI Fitness Score</CardDescription>
                            <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                                <Award className="w-4 h-4" />
                            </div>
                        </div>
                        <CardTitle className="text-3xl font-black text-slate-900 dark:text-white font-mono mt-2">
                            {aiInsight?.readinessScore || 95} <span className="text-sm text-orange-600 dark:text-orange-400 font-normal">/ 100</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <Badge variant="glow">Optimal Recovery</Badge>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">Metabolic output at peak condition.</p>
                    </CardContent>
                </Card>
            </div>

            {/* ── MACROS & TRACKED MEALS BENTO ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left: Macros Progress Breakdown */}
                <Card className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-3xl">
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-2 font-display">
                            <Activity className="w-5 h-5 text-orange-600" />
                            <span>Macronutrient Breakdown</span>
                        </CardTitle>
                        <CardDescription>Targeted vs Consumed Macros for {selectedDate}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Protein */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-xs font-mono font-bold">
                                <span className="text-slate-700 dark:text-slate-300">PROTEIN</span>
                                <span className="text-orange-600 dark:text-orange-400">{data?.macros?.protein || 0} / {data?.goals?.protein || 150}g</span>
                            </div>
                            <Progress value={data?.macros?.protein || 0} max={data?.goals?.protein || 150} />
                        </div>

                        {/* Carbs */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-xs font-mono font-bold">
                                <span className="text-slate-700 dark:text-slate-300">CARBOHYDRATES</span>
                                <span className="text-amber-600 dark:text-amber-400">{data?.macros?.carbs || 0} / {data?.goals?.carbs || 250}g</span>
                            </div>
                            <Progress value={data?.macros?.carbs || 0} max={data?.goals?.carbs || 250} indicatorClassName="from-amber-500 to-yellow-500" />
                        </div>

                        {/* Fats */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-xs font-mono font-bold">
                                <span className="text-slate-700 dark:text-slate-300">FATS</span>
                                <span className="text-emerald-600 dark:text-emerald-400">{data?.macros?.fats || 0} / {data?.goals?.fats || 65}g</span>
                            </div>
                            <Progress value={data?.macros?.fats || 0} max={data?.goals?.fats || 65} indicatorClassName="from-emerald-500 to-teal-500" />
                        </div>
                    </CardContent>
                    <CardFooter className="pt-2">
                        <Button variant="outline" size="sm" onClick={() => navigate('/meal-planner')} className="w-full gap-2 font-mono text-xs">
                            <span>Open 7-Day Meal Planner</span>
                            <ArrowRight className="w-4 h-4 text-orange-600" />
                        </Button>
                    </CardFooter>
                </Card>

                {/* Right: Tracked Meal Log Items */}
                <Card className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-3xl">
                    <CardHeader className="flex flex-row items-center justify-between pb-4">
                        <div>
                            <CardTitle className="text-xl font-display">Tracked Meals</CardTitle>
                            <CardDescription>Meals logged for {selectedDate}</CardDescription>
                        </div>
                        <Button variant="glow" size="sm" onClick={() => navigate('/diet')} className="gap-1.5 text-xs font-mono">
                            <Plus className="w-4 h-4" /> Log Meal Fuel
                        </Button>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {data?.trackedMeals && Object.values(data.trackedMeals).some(arr => arr.length > 0) ? (
                            Object.entries(data.trackedMeals).map(([mealType, items]) => (
                                items.length > 0 && (
                                    <div key={mealType} className="space-y-2">
                                        <h5 className="text-xs font-bold text-orange-600 dark:text-orange-400 font-mono uppercase tracking-widest">{mealType}</h5>
                                        <div className="space-y-2">
                                            {items.map((item, idx) => (
                                                <div 
                                                    key={idx} 
                                                    className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between hover:border-orange-300 transition-colors"
                                                >
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900 dark:text-white font-display">{item.name}</p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                                                            {item.calories} kcal • P: {item.protein} | C: {item.carbs} | F: {item.fats}
                                                        </p>
                                                    </div>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm"
                                                        onClick={() => handleDeleteMealItem(mealType, item.name)}
                                                        className="h-8 w-8 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                                                        title="Delete item"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )
                            ))
                        ) : (
                            <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800">
                                <Activity className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">No meals logged for this date yet.</p>
                                <Button variant="outline" size="sm" onClick={() => navigate('/diet')} className="mt-4 font-mono text-xs">
                                    Browse Foods & Log Fuel
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* ── EDIT TARGET DIALOG ── */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="w-full max-w-sm"
                        >
                            <Card className="border-2 border-orange-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl shadow-2xl">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-xl font-display">Edit {editingGoal.label} Target</CardTitle>
                                    <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-800 dark:hover:text-white">
                                        <X className="w-5 h-5" />
                                    </button>
                                </CardHeader>
                                <CardContent className="space-y-4 pt-2">
                                    <label className="block text-xs font-mono text-slate-600 dark:text-slate-300">New Target Value</label>
                                    <Input 
                                        type="number"
                                        value={editingGoal.value}
                                        onChange={(e) => setEditingGoal({ ...editingGoal, value: e.target.value })}
                                        placeholder="Enter target value"
                                        className="font-mono text-base bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                                    />
                                </CardContent>
                                <CardFooter className="flex gap-2">
                                    <Button variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1">
                                        Cancel
                                    </Button>
                                    <Button variant="glow" onClick={handleSaveGoal} className="flex-1">
                                        Save Target
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Home;

