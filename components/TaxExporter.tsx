import React, { useState } from 'react';
import { Download, FileText, CheckCircle, Calculator, ChevronRight } from 'lucide-react';
import { Card, Button } from './UI';
import { useArtisanData } from './DataContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export const TaxExporter = () => {
    const { getInventoryValue } = useArtisanData();
    const [isExporting, setIsExporting] = useState(false);

    // Dynamic Calculations
    // 1. Beginning Inventory (Assume starting 0 for mock, or total value of raw materials)
    const inventoryValuation = getInventoryValue();
    const mockPurchases = 12500; // Mock historical purchases for the year
    const cogs = mockPurchases - inventoryValuation; // Simplified Schedule C formula

    const handleExport = () => {
        setIsExporting(true);
        setTimeout(() => {
            setIsExporting(false);
            toast.success("Schedule C Tax Summary generated and downloaded!");
            // In a real app, this would trigger a jsPDF or CSV blob download
        }, 2000);
    };

    return (
        <Card className="bg-black/60 backdrop-blur-xl border border-white/10 p-4 sm:p-8 rounded-3xl relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-emerald-600/20 rounded-full blur-[100px]" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 sm:p-8">
                <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                            <FileText size={24} className="text-[#C5A059]" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white font-serif">Schedule C Tax Season Helper</h3>
                            <p className="text-white/50 text-sm">Automated COGS calculation and expense extraction.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                            <p className="text-xs text-white/40 uppercase tracking-widest font-bold mb-1">Ending Inv. Value</p>
                            <p className="text-xl text-white font-mono">${inventoryValuation.toLocaleString()}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                            <p className="text-xs text-white/40 uppercase tracking-widest font-bold mb-1">Calculated COGS</p>
                            <p className="text-xl text-emerald-400 font-mono">${cogs.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4 w-full md:w-auto">
                    <Button 
                        onClick={handleExport}
                        disabled={isExporting}
                        className="bg-[#C5A059] hover:bg-[#b08d4a] text-black h-14 px-8 rounded-xl font-bold tracking-widest uppercase flex items-center justify-center gap-3 w-full md:w-auto"
                    >
                        {isExporting ? <Calculator className="animate-spin" size={18} /> : <Download size={18} />}
                        {isExporting ? "GENERATING..." : "EXPORT IRS SUMMARY"}
                    </Button>
                    <p className="text-[10px] text-white/30 text-center max-w-[200px] mx-auto">
                        Generates a structured CSV mapping to IRS Schedule C Line 35-42 requirements.
                    </p>
                </div>
            </div>
        </Card>
    );
};
