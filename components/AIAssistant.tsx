import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Send, Minimize2, Sparkles, Calendar, Factory, Database, Mic, MicOff, Volume2, VolumeX, Loader2, CheckCircle2, ListTodo, ChevronRight, Zap, Search } from 'lucide-react';
import { useArtisanData } from './DataContext';
import { chatWithLola, generateLolaSpeech } from '../services/geminiService';

type Msg = { 
  role: 'user' | 'assistant', 
  text: string, 
  followUpQuestions?: string[],
  suggestedRoute?: string | null,
  isSlotSelector?: boolean,
  isAuditPrompt?: boolean
};

export const AIAssistant: React.FC = () => { 
  const navigate = useNavigate();
  const { businessProfile, addAppointment, inventory, productionStats, getTotalRevenue, getMarginMetrics, todos, integrations } = useArtisanData();
  const [isOpen, setIsOpen] = useState(false); 
  const [messages, setMessages] = useState<Msg[]>([ 
    { role: 'assistant', text: `Greetings! Lola online. Cognitive nodes multiplexed: Fast, Thinking, Search available. Ask Lola to summarize your margins, check your orders, or brainstorm marketing ideas! ✅`, followUpQuestions: ["Check Margins", "Marketing Ideas?"] } 
  ]); 
  const [input, setInput] = useState(''); 
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isTtsEnabled, setIsTtsEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [mode, setMode] = useState<'fast' | 'deep' | 'search'>('fast');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const recognitionRef = useRef<any>(null);
  const currentAudioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const lastAudioRequestIdRef = useRef<number>(0);

  const totalFinishedStock = inventory.filter(i => i.type === 'finished').reduce((acc, i) => acc + i.stock, 0);
  const { isMarginHealthy, marginMultiplier } = getMarginMetrics();
  const pendingTodos = todos.filter(t => !t.completed).length;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  useEffect(() => {
    return () => {
        currentAudioSourceRef.current?.stop();
        audioContextRef.current?.close();
    };
  }, []);

  const decodeBase64 = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  };

  const playLolaVoice = async (text: string) => {
    if (!isTtsEnabled) return;
    const requestId = ++lastAudioRequestIdRef.current;
    if (currentAudioSourceRef.current) {
        try { currentAudioSourceRef.current.stop(); } catch (e) {}
    }
    setIsSpeaking(true);
    try {
      const base64Audio = await generateLolaSpeech(text);
      if (requestId !== lastAudioRequestIdRef.current) return;
      if (base64Audio) {
        if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        const ctx = audioContextRef.current;
        if (ctx.state === 'suspended') await ctx.resume();
        const audioBuffer = await decodeAudioData(decodeBase64(base64Audio), ctx, 24000, 1);
        if (requestId !== lastAudioRequestIdRef.current) return;
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.onended = () => { if (requestId === lastAudioRequestIdRef.current) setIsSpeaking(false); };
        currentAudioSourceRef.current = source;
        source.start(0);
      } else { setIsSpeaking(false); }
    } catch (e) {
      console.error("Speech synthesis failed", e);
      if (requestId === lastAudioRequestIdRef.current) setIsSpeaking(false);
    }
  };

  const toggleDictation = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => prev + (prev ? ' ' : '') + transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleSend = async (overrideMsg?: string) => { 
    const msgToProcess = overrideMsg || input;
    if (!msgToProcess.trim()) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: msgToProcess }]);
    setIsLoading(true);
    try {
        const snapshot = { 
            inventory, productionStats, 
            totalFinishedUnits: totalFinishedStock,
            isMarginHealthy, marginMultiplier,
            revenue: getTotalRevenue(),
            connectedIntegrations: integrations.filter(i => i.status === 'Connected').map(i => i.name)
        };
        const response = await chatWithLola(msgToProcess, snapshot, mode);
        const assistantMsg: Msg = { 
            role: 'assistant', text: response.text, 
            followUpQuestions: response.followUpQuestions,
            suggestedRoute: response.suggestedRoute
        };
        if (msgToProcess.toLowerCase().includes('wholesale') || msgToProcess.toLowerCase().includes('strategy')) {
            if (marginMultiplier < 2.2 || totalFinishedStock < 50) assistantMsg.isAuditPrompt = true;
            else assistantMsg.isSlotSelector = true;
        }
        setMessages(prev => [...prev, assistantMsg]);
        if (isTtsEnabled) setTimeout(() => playLolaVoice(response.text), 50);
    } catch (error) {
        setMessages(prev => [...prev, { role: 'assistant', text: "Node communication error." }]);
    } finally {
        setIsLoading(false);
    }
  };

  const handleSelectSlot = (time: string, type: string = 'Wholesale Strategy') => {
      const confirmText = `Confirmed for ${time}.`;
      addAppointment({ clientName: 'Wholesale Lead', email: 'lead@artisanflow.ai', date: '2025-12-16', time, type: type as any, status: 'Confirmed' });
      setMessages(prev => [...prev, { role: 'assistant', text: confirmText }]);
      if (isTtsEnabled) playLolaVoice(confirmText);
  };

  if (!isOpen) { 
    return ( 
      <button 
        onClick={() => setIsOpen(true)} 
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#6A2C91] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors z-50 animate-float"
      >
         <MessageSquare size={24} />
         {pendingTodos > 0 && (
             <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#C5A059] rounded-full border-2 border-white flex items-center justify-center text-[10px] font-black animate-pulse">
                 {pendingTodos}
             </div>
         )}
      </button> 
    ); 
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 h-[380px] max-h-[calc(100vh-64px)] bg-black/80 backdrop-blur-3xl border border-white/10 rounded-[2rem] shadow-[0_0_50px_rgba(106,44,145,0.4)] flex flex-col overflow-hidden z-50 animate-in slide-in-from-bottom-10 border-t-4 border-t-[#C5A059]">
      <div className="bg-transparent p-4 flex justify-between items-center relative border-b border-white/10">
        <div className="flex items-center gap-2 pl-2">
            <div className="p-1.5 bg-[#6A2C91]/10 rounded-lg">
                <Database size={14} className="text-[#6A2C91]" />
            </div>
            <h3 className="font-black text-xs tracking-tight flex items-center gap-1 uppercase italic text-white">
                Lola <Sparkles size={10} className="text-[#C5A059]" />
            </h3>
            <div className={`w-2 h-2 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)] ${isSpeaking ? 'bg-amber-400 animate-ping' : 'bg-emerald-500 animate-pulse'} ml-1`}></div>
        </div>
        <div className="flex items-center gap-1.5">
            <button onClick={() => setIsTtsEnabled(!isTtsEnabled)} className={`p-2 rounded-xl transition-all ${isTtsEnabled ? 'bg-[#C5A059] text-black shadow-lg' : 'text-white/40 hover:text-[#C5A059] hover:bg-white/5'}`} title={isTtsEnabled ? "Disable Voice" : "Enable Voice Output"}>
                {isTtsEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
            <button onClick={() => setIsOpen(false)} className="p-2 text-white/40 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"><Minimize2 size={16} /></button>
        </div>
      </div>

      <div className="bg-white/5 p-2 border-b border-white/5 flex justify-center gap-2">
          <button onClick={() => setMode('fast')} className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1 transition-all ${mode === 'fast' ? 'bg-[#6A2C91] text-white' : 'bg-black/50 text-white/50 border border-white/5'}`}>
              <Zap size={10} /> Fast
          </button>
          <button onClick={() => setMode('deep')} className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1 transition-all ${mode === 'deep' ? 'bg-[#C5A059] text-black' : 'bg-black/50 text-white/50 border border-white/5'}`}>
              <Database size={10} /> Think
          </button>
          <button onClick={() => setMode('search')} className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1 transition-all ${mode === 'search' ? 'bg-blue-600 text-white' : 'bg-black/50 text-white/50 border border-white/5'}`}>
              <Search size={10} /> Search
          </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-transparent scrollbar-hide">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[85%] p-3.5 rounded-2xl text-[11px] shadow-sm leading-relaxed group relative ${msg.role === 'user' ? 'bg-[#C5A059] text-black rounded-br-none shadow-[#C5A059]/20 font-medium' : 'bg-white/10 text-white rounded-bl-none border border-white/5'}`}>
              {msg.text}
              {msg.suggestedRoute && (
                  <button onClick={() => { navigate(msg.suggestedRoute!); setIsOpen(false); }} className="mt-3 flex items-center gap-2 w-full py-2 px-3 bg-white border border-purple-200 text-[#6A2C91] rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-purple-50 transition-all shadow-sm">
                      Recommended Task <ChevronRight size={12} />
                  </button>
              )}
              {msg.isAuditPrompt && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
                   <p className="text-[9px] font-black text-amber-800 flex items-center gap-1.5 uppercase tracking-widest"><Factory size={12} /> CAPACITY ALERT</p>
                   <button onClick={() => handleSelectSlot('10:00 AM', 'Manufacturing Audit')} className="w-full bg-[#C5A059] text-white py-2 rounded-lg text-[8px] font-black uppercase tracking-[0.2em] shadow-md shadow-amber-200/50 hover:bg-[#b08e4d] transition-all active:scale-95">Schedule Audit</button>
                </div>
              )}
            </div>
            {msg.role === 'assistant' && msg.followUpQuestions && msg.followUpQuestions.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5 px-1 animate-in fade-in slide-up duration-500">
                    {msg.followUpQuestions.map((q, i) => (
                        <button key={i} onClick={() => handleSend(q)} className="bg-black/40 border border-white/10 text-[9px] font-bold text-white/70 px-3 py-1 rounded-full hover:border-[#C5A059] hover:text-[#C5A059] hover:bg-white/5 transition-all shadow-sm">
                            {q}
                        </button>
                    ))}
                </div>
            )}
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
                <div className="bg-white/5 p-3 rounded-2xl border border-white/10 animate-pulse flex items-center gap-2.5">
                    <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-[#C5A059] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-1.5 h-1.5 bg-[#C5A059] rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                        <div className="w-1.5 h-1.5 bg-[#C5A059] rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
                    </div>
                    <span className="text-[9px] font-black text-[#C5A059] uppercase tracking-[0.2em]">{mode === 'deep' ? 'THINKING...' : 'ANALYZING...'}</span>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 bg-black border-t border-white/10">
        <div className="flex items-center gap-2 bg-white/5 rounded-2xl px-3 py-1.5 border border-white/10 focus-within:border-[#C5A059] focus-within:bg-black focus-within:ring-2 focus-within:ring-[#C5A059]/20 transition-all">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder={isListening ? "Listening..." : "Ask Lola..."} className="flex-1 bg-transparent py-2 text-white text-xs outline-none placeholder:text-white/30 font-bold" />
          <div className="flex items-center gap-1.5">
              <button onClick={toggleDictation} className={`p-2 rounded-xl transition-all ${isListening ? 'bg-emerald-500/20 text-emerald-400 shadow-inner' : 'text-white/40 hover:text-[#C5A059] hover:bg-white/5 shadow-sm border border-transparent hover:border-white/5'}`} title="Voice Input">
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
              <button onClick={() => handleSend()} disabled={isLoading || !input.trim()} className="p-2.5 bg-[#C5A059] text-black rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:hover:scale-100 flex items-center justify-center shadow-lg shadow-[#C5A059]/20" title="Send (Enter)">
                <Send size={14} />
              </button>
          </div>
        </div>
      </div>
    </div>
  ); 
};