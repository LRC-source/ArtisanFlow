import React, { useState } from 'react';
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
  const [isStarred, setIsStarred] = useState(false);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const handleStar = () => {
    setIsStarred(!isStarred);
    toast.success(isStarred ? "Removed from favorites" : "Added to favorites");
  };

  return (
    <div className="mb-6 sm:mb-12">
      <div className="flex flex-col md:flex-col sm:flex-col sm:flex-row md:items-end justify-between gap-3 sm:gap-6">
        <div className="space-y-4">
          {/* Back Button & Parent Context */}
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={handleBack}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white sm:text-gray-400 hover:text-[#6A2C91] transition-colors group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to {parentTitle || 'Previous'}</span>
          </motion.button>

          {/* Title & Description */}
          <div className="hidden sm:block space-y-2">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm sm:text-base md:text-3xl sm:text-5xl lg:text-7xl font-black sm:text-4xl lg:text-5xl text-white font-bold leading-tight" 
              style={{ fontFamily: '"Playfair Display", serif', letterSpacing: '-0.02em', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
            >
              {title}
            </motion.h1>
            {description && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-white sm:text-gray-400 text-sm max-w-2xl leading-relaxed font-medium"
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
          className="hidden sm:flex items-center gap-3"
        >
          {actions}
          <div className="flex items-center gap-2 ml-2 pl-4 border-l border-white/10">
            <button 
                onClick={handleStar} 
                className={`p-3 rounded-2xl border border-white/10 transition-all shadow-sm ${isStarred ? 'bg-[#C5A059]/20 text-[#C5A059]' : 'bg-white/5 text-white sm:text-white/40 hover:text-[#C5A059] hover:bg-white/10'}`}
            >
              <Star size={18} fill={isStarred ? "currentColor" : "none"} />
            </button>
            <button 
                onClick={handleShare} 
                className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white sm:text-white/40 hover:text-[#6A2C91] hover:bg-white/10 transition-all shadow-sm"
            >
              <Share2 size={18} />
            </button>
            <button onClick={() => toast.info("More options available in the vault")} className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white sm:text-white/40 hover:text-white hover:bg-white/10 transition-all shadow-sm">
              <MoreHorizontal size={18} />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Decorative Separator */}
      <div className="hidden sm:block mt-10 h-[1px] w-full bg-gradient-to-r from-white/10 via-white/20 to-transparent" />
    </div>
  );
};
