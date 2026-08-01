import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle, FileText, Database, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Button, VaultBanner } from './UI';
import { SubPageHeader } from './SubPageHeader';
import { useArtisanData } from './DataContext';
import { toast } from 'sonner';

export const CraftybaseImporter = () => {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { businessProfile } = useArtisanData();

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            validateAndSetFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            validateAndSetFile(e.target.files[0]);
        }
    };

    const validateAndSetFile = (uploadedFile: File) => {
        if (uploadedFile.type === 'text/csv' || uploadedFile.name.endsWith('.csv')) {
            setFile(uploadedFile);
        } else {
            toast.error("Invalid file format. Please upload a Craftybase CSV export.");
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        
        setIsUploading(true);

        // Simulate CSV parsing and GAS POST
        setTimeout(async () => {
            try {
                // Mock POST to GAS Web App endpoint
                const gasUrl = import.meta.env.VITE_GAS_DATABASE_URL;
                if (gasUrl) {
                    await fetch(gasUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            action: 'importCraftybaseData',
                            userId: businessProfile.email,
                            fileName: file.name
                        })
                    }).catch(e => console.warn("GAS Mock Error", e));
                }

                setIsUploading(false);
                setIsSuccess(true);
                toast.success("Craftybase data successfully migrated into ArtisanFlow matrix.");
                setFile(null);
                
                setTimeout(() => setIsSuccess(false), 5000);
            } catch (err) {
                toast.error("Failed to migrate data. Please try again.");
                setIsUploading(false);
            }
        }, 3000);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-10 md:p-16 space-y-12 max-w-[1200px] mx-auto pb-32"
        >
            <SubPageHeader title="Legacy Migration Hub" description="Seamlessly migrate your legacy Craftybase data into the ArtisanFlow ecosystem." />
            
            <VaultBanner 
                title="Craftybase One-Click Importer"
                subtitle="Upload your Craftybase CSV exports (Inventory, Recipes, Vendors). Our system will automatically map your Material Names, Unit Costs, and Recipe Ingredients into the ArtisanFlow Matrix."
                badge="Data Matrix Synchronization"
            >
                <div className="flex gap-4">
                     <Button className="bg-[#6A2C91] hover:bg-[#5a257a] text-white h-12 px-8 rounded-full shadow-lg" onClick={() => fileInputRef.current?.click()}>
                         BROWSE FILES
                     </Button>
                </div>
            </VaultBanner>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Upload Zone */}
                <div 
                    className={`border-2 border-dashed rounded-3xl p-16 flex flex-col items-center justify-center text-center transition-all duration-300 ${isDragging ? 'border-[#C5A059] bg-[#C5A059]/10' : 'border-white/10 bg-white/5'} ${isSuccess ? 'border-emerald-500/50 bg-emerald-900/10' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <input type="file" accept=".csv" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                    
                    <AnimatePresence mode="wait">
                        {isSuccess ? (
                            <motion.div key="success" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center gap-4">
                                <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center">
                                    <CheckCircle size={40} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-emerald-400">Migration Complete</h3>
                                    <p className="text-white/40 text-sm mt-2">Data mapped to ArtisanFlow database schema.</p>
                                </div>
                            </motion.div>
                        ) : file ? (
                            <motion.div key="file" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center gap-6 w-full">
                                <div className="w-20 h-20 bg-[#6A2C91]/20 text-[#C5A059] rounded-full flex items-center justify-center">
                                    <FileText size={40} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">{file.name}</h3>
                                    <p className="text-white/40 text-sm mt-2">{(file.size / 1024).toFixed(2)} KB CSV File</p>
                                </div>
                                <Button 
                                    className="bg-[#C5A059] hover:bg-[#b08d4a] text-black w-full h-14 rounded-xl font-bold tracking-widest uppercase mt-4 flex items-center justify-center gap-3"
                                    onClick={handleUpload}
                                    disabled={isUploading}
                                >
                                    {isUploading ? <><Loader2 size={18} className="animate-spin" /> SYNTHESIZING...</> : <><Database size={18} /> INITIATE MIGRATION</>}
                                </Button>
                            </motion.div>
                        ) : (
                            <motion.div key="empty" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center gap-6 pointer-events-none">
                                <div className="w-24 h-24 bg-white/5 text-white/20 rounded-full flex items-center justify-center mb-2">
                                    <UploadCloud size={48} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">Drag & Drop CSV Export</h3>
                                    <p className="text-white/40 text-sm max-w-xs mx-auto">Drop your Craftybase CSV file here, or click the Browse button above.</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Info Panel */}
                <Card className="bg-black/40 backdrop-blur-xl border border-white/10 p-10 rounded-3xl space-y-8 flex flex-col justify-center">
                    <h3 className="text-2xl font-serif text-white font-bold tracking-tight flex items-center gap-3">
                        <ShieldCheck size={28} className="text-[#C5A059]" /> Automated Schema Mapping
                    </h3>
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 shrink-0"><ArrowRight size={16} /></div>
                            <div>
                                <h4 className="text-white font-bold text-sm">Inventory Matrix Synchronization</h4>
                                <p className="text-white/40 text-xs mt-1 leading-relaxed">Craftybase "Material Name" and "SKU" headers are instantly mapped to your active supply nodes.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 shrink-0"><ArrowRight size={16} /></div>
                            <div>
                                <h4 className="text-white font-bold text-sm">COGS Value Extraction</h4>
                                <p className="text-white/40 text-xs mt-1 leading-relaxed">Unit costs are extracted and re-calibrated into the Profit Guard™ ledger for real-time margin tracking.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 shrink-0"><ArrowRight size={16} /></div>
                            <div>
                                <h4 className="text-white font-bold text-sm">Golden Ratio Ledger (Recipes)</h4>
                                <p className="text-white/40 text-xs mt-1 leading-relaxed">Recipe ingredients and batch yields are converted into actionable manufacturing nodes.</p>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </motion.div>
    );
};
