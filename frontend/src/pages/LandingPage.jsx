import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Sun,
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
  ShieldAlert,
  Check,
  Calendar,
  Layers,
  HeartPulse,
  Mail,
  Lock,
  Globe,
  HelpCircle
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';

const LandingPage = () => {
    const navigate = useNavigate();
    const [emailInput, setEmailInput] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleAuth = (mode = 'login') => {
        navigate(`/auth?mode=${mode}`);
    };

    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        if (emailInput) {
            setSubscribed(true);
            setEmailInput('');
        }
    };

    const stats = [
        { label: "Active Athletes", value: "25,000+", icon: <Users className="w-4 h-4 text-orange-600" /> },
        { label: "Smart Plans Built", value: "1.2M+", icon: <Brain className="w-4 h-4 text-orange-600" /> },
        { label: "User Satisfaction", value: "99.4%", icon: <Star className="w-4 h-4 text-orange-600" /> },
        { label: "Form Accuracy", value: "98.8%", icon: <ShieldCheck className="w-4 h-4 text-orange-600" /> },
    ];

    const features = [
        {
            title: "Personalized Workout Splits",
            description: "Custom training routines tailored to your fitness level, target muscle groups, equipment availability, and weekly schedule.",
            icon: <Dumbbell className="w-6 h-6 text-white" />,
            badge: "Smart Workouts",
            gradient: "from-orange-500 via-amber-500 to-orange-600",
            badgeStyle: "bg-orange-50 text-orange-700 border-orange-200/80"
        },
        {
            title: "Precision Food & Macro Tracker",
            description: "Instant calorie and macronutrient breakdowns for thousands of regional and global foods with flexible serving size calculation.",
            icon: <Utensils className="w-6 h-6 text-white" />,
            badge: "Nutrition Insights",
            gradient: "from-emerald-500 via-teal-500 to-emerald-600",
            badgeStyle: "bg-emerald-50 text-emerald-700 border-emerald-200/80"
        },
        {
            title: "7-Day Intelligent Meal Planner",
            description: "Structured weekly meal schedules with one-touch recipe alternatives designed around your target daily calories.",
            icon: <Calendar className="w-6 h-6 text-white" />,
            badge: "Weekly Planning",
            gradient: "from-purple-500 via-violet-500 to-indigo-600",
            badgeStyle: "bg-purple-50 text-purple-700 border-purple-200/80"
        },
        {
            title: "24/7 Virtual Fitness Assistant",
            description: "Get immediate answers and personalized guidance on exercise form, workout recovery, nutrition, and training strategy.",
            icon: <Brain className="w-6 h-6 text-white" />,
            badge: "24/7 Guidance",
            gradient: "from-blue-500 via-cyan-500 to-blue-600",
            badgeStyle: "bg-blue-50 text-blue-700 border-blue-200/80"
        },
        {
            title: "Intelligent Health & Limit Alerts",
            description: "Automatic notifications whenever your calorie or macronutrient intake strays outside your recommended safe range.",
            icon: <ShieldAlert className="w-6 h-6 text-white" />,
            badge: "Calorie Safety",
            gradient: "from-rose-500 via-red-500 to-pink-600",
            badgeStyle: "bg-rose-50 text-rose-700 border-rose-200/80"
        },
        {
            title: "Interactive Exercise Library",
            description: "Detailed exercise execution instructions with muscle activation maps, technique tips, and progress logging.",
            icon: <Layers className="w-6 h-6 text-white" />,
            badge: "Exercise Technique",
            gradient: "from-amber-500 via-orange-500 to-amber-600",
            badgeStyle: "bg-amber-50 text-amber-700 border-amber-200/80"
        }
    ];

    const pricingPlans = [
        {
            name: "Starter Athlete",
            price: "₹0",
            period: "Forever Free",
            description: "Essential workout & food tracking for fitness beginners.",
            features: [
                "Daily Calorie & Water Tracking",
                "Standard Exercise Library Access",
                "Basic Macro Breakdown",
                "Community Support Access"
            ],
            popular: false,
            buttonText: "Start Free Now",
            buttonVariant: "outline"
        },
        {
            name: "Pro Athlete",
            price: "₹799",
            period: "per month",
            description: "The complete intelligent workout split & nutrition suite.",
            features: [
                "Everything in Starter",
                "Unlimited 7-Day Meal Plans",
                "Personalized Workout Split Generator",
                "24/7 Virtual Fitness Assistant",
                "Calorie & Macro Safety Alerts",
                "Fast Cloud Sync"
            ],
            popular: true,
            buttonText: "Start Pro Trial",
            buttonVariant: "glow"
        },
        {
            name: "Elite Performance",
            price: "₹1,499",
            period: "per month",
            description: "Advanced coaching insights & multi-profile management.",
            features: [
                "Everything in Pro",
                "1-on-1 Fitness Analytics Reports",
                "Custom Recipe & Fuel Creator",
                "Unlimited Multi-Device Sync",
                "VIP Dedicated Support 24/7",
                "Early Access to New Features"
            ],
            popular: false,
            buttonText: "Go Elite",
            buttonVariant: "outline"
        }
    ];

    const reviews = [
        { 
            name: "Rahul Sharma", 
            role: "Software Engineer", 
            rating: 5,
            text: "FitGenix changed my life. The AI plans are so accurate, strictly followed the diet and lost 8kg in 2 months!" 
        },
        { 
            name: "Priya Patel", 
            role: "Marketing Head", 
            rating: 5,
            text: "Finally an app that understands Indian diet! The macro breakdown for homemade food is a total game changer." 
        },
        { 
            name: "Amit Verma", 
            role: "Business Owner", 
            rating: 5,
            text: "The adaptive workouts are perfect for my busy schedule. I can train at home or gym and get real results." 
        },
        { 
            name: "Sneha Gupta", 
            role: "College Student", 
            rating: 5,
            text: "The AI Coach is like having a personal trainer 24/7. It helped me fix my posture and build strength safely." 
        },
        { 
            name: "Vikram Reddy", 
            role: "Fitness Enthusiast", 
            rating: 5,
            text: "Best macro tracker I've used. It's fast, intuitive, and the AI suggestions for meals are actually delicious." 
        },
        { 
            name: "Anjali Singh", 
            role: "UX Designer", 
            rating: 5,
            text: "The UI is stunning and the user experience is seamless. It makes tracking my fitness journey feel effortless." 
        }
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
                        <a href="#pricing" className="hover:text-orange-600 transition-colors">Pricing</a>
                        <a href="#reviews" className="hover:text-orange-600 transition-colors">Reviews</a>
                        <a href="#ai-coach" className="hover:text-orange-600 transition-colors">AI Coach</a>
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
            <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
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

            {/* ── FEATURES SECTION ── */}
            <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80 relative">
                {/* Ambient Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-orange-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />

                <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
                    <span className="px-4 py-1.5 rounded-full text-xs font-mono font-bold bg-orange-100 text-orange-700 border border-orange-200 uppercase tracking-wider inline-block">
                        CORE CAPABILITIES
                    </span>
                    <h2 className="text-3xl sm:text-5xl font-black text-slate-900 font-display uppercase tracking-tight">
                        ENGINEERED FOR <span className="text-orange-600">PEAK PERFORMANCE</span>
                    </h2>
                    <p className="text-base text-slate-600 font-medium">
                        Everything you need to plan, track, and master your fitness transformation in one intelligent platform.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feat, idx) => (
                        <div 
                            key={idx} 
                            className="bg-white rounded-3xl p-7 border border-slate-200/80 hover:border-orange-300 shadow-sm hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 group flex flex-col justify-between hover:-translate-y-1.5"
                        >
                            <div className="space-y-5">
                                <div className="flex items-center justify-between">
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feat.gradient} flex items-center justify-center shadow-md group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}>
                                        {feat.icon}
                                    </div>
                                    <span className={`px-3.5 py-1 rounded-full text-xs font-mono font-bold border ${feat.badgeStyle}`}>
                                        {feat.badge}
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-orange-600 transition-colors font-display">
                                        {feat.title}
                                    </h3>
                                    <p className="text-sm text-slate-600 font-medium leading-relaxed">
                                        {feat.description}
                                    </p>
                                </div>
                            </div>
                            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs font-mono font-bold text-slate-400 group-hover:text-orange-600 transition-colors">
                                <span>Explore Feature</span>
                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── PRICING SECTION ── */}
            <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80">
                <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
                    <h2 className="text-3xl sm:text-5xl font-black text-slate-900 font-display uppercase tracking-tight">
                        TRANSPARENT <span className="text-orange-600">PRICING PLANS</span>
                    </h2>
                    <p className="text-base text-slate-600 font-medium">
                        Select the perfect plan tailored to your training goals. Upgrade or cancel anytime.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                    {pricingPlans.map((plan, idx) => (
                        <Card 
                            key={idx} 
                            className={`flex flex-col justify-between transition-all ${
                                plan.popular 
                                    ? 'sunrise-card-active border-2 border-orange-500 scale-105 shadow-sunrise-orange relative' 
                                    : 'sunrise-card'
                            }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider shadow-md">
                                    MOST POPULAR
                                </div>
                            )}

                            <div>
                                <CardHeader className="space-y-2 pt-6">
                                    <CardTitle className="text-2xl font-black text-slate-900 uppercase">{plan.name}</CardTitle>
                                    <CardDescription>{plan.description}</CardDescription>
                                    <div className="pt-4 flex items-baseline gap-2">
                                        <span className="text-4xl font-black text-slate-900 font-mono">{plan.price}</span>
                                        <span className="text-sm font-semibold text-slate-500 font-mono">{plan.period}</span>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-3 pt-4 border-t border-slate-100">
                                    {plan.features.map((feat, i) => (
                                        <div key={i} className="flex items-center gap-3 text-xs font-semibold text-slate-700">
                                            <div className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                                                <Check className="w-3.5 h-3.5" />
                                            </div>
                                            <span>{feat}</span>
                                        </div>
                                    ))}
                                </CardContent>
                            </div>

                            <CardFooter className="pt-6">
                                <Button 
                                    variant={plan.buttonVariant} 
                                    onClick={() => handleAuth('signup')}
                                    className="w-full font-mono font-bold"
                                >
                                    {plan.buttonText}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </section>

            {/* ── REVIEWS SECTION ── */}
            <section id="reviews" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80">
                <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
                    <h2 className="text-3xl sm:text-5xl font-black text-slate-900 font-display uppercase tracking-tight">
                        ATHLETE <span className="text-orange-600">TESTIMONIALS</span>
                    </h2>
                    <p className="text-base text-slate-600 font-medium">
                        See how thousands of dedicated users transformed their body & energy output with FitGenix.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {reviews.map((rev, idx) => (
                        <Card key={idx} className="sunrise-card p-6 flex flex-col justify-between">
                            <div className="space-y-4">
                                <div className="flex items-center gap-1 text-amber-500">
                                    {Array.from({ length: rev.rating }).map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                                    ))}
                                </div>
                                <p className="text-sm text-slate-700 italic leading-relaxed">
                                    "{rev.text}"
                                </p>
                            </div>
                            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center font-black text-white text-sm font-mono">
                                    {rev.name.charAt(0)}
                                </div>
                                <div>
                                    <h5 className="font-bold text-slate-900 text-sm font-display">{rev.name}</h5>
                                    <p className="text-xs text-slate-500 font-mono">{rev.role}</p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </section>

            {/* ── RICH FOOTER SECTION ── */}
            <footer className="border-t border-slate-200 bg-white pt-16 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-100">
                    
                    {/* Brand Column */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-sunrise-orange">
                                <Flame className="w-6 h-6 fill-white" />
                            </div>
                            <span className="text-2xl font-black text-slate-900 font-display">
                                Fit<span className="text-orange-600">Genix</span>
                            </span>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed max-w-sm">
                            FitGenix is your all-in-one AI fitness platform. Adaptive workout split generators, precision macro tracking, and 24/7 intelligent coaching.
                        </p>
                        
                        {/* Newsletter Subscribe */}
                        <form onSubmit={handleNewsletterSubmit} className="space-y-2 pt-2">
                            <p className="text-xs font-mono font-bold text-slate-700 uppercase">Subscribe to AI Workout Tips</p>
                            <div className="flex gap-2 max-w-sm">
                                <Input 
                                    type="email" 
                                    placeholder="Enter your email" 
                                    value={emailInput}
                                    onChange={(e) => setEmailInput(e.target.value)}
                                    className="bg-slate-50 text-xs"
                                    required
                                />
                                <Button type="submit" variant="glow" size="sm" className="shrink-0 font-mono text-xs">
                                    Subscribe
                                </Button>
                            </div>
                            {subscribed && (
                                <p className="text-xs text-emerald-600 font-mono">✓ Thank you for subscribing!</p>
                            )}
                        </form>
                    </div>

                    {/* Product Links */}
                    <div className="space-y-3 font-mono text-xs">
                        <h5 className="font-bold text-slate-900 uppercase tracking-wider text-sm">Product</h5>
                        <ul className="space-y-2.5 text-slate-600">
                            <li><a href="#features" className="hover:text-orange-600 transition-colors">AI Workout Generator</a></li>
                            <li><a href="#features" className="hover:text-orange-600 transition-colors">Smart Macro Tracker</a></li>
                            <li><a href="#features" className="hover:text-orange-600 transition-colors">7-Day Meal Planner</a></li>
                            <li><a href="#features" className="hover:text-orange-600 transition-colors">24/7 AI Coach</a></li>
                            <li><a href="#pricing" className="hover:text-orange-600 transition-colors">Pricing Plans</a></li>
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div className="space-y-3 font-mono text-xs">
                        <h5 className="font-bold text-slate-900 uppercase tracking-wider text-sm">Company</h5>
                        <ul className="space-y-2.5 text-slate-600">
                            <li><a href="#reviews" className="hover:text-orange-600 transition-colors">About FitGenix</a></li>
                            <li><a href="#reviews" className="hover:text-orange-600 transition-colors">Athlete Reviews</a></li>
                            <li><a href="#reviews" className="hover:text-orange-600 transition-colors">Careers</a></li>
                            <li><a href="#reviews" className="hover:text-orange-600 transition-colors">Press & Media</a></li>
                        </ul>
                    </div>

                    {/* Legal & Support */}
                    <div className="space-y-3 font-mono text-xs">
                        <h5 className="font-bold text-slate-900 uppercase tracking-wider text-sm">Support & Legal</h5>
                        <ul className="space-y-2.5 text-slate-600">
                            <li><a href="#" className="hover:text-orange-600 transition-colors">Help Center</a></li>
                            <li><a href="#" className="hover:text-orange-600 transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-orange-600 transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-orange-600 transition-colors">Security Overview</a></li>
                        </ul>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono">
                    <p>&copy; 2026 FitGenix AI Inc. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        <a href="#" className="hover:text-orange-600 transition-colors">Privacy</a>
                        <a href="#" className="hover:text-orange-600 transition-colors">Terms</a>
                        <a href="#" className="hover:text-orange-600 transition-colors">Security</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
