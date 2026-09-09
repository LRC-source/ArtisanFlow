import React from 'react';
import { useArtisanData } from './DataContext';
import { Button } from './UI';
import { Sparkles, ChevronRight, ChevronLeft, X, LayoutDashboard, Boxes, ShoppingBag, Target, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const STEPS = [
  {
    title: "Welcome to Artisan Flow",
    desc: "Let's take a quick tour of your new workspace and see how everything connects.",
    icon: Sparkles,
    route: "/"
  },
  {
    title: "Dashboard",
    desc: "See a real-time overview of your business metrics and quickly access your most important tools.",
    icon: LayoutDashboard,
    route: "/command-center"
  },
  {
    title: "Inventory",
    desc: "Track your raw materials and finished goods, and see exactly what you need to reorder.",
    icon: Boxes,
    route: "/inventory"
  },
  {
    title: "Orders",
    desc: "Process customer orders and sync them with your storefront like Shopify or WooCommerce.",
    icon: ShoppingBag,
    route: "/operations/orders"
  },
  {
    title: "Marketing",
    desc: "Generate AI-powered copy, emails, and social media posts for your products.",
    icon: Target,
    route: "/marketing"
  },
  {
    title: "Profit Guard",
    desc: "Set financial targets and track your cash flow to ensure your business stays profitable.",
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
    <div className="fixed inset-0 z-[100] pointer-events-none flex items-start justify-end p-4 sm:p-6 sm:pt-20 pt-20">
      <div className="bg-white pointer-events-auto rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden border border-stone-200 relative animate-in slide-in-from-right-8 fade-in duration-300">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-stone-100">
            <div 
                className="h-full bg-[#6A2C91] transition-all duration-500" 
                style={{ width: `${((tutorialStep + 1) / STEPS.length) * 100}%` }}
            />
        </div>

        <button 
          onClick={completeTutorial} 
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-red-500 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="p-6 space-y-6">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-[#6A2C91] shadow-inner shrink-0">
                    <currentStep.icon size={20} />
                </div>
                <div>
                    <p className="text-[9px] font-black text-[#C5A059] uppercase tracking-widest">Quick Tour</p>
                    <h2 className="text-xl font-black font-serif text-gray-900">{currentStep.title}</h2>
                </div>
            </div>
            
            <p className="text-sm text-gray-600 leading-relaxed font-medium">
                {currentStep.desc}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                <button 
                  onClick={handlePrev}
                  disabled={tutorialStep === 0}
                  className={`text-xs font-bold uppercase tracking-widest flex items-center gap-1 transition-colors ${tutorialStep === 0 ? 'text-stone-300 cursor-not-allowed' : 'text-stone-500 hover:text-[#6A2C91]'}`}
                >
                    <ChevronLeft size={16} /> Back
                </button>
                <div className="flex gap-1.5">
                    {STEPS.map((_, i) => (
                        <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i === tutorialStep ? 'bg-[#6A2C91] w-4' : 'bg-stone-200'}`} />
                    ))}
                </div>
                <Button 
                    onClick={handleNext} 
                    className="w-auto py-2 px-6 rounded-2xl bg-[#6A2C91] text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-purple-100 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
                >
                    {isLast ? "GET STARTED" : "NEXT"} <ChevronRight size={16} />
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
};
