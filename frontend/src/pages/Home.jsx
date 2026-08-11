import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotification } from '../context/NotificationContext';
import { 
  Sun,
  Flame, 
  Trash2, 
  AlertTriangle, 
  Droplet, 
  Dumbbell, 
  Brain, 
  Plus, 
  Edit3, 
  Zap,
  Activity,
  X,
  CheckCircle2,
  TrendingUp,
  ShieldAlert,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../apiConfig';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress, CircularProgress } from '../components/ui/progress';
import { Input } from '../components/ui/input';

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

    const quotes = [
        { text: "Every morning brings new potential, but only effort converts it into reality.", author: "FitGenix AI Coach" },
        { text: "Small daily improvements over time lead to stunning long-term results.", author: "Robin Sharma" },
        { text: "Energy flows where attention goes. Focus on your strength.", author: "Tony Robbins" },
        { text: "You don't have to be extreme, just consistent.", author: "FitGenix Coach" }
    ];

    const last7Days = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0];
    }).reverse();

    const fetchData = async () => {
        if (!data) setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/dashboard?date=${selectedDate}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await res.json();
            if (result.success) {
                setData(result.data);
                localStorage.setItem(`dashboard_cache_${selectedDate}`, JSON.stringify(result.data));
            }
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        setQuote(randomQuote.text);
        setAuthor(randomQuote.author);
        fetchData();
    }, [selectedDate]);

    const handleSaveGoal = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/dashboard/goal`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ key: editingGoal.key, value: Number(editingGoal.value) })
            });
            const result = await res.json();
            if (result.success) {
                setData(result.data);
                localStorage.setItem(`dashboard_cache_${selectedDate}`, JSON.stringify(result.data));
                setIsModalOpen(false);
                showNotification(`Updated ${editingGoal.label} target successfully!`, 'success');
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
                fetchData();
            } else {
                showNotification(result.error || 'Failed to delete item', 'error');
            }
        } catch (err) {
            console.error('Delete item error:', err);
            showNotification('Error deleting item', 'error');
        }
    };

    const isCalorieDanger = data && data.totalConsumed > (data.goals?.calories || 2000);
    const isProteinDanger = data && data.macros?.protein > (data.goals?.protein || 150);
    const isCarbsDanger = data && data.macros?.carbs > (data.goals?.carbs || 250);

    return (
        <div className="space-y-8 font-sans max-w-7xl mx-auto pb-12 text-slate-800">
            
            {/* ── HERO BANNER: RISE AND CONQUER YOUR GOALS ── */}
            <div className="relative rounded-3xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white p-6 sm:p-10 overflow-hidden shadow-sunrise-orange">
                <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/20 rounded-full blur-[90px] pointer-events-none" />
                
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <Badge className="bg-white/20 backdrop-blur-md text-white border-white/30 px-3 py-1 font-bold">
                                🌅 MORNING STREAK: 15 DAYS
                            </Badge>
                            <Badge className="hidden sm:inline-flex bg-white/20 backdrop-blur-md text-white border-white/30">
                                PEAK WELLNESS TELEMETRY
                            </Badge>
                        </div>

                        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white font-display uppercase leading-tight">
                            RISE & CONQUER <br />YOUR GOALS
                        </h1>

                        <p className="text-sm sm:text-base text-white/90 font-medium max-w-xl">
                            Good day, <strong className="text-white font-bold">{data?.user?.name || 'Athlete'}</strong>! You are operating at <span className="font-mono font-bold underline">98% Energy Output</span>.
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
                                            ? 'bg-white text-orange-600 font-black shadow-lg'
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

            {/* ── INTERACTIVE MACRO DANGER ALERT BANNER ── */}
            <AnimatePresence>
                {(isCalorieDanger || isProteinDanger || isCarbsDanger) && (
                    <motion.div
                        initial={{ opacity: 0, y: -15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        className="bg-red-50 border-2 border-red-300 p-5 rounded-2xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 border border-red-200 flex items-center justify-center animate-pulse shrink-0">
                                <ShieldAlert className="w-7 h-7" />
                            </div>
                            <div>
                                <h4 className="text-base font-black text-red-700 font-display uppercase tracking-wide flex items-center gap-2">
                                    <span>⚠️ MACRO LIMIT EXCEEDED</span>
                                    <Badge variant="destructive">ALERT</Badge>
                                </h4>
                                <p className="text-xs text-red-800 font-mono mt-0.5">
                                    {isCalorieDanger && `Calories over target by +${data.totalConsumed - data.goals.calories} kcal. `}
                                    {isProteinDanger && `Protein over limit. `}
                                    {isCarbsDanger && `Carbs over limit.`}
                                </p>
                            </div>
                        </div>
                        <Button 
                            variant="danger" 
                            size="sm" 
                            onClick={() => navigate('/diet')}
                            className="shrink-0"
                        >
                            Adjust Diet Intake
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── MOTIVATIONAL QUOTE CARD ── */}
            <div className="sunrise-card p-5 border-l-4 border-l-orange-500 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                    <Sun className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-slate-700 italic font-medium leading-relaxed font-display">"{quote}"</p>
                    <p className="text-xs font-mono font-bold text-orange-600 mt-1">— {author}</p>
                </div>
            </div>

            {/* ── SUNRISE KINETIC STAT CARDS ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* 1. Calorie Goal Card */}
                <Card className="sunrise-card relative overflow-hidden">
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                            <CardDescription className="text-slate-500 font-mono uppercase font-bold">Daily Calorie Goal</CardDescription>
                            <Badge variant="glow">SUNRISE</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center py-4 space-y-3">
                        <CircularProgress value={data?.totalConsumed || 0} max={data?.goals?.calories || 2000} size={130} strokeWidth={11}>
                            <p className="text-2xl font-black text-slate-900 font-mono">{data?.totalConsumed || 0}</p>
                            <p className="text-[10px] text-slate-500 font-mono">/ {data?.goals?.calories || 2000} kcal</p>
                        </CircularProgress>

                        <button 
                            onClick={() => { setEditingGoal({ key: 'calories', label: 'Calories', value: data?.goals?.calories || 2000 }); setIsModalOpen(true); }}
                            className="text-xs text-orange-600 hover:underline flex items-center gap-1 font-bold font-mono"
                        >
                            <Edit3 className="w-3.5 h-3.5" /> Edit Calorie Goal
                        </button>
                    </CardContent>
                </Card>

                {/* 2. Water Hydration Card */}
                <Card className="sunrise-card">
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                            <CardDescription className="text-slate-500 font-mono uppercase font-bold">Hydration Level</CardDescription>
                            <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
                                <Droplet className="w-4 h-4" />
                            </div>
                        </div>
                        <CardTitle className="text-4xl font-black text-slate-900 font-mono mt-2">
                            {data?.waterIntake || 0}
                            <span className="text-sm text-slate-500 font-normal"> / {data?.goals?.water || 3.0} L</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-3">
                        <Progress value={data?.waterIntake || 0} max={data?.goals?.water || 3.0} indicatorClassName="from-cyan-500 to-blue-500" />
                        <button 
                            onClick={() => { setEditingGoal({ key: 'water', label: 'Water (L)', value: data?.goals?.water || 3.0 }); setIsModalOpen(true); }}
                            className="text-xs text-cyan-600 hover:underline flex items-center gap-1 font-bold font-mono"
                        >
                            <Edit3 className="w-3.5 h-3.5" /> Edit Water Target
                        </button>
                    </CardContent>
                </Card>

                {/* 3. Workouts Card */}
                <Card className="sunrise-card">
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                            <CardDescription className="text-slate-500 font-mono uppercase font-bold">Active Training</CardDescription>
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <Dumbbell className="w-4 h-4" />
                            </div>
                        </div>
                        <CardTitle className="text-4xl font-black text-slate-900 font-mono mt-2">
                            {data?.workoutsCompleted || 0}
                            <span className="text-sm text-slate-500 font-normal"> / 5 Sessions</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 flex flex-col gap-2">
                        <Badge variant="success" className="w-fit flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Target Achieved</span>
                        </Badge>
                        <p className="text-xs text-slate-500 font-medium">Hypertrophy phase active</p>
                    </CardContent>
                </Card>

                {/* 4. AI Health Score Card */}
                <Card className="sunrise-card">
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                            <CardDescription className="text-slate-500 font-mono uppercase font-bold">Neural Health Score</CardDescription>
                            <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                                <Brain className="w-4 h-4" />
                            </div>
                        </div>
                        <CardTitle className="text-4xl font-black text-slate-900 font-mono mt-2">
                            98 <span className="text-sm text-orange-600 font-normal">/ 100</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <Badge variant="glow">Optimal</Badge>
                        <p className="text-xs text-slate-500 mt-2 font-medium">Recovery index: 95%</p>
                    </CardContent>
                </Card>
            </div>

            {/* ── MACROS & TRACKED MEALS BENTO ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left: Macros Progress Breakdown */}
                <Card className="lg:col-span-5 sunrise-card">
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-2">
                            <Activity className="w-5 h-5 text-orange-600" />
                            <span>Macronutrient Breakdown</span>
                        </CardTitle>
                        <CardDescription>Targeted vs Consumed Macros for today</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Protein */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-xs font-mono font-bold">
                                <span className="text-slate-700">PROTEIN</span>
                                <span className="text-orange-600">{data?.macros?.protein || 0} / {data?.goals?.protein || 150}g</span>
                            </div>
                            <Progress value={data?.macros?.protein || 0} max={data?.goals?.protein || 150} />
                        </div>

                        {/* Carbs */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-xs font-mono font-bold">
                                <span className="text-slate-700">CARBOHYDRATES</span>
                                <span className="text-amber-600">{data?.macros?.carbs || 0} / {data?.goals?.carbs || 250}g</span>
                            </div>
                            <Progress value={data?.macros?.carbs || 0} max={data?.goals?.carbs || 250} indicatorClassName="from-amber-500 to-yellow-500" />
                        </div>

                        {/* Fats */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-xs font-mono font-bold">
                                <span className="text-slate-700">FATS</span>
                                <span className="text-emerald-600">{data?.macros?.fats || 0} / {data?.goals?.fats || 65}g</span>
                            </div>
                            <Progress value={data?.macros?.fats || 0} max={data?.goals?.fats || 65} indicatorClassName="from-emerald-500 to-teal-500" />
                        </div>
                    </CardContent>
                    <CardFooter className="pt-2">
                        <Button variant="outline" size="sm" onClick={() => navigate('/meal-planner')} className="w-full gap-2 font-mono">
                            <span>Open 7-Day Meal Planner</span>
                            <ArrowRight className="w-4 h-4 text-orange-600" />
                        </Button>
                    </CardFooter>
                </Card>

                {/* Right: Tracked Meal Log Items */}
                <Card className="lg:col-span-7 sunrise-card">
                    <CardHeader className="flex flex-row items-center justify-between pb-4">
                        <div>
                            <CardTitle className="text-xl">Tracked Meals</CardTitle>
                            <CardDescription>Meals logged for {selectedDate}</CardDescription>
                        </div>
                        <Button variant="glow" size="sm" onClick={() => navigate('/diet')} className="gap-1.5 text-xs font-mono">
                            <Plus className="w-4 h-4" /> Log Meal
                        </Button>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {data?.trackedMeals && Object.keys(data.trackedMeals).length > 0 ? (
                            Object.entries(data.trackedMeals).map(([mealType, items]) => (
                                items.length > 0 && (
                                    <div key={mealType} className="space-y-2">
                                        <h5 className="text-xs font-bold text-orange-600 font-mono uppercase tracking-widest">{mealType}</h5>
                                        <div className="space-y-2">
                                            {items.map((item, idx) => (
                                                <div 
                                                    key={idx} 
                                                    className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between hover:border-orange-300 transition-colors"
                                                >
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900 font-display">{item.name}</p>
                                                        <p className="text-xs text-slate-500 font-mono mt-0.5">
                                                            {item.calories} kcal • P: {item.protein} | C: {item.carbs} | F: {item.fats}
                                                        </p>
                                                    </div>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm"
                                                        onClick={() => handleDeleteMealItem(mealType, item.name)}
                                                        className="h-8 w-8 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50"
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
                            <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200">
                                <Activity className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                                <p className="text-sm text-slate-500 font-medium">No meals logged for this date yet.</p>
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
                            <Card className="sunrise-card-active border-2 border-orange-500 bg-white">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-xl">Edit {editingGoal.label} Target</CardTitle>
                                    <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-800">
                                        <X className="w-5 h-5" />
                                    </button>
                                </CardHeader>
                                <CardContent className="space-y-4 pt-2">
                                    <label className="block text-xs font-mono text-slate-600">New Target Value</label>
                                    <Input 
                                        type="number"
                                        value={editingGoal.value}
                                        onChange={(e) => setEditingGoal({ ...editingGoal, value: e.target.value })}
                                        placeholder="Enter target value"
                                        className="font-mono text-base bg-slate-50"
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
