import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, CheckCircle, FileText, Database, ArrowRight, Loader2, FileSpreadsheet, XCircle, Download, PlayCircle, Edit3, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Button, VaultBanner, Select, Input } from './UI';
import { SubPageHeader } from './SubPageHeader';
import { useArtisanData } from './DataContext';
import { toast } from 'sonner';
import { auth, db } from '../services/firebase';
import { collection, addDoc } from 'firebase/firestore';
import Papa from 'papaparse';

type ImportPhase = 'upload' | 'preview' | 'importing' | 'success';

export const UniversalImporter = () => {
    const { isDemoMode } = useArtisanData();
    const [phase, setPhase] = useState<ImportPhase>('upload');
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [csvData, setCsvData] = useState<any[]>([]);
    const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
    const [progress, setProgress] = useState(0);
    const [errors, setErrors] = useState<string[]>([]);
    const [importType, setImportType] = useState('materials');
    const [mapping, setMapping] = useState<Record<string, string>>({});
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    const requiredFields: Record<string, { key: string, label: string }[]> = {
        materials: [{ key: 'name', label: 'Material Name' }, { key: 'cost', label: 'Unit Cost' }, { key: 'quantity', label: 'Quantity' }],
        orders: [{ key: 'orderId', label: 'Order ID' }, { key: 'total', label: 'Order Total' }],
        customers: [{ key: 'name', label: 'Customer Name' }, { key: 'email', label: 'Email Address' }],
        recipes: [{ key: 'name', label: 'Recipe Name' }, { key: 'yield', label: 'Batch Yield' }]
    };

    // --- HEURISTIC ENGINE ---
    const sniffContentAndMap = (headers: string[], data: any[]) => {
        const sampleSize = Math.min(10, data.length);
        const samples = data.slice(0, sampleSize);
        
        let emailScore = 0;
        let dateScore = 0;
        let orderIdScore = 0;
        
        // Content scoring for import type
        headers.forEach(h => {
            let colEmail = 0, colDate = 0, colOrderId = 0;
            samples.forEach(row => {
                const val = String(row[h] || '').trim();
                if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(val)) colEmail++;
                if (val.length > 5 && !isNaN(Date.parse(val)) && !/^\d+$/.test(val)) colDate++;
                if (val.startsWith('#') || h.toLowerCase().includes('order')) colOrderId++;
            });
            emailScore += colEmail / sampleSize;
            dateScore += colDate / sampleSize;
            orderIdScore += colOrderId / sampleSize;
        });

        // Determine Import Type
        let bestType = 'materials';
        const headerText = headers.join(' ').toLowerCase();
        if (emailScore > 0.3 || headerText.includes('email') || headerText.includes('customer')) {
            bestType = 'customers';
        } else if (orderIdScore > 0.3 || (dateScore > 0.2 && headerText.includes('total'))) {
            bestType = 'orders';
        } else if (headerText.includes('yield') || headerText.includes('ingredient')) {
            bestType = 'recipes';
        }
        setImportType(bestType);

        // Determine Field Mappings
        const newMapping: Record<string, string> = {};
        const reqFields = requiredFields[bestType as keyof typeof requiredFields] || [];
        
        reqFields.forEach(field => {
            let bestHeader = '';
            let highestScore = 0;
            
            headers.forEach(h => {
                const hl = h.toLowerCase();
                let score = 0;
                // 1. Header string match
                if (hl.includes(field.key)) score += 5;
                if (field.key === 'cost' && (hl.includes('price') || hl.includes('value'))) score += 4;
                if (field.key === 'quantity' && (hl.includes('qty') || hl.includes('stock'))) score += 4;
                if (field.key === 'name' && (hl.includes('title') || hl.includes('item') || hl.includes('product'))) score += 4;
                
                // 2. Content pattern match
                let contentMatches = 0;
                samples.forEach(row => {
                    const val = String(row[h] || '').trim();
                    if (field.key === 'cost' && (val.includes('$') || !isNaN(parseFloat(val)))) contentMatches++;
                    if (field.key === 'quantity' && /^\d+$/.test(val)) contentMatches++;
                    if (field.key === 'email' && /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(val)) contentMatches++;
                });
                score += (contentMatches / sampleSize) * 3;
                
                if (score > highestScore) {
                    highestScore = score;
                    bestHeader = h;
                }
            });
            
            if (highestScore > 1) {
                newMapping[field.key] = bestHeader;
            }
        });
        
        setMapping(newMapping);
    };

    const processFile = (uploadedFile: File) => {
        Papa.parse(uploadedFile, {
            header: true,
            skipEmptyLines: true,
            complete: (results: any) => {
                const headers = results.meta.fields || [];
                // Filter fully empty rows
                const cleanData = results.data.filter((row: any) => Object.values(row).some(v => v !== ''));
                
                setCsvHeaders(headers);
                setCsvData(cleanData);
                sniffContentAndMap(headers, cleanData);
                setPhase('preview');
            }
        });
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
            processFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            processFile(e.target.files[0]);
        }
    };

    // --- ACTIONS ---
    const downloadTemplate = () => {
        const templates: Record<string, string> = {
            materials: "Material Name,Unit Cost,Quantity,Category\nLavender Oil,2.50,50,Raw Material",
            orders: "Order ID,Customer Email,Order Total,Date\nORD-001,jane@example.com,45.00,2026-10-01",
            customers: "Customer Name,Email Address,Phone\nJane Doe,jane@example.com,555-0100",
            recipes: "Recipe Name,Batch Yield,Production Time\nLavender Soap,100 bars,48 hours"
        };
        const content = templates[importType] || templates.materials;
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `artisanflow_${importType}_template.csv`;
        link.click();
    };

    const loadSampleData = () => {
        const sampleHeaders = ["Item Name", "Stock Qty", "Wholesale Price"];
        const sampleData = [
            {"Item Name": "Shea Butter", "Stock Qty": "25", "Wholesale Price": ".50"},
            {"Item Name": "Lye", "Stock Qty": "10", "Wholesale Price": "1.25"},
            {"Item Name": "Molds", "Stock Qty": "5", "Wholesale Price": ".00"}
        ];
        setFile(new File([""], "sample_inventory.csv"));
        setCsvHeaders(sampleHeaders);
        setCsvData(sampleData);
        sniffContentAndMap(sampleHeaders, sampleData);
        setPhase('preview');
    };

    const getColumnLetter = (headerName: string) => {
        const idx = csvHeaders.indexOf(headerName);
        if (idx === -1) return '?';
        return String.fromCharCode(65 + idx);
    };

    const handleUpload = async () => {
        if (!file || !auth.currentUser) return;
        
        const importedFiles = JSON.parse(localStorage.getItem('imported_csv_files') || '[]');
        if (importedFiles.includes(file.name) && file.name !== 'sample_inventory.csv') {
            if (!window.confirm(`You have already imported "${file.name}". Are you sure you want to import it again? This may create duplicates.`)) {
                return;
            }
        }
        
        setPhase('importing');
        setErrors([]);
        setProgress(0);
        
        const uid = auth.currentUser.uid;
        const targetCollection = collection(db, 'users', uid, importType);
        
        let successCount = 0;
        let errs: string[] = [];

        for (let i = 0; i < csvData.length; i++) {
            const row = csvData[i];
            try {
                const payload: any = {};
                for (const [afField, csvHeader] of Object.entries(mapping)) {
                    if (csvHeader && row[csvHeader] !== undefined) {
                        let val = String(row[csvHeader]).trim();
                        if (['cost', 'quantity', 'total', 'yield'].includes(afField)) {
                            const num = parseFloat(val.replace(/[^0-9.-]+/g,""));
                            payload[afField] = isNaN(num) ? 0 : num;
                        } else {
                            payload[afField] = val;
                        }
                    }
                }
                payload.importedAt = new Date().toISOString();
                
                // Plain-language validation
                const reqs = requiredFields[importType as keyof typeof requiredFields] || [];
                for (let r of reqs) {
                    if (payload[r.key] === undefined || payload[r.key] === null || payload[r.key] === '') {
                        const colLetter = getColumnLetter(mapping[r.key]);
                        throw new Error(`Row ${i+1} is missing a ${r.label} (check column ${colLetter}: "${mapping[r.key]}")`);
                    }
                }

                if (!isDemoMode) await addDoc(targetCollection, payload);
                successCount++;
            } catch (err: any) {
                errs.push(err.message || `Row ${i+1}: Unknown error`);
            }
            
            setProgress(Math.round(((i + 1) / csvData.length) * 100));
        }

        setErrors(errs);
        
        if (successCount > 0) {
            if (file.name !== 'sample_inventory.csv' && !importedFiles.includes(file.name)) {
                importedFiles.push(file.name);
                localStorage.setItem('imported_csv_files', JSON.stringify(importedFiles));
            }
            toast.success(`Successfully migrated ${successCount} records into ${importType}.`);
            setPhase('success');
            setTimeout(() => {
                setPhase('upload');
                setFile(null);
                setCsvData([]);
            }, 5000);
        } else {
            toast.error("Import failed. See errors below.");
            setPhase('preview'); // Send back to preview to fix
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 sm:p-8 lg:p-12 space-y-6 max-w-5xl mx-auto bg-black/40 border border-white/10 rounded-3xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold font-serif text-white">Import Your Data</h2>
                    <p className="text-sm text-white/50">Bring your inventory, recipes, orders, and customers from any CSV.</p>
                </div>
                {phase === 'upload' && (
                    <div className="flex gap-3 mt-4 sm:mt-0">
                        <Button variant="outline" className="text-xs border-white/10 hover:bg-white/5 text-white" onClick={downloadTemplate}>
                            <Download size={14} className="mr-2" /> Template
                        </Button>
                        <Button variant="outline" className="text-xs border-[#C5A059]/30 text-[#C5A059] hover:bg-[#C5A059]/10" onClick={loadSampleData}>
                            <PlayCircle size={14} className="mr-2" /> Try Sample
                        </Button>
                    </div>
                )}
            </div>

            <AnimatePresence mode="wait">
                {phase === 'upload' && (
                    <motion.div key="upload" exit={{ opacity: 0, y: -10 }} className={`border-2 border-dashed rounded-3xl p-10 sm:p-20 flex flex-col items-center justify-center text-center transition-all duration-300 ${isDragging ? 'border-[#C5A059] bg-[#C5A059]/10' : 'border-white/10 bg-white/5'}`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
                        <input type="file" accept=".csv" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                        <div className="w-20 h-20 bg-white/5 text-white/20 rounded-full flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors" onClick={() => fileInputRef.current?.click()}>
                            <UploadCloud size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-white mt-6 mb-2">Upload your CSV</h3>
                        <p className="text-sm text-white/40">Drag and drop, or click to browse files.</p>
                    </motion.div>
                )}

                {phase === 'preview' && (
                    <motion.div key="preview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                        <div className="bg-[#6A2C91]/20 border border-[#6A2C91]/50 rounded-xl p-4 flex justify-between items-center">
                            <div>
                                <p className="text-xs text-[#C5A059] font-bold uppercase tracking-widest mb-1">AI Detection</p>
                                <p className="text-white text-sm">We detected <strong className="text-white">{csvData.length} rows</strong> of <strong className="text-white">{importType}</strong> data. Review the mapping below.</p>
                            </div>
                            <Select value={importType} onChange={(e: any) => { setImportType(e.target.value); sniffContentAndMap(csvHeaders, csvData); }} className="w-48 bg-black">
                                <option value="materials">Materials</option>
                                <option value="orders">Orders</option>
                                <option value="customers">Customers</option>
                                <option value="recipes">Recipes</option>
                            </Select>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-1 space-y-4">
                                <h4 className="text-sm font-bold text-white uppercase tracking-widest">Column Mapping</h4>
                                {(requiredFields[importType as keyof typeof requiredFields] || []).map(field => (
                                    <div key={field.key} className="bg-white/5 p-3 rounded-lg border border-white/10">
                                        <div className="text-xs text-white/50 mb-2">{field.label} <span className="text-red-400">*</span></div>
                                        <Select value={mapping[field.key] || ''} onChange={(e: any) => setMapping({...mapping, [field.key]: e.target.value})} className="w-full text-xs bg-black">
                                            <option value="">-- Ignore --</option>
                                            {csvHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                                        </Select>
                                    </div>
                                ))}
                            </div>

                            <div className="lg:col-span-2 space-y-4">
                                <h4 className="text-sm font-bold text-white uppercase tracking-widest">Data Preview</h4>
                                <div className="bg-black border border-white/10 rounded-xl overflow-x-auto">
                                    <table className="w-full text-left text-xs">
                                        <thead className="bg-white/5 border-b border-white/10">
                                            <tr>
                                                {(requiredFields[importType as keyof typeof requiredFields] || []).map(f => (
                                                    <th key={f.key} className="p-3 text-white/50 font-medium">{f.label}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {csvData.slice(0, 4).map((row, idx) => (
                                                <tr key={idx} className="border-b border-white/5">
                                                    {(requiredFields[importType as keyof typeof requiredFields] || []).map(f => {
                                                        const csvHeader = mapping[f.key];
                                                        const val = csvHeader ? row[csvHeader] : '';
                                                        return <td key={f.key} className="p-3 text-white/80">{val || <span className="text-red-400/50">Missing</span>}</td>;
                                                    })}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {csvData.length > 4 && <div className="p-3 text-center text-white/30 text-xs bg-white/5 italic">...and {csvData.length - 4} more rows</div>}
                                </div>
                            </div>
                        </div>

                        {errors.length > 0 && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                                <p className="text-sm font-bold text-red-400 mb-2 flex items-center gap-2"><XCircle size={16}/> Import Errors</p>
                                <ul className="list-disc pl-5 space-y-1">
                                    {errors.slice(0, 5).map((err, idx) => <li key={idx} className="text-xs text-red-400/80">{err}</li>)}
                                    {errors.length > 5 && <li className="text-xs text-red-400/80 italic">...and {errors.length - 5} more.</li>}
                                </ul>
                            </div>
                        )}

                        <div className="flex gap-4 pt-4 border-t border-white/10">
                            <Button variant="outline" className="flex-1 border-white/20 text-white" onClick={() => setPhase('upload')}>Cancel</Button>
                            <Button className="flex-1 bg-[#C5A059] text-black hover:bg-[#b08d4a] font-bold tracking-widest" onClick={handleUpload}>
                                Confirm & Import
                            </Button>
                        </div>
                    </motion.div>
                )}

                {phase === 'importing' && (
                    <motion.div key="importing" className="py-20 flex flex-col items-center">
                        <Loader2 size={48} className="animate-spin text-[#C5A059] mb-6" />
                        <h3 className="text-xl font-bold text-white mb-4">Importing {importType}...</h3>
                        <div className="w-full max-w-md bg-white/10 rounded-full h-2">
                            <div className="bg-[#C5A059] h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                        </div>
                    </motion.div>
                )}

                {phase === 'success' && (
                    <motion.div key="success" className="py-20 flex flex-col items-center">
                        <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-6">
                            <Check size={48} />
                        </div>
                        <h3 className="text-2xl font-bold text-emerald-400 mb-2">Import Successful!</h3>
                        <p className="text-white/50">Your data has been cleanly mapped into Artisan Flow.</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};
