import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MoreHorizontal, Share2, Star } from 'lucide-react';
import { toast } from 'sonner';

interface SubPageHeaderProps {
  title: string;
  parentTitle?: string;
  onBack?: () => void;
  actions?: React.ReactNode;
  description?: string;
}

export const SubPageHeader: React.FC<SubPageHeaderProps> = ({ 
  title, 
  parentTitle, 
  onBack, 
  actions,
  description 
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="mb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          {/* Back Button & Parent Context */}
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={handleBack}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-[#6A2C91] transition-colors group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to {parentTitle || 'Previous'}</span>
          </motion.button>

          {/* Title & Description */}
          <div className="space-y-2">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl text-white font-bold leading-tight" 
              style={{ fontFamily: '"Playfair Display", serif', letterSpacing: '-0.02em', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
            >
              {title}
            </motion.h1>
            {description && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-gray-400 text-sm max-w-2xl leading-relaxed font-medium"
              >
                {description}
              </motion.p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-3"
        >
          {actions}
          <div className="flex items-center gap-2 ml-2 pl-4 border-l border-white/10">
            <button onClick={() => toast.info("Star feature coming soon")} className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-[#C5A059] hover:bg-white/10 transition-all shadow-sm">
              <Star size={18} />
            </button>
            <button onClick={() => toast.info("Share feature coming soon")} className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-[#6A2C91] hover:bg-white/10 transition-all shadow-sm">
              <Share2 size={18} />
            </button>
            <button onClick={() => toast.info("More options coming soon")} className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all shadow-sm">
              <MoreHorizontal size={18} />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Decorative Separator */}
      <div className="mt-10 h-[1px] w-full bg-gradient-to-r from-white/10 via-white/20 to-transparent" />
    </div>
  );
};
