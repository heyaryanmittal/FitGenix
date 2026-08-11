import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaCalendarAlt, FaSearch, FaMagic, FaPlus, FaTrash, FaSave,
    FaChevronLeft, FaChevronRight, FaFire, FaLeaf, FaEdit,
    FaTimes, FaCheck, FaSpinner, FaDownload, FaUtensils
} from 'react-icons/fa';
import { useNotification } from '../context/NotificationContext';
import API_URL from '../apiConfig';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const MEALS = ['breakfast', 'lunch', 'snacks', 'dinner'];
const DIET_TYPES = ['Balanced', 'High Protein', 'Low Carb', 'Keto', 'Vegan', 'Vegetarian', 'Paleo', 'Mediterranean'];
const GOAL_PRESETS = ['Weight Loss', 'Muscle Gain', 'Maintenance', 'Endurance', 'Lean Bulk', 'Fat Loss + Muscle'];

const MEAL_COLORS = {
    breakfast: { bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-700', dot: 'bg-amber-400', text: 'text-amber-700 dark:text-amber-300', badge: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300' },
    lunch: { bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-700', dot: 'bg-green-500', text: 'text-green-700 dark:text-green-300', badge: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300' },
    snacks: { bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-200 dark:border-purple-700', dot: 'bg-purple-500', text: 'text-purple-700 dark:text-purple-300', badge: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300' },
    dinner: { bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-700', dot: 'bg-blue-500', text: 'text-blue-700 dark:text-blue-300', badge: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300' },
};

const emptyDay = () => ({ breakfast: [], lunch: [], snacks: [], dinner: [] });

const defaultPlan = () => {
    const plan = {};
    DAYS.forEach(d => { plan[d] = emptyDay(); });
    return plan;
};

// Normalize keys from AI / DB: lowercase day names, alias meal name variants
const MEAL_ALIASES = {
    breakfast: 'breakfast', Breakfast: 'breakfast',
    lunch: 'lunch', Lunch: 'lunch',
    dinner: 'dinner', Dinner: 'dinner',
    snack: 'snacks', Snack: 'snacks', snacks: 'snacks', Snacks: 'snacks',
};

const normalizePlan = (rawPlan) => {
    const base = defaultPlan();
    if (!rawPlan || typeof rawPlan !== 'object') return base;

    Object.entries(rawPlan).forEach(([rawDay, rawMeals]) => {
        const day = rawDay.toLowerCase().trim();
        if (!base[day]) return; // skip unknown days

        // rawMeals may be a Mongoose doc — convert to plain object
        const mealsObj = (rawMeals && typeof rawMeals.toObject === 'function')
            ? rawMeals.toObject()
            : (rawMeals || {});

        Object.entries(mealsObj).forEach(([rawMeal, items]) => {
            const meal = MEAL_ALIASES[rawMeal] || rawMeal.toLowerCase();
            if (!base[day][meal]) return; // skip unknown meal keys
            // items may be a Mongoose DocumentArray — convert to plain array
            const arr = Array.isArray(items) ? items : [];
            base[day][meal] = arr.map(item => {
                const plain = (item && typeof item.toObject === 'function') ? item.toObject() : { ...item };
                return {
                    name: plain.name || '',
                    calories: parseInt(plain.calories) || 0,
                    protein: plain.protein || '0g',
                    carbs: plain.carbs || '0g',
                    fats: plain.fats || '0g',
                    notes: plain.notes || ''
                };
            });
        });
    });
    return base;
};

// ─── Sub-component: Single food item row ────────────────────────────────────
const FoodItem = ({ item, onDelete, onEdit, onSuggest }) => {
    const [isSuggesting, setIsSuggesting] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="flex flex-col gap-2 py-3 border-b border-gray-100 dark:border-gray-700/50 last:border-0 group"
        >
            <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                    <p className="font-bold text-sm text-gray-800 dark:text-gray-100 leading-snug">{item.name}</p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                        <span className="text-[10px] bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-300 px-1.5 py-0.5 rounded font-black">
                            {item.calories} kcal
                        </span>
                        <span className="text-[10px] bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 px-1.5 py-0.5 rounded font-black">
                            P {item.protein}
                        </span>
                    </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <button
                        type="button"
                        onClick={async () => {
                            setIsSuggesting(true);
                            await onSuggest();
                            setIsSuggesting(false);
                        }}
                        className="w-7 h-7 rounded-lg bg-violet-100 dark:bg-violet-900/40 text-violet-500 flex items-center justify-center hover:bg-violet-200 transition-colors"
                        title="Suggest Alternative"
                    >
                        {isSuggesting ? <FaSpinner className="animate-spin" size={10} /> : <FaMagic size={10} />}
                    </button>
                    <button type="button" onClick={onEdit} className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-500 flex items-center justify-center hover:bg-blue-200 transition-colors">
                        <FaEdit size={10} />
                    </button>
                    <button type="button" onClick={onDelete} className="w-7 h-7 rounded-lg bg-red-100 dark:bg-red-900/40 text-red-500 flex items-center justify-center hover:bg-red-200 transition-colors">
                        <FaTrash size={10} />
                    </button>
                </div>
            </div>
            {item.notes && (
                <p className="text-[10px] text-gray-400 italic bg-gray-50 dark:bg-gray-800/50 p-1.5 rounded-lg border border-gray-100 dark:border-gray-700/50">
                    💡 {item.notes}
                </p>
            )}
        </motion.div>
    );
};

// ─── Sub-component: Add / Edit food modal ───────────────────────────────────
const FoodModal = ({ isOpen, onClose, onSave, initialData }) => {
    const [form, setForm] = useState({ name: '', calories: '', protein: '', carbs: '', fats: '', notes: '' });

    useEffect(() => {
        if (initialData) setForm(initialData);
        else setForm({ name: '', calories: '', protein: '', carbs: '', fats: '', notes: '' });
    }, [initialData, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.name.trim()) return;
        onSave({
            name: form.name.trim(),
            calories: parseInt(form.calories) || 0,
            protein: form.protein || '0g',
            carbs: form.carbs || '0g',
            fats: form.fats || '0g',
            notes: form.notes
        });
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-2xl w-full max-w-sm border border-gray-100 dark:border-gray-700"
                    >
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-lg font-black text-gray-800 dark:text-white">{initialData ? 'Edit Food Item' : 'Add Food Item'}</h3>
                            <button type="button" onClick={onClose} className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
                                <FaTimes size={12} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <input
                                required
                                placeholder="Food name *"
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                            />
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    type="number"
                                    placeholder="Calories"
                                    value={form.calories}
                                    onChange={e => setForm({ ...form, calories: e.target.value })}
                                    className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                                />
                                <input
                                    placeholder="Protein (e.g. 25g)"
                                    value={form.protein}
                                    onChange={e => setForm({ ...form, protein: e.target.value })}
                                    className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                                />
                                <input
                                    placeholder="Carbs (e.g. 30g)"
                                    value={form.carbs}
                                    onChange={e => setForm({ ...form, carbs: e.target.value })}
                                    className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                                />
                                <input
                                    placeholder="Fats (e.g. 8g)"
                                    value={form.fats}
                                    onChange={e => setForm({ ...form, fats: e.target.value })}
                                    className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                                />
                            </div>
                            <input
                                placeholder="Prep notes (optional)"
                                value={form.notes}
                                onChange={e => setForm({ ...form, notes: e.target.value })}
                                className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                            />
                            <button
                                type="submit"
                                className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                            >
                                <FaCheck /> {initialData ? 'Update' : 'Add Item'}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const MealPlanner = () => {
    const { showNotification } = useNotification();
    const [plan, setPlan] = useState(defaultPlan());
    const [activeDay, setActiveDay] = useState('monday');
    const [isSaving, setIsSaving] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showGenPanel, setShowGenPanel] = useState(false);

    // Food modal state
    const [foodModal, setFoodModal] = useState({ open: false, day: null, meal: null, editIndex: null, data: null });

    // AI generator form
    const [genForm, setGenForm] = useState({
        dietType: 'Balanced',
        goal: 'Maintenance',
        dietPreference: 'non-veg', // 'veg' | 'non-veg'
        calorieGoal: '',
        allergies: '',
        days: 7,
        customPrefs: ''
    });

    // Search / filter state
    const [search, setSearch] = useState('');

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    // ── Load existing plan ─────────────────────────────────────────────────
    useEffect(() => {
        const fetchPlan = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/meal-plan`, { headers });
                if (res.data.success && Object.keys(res.data.mealPlan || {}).length > 0) {
                    setPlan(normalizePlan(res.data.mealPlan));
                }
            } catch (err) {
                console.error('Failed to load meal plan', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPlan();
    }, []);

    // ── Save plan ──────────────────────────────────────────────────────────
    const savePlan = async () => {
        setIsSaving(true);
        try {
            await axios.post(`${API_URL}/api/meal-plan/save`, { mealPlan: plan }, { headers });
            showNotification('Meal plan saved! ✅', 'success');
        } catch (err) {
            showNotification('Failed to save plan', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    // ── AI Generate ────────────────────────────────────────────────────────
    const generatePlan = async () => {
        setIsGenerating(true);
        try {
            const payload = {
                dietType: genForm.dietType,
                dietPreference: genForm.dietPreference,
                preferences: `${genForm.goal}. ${genForm.customPrefs}`.trim(),
                calorieGoal: parseInt(genForm.calorieGoal) || undefined,
                allergies: genForm.allergies || 'none',
                days: 7,
                startDay: 'monday'
            };
            const res = await axios.post(`${API_URL}/api/meal-plan/generate`, payload, { headers });
            if (res.data.success) {
                // Merge new generation into existing plan
                const newPart = normalizePlan(res.data.mealPlan);
                setPlan(prev => ({ ...prev, ...newPart }));

                setShowGenPanel(false);
                showNotification(`AI meal plan generated for ${genForm.days} days! 🎉 Save it when ready.`, 'success');
            }
        } catch (err) {
            showNotification(err.response?.data?.error || 'AI generation failed', 'error');
        } finally {
            setIsGenerating(false);
        }
    };

    // ── Suggest Alternative ───────────────────────────────────────────────
    const suggestAlternative = async (day, meal, index) => {
        const foodItem = plan[day][meal][index];
        try {
            const res = await axios.post(`${API_URL}/api/meal-plan/suggest-alternative`, {
                foodItem,
                dietType: genForm.dietType,
                allergies: genForm.allergies
            }, { headers });

            if (res.data.success) {
                setPlan(prev => {
                    const updated = { ...prev };
                    updated[day][meal][index] = res.data.alternative;
                    return { ...updated };
                });
                showNotification('Ingredient flexibility enabled! Swapped with alternative. 🔄', 'success');
            }
        } catch (err) {
            showNotification('Could not suggest alternative', 'error');
        }
    };

    // ── Add / Edit food ────────────────────────────────────────────────────
    const openAddModal = (day, meal) => {
        setFoodModal({ open: true, day, meal, editIndex: null, data: null });
    };

    const openEditModal = (day, meal, index) => {
        setFoodModal({ open: true, day, meal, editIndex: index, data: plan[day][meal][index] });
    };

    const handleFoodSave = (item) => {
        const { day, meal, editIndex } = foodModal;
        setPlan(prev => {
            const updated = { ...prev };
            const items = [...(updated[day][meal] || [])];
            if (editIndex !== null) items[editIndex] = item;
            else items.push(item);
            updated[day] = { ...updated[day], [meal]: items };
            return updated;
        });
    };

    const deleteFood = (day, meal, index) => {
        setPlan(prev => {
            const updated = { ...prev };
            const items = [...updated[day][meal]];
            items.splice(index, 1);
            updated[day] = { ...updated[day], [meal]: items };
            return updated;
        });
    };

    // ── Clear a whole day ──────────────────────────────────────────────────
    const clearDay = (day) => {
        setPlan(prev => ({ ...prev, [day]: emptyDay() }));
        showNotification(`${day.charAt(0).toUpperCase() + day.slice(1)} cleared`, 'success');
    };

    // ── Copy yesterday to today ────────────────────────────────────────────
    const copyFromPrevDay = (day) => {
        const idx = DAYS.indexOf(day);
        if (idx === 0) { showNotification('No previous day to copy from', 'error'); return; }
        const prevDay = DAYS[idx - 1];
        setPlan(prev => ({
            ...prev,
            [day]: JSON.parse(JSON.stringify(prev[prevDay]))
        }));
        showNotification(`Copied from ${prevDay}`, 'success');
    };

    // ── Computed totals for active day ──────────────────────────────────────
    const dayTotals = useCallback((day) => {
        let cal = 0, prot = 0, carb = 0, fat = 0;
        MEALS.forEach(meal => {
            (plan[day]?.[meal] || []).forEach(item => {
                cal += item.calories || 0;
                prot += parseInt(item.protein) || 0;
                carb += parseInt(item.carbs) || 0;
                fat += parseInt(item.fats) || 0;
            });
        });
        return { cal, prot, carb, fat };
    }, [plan]);

    // ── Filtered meals (search) ─────────────────────────────────────────────
    const filteredMeals = (day, meal) => {
        const items = plan[day]?.[meal] || [];
        if (!search.trim()) return items;
        return items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));
    };

    const activeTotals = dayTotals(activeDay);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <FaSpinner className="animate-spin text-4xl text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-12">
            {/* ─── Food Add/Edit Modal ─────────────────────────────────── */}
            <FoodModal
                isOpen={foodModal.open}
                onClose={() => setFoodModal({ ...foodModal, open: false })}
                onSave={handleFoodSave}
                initialData={foodModal.data}
            />

            {/* ─── Header ──────────────────────────────────────────────── */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-black text-gray-800 dark:text-white flex items-center gap-3">
                        <FaCalendarAlt className="text-primary text-3xl" />
                        <div className="leading-tight">
                            Weekly Meal Planner
                            <span className="block text-xs font-semibold text-gray-400 mt-0.5">Plan, customise & save your week</span>
                        </div>
                    </h2>
                </div>
                <div className="flex gap-2 flex-wrap">
                    <button
                        type="button"
                        onClick={() => setShowGenPanel(v => !v)}
                        className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-500 text-white px-3 py-2 rounded-xl font-bold text-xs hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/30"
                    >
                        <FaMagic /> AI Generate
                    </button>
                    <button
                        type="button"
                        onClick={savePlan}
                        disabled={isSaving}
                        className="flex items-center gap-2 bg-primary text-white px-3 py-2 rounded-xl font-bold text-xs hover:opacity-90 transition-opacity shadow-lg shadow-primary/30 disabled:opacity-50"
                    >
                        {isSaving ? <FaSpinner className="animate-spin" /> : <FaSave />}
                        {isSaving ? 'Saving...' : 'Save Plan'}
                    </button>
                </div>
            </div>

            {/* ─── AI Generator Panel ──────────────────────────────────── */}
            <AnimatePresence>
                {showGenPanel && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border border-violet-200 dark:border-violet-700 rounded-2xl p-5"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <FaMagic className="text-violet-500" />
                            <h3 className="font-black text-gray-800 dark:text-white">AI Meal Plan Generator</h3>
                            <span className="ml-auto text-xs bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-300 px-2 py-1 rounded-full font-semibold">Powered by Groq AI</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Diet Type */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Diet Type</label>
                                <div className="flex flex-wrap gap-1.5">
                                    {DIET_TYPES.map(d => (
                                        <button
                                            key={d}
                                            type="button"
                                            onClick={() => setGenForm(f => ({ ...f, dietType: d }))}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${genForm.dietType === d ? 'bg-violet-600 text-white shadow-md' : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-violet-100 dark:hover:bg-violet-900/30'}`}
                                        >
                                            {d}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Fitness Goal */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Fitness Goal</label>
                                <div className="flex flex-wrap gap-1.5">
                                    {GOAL_PRESETS.map(g => (
                                        <button
                                            key={g}
                                            type="button"
                                            onClick={() => setGenForm(f => ({ ...f, goal: g }))}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${genForm.goal === g ? 'bg-primary text-white shadow-md' : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-orange-900/30'}`}
                                        >
                                            {g}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Dietary Preference */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Dietary Preference</label>
                                <div className="flex gap-2 p-1 bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                                    {['non-veg', 'veg'].map(p => (
                                        <button
                                            key={p}
                                            type="button"
                                            onClick={() => setGenForm(f => ({ ...f, dietPreference: p }))}
                                            className={`flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${genForm.dietPreference === p ? (p === 'veg' ? 'bg-green-500 text-white' : 'bg-rose-500 text-white') : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Settings column */}
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Daily Calorie Target</label>
                                    <input
                                        type="number"
                                        placeholder="e.g. 2200 (uses your goal if blank)"
                                        value={genForm.calorieGoal}
                                        onChange={e => setGenForm(f => ({ ...f, calorieGoal: e.target.value }))}
                                        className="w-full p-2.5 rounded-xl bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Allergies / Avoid</label>
                                    <input
                                        placeholder="e.g. gluten, dairy, nuts"
                                        value={genForm.allergies}
                                        onChange={e => setGenForm(f => ({ ...f, allergies: e.target.value }))}
                                        className="w-full p-2.5 rounded-xl bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Additional Preferences</label>
                                    <input
                                        placeholder="e.g. Indian cuisine, budget-friendly"
                                        value={genForm.customPrefs}
                                        onChange={e => setGenForm(f => ({ ...f, customPrefs: e.target.value }))}
                                        className="w-full p-2.5 rounded-xl bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={generatePlan}
                            disabled={isGenerating}
                            className="mt-5 w-full bg-gradient-to-r from-violet-600 to-purple-500 text-white py-2.5 rounded-xl font-black text-xs hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30"
                        >
                            {isGenerating ? <><FaSpinner className="animate-spin" /> Generating... this may take 20–30 seconds</> : <><FaMagic /> Generate My Meal Plan</>}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ─── Search Bar ──────────────────────────────────────────── */}
            <div className="relative max-w-md">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search food items across the week..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary text-sm text-gray-800 dark:text-white shadow-sm"
                />
                {search && (
                    <button type="button" onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        <FaTimes size={12} />
                    </button>
                )}
            </div>

            {/* ─── Day Tabs ─────────────────────────────────────────────── */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-3 border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="flex gap-1 overflow-x-auto scrollbar-hide">
                    {DAYS.map(day => {
                        const totals = dayTotals(day);
                        const isActive = activeDay === day;
                        const hasData = MEALS.some(m => plan[day]?.[m]?.length > 0);
                        return (
                            <button
                                key={day}
                                type="button"
                                onClick={() => setActiveDay(day)}
                                className={`flex-shrink-0 flex flex-col items-center px-4 py-2.5 rounded-xl transition-all ${isActive ? 'bg-primary text-white shadow-md shadow-primary/30' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                            >
                                <span className="text-[10px] font-black uppercase tracking-wider">{day.slice(0, 3)}</span>
                                <span className={`text-xs font-semibold mt-0.5 ${isActive ? 'text-white/80' : 'text-gray-400'}`}>
                                    {totals.cal > 0 ? `${totals.cal} kcal` : '—'}
                                </span>
                                {hasData && !isActive && (
                                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-1" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ─── Day Summary Bar ─────────────────────────────────────── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                    { label: 'Calories', value: `${activeTotals.cal} kcal`, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20' },
                    { label: 'Protein', value: `${activeTotals.prot}g`, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                    { label: 'Carbs', value: `${activeTotals.carb}g`, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
                    { label: 'Fats', value: `${activeTotals.fat}g`, color: 'text-gray-500', bg: 'bg-gray-100 dark:bg-gray-700/50' },
                ].map(stat => (
                    <div key={stat.label} className={`${stat.bg} rounded-2xl p-3 text-center`}>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">{stat.label}</p>
                        <p className={`text-xl font-black ${stat.color}`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* ─── Day Controls ─────────────────────────────────────────── */}
            <div className="flex gap-2 flex-wrap">
                <button
                    type="button"
                    onClick={() => copyFromPrevDay(activeDay)}
                    className="text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 font-semibold flex items-center gap-1.5 transition-colors"
                >
                    <FaDownload size={10} /> Copy from {DAYS[Math.max(0, DAYS.indexOf(activeDay) - 1)]}
                </button>
                <button
                    type="button"
                    onClick={() => clearDay(activeDay)}
                    className="text-xs bg-white dark:bg-gray-800 border border-red-200 dark:border-red-800 text-red-500 px-3 py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 font-semibold flex items-center gap-1.5 transition-colors"
                >
                    <FaTrash size={10} /> Clear {activeDay.charAt(0).toUpperCase() + activeDay.slice(1)}
                </button>
            </div>

            {/* ─── 4 Meal Columns ──────────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {MEALS.map(meal => {
                    const c = MEAL_COLORS[meal];
                    const items = filteredMeals(activeDay, meal);
                    const allItems = plan[activeDay]?.[meal] || [];
                    const mealCal = allItems.reduce((s, i) => s + (i.calories || 0), 0);

                    return (
                        <div key={meal} className={`${c.bg} border ${c.border} rounded-2xl p-4 flex flex-col`}>
                            {/* Meal header */}
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <span className={`w-2.5 h-2.5 rounded-full ${c.dot}`} />
                                    <h4 className={`font-black capitalize text-sm ${c.text}`}>{meal}</h4>
                                </div>
                                {mealCal > 0 && (
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.badge}`}>
                                        {mealCal} kcal
                                    </span>
                                )}
                            </div>

                            {/* Food items */}
                            <div className="flex-1 space-y-0 min-h-[100px]">
                                <AnimatePresence>
                                    {items.length === 0 ? (
                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-xs text-gray-400 italic"
                                        >
                                            {search ? 'No matches found' : `No ${meal} planned`}
                                        </motion.p>
                                    ) : (
                                        items.map((item, idx) => (
                                            <FoodItem
                                                key={idx}
                                                item={item}
                                                onDelete={() => deleteFood(activeDay, meal, idx)}
                                                onEdit={() => openEditModal(activeDay, meal, idx)}
                                                onSuggest={() => suggestAlternative(activeDay, meal, idx)}
                                            />
                                        ))
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Add button */}
                            <button
                                type="button"
                                onClick={() => openAddModal(activeDay, meal)}
                                className={`mt-3 w-full border-2 border-dashed ${c.border} ${c.text} py-2 rounded-xl text-xs font-bold hover:bg-white/50 dark:hover:bg-white/5 transition-colors flex items-center justify-center gap-1.5`}
                            >
                                <FaPlus size={10} /> Add {meal}
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* ─── Week Overview Bar Graph ─────────────────────────────── */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest">📊 Weekly Calorie Progress</h3>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 bg-primary rounded-sm"></div>
                            <span className="text-[10px] font-bold text-gray-400">PLANNED</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded-sm"></div>
                            <span className="text-[10px] font-bold text-gray-400">EMPTY</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-end justify-between gap-1 h-32 md:h-48 px-2">
                    {DAYS.map(day => {
                        const t = dayTotals(day);
                        const limit = 2500; // Baseline for graph
                        const height = Math.min((t.cal / limit) * 100, 100);
                        const isActive = day === activeDay;

                        return (
                            <div key={day} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                                <div className="text-[10px] font-bold text-gray-400 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {t.cal}
                                </div>
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${height}%` }}
                                    onClick={() => setActiveDay(day)}
                                    className={`w-full max-w-[40px] rounded-t-lg transition-all cursor-pointer relative ${isActive ? 'bg-primary shadow-lg shadow-primary/30' : (t.cal > 0 ? 'bg-primary/40 dark:bg-primary/20 hover:bg-primary/60' : 'bg-gray-100 dark:bg-gray-700/50')}`}
                                >
                                    {isActive && <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full"></div>}
                                </motion.div>
                                <span className={`text-[10px] font-black uppercase mt-1 ${isActive ? 'text-primary' : 'text-gray-400'}`}>
                                    {day.slice(0, 3)}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default MealPlanner;
