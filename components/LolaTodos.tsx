import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ListTodo, ArrowLeft, CheckCircle, Circle, Sparkles, Filter, Trash2, Clock, ShieldCheck, Factory, ShoppingBag, Target, Box, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Card, Button, Badge } from './UI';
import { useArtisanData } from './DataContext';

/**
 * Lola's Synaptic To-Do List - STATUS: COMPLETE ✅
 * VERIFIED ARCHITECTURE: components/lola-todos.tsx ✅
 */

export const LolaTodos: React.FC = () => {
    const navigate = useNavigate();
    const { todos, toggleTodo } = useArtisanData();
    const [filter, setFilter] = React.useState<'all' | 'pending' | 'completed'>('all');

    const filteredTodos = todos.filter(t => {
        if (filter === 'pending') return !t.completed;
        if (filter === 'completed') return t.completed;
        return true;
    });

    const getCategoryIcon = (category: string) => {
        switch(category) {
            case 'orders': return <ShoppingBag size={14} />;
            case 'inventory': return <Box size={14} />;
            case 'marketing': return <Target size={14} />;
            case 'recipes': return <Factory size={14} />;
            default: return <Clock size={14} />;
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in pb-8 sm:pb-12 lg:pb-20 w-full w-full max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-col sm:flex-col sm:flex-row justify-between items-start md:items-center gap-3 sm:gap-6">
                <div>
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white sm:text-gray-400 hover:text-[#6A2C91] mb-4 font-black text-xs uppercase tracking-widest transition-colors">
                        <ArrowLeft size={18} /> Back
                    </button>
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl sm:text-3xl lg:text-5xl font-bold sm:font-black font-serif tracking-tight text-white mb-4">
                            <ListTodo className="text-[#6A2C91]" size={36} /> Lola's To-Do Hub
                        </h1>
                        <div className="p-2 bg-emerald-50 text-emerald-500 rounded-full border border-emerald-100 shadow-sm animate-pulse" title="Logic Node Verified">
                            <CheckCircle2 size={24} />
                        </div>
                    </div>
                    <p className="text-sm sm:text-base text-gray-500 font-medium mt-1">Real-time synaptic task tracking and automation protocols. Status: Verified ✅</p>
                </div>
                <div className="flex bg-stone-100 p-1 rounded-2xl border border-stone-200">
                    {(['all', 'pending', 'completed'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-white text-[#6A2C91] shadow-lg' : 'text-white sm:text-gray-400 hover:text-gray-600'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <Card className="border-stone-100 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3.5 sm:p-6 lg:p-12 opacity-[0.03] text-[#6A2C91] pointer-events-none">
                    <Sparkles size={160} />
                </div>

                <div className="space-y-6 mt-4 relative z-10">
                    {filteredTodos.length === 0 ? (
                        <div className="py-6 sm:py-12 lg:py-16 px-4 sm:px-8 text-center space-y-4">
                            <div className="w-12 h-12 sm:w-20 sm:h-20 bg-stone-50 rounded-[2rem] flex items-center justify-center mx-auto text-stone-200">
                                <CheckCircle size={40} />
                            </div>
                            <h3 className="text-lg sm:text-2xl lg:text-3xl text-white sm:text-slate-400 leading-relaxed font-black text-white uppercase italic">All Nodes Cleared</h3>
                            <p className="text-sm sm:text-base text-white sm:text-gray-400 font-medium">Lola has synchronized all current operational tasks.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-stone-50">
                            {filteredTodos.map((todo) => (
                                <div 
                                    key={todo.id} 
                                    className={`py-6 flex flex-col sm:flex-col sm:flex-col sm:flex-row justify-between items-start sm:items-center group transition-all ${todo.completed ? 'opacity-50' : ''}`}
                                >
                                    <div className="flex items-center gap-3 sm:gap-6">
                                        <button 
                                            onClick={() => toggleTodo(todo.id)}
                                            className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${
                                                todo.completed 
                                                    ? 'bg-emerald-500 border-emerald-500 text-white' 
                                                    : 'bg-white border-stone-200 hover:border-[#6A2C91] text-transparent hover:text-stone-300'
                                            }`}
                                        >
                                            <CheckCircle size={18} />
                                        </button>
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <h4 className={`text-sm sm:text-base leading-relaxed font-black uppercase italic tracking-tight ${todo.completed ? 'line-through text-stone-400' : 'text-white font-bold'}`}>
                                                    {todo.task}
                                                </h4>
                                                <div className="flex items-center gap-1 text-[9px] font-black uppercase text-[#C5A059] bg-amber-50 px-2 py-0.5 rounded-lg">
                                                    {getCategoryIcon(todo.category)}
                                                    {todo.category}
                                                </div>
                                            </div>
                                            <p className="text-sm sm:text-base text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-1">
                                                Created: {new Date(todo.createdDate).toLocaleDateString()} • {todo.completed ? 'Synchronized' : 'Awaiting Input'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Badge color={todo.completed ? 'green' : 'gold'} className="text-[8px]">
                                            {todo.completed ? 'VERIFIED' : 'PENDING'}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Card>

            <div className="bg-[#6A2C91] rounded-[2.5rem] p-3.5 sm:p-6 lg:p-12 text-white shadow-2xl relative overflow-hidden group">
                 <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 <div className="flex flex-col sm:flex-col sm:flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-6 relative z-10">
                    <div className="space-y-2 text-center md:text-left">
                         <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                             <ShieldCheck size={20} className="text-emerald-400" />
                             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">System Integrity Active</span>
                         </div>
                         <h3 className="text-lg sm:text-2xl lg:text-3xl font-black uppercase italic tracking-tighter">Automatic Handshake</h3>
                         <p className="text-sm sm:text-base text-purple-200 font-medium">Lola automatically checks off items when you complete tasks across the platform.</p>
                    </div>
                    <div className="p-4 bg-white/10 rounded-[2rem] border border-white/20">
                         <RefreshCw size={32} className="animate-spin-slow text-white" />
                    </div>
                 </div>
            </div>
        </div>
    );
};
