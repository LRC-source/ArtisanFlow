import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ArrowRight, X } from 'lucide-react';
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
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-[#0A0A0A] border border-white/10 rounded-[2rem] p-8 sm:p-12 shadow-2xl overflow-hidden"
        >
          <button onClick={onClose} className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors">
            <X size={24} />
          </button>
          
          <div className="mb-8 flex justify-center">
            <div className="w-20 h-20 bg-[#6A2C91]/20 border border-[#6A2C91]/30 rounded-2xl flex items-center justify-center">
              <Lock size={32} className="text-[#C5A059]" />
            </div>
          </div>
          
          <h2 className="text-3xl font-serif text-white tracking-tight text-center mb-4">
            Capacity Reached
          </h2>
          
          <p className="text-white/60 font-sans text-sm leading-relaxed text-center mb-8">
            You have reached your limit of <strong className="text-white">{currentLimit} {featureName}</strong> on your current tier. 
            Upgrade to <strong className="text-[#C5A059]">{requiredTier}</strong> to unlock higher capacities and advanced business capabilities.
          </p>
          
          <div className="flex flex-col gap-4">
            <Button 
              variant="premium" 
              onClick={() => { onClose(); navigate('/settings/subscription'); }}
              className="w-full h-14 font-black tracking-widest text-[11px]"
            >
              UPGRADE SUBSCRIPTION <ArrowRight size={16} className="ml-2" />
            </Button>
            <Button 
              variant="ghost" 
              onClick={onClose}
              className="w-full h-14 text-white/50 hover:text-white uppercase tracking-widest text-[11px]"
            >
              Not Now
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
