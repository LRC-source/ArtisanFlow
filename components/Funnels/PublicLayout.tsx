import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers } from 'lucide-react';
import { Button } from '../UI';

export const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#C5A059] selection:text-black">
      {/* Global Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex flex-col sm:flex-col sm:flex-col sm:flex-row items-start sm:items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#C5A059]/10 flex items-center justify-center border border-[#C5A059]/30">
              <Layers className="text-[#C5A059]" size={24} />
            </div>
            <span className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">Artisan<span className="text-[#C5A059]">Flow</span></span>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-4">
            <Button variant="ghost" className="text-white sm:text-white/70 hover:text-white uppercase tracking-widest text-xs hidden sm:block" onClick={() => navigate('/auth')}>
              Login
            </Button>
            <Button variant="premium" className="px-6 rounded-full uppercase tracking-widest text-xs font-bold" onClick={() => navigate('/auth')}>
              Start Free Audit
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20">
        {children}
      </main>

      {/* Global Footer */}
      <footer className="border-t border-white/10 py-6 sm:py-12 lg:py-16 px-4 sm:px-8 mt-8 sm:mt-12 lg:mt-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex items-center gap-3">
              <Layers className="text-white/30" size={24} />
              <span className="font-serif text-xl font-bold text-white sm:text-white/50">ArtisanFlow</span>
            </div>
            <p className="text-sm sm:text-base text-white sm:text-white/40 leading-relaxed">The operating system for master artisans. Standardize recipes, manage inventory, and scale your brand.</p>
          </div>
          
          <div className="flex flex-col gap-3 text-sm text-white sm:text-white/60">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Platform</h4>
            <span className="hover:text-white cursor-pointer transition-colors" onClick={() => navigate('/features')}>Features</span>
            <span className="hover:text-white cursor-pointer transition-colors" onClick={() => navigate('/pricing')}>Pricing</span>
            <span className="hover:text-white cursor-pointer transition-colors" onClick={() => navigate('/makers')}>Makers</span>
          </div>

          <div className="flex flex-col gap-3 text-sm text-white sm:text-white/60">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Legal</h4>
            <span className="hover:text-white cursor-pointer transition-colors" onClick={() => navigate('/terms')}>Terms & Conditions</span>
            <span className="hover:text-white cursor-pointer transition-colors" onClick={() => navigate('/privacy')}>Privacy Policy</span>
          </div>

          <div className="flex flex-col gap-3 sm:gap-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Subscribe</h4>
            <div className="flex flex-col gap-2">
              <input type="email" placeholder="Email Address" className="h-10 text-sm px-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#C5A059]" />
              <button className="h-10 py-2 px-4 text-sm w-full bg-[#C5A059] text-black font-semibold rounded-lg hover:bg-[#b08e4d] transition-all">Subscribe</button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/10 text-center">
          <p className="text-sm sm:text-base text-white sm:text-white/40">© 2026 ArtisanFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
