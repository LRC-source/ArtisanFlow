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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="bg-black/60 border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 backdrop-blur-3xl">
                <div className="bg-gradient-to-r from-black/80 to-[#101010] border-b border-white/5 p-6 text-white relative">
                    <button onClick={handleDismiss} className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-[#C5A059]/10 border border-[#C5A059]/20 rounded-lg text-[#C5A059]">
                            <Info size={24} />
                        </div>
                        <h2 className="text-2xl font-serif tracking-tight text-white">{title}</h2>
                    </div>
                    <p className="text-white/60 font-sans font-light text-sm leading-relaxed">{description}</p>
                </div>
                <div className="p-4 sm:p-8 space-y-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Quick Start Guide</h3>
                        <div className="text-[10px] font-black text-[#C5A059] uppercase tracking-[0.2em]">
                            Step {currentStep + 1} of {steps.length}
                        </div>
                    </div>
                    
                    <div className="min-h-[120px] flex items-start gap-4 p-6 bg-white/5 border border-white/10 rounded-xl">
                        <div className="mt-1 text-[#C5A059] shrink-0">
                            <CheckCircle size={20} />
                        </div>
                        <p className="text-base font-medium text-white/90 leading-relaxed">{steps[currentStep]}</p>
                    </div>

                    <div className="flex gap-4 mt-8 pt-4 border-t border-white/5">
                        <Button 
                            variant="outline" 
                            onClick={handlePrev} 
                            disabled={currentStep === 0}
                            className={`flex-1 h-12 font-bold tracking-widest ${currentStep === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <ChevronLeft size={18} className="mr-1" /> PREV
                        </Button>
                        <Button variant="premium" onClick={handleNext} className="flex-1 h-12 font-black tracking-widest shadow-lg shadow-[#C5A059]/20">
                            {currentStep === steps.length - 1 ? 'GOT IT, LETS GO' : 'NEXT'} {currentStep < steps.length - 1 && <ChevronRight size={18} className="ml-1" />}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
