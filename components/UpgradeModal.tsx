import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ArrowRight, X, TrendingUp, ShieldCheck, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from './UI';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
  currentLimit: number | string;
  requiredTier?: string;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ 
  isOpen, 
  onClose, 
  featureName, 
  currentLimit,
  requiredTier = "Artisan Flow Basic"
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
          onClick={onClose}
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-black/60 border border-white/10 rounded-[3rem] p-8 sm:p-12 shadow-[0_0_50px_rgba(106,44,145,0.15)] overflow-hidden backdrop-blur-3xl"
        >
          {/* Background Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A059] opacity-[0.03] rounded-bl-full -mr-20 -mt-20"></div>

          <button onClick={onClose} className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors z-10">
            <X size={24} />
          </button>
          
          <div className="relative z-10">
            <div className="mb-10 flex items-center gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-[#6A2C91]/30 to-[#C5A059]/20 border border-white/10 rounded-2xl flex items-center justify-center shadow-inner">
                <Lock size={32} className="text-[#C5A059]" />
              </div>
              <div>
                <h2 className="text-4xl font-serif text-white tracking-tight mb-2">
                  System Architecture Locked
                </h2>
                <p className="text-[11px] text-white/40 font-sans font-bold uppercase tracking-[0.3em]">Tier Limit Reached</p>
              </div>
            </div>
            
            <p className="text-white/60 font-sans text-sm leading-relaxed mb-10">
              You have reached your vault limit of <strong className="text-white">{currentLimit} {featureName}</strong>. 
              Upgrade to <strong className="text-[#C5A059]">{requiredTier}</strong> to unlock infinite scaling capacity and automated profit protection.
            </p>

            {/* ROI Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center shadow-sm">
                    <TrendingUp size={24} className="text-emerald-400 mx-auto mb-3" />
                    <p className="text-white text-xl font-serif mb-1">+24%</p>
                    <p className="text-white/30 text-[9px] uppercase tracking-widest font-bold">Avg. Margin Increase</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center shadow-sm border-t-2 border-t-[#C5A059]">
                    <ShieldCheck size={24} className="text-[#C5A059] mx-auto mb-3" />
                    <p className="text-white text-xl font-serif mb-1">Infinite</p>
                    <p className="text-white/30 text-[9px] uppercase tracking-widest font-bold">Vault Capacity</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center shadow-sm">
                    <Zap size={24} className="text-cyan-400 mx-auto mb-3" />
                    <p className="text-white text-xl font-serif mb-1">24/7</p>
                    <p className="text-white/30 text-[9px] uppercase tracking-widest font-bold">Lola AI Assistance</p>
                </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="ghost" 
                onClick={onClose}
                className="flex-1 h-16 text-white/50 hover:text-white hover:bg-white/5 rounded-full uppercase tracking-[0.2em] text-[11px] font-bold"
              >
                MAINTAIN CURRENT TIER
              </Button>
              <Button 
                variant="primary" 
                onClick={() => { onClose(); navigate('/settings/subscription'); }}
                className="flex-1 h-16 bg-gradient-to-r from-[#C5A059] to-[#b08e4d] hover:from-[#b08e4d] hover:to-[#9c7d42] border-none text-white rounded-full font-black tracking-[0.2em] text-[11px] shadow-[0_0_20px_rgba(197,160,89,0.3)] transition-all"
              >
                UNLOCK {requiredTier.toUpperCase()} <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
