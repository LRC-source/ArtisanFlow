import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Minimize2 } from 'lucide-react';
import { chatWithLola } from '../services/geminiService';
import { COLORS } from '../constants';

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
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#FFD700] rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors z-50 animate-float"
      >
         <MessageSquare size={24} className="text-black" />
      </button> 
    ); 
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-[#0A0A0A] border border-gray-800 rounded-xl shadow-2xl flex flex-col overflow-hidden z-50 animate-in slide-in-from-bottom-10">
      <div className="bg-gradient-to-r from-gray-900 to-black p-4 border-b border-white/10 flex justify-between items-center">
        <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-[#FFD700] rounded-full animate-pulse"></div>
            <h3 className="font-bold text-white tracking-widest">LOLA AI</h3>
        </div>
        <div className="flex space-x-2">
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <Minimize2 size={18} />
            </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
              msg.role === 'user' 
                ? 'bg-[#FFD700] text-black rounded-br-none' 
                : 'bg-white/10 text-white rounded-bl-none border border-white/10'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/5 text-gray-400 p-3 rounded-lg text-xs italic">
              Lola is thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about inventory..."
            className="flex-1 bg-black border border-gray-700 rounded-md px-3 py-2 text-white text-sm focus:border-[#FFD700] outline-none"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading}
            className="p-2 bg-[#FFD700] rounded-md hover:bg-white transition-colors disabled:opacity-50"
          >
            <Send size={18} className="text-black" />
          </button>
        </div>
      </div>
    </div>
  ); 
};
