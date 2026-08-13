import React from 'react';
import { useArtisanData } from './DataContext';
import { Button } from './UI';
import { Sparkles, ChevronRight, ChevronLeft, X, LayoutDashboard, Boxes, ShoppingBag, Target, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const STEPS = [
  {
    title: "Welcome, Architect",
    desc: "Greetings from the LRC Artisan Flow team. Let's briefly walk through your new high-precision command center.",
    icon: Sparkles,
    route: "/"
  },
  {
    title: "Synaptic Path",
    desc: "This is your Overview. Lola AI synthesizes real-time metrics to show you exactly where your business stands at any given moment.",
    icon: LayoutDashboard,
    route: "/command-center"
  },
  {
    title: "Resource Hub",
    desc: "Your Inventory Vault. Track raw materials and finished goods with surgical precision. This is where your material burn rates are calculated.",
    icon: Boxes,
    route: "/inventory"
  },
  {
    title: "Manufacturing Control",
    desc: "Process omnichannel orders and sync with platforms like Shopify or WooCommerce. Our Synaptic Handshake ensures data integrity across every node.",
    icon: ShoppingBag,
    route: "/operations/orders"
  },
  {
    title: "Marketing Studio",
    desc: "Generate AI-powered copy, visual assets, and comprehensive strategies designed to capitalize on your current stock levels.",
    icon: Target,
    route: "/marketing"
  },
  {
    title: "Budget Guard™",
    desc: "Your financial steering wheel. Set targets and let AI analyze your cash flow to suggest optimal resource reallocation.",
    icon: ShieldCheck,
    route: "/finance/budget-guard"
  }
];

export const TutorialOverlay: React.FC = () => {
  const { isTutorialActive, tutorialStep, setTutorialStep, completeTutorial } = useArtisanData();
  const navigate = useNavigate();

  if (!isTutorialActive) return null;

  const currentStep = STEPS[tutorialStep];
  const isLast = tutorialStep === STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      completeTutorial();
    } else {
      const nextStep = tutorialStep + 1;
      setTutorialStep(nextStep);
      navigate(STEPS[nextStep].route);
    }
  };

  const handlePrev = () => {
    if (tutorialStep > 0) {
      const prevStep = tutorialStep - 1;
      setTutorialStep(prevStep);
      navigate(STEPS[prevStep].route);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center md:items-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-stone-200 relative animate-in zoom-in slide-up">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-stone-100">
            <div 
                className="h-full bg-[#6A2C91] transition-all duration-500" 
                style={{ width: `${((tutorialStep + 1) / STEPS.length) * 100}%` }}
            />
        </div>

        <button 
          onClick={completeTutorial} 
          className="absolute top-6 right-6 p-2 text-stone-300 hover:text-red-500 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="p-4 sm:p-10 space-y-8">
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-[#6A2C91] shadow-inner">
                    <currentStep.icon size={32} />
                </div>
                <div>
                    <p className="text-[10px] font-black text-[#C5A059] uppercase tracking-[0.3em]">Synaptic Onboarding</p>
                    <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">{currentStep.title}</h2>
                </div>
            </div>

            <p className="text-gray-500 text-lg leading-relaxed font-medium">
                {currentStep.desc}
            </p>

            <div className="flex items-center justify-between pt-6">
                <div className="flex gap-1.5">
                    {STEPS.map((_, i) => (
                        <div 
                            key={i} 
                            className={`w-2 h-2 rounded-full transition-all ${i === tutorialStep ? 'w-6 bg-[#6A2C91]' : 'bg-stone-200'}`}
                        />
                    ))}
                </div>
                <div className="flex gap-3">
                    {tutorialStep > 0 && (
                        <Button 
                            variant="outline" 
                            onClick={handlePrev} 
                            className="h-12 px-6 rounded-2xl font-black text-[10px] uppercase tracking-widest border-stone-200 text-stone-400 hover:text-gray-900"
                        >
                            <ChevronLeft size={16} /> BACK
                        </Button>
                    )}
                    <Button 
                        onClick={handleNext} 
                        className="h-12 px-10 rounded-2xl bg-[#6A2C91] text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-purple-100 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
                    >
                        {isLast ? "INITIALIZE SYSTEM" : "NEXT NODE"} <ChevronRight size={16} />
                    </Button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
