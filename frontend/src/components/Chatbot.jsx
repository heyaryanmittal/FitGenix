import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dumbbell, Send, X, Sparkles, Bot, Trash2 } from 'lucide-react';
import axios from 'axios';
import API_URL from '../apiConfig';
import { Button } from './ui/button';
import { Input } from './ui/input';

const SUGGESTIONS = [
    { label: "⚡ Today's Analysis", query: "Can you analyze my daily fitness, calorie, and water progress?" },
    { label: "💪 4-Day Workout Split", query: "Can you give me a simple 4-day workout split for muscle building?" },
    { label: "🥗 High Protein Foods", query: "What are the top 5 high-protein foods for muscle recovery?" },
    { label: "🔥 Calorie Deficit Tips", query: "How do I safely maintain a calorie deficit to lose fat?" },
    { label: "💧 Daily Water Goal", query: "How much water should I drink daily for optimal fitness?" },
    { label: "🧘 Post-Workout Stretch", query: "Give me a quick 5-minute post-workout cooldown routine." }
];

// Custom Formatted Text Component for Bullet Points & Bold Styling
const FormattedMessage = ({ text }) => {
    if (!text) return null;

    // Split text into paragraphs by newline
    const lines = text.split('\n').filter(line => line.trim() !== '');

    return (
        <div className="space-y-1.5">
            {lines.map((line, lineIdx) => {
                const trimmed = line.trim();

                // Check if line is a bullet point or numbered item
                const isBullet = trimmed.startsWith('-') || trimmed.startsWith('•') || trimmed.startsWith('*');
                const isNumbered = /^\d+\./.test(trimmed);

                // Clean the prefix if it's a bullet
                const cleanContent = isBullet
                    ? trimmed.replace(/^[-•*]\s*/, '')
                    : isNumbered
                        ? trimmed.replace(/^\d+\.\s*/, '')
                        : trimmed;

                // Helper to format **bold** text inside a line
                const renderInline = (str) => {
                    const parts = str.split(/(\*\*.*?\*\*)/g);
                    return parts.map((part, pIdx) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                            return (
                                <strong key={pIdx} className="font-semibold text-slate-900 dark:text-white">
                                    {part.slice(2, -2)}
                                </strong>
                            );
                        }
                        return part;
                    });
                };

                if (isBullet) {
                    return (
                        <div key={lineIdx} className="flex items-start gap-2 my-1 pl-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                            <span className="text-slate-700 dark:text-slate-200 leading-relaxed">{renderInline(cleanContent)}</span>
                        </div>
                    );
                }

                if (isNumbered) {
                    const matchNum = trimmed.match(/^(\d+)\./);
                    const num = matchNum ? matchNum[1] : lineIdx + 1;
                    return (
                        <div key={lineIdx} className="flex items-start gap-2 my-1 pl-1">
                            <span className="text-[10px] font-bold text-orange-500 bg-orange-100 dark:bg-orange-950/60 dark:text-orange-400 rounded-full w-4 h-4 flex items-center justify-center shrink-0 mt-0.5 font-mono">
                                {num}
                            </span>
                            <span className="text-slate-700 dark:text-slate-200 leading-relaxed">{renderInline(cleanContent)}</span>
                        </div>
                    );
                }

                return (
                    <p key={lineIdx} className="text-slate-700 dark:text-slate-200 leading-relaxed">
                        {renderInline(trimmed)}
                    </p>
                );
            })}
        </div>
    );
};

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            text: "Hello! I am **FitGenix AI**, your personal health & fitness coach. 🦾\n\nAsk me anything about your workouts, diet macros, fat loss, or recovery goals!"
        }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const toggleChat = () => setIsOpen(prev => !prev);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const sendMessage = async (textToSend) => {
        const query = textToSend || input;
        if (!query.trim() || loading) return;

        const userMessage = { role: 'user', text: query };
        setMessages(prev => [...prev, userMessage]);
        if (!textToSend) setInput("");
        setLoading(true);

        try {
            const response = await axios.post(`${API_URL}/api/chatbot`, { message: query });
            const aiMessage = { role: 'assistant', text: response.data.reply };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages(prev => [
                ...prev,
                { role: 'assistant', text: "Sorry, I'm having trouble connecting right now. Please check your backend connection." }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        sendMessage();
    };

    const clearChat = () => {
        setMessages([
            {
                role: 'assistant',
                text: "Chat cleared! How can I assist with your health and fitness today? 🏋️"
            }
        ]);
    };

    return (
        <div className="relative z-[9999]">
            {/* Minimalist Floating Trigger Button */}
            <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                className="fixed bottom-6 right-6 bg-gradient-to-tr from-orange-600 via-amber-500 to-orange-400 text-white p-3.5 rounded-2xl shadow-xl shadow-orange-500/30 z-[9999] flex items-center justify-center border border-white/20 backdrop-blur-md cursor-pointer"
                onClick={toggleChat}
                aria-label="Toggle FitGenix AI Coach"
            >
                <div className="relative flex items-center justify-center">
                    {isOpen ? <X className="w-6 h-6" /> : <Dumbbell className="w-6 h-6" />}
                    {!isOpen && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-900 animate-pulse" />
                    )}
                </div>
            </motion.button>

            {/* Chatbot Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed bottom-[84px] right-4 sm:right-6 w-[92vw] sm:w-[410px] h-[560px] max-h-[75vh] bg-white border border-slate-200 rounded-3xl shadow-2xl z-[9999] flex flex-col overflow-hidden text-slate-800"
                    >
                        {/* Minimalist Header */}
                        <div className="bg-slate-900 px-4 py-3.5 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center shadow-md shadow-orange-500/20">
                                    <Bot className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-sm text-slate-100 font-display tracking-tight">FitGenix AI Coach</h3>
                                        <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[9px] font-medium border border-emerald-500/30 flex items-center gap-1 font-mono">
                                            <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping" /> Online
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                                        <Sparkles className="w-3 h-3 text-amber-400" /> Health & Fitness Assistant
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={clearChat}
                                    title="Clear Chat"
                                    className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={toggleChat}
                                    className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Messages Container */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900 transition-colors">
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[88%] p-3.5 rounded-2xl text-xs ${
                                            msg.role === 'user'
                                                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-br-xs shadow-md shadow-orange-500/15 font-medium'
                                                : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 rounded-bl-xs shadow-sm'
                                        }`}
                                    >
                                        {msg.role === 'user' ? (
                                            <p className="whitespace-pre-wrap">{msg.text}</p>
                                        ) : (
                                            <FormattedMessage text={msg.text} />
                                        )}
                                    </div>
                                </div>
                            ))}

                            {/* Thinking State */}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-bl-xs border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 font-mono">
                                        <Sparkles className="w-4 h-4 text-orange-500 animate-spin" />
                                        <span>Analyzing fitness query...</span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Suggestion Chips */}
                        <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto shrink-0">
                            {SUGGESTIONS.map((item, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => sendMessage(item.query)}
                                    disabled={loading}
                                    className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-orange-50 text-slate-600 hover:text-orange-600 text-[11px] font-medium whitespace-nowrap transition-all border border-slate-200/60 hover:border-orange-200 shrink-0 cursor-pointer"
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>

                        {/* Form Input */}
                        <form onSubmit={handleFormSubmit} className="p-3 bg-white border-t border-slate-100 flex gap-2 shrink-0">
                            <Input
                                type="text"
                                placeholder="Ask about workouts, diet, macros..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                disabled={loading}
                                className="h-10 text-xs bg-slate-50 border-slate-200 focus-visible:ring-orange-500 rounded-xl text-slate-800"
                            />
                            <Button
                                type="submit"
                                disabled={!input.trim() || loading}
                                className="h-10 w-10 p-0 shrink-0 rounded-xl bg-slate-900 hover:bg-orange-600 text-white transition-colors cursor-pointer"
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Chatbot;
