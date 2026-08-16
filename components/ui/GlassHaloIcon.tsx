import React from 'react';

interface GlassHaloIconProps {
  icon: React.ElementType;
  color?: 'cyan' | 'purple' | 'gold' | 'magenta' | 'emerald';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const colorStyles = {
  cyan: {
    bg: 'bg-[#06B6D4]/10',
    border: 'border-[#06B6D4]/30',
    shadow: 'shadow-[0_0_15px_rgba(6,182,212,0.25)]',
    text: 'text-[#06B6D4]',
  },
  purple: {
    bg: 'bg-[#A855F7]/10',
    border: 'border-[#A855F7]/30',
    shadow: 'shadow-[0_0_15px_rgba(168,85,247,0.25)]',
    text: 'text-[#A855F7]',
  },
  gold: {
    bg: 'bg-[#C5A059]/10',
    border: 'border-[#C5A059]/30',
    shadow: 'shadow-[0_0_15px_rgba(197,160,89,0.25)]',
    text: 'text-[#C5A059]',
  },
  magenta: {
    bg: 'bg-[#D946EF]/10',
    border: 'border-[#D946EF]/30',
    shadow: 'shadow-[0_0_15px_rgba(217,70,239,0.25)]',
    text: 'text-[#D946EF]',
  },
  emerald: {
    bg: 'bg-[#10B981]/10',
    border: 'border-[#10B981]/30',
    shadow: 'shadow-[0_0_15px_rgba(16,185,129,0.25)]',
    text: 'text-[#10B981]',
  },
};

const sizeStyles = {
  sm: { container: 'w-8 h-8 rounded-xl', icon: 'w-4 h-4' },
  md: { container: 'w-11 h-11 rounded-2xl', icon: 'w-5 h-5' },
  lg: { container: 'w-14 h-14 rounded-2xl', icon: 'w-7 h-7' },
  xl: { container: 'w-20 h-20 rounded-[2rem]', icon: 'w-10 h-10' },
};

export const GlassHaloIcon: React.FC<GlassHaloIconProps> = ({
  icon: Icon,
  color = 'cyan',
  size = 'md',
  className = '',
}) => {
  const c = colorStyles[color];
  const s = sizeStyles[size];

  return (
    <div
      className={`relative flex items-center justify-center shrink-0 border backdrop-blur-md transition-all duration-300 ${s.container} ${c.bg} ${c.border} ${c.shadow} ${className}`}
    >
      <Icon className={`${s.icon} ${c.text}`} />
    </div>
  );
};
