import React, { useEffect, useState } from 'react';
import { X, CheckCircle, Info, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from './UI';
import { useArtisanData } from './DataContext';

interface ContextualTutorialProps {
    hubId: string;
    title: string;
    description: string;
    steps: string[];
}

export const ContextualTutorialModal: React.FC<ContextualTutorialProps> = ({ hubId, title, description, steps }) => {
    const { onboardingState, markHubVisited, businessProfile } = useArtisanData();
    const [isVisible, setIsVisible] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const hasInitialized = React.useRef(false);

    useEffect(() => {
        if (!hasInitialized.current) {
            hasInitialized.current = true;
            // Only show if this hub hasn't been visited yet
            if (!onboardingState[hubId]) {
                setIsVisible(true);
            }
        }
    }, [hubId, onboardingState, businessProfile.role]);

    const handleDismiss = () => {
        setIsVisible(false);
        markHubVisited(hubId);
    };

    // Keyboard listener for Escape key dismissal
    useEffect(() => {
        if (!isVisible) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleDismiss();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isVisible, hubId]);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleDismiss();
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[100] pointer-events-none flex items-end justify-end p-4 sm:p-6 animate-in fade-in duration-300">
            <div className="bg-[#0A0A0C]/95 border border-white/20 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-300 backdrop-blur-2xl pointer-events-auto">
                <div className="bg-gradient-to-r from-black/90 to-[#121215] border-b border-white/10 p-4 text-white relative">
                    <button 
                        type="button"
                        onClick={handleDismiss} 
                        className="absolute top-3 right-3 text-white/50 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
                        title="Close Guide (Esc)"
                    >
                        <X size={18} />
                    </button>
                    <div className="flex items-center gap-2.5 mb-1">
                        <div className="p-1.5 bg-[#C5A059]/10 border border-[#C5A059]/30 rounded-lg text-[#C5A059]">
                            <Info size={18} />
                        </div>
                        <h2 className="text-lg text-white font-display font-medium uppercase tracking-widest">{title}</h2>
                    </div>
                    <p className="text-xs text-white/70 font-sans font-light leading-relaxed pr-6">{description}</p>
                </div>
                <div className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-[10px] text-white/40 uppercase font-display font-medium tracking-widest">Quick Start Guide</h3>
                        <div className="text-[10px] font-black text-[#C5A059] uppercase tracking-[0.2em]">
                            Step {currentStep + 1} of {steps.length}
                        </div>
                    </div>
                    
                    <div className="min-h-[70px] flex items-start gap-3 p-3 bg-white/5 border border-white/10 rounded-xl">
                        <div className="mt-0.5 text-[#C5A059] shrink-0">
                            <CheckCircle size={16} />
                        </div>
                        <p className="text-xs text-white/90 font-medium leading-relaxed">{steps[currentStep]}</p>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/5">
                        <Button 
                            variant="outline" 
                            onClick={handlePrev} 
                            disabled={currentStep === 0}
                            className={`py-1 px-3 text-[10px] font-bold tracking-widest text-white border-white/20 ${currentStep === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
                        >
                            <ChevronLeft size={14} className="mr-1" /> PREV
                        </Button>
                        <Button 
                            variant="premium" 
                            onClick={handleNext} 
                            className="py-1 px-4 text-[10px] bg-[#C5A059] text-black hover:bg-[#b08e4d] font-bold uppercase tracking-wider"
                        >
                            {currentStep === steps.length - 1 ? 'GOT IT, LETS GO' : 'NEXT'} {currentStep < steps.length - 1 && <ChevronRight size={14} className="ml-1" />}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
