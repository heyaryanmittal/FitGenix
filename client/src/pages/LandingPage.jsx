import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight, FaDumbbell, FaCarrot, FaFire, FaBrain, FaPlay } from 'react-icons/fa';

const LandingPage = () => {
    const navigate = useNavigate();
    const { scrollY } = useScroll();
    const yHero = useTransform(scrollY, [0, 500], [0, 150]);

    const handleStart = () => navigate('/auth');

    const StatCounter = ({ value, label }) => {
        return (
            <div className="flex flex-col items-center">
                <span className="text-4xl font-bold text-gray-900">{value}</span>
                <span className="text-sm text-gray-500 uppercase tracking-widest mt-1">{label}</span>
            </div>
        );
    };

    const heroImages = [
        "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1550345332-09e3ac987658?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1560090995-01632a28895b?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1507398941214-572c25f4b1dc?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400&auto=format&fit=crop",
    ];

    const reviews = [
        { name: "Rahul Sharma", role: "Software Engineer", img: "https://randomuser.me/api/portraits/men/32.jpg", text: "FitGenix changed my life. The AI plans are so accurate, strictly followed the diet and lost 8kg in 2 months!" },
        { name: "Priya Patel", role: "Student", img: "https://randomuser.me/api/portraits/women/44.jpg", text: "Finally an app that understands Indian diet! The macro breakdown for homemade food is a game changer." },
        { name: "Amit Verma", role: "Businessman", img: "https://randomuser.me/api/portraits/men/86.jpg", text: "The adaptive workouts are perfect for my busy schedule. I can train at home or gym and get results." }
    ];

    return (
        <div className="min-h-screen bg-white text-gray-800 font-sans overflow-x-hidden">


            <header className="relative pt-10 pb-20 lg:pt-16 lg:pb-32 px-6 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full -z-10 bg-white">
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-yellow-100 rounded-full blur-3xl opacity-60"></div>
                    <div className="absolute bottom-[0%] left-[-10%] w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl opacity-60"></div>
                </div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="space-y-8 z-10"
                    >
                        <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-gray-900 leading-none">
                            Fit<span className="text-primary">Genix</span>.
                        </h1>

                        <h2 className="text-4xl md:text-6xl font-black leading-tight tracking-tight text-gray-900">
                            Shape Your <br />
                            <span className="text-primary relative inline-block">
                                Future
                                <svg className="absolute w-full h-2 md:h-3 -bottom-1 left-0 text-yellow-500 opacity-60 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                                </svg>
                            </span>
                        </h2>

                        <p className="text-lg md:text-xl text-gray-500 max-w-lg leading-relaxed font-light">
                            No generic plans. Just smart styling, real-time diet analysis, and workouts that adapt to <strong className="text-gray-900 font-semibold">your life.</strong>
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button onClick={handleStart} className="btn-primary text-lg px-10 py-4 shadow-xl shadow-primary/20">
                                Start Training Free <FaArrowRight />
                            </button>
                        </div>

                        <div className="flex items-center gap-8 pt-6 border-t border-gray-100 mt-6">
                            <StatCounter value="15k+" label="Active Users" />
                            <div className="h-10 w-px bg-gray-200"></div>
                            <StatCounter value="4.9" label="Rating" />
                            <div className="h-10 w-px bg-gray-200"></div>
                            <StatCounter value="24/7" label="AI Support" />
                        </div>
                    </motion.div>

                    <motion.div
                        style={{ y: yHero }}
                        className="relative hidden lg:flex items-center justify-center h-full w-full overflow-visible"
                    >
                        <div className="relative" style={{ width: 480, height: 540 }}>
                            {(() => {
                                const S = 100;
                                const B = 4;
                                const hH = S * 0.866;
                                const cW = S * 1.02;
                                const rH = hH * 1.02;

                                const layout = [
                                    [{ img: 0 }],
                                    [{ img: 1 }, { img: 2 }],
                                    [{ img: 3 }, { img: 4 }, { img: 5 }, { img: 6 }],
                                    [{ img: 7 }, { img: 8 }, { img: 9 }],
                                    [{ img: 10 }],
                                ];

                                const canvasW = 480;
                                const canvasH = 540;
                                const hexClip = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

                                return layout.flatMap((row, rowIdx) => {
                                    const cols = row.length;
                                    const rowWidth = (cols - 1) * cW;
                                    const startX = (canvasW - rowWidth) / 2;
                                    const cy = 50 + rowIdx * rH;

                                    return row.map(({ img: imgIdx }, colIdx) => {
                                        const cx = startX + colIdx * cW;
                                        const top = cy - S / 2;
                                        const left = cx - S / 2;
                                        return (
                                            <motion.div
                                                key={imgIdx}
                                                whileHover={{ scale: 1.12, zIndex: 50 }}
                                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                                style={{
                                                    position: "absolute",
                                                    top,
                                                    left,
                                                    width: S,
                                                    height: S,
                                                    clipPath: hexClip,
                                                    zIndex: 10,
                                                    cursor: "pointer",
                                                    background: "#fe5000",
                                                    padding: B,
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        width: "100%",
                                                        height: "100%",
                                                        clipPath: hexClip,
                                                        overflow: "hidden",
                                                    }}
                                                >
                                                    <img
                                                        src={heroImages[imgIdx]}
                                                        alt={`fitness-${imgIdx}`}
                                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                    />
                                                </div>
                                            </motion.div>
                                        );
                                    });
                                });
                            })()}
                        </div>
                    </motion.div>
                </div>
            </header>

            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <span className="text-primary font-bold tracking-widest uppercase text-3xl mb-4 block">Why FitGenix?</span>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-500 mb-6">Not Just Another App.</h2>
                        <p className="text-gray-500 text-lg max-w-2xl mx-auto">We use advanced Llama-3 AI models to analyze your lifestyle and create plans that actually stick.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Card 1 */}
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all border border-gray-100"
                        >
                            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-6">
                                <FaBrain />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Neural AI Coaching</h3>
                            <p className="text-gray-500 leading-relaxed">
                                Our chatbot understands context. Ask "I have back pain, what should I avoid?" and get medically-sound (general) advice instantly.
                            </p>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -10 }}
                            className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all border border-gray-100 relative overflow-hidden"
                        >
                            <div className="w-16 h-16 bg-orange-50 text-primary rounded-2xl flex items-center justify-center text-3xl mb-6">
                                <FaDumbbell />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Adaptive Workouts</h3>
                            <p className="text-gray-500 leading-relaxed">
                                Whether you have a full gym or just open floor space, we generate the perfect routine for your available equipment.
                            </p>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -10 }}
                            className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all border border-gray-100"
                        >
                            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center text-3xl mb-6">
                                <FaCarrot />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Macro Precision</h3>
                            <p className="text-gray-500 leading-relaxed">
                                Snap a photo or type a meal, and we'll break down the protein, carbs, and fats instantly. No more guessing.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="py-24 px-6 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black text-gray-900">Real Stories, Real Results</h2>
                        <div className="w-24 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {reviews.map((review, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-gray-50 p-8 rounded-3xl relative"
                            >
                                <div className="flex text-yellow-500 mb-4">
                                    {[...Array(5)].map((_, i) => <span key={i}>★</span>)}
                                </div>
                                <p className="text-gray-600 italic mb-6">"{review.text}"</p>
                                <div className="flex items-center gap-4">
                                    <img src={review.img} alt={review.name} className="w-12 h-12 rounded-full object-cover" />
                                    <div>
                                        <h4 className="font-bold text-gray-900">{review.name}</h4>
                                        <p className="text-xs text-gray-500">{review.role}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-24 px-6 bg-white">
                <div className="max-w-7xl mx-auto border border-gray-200 rounded-[3rem] p-12 md:p-20 flex flex-col md:flex-row items-center justify-between gap-12 bg-gray-50 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                    <div className="max-w-2xl relative z-10">
                        <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
                            Unlock Your <br />
                            <span className="text-primary">Best Self.</span>
                        </h2>
                        <p className="text-xl text-gray-600 mb-8 font-light">
                            Join thousands of users who have transformed their lives with our intelligent, adaptive fitness technology. Start your journey today.
                        </p>
                        <div className="flex items-center gap-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleStart}
                                className="bg-gray-900 text-white font-bold text-xl py-4 px-10 rounded-full hover:bg-black transition-all shadow-xl shadow-gray-900/20"
                            >
                                Get Started Now
                            </motion.button>
                        </div>
                    </div>

                    <div className="relative w-full md:w-1/3 aspect-square max-w-sm">
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary to-yellow-400 rounded-full opacity-20 blur-2xl animate-pulse"></div>
                        <img
                            src="https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=600&auto=format&fit=crop"
                            alt="Success"
                            className="w-full h-full object-cover rounded-3xl shadow-2xl transform rotate-3 hover:rotate-0 transition-all duration-500"
                        />
                    </div>
                </div>
            </section>

            <footer className="bg-white border-t border-gray-100 py-12 text-center text-gray-500 text-sm">
                <div className="flex justify-center gap-6 mb-8 text-2xl text-gray-400">
                    <i className="hover:text-primary cursor-pointer transition-colors">Instagram</i>
                    <i className="hover:text-primary cursor-pointer transition-colors">Twitter</i>
                    <i className="hover:text-primary cursor-pointer transition-colors">YouTube</i>
                </div>
                <p>&copy; 2026 FitGenix Inc. Engineered for Human Potential.</p>
            </footer>

        </div >
    );
};

export default LandingPage;
