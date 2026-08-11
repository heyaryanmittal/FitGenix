import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Send, X, Sparkles, Bot, Cpu } from 'lucide-react';
import axios from 'axios';
import API_URL from '../apiConfig';
import { Button } from './ui/button';
import { Input } from './ui/input';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', text: "Neural link established. I'm FitGenix Cyber Coach. 🦾 Query me for telemetry adjustments, meal macros, or workout execution!" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const toggleChat = () => setIsOpen(!isOpen);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const response = await axios.post(`${API_URL}/api/chatbot`, { message: input });
            const aiMessage = { role: 'assistant', text: response.data.reply };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages(prev => [...prev, { role: 'assistant', text: "Sorry, I'm having trouble connecting to my neural AI core right now. Please try again." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="fixed bottom-6 right-6 bg-gradient-to-r from-orange-600 via-primary to-cyan-400 text-white p-3.5 rounded-2xl shadow-copper-glow z-50 flex items-center justify-center border border-orange-400/50"
                onClick={toggleChat}
            >
                {isOpen ? <X className="w-6 h-6" /> : <Brain className="w-6 h-6" />}
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="fixed bottom-22 right-6 w-80 sm:w-96 h-[520px] bg-[#0D1117] border-2 border-orange-500/40 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden backdrop-blur-2xl"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-orange-600 via-primary to-cyan-500 p-4 text-white flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-black/30 flex items-center justify-center border border-white/20">
                                    <Bot className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm leading-none font-display uppercase tracking-wide">FitGenix Cyber Coach</h3>
                                    <p className="text-[10px] text-white/90 mt-0.5 flex items-center gap-1 font-mono">
                                        <Cpu className="w-3 h-3 text-cyan-300 animate-pulse" /> Telemetry Active
                                    </p>
                                </div>
                            </div>
                            <button onClick={toggleChat} className="text-white/80 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#05070B]">
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[85%] p-3 rounded-2xl text-xs font-medium leading-relaxed font-sans ${
                                            msg.role === 'user'
                                                ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white rounded-br-none shadow-copper-glow-sm'
                                                : 'bg-[#0D1117] text-zinc-100 border border-zinc-800 rounded-bl-none font-mono'
                                        }`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-[#0D1117] p-3 rounded-2xl rounded-bl-none border border-zinc-800 flex items-center gap-1.5 text-xs text-cyan-400 font-mono">
                                        <Sparkles className="w-4 h-4 animate-spin" />
                                        <span>Analyzing telemetry response...</span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Form Input */}
                        <form onSubmit={handleSend} className="p-3 bg-[#0D1117] border-t border-zinc-800 flex gap-2">
                            <Input
                                type="text"
                                placeholder="Query Cyber Core..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="h-10 text-xs bg-[#05070B] font-mono"
                            />
                            <Button type="submit" variant="glow" size="sm" className="h-10 w-10 p-0 shrink-0">
                                <Send className="w-4 h-4" />
                            </Button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Chatbot;
