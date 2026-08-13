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
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 rounded-xl bg-[#C5A059]/10 flex items-center justify-center border border-[#C5A059]/30">
              <Layers className="text-[#C5A059]" size={24} />
            </div>
            <span className="font-serif text-2xl tracking-tight text-white">Artisan<span className="text-[#C5A059]">Flow</span></span>
          </div>
          
          <div className="flex items-center gap-6">
            <Button variant="ghost" className="text-white/70 hover:text-white uppercase tracking-widest text-xs" onClick={() => navigate('/auth')}>
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
      <footer className="border-t border-white/10 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <Layers className="text-white/30" size={20} />
            <span className="font-serif text-lg text-white/50">ArtisanFlow</span>
          </div>
          <div className="flex gap-6 text-sm font-sans font-light text-white/40">
            <span className="hover:text-white cursor-pointer transition-colors" onClick={() => navigate('/terms')}>Terms & Conditions</span>
            <span className="hover:text-white cursor-pointer transition-colors" onClick={() => navigate('/privacy')}>Privacy Policy</span>
          </div>
          <p className="text-xs text-white/30 font-sans tracking-wider">© 2026 ArtisanFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
