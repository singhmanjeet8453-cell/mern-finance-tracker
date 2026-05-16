import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Sparkles, Send, Bot, User as UserIcon, Lightbulb, Zap, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AIInsights = () => {
  const [insights, setInsights] = useState([]);
  const [chat, setChat] = useState([{ sender: 'ai', text: 'Hello! I am your AI financial assistant. Ask me for saving tips or budget advice.' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const SUGGESTIONS = [
    { icon: <TrendingUp size={16} />, text: 'How to reduce expenses?' },
    { icon: <Zap size={16} />, text: 'Tips for saving 20% of salary' },
    { icon: <Lightbulb size={16} />, text: 'Explain the 50/30/20 rule' }
  ];

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const API_BASE_URL = import.meta.env.PROD ? '' : 'http://localhost:5000';
        const res = await axios.get(`${API_BASE_URL}/api/ai/insights`);
        setInsights(res.data.insights);
      } catch (err) {
        console.error(err);
      }
    };
    fetchInsights();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  const handleSend = async (e, customText = null) => {
    e?.preventDefault();
    const textToSend = customText || input;
    if (!textToSend.trim()) return;
    
    setChat([...chat, { sender: 'user', text: textToSend }]);
    if (!customText) setInput('');
    setLoading(true);

    try {
      const API_BASE_URL = import.meta.env.PROD ? '' : 'http://localhost:5000';
      const res = await axios.post(`${API_BASE_URL}/api/ai/chat`, { message: textToSend });
      setChat(prev => [...prev, { sender: 'ai', text: res.data.reply }]);
    } catch (err) {
      setChat(prev => [...prev, { sender: 'ai', text: 'Sorry, I am having trouble connecting right now.' }]);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
      
      {/* Insights Panel */}
      <motion.div variants={itemVariants} className="xl:col-span-1 space-y-6 flex flex-col h-[400px] xl:h-auto">
        <div>
          <h1 className="text-3xl font-display font-bold text-white flex items-center gap-3">
            <span className="p-2 bg-primary/20 text-primary rounded-xl"><Sparkles size={24}/></span> 
            Smart Insights
          </h1>
          <p className="text-textMuted mt-2">AI-driven analysis of your spending</p>
        </div>
        
        <div className="glass rounded-2xl p-6 flex-1 overflow-y-auto space-y-4">
          <AnimatePresence>
            {insights.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center text-center p-6 border border-dashed border-white/10 rounded-xl bg-card/20">
                <Sparkles className="text-primary/50 mb-3" size={32} />
                <p className="text-textMuted font-medium">Analyzing your financial data to generate personalized insights...</p>
              </motion.div>
            ) : (
              insights.map((insight, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-5 bg-card/40 border border-white/5 rounded-xl flex items-start gap-4 hover:bg-white/5 hover:border-white/10 transition-all group shadow-sm"
                >
                  <div className="mt-0.5 w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Sparkles size={16}/>
                  </div>
                  <p className="text-sm leading-relaxed text-white/90">{insight}</p>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Chatbot Interface */}
      <motion.div variants={itemVariants} className="xl:col-span-2 glass rounded-2xl flex flex-col overflow-hidden border border-white/5 shadow-2xl relative">
        {/* Chat Header */}
        <div className="p-5 border-b border-white/5 bg-card/50 flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <Bot size={24}/>
          </div>
          <div>
            <h2 className="font-display font-bold text-lg text-white">Financial Assistant</h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
              <p className="text-xs font-medium text-success">Online & Ready to Help</p>
            </div>
          </div>
        </div>
        
        {/* Chat Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 relative z-10 scroll-smooth">
          <AnimatePresence>
            {chat.map((msg, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-end gap-3 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-md ${msg.sender === 'user' ? 'bg-gradient-to-br from-blue-400 to-primary text-white' : 'bg-card border border-white/10 text-primary'}`}>
                    {msg.sender === 'user' ? <UserIcon size={18}/> : <Bot size={18}/>}
                  </div>
                  <div className={`p-4 rounded-2xl shadow-sm ${msg.sender === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-card border border-white/5 text-white/90 rounded-bl-none'}`}>
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="flex items-end gap-3 max-w-[80%]">
                <div className="w-9 h-9 rounded-full bg-card border border-white/10 text-primary flex items-center justify-center shadow-md">
                  <Bot size={18}/>
                </div>
                <div className="px-5 py-4 bg-card rounded-2xl rounded-bl-none border border-white/5">
                  <div className="flex gap-1.5">
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-2 h-2 rounded-full bg-primary/60"></motion.div>
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-2 h-2 rounded-full bg-primary/60"></motion.div>
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-2 h-2 rounded-full bg-primary/60"></motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Suggestions & Input Area */}
        <div className="p-4 border-t border-white/5 bg-card/40 relative z-10 flex flex-col gap-3">
          {/* Quick Suggestions */}
          {!loading && chat.length < 5 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {SUGGESTIONS.map((sug, i) => (
                <button 
                  key={i} 
                  onClick={() => handleSend(null, sug.text)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/30 rounded-lg text-xs font-medium text-textMuted hover:text-white transition-all"
                >
                  <span className="text-primary">{sug.icon}</span> {sug.text}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={e => handleSend(e)} className="flex gap-3">
            <input 
              type="text" 
              placeholder="Ask anything about your finances..." 
              className="flex-1 bg-background border border-white/10 rounded-xl px-5 py-3.5 text-sm text-white placeholder:text-textMuted outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-inner transition-all"
              value={input}
              onChange={e => setInput(e.target.value)}
            />
            <button 
              disabled={loading || !input.trim()} 
              type="submit" 
              className="bg-primary hover:bg-primary/90 text-white disabled:opacity-50 disabled:cursor-not-allowed p-3.5 rounded-xl transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 flex items-center justify-center hover:scale-105 active:scale-95"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </motion.div>

    </motion.div>
  );
};

export default AIInsights;
