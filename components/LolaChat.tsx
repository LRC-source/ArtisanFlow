import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Minimize2, Sparkles } from 'lucide-react';
import { chatWithLola } from '../services/geminiService';
import { COLORS } from '../constants';
import { GlassHaloIcon } from './ui/GlassHaloIcon';

export const LolaChat: React.FC = () => { 
  const [isOpen, setIsOpen] = useState(false); 
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', text: string}[]>([ 
    { role: 'assistant', text: 'Hello! I am Lola, your Systems Architect. How can I assist you today?' } 
  ]); 
  const [input, setInput] = useState(''); 
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => { 
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);
    
    try {
      const response = await chatWithLola(userMsg);
      setMessages(prev => [...prev, { role: 'assistant', text: response.text }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', text: 'I encountered a connection error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) { 
    return ( 
      <button 
        onClick={() => setIsOpen(true)} 
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full flex items-center justify-center transition-all z-50 animate-float p-[1.5px] bg-gradient-to-r from-[#06B6D4] via-[#A855F7] via-[#D946EF] to-[#C5A059] shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:shadow-[0_0_50px_rgba(168,85,247,0.6)] hover:scale-105"
      >
         <div className="w-full h-full bg-[#0A0A0A] rounded-full flex items-center justify-center relative overflow-hidden">
            <span className="absolute inset-0 bg-gradient-to-r from-[#06B6D4] to-[#C5A059] opacity-20 blur-md"></span>
            <MessageSquare size={24} className="text-white relative z-10" />
         </div>
      </button> 
    ); 
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-black/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden z-50 animate-in slide-in-from-bottom-10 shadow-[0_0_40px_rgba(0,0,0,0.8)]">
      <div className="bg-white/5 p-5 border-b border-white/10 flex justify-between items-center">
        <div className="flex items-center gap-3">
            <GlassHaloIcon icon={Sparkles} color="cyan" size="sm" className="animate-pulse" />
            <div>
                <h3 className="font-serif font-bold text-white tracking-tight text-lg leading-tight">Lola AI</h3>
                <p className="text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-[#06B6D4]">Systems Architect</p>
            </div>
        </div>
        <div className="flex space-x-2">
            <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full">
                <Minimize2 size={16} />
            </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-[1.5rem] text-[13px] font-sans leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-gradient-to-r from-[#06B6D4] to-[#A855F7] text-white rounded-br-sm shadow-[0_0_15px_rgba(6,182,212,0.3)]' 
                : 'bg-white/5 text-white/90 rounded-bl-sm border border-white/10 backdrop-blur-md shadow-inner'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/5 text-white/40 p-4 rounded-[1.5rem] rounded-bl-sm border border-white/10 text-xs italic font-sans flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] animate-bounce"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#A855F7] animate-bounce delay-75"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-bounce delay-150"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      <div className="sticky bottom-0 z-50 md:static p-4 border-t border-white/10 bg-[#0A0A0A]/90 md:bg-white/5 backdrop-blur-xl md:backdrop-blur-none">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Lola about inventory..."
            className="flex-1 bg-black/50 border border-white/10 rounded-full px-5 py-3 text-white text-[13px] font-sans focus:border-[#06B6D4]/50 focus:shadow-[0_0_10px_rgba(6,182,212,0.2)] outline-none transition-all placeholder:text-white/30"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading}
            className="w-12 h-12 rounded-full flex items-center justify-center p-[1px] bg-gradient-to-r from-[#06B6D4] to-[#A855F7] disabled:opacity-50 hover:scale-105 transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)]"
          >
            <div className="w-full h-full bg-[#0A0A0A] rounded-full flex items-center justify-center">
                <Send size={16} className="text-white ml-1" />
            </div>
          </button>
        </div>
      </div>
    </div>
  ); 
};
