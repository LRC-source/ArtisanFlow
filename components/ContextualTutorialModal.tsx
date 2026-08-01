import React, { useEffect, useState } from 'react';
import { X, CheckCircle, Info } from 'lucide-react';
import { Button } from './UI';
import { useArtisanData } from './DataContext';

interface ContextualTutorialProps {
    hubId: string;
    title: string;
    description: string;
    steps: string[];
}

export const ContextualTutorialModal: React.FC<ContextualTutorialProps> = ({ hubId, title, description, steps }) => {
    const { onboardingState, markHubVisited } = useArtisanData();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // If this hub hasn't been visited yet, show the modal
        if (!onboardingState[hubId]) {
            setIsVisible(true);
        }
    }, [hubId, onboardingState]);

    const handleDismiss = () => {
        setIsVisible(false);
        markHubVisited(hubId);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
                <div className="bg-gradient-to-r from-[#6A2C91] to-[#C5A059] p-6 text-white relative">
                    <button onClick={handleDismiss} className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <Info size={24} />
                        </div>
                        <h2 className="text-2xl font-black uppercase tracking-tight italic">{title}</h2>
                    </div>
                    <p className="text-white/90 font-medium text-sm leading-relaxed">{description}</p>
                </div>
                <div className="p-6 space-y-4">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Quick Start Guide</h3>
                    <div className="space-y-3">
                        {steps.map((step, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                                <div className="mt-0.5 text-[#C5A059]">
                                    <CheckCircle size={18} />
                                </div>
                                <p className="text-sm font-medium text-gray-700 leading-relaxed">{step}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8">
                        <Button variant="primary" onClick={handleDismiss} className="w-full h-12 font-black tracking-widest shadow-lg shadow-purple-900/10">
                            GOT IT, LET'S GO
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
