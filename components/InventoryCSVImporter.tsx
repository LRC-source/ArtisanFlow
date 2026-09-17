import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, FileText, CheckCircle2, AlertTriangle, ArrowRight, ArrowLeft, 
  RotateCcw, Sparkles, Layers, Database, Package, ShieldCheck, XCircle, Table
} from 'lucide-react';
import Papa from 'papaparse';
import { Card, Button, Badge, Select } from './UI';
import { useArtisanData } from './DataContext';
import { toast } from 'sonner';

export type ImportEntity = 'raw_materials' | 'recipes' | 'finished_goods';

interface FieldSpec {
  key: string;
  label: string;
  required: boolean;
  type: 'string' | 'number';
  description: string;
}

const ENTITY_FIELDS: Record<ImportEntity, FieldSpec[]> = {
  raw_materials: [
    { key: 'name', label: 'Item / Material Name', required: true, type: 'string', description: 'e.g., Lavender Essential Oil' },
    { key: 'sku', label: 'SKU / Part Number', required: false, type: 'string', description: 'e.g., RAW-LAV-001' },
    { key: 'stock', label: 'Initial Stock Quantity', required: true, type: 'number', description: 'Current available stock' },
    { key: 'unit', label: 'Unit of Measure', required: false, type: 'string', description: 'oz, ml, grams, lbs, units' },
    { key: 'unitCost', label: 'Unit Cost ($)', required: true, type: 'number', description: 'Cost per unit of measurement' },
    { key: 'reorderPoint', label: 'Reorder Safety Point', required: false, type: 'number', description: 'Threshold to trigger low stock alert' },
    { key: 'supplier', label: 'Supplier / Vendor Name', required: false, type: 'string', description: 'Preferred vendor or source' },
    { key: 'category', label: 'Material Category', required: false, type: 'string', description: 'Oils, Packaging, Waxes, etc.' }
  ],
  recipes: [
    { key: 'name', label: 'Recipe / Formula Name', required: true, type: 'string', description: 'e.g., Botanical Salve Formulation' },
    { key: 'sku', label: 'Recipe Code / SKU', required: false, type: 'string', description: 'e.g., REC-SALVE-01' },
    { key: 'yieldValue', label: 'Batch Yield Quantity', required: true, type: 'number', description: 'Expected yield number per batch' },
    { key: 'yield', label: 'Yield Label / Unit', required: false, type: 'string', description: 'e.g., 50 Jars (2oz)' },
    { key: 'materialCost', label: 'Est. Material Cost ($)', required: false, type: 'number', description: 'BOM cost estimate' },
    { key: 'laborCost', label: 'Labor Cost ($)', required: false, type: 'number', description: 'Estimated labor cost per run' },
    { key: 'productionTime', label: 'Production Time (mins)', required: false, type: 'number', description: 'Run duration in minutes' },
    { key: 'version', label: 'Formulation Version', required: false, type: 'string', description: 'e.g., 1.0 or v2' }
  ],
  finished_goods: [
    { key: 'name', label: 'Finished Product Name', required: true, type: 'string', description: 'e.g., Calming Lavender Bath Salt (8oz)' },
    { key: 'sku', label: 'Product SKU', required: true, type: 'string', description: 'e.g., FG-SALTS-8OZ' },
    { key: 'retailPrice', label: 'Retail Price ($)', required: true, type: 'number', description: 'Selling price per unit' },
    { key: 'stock', label: 'Ready-to-Sell Stock', required: true, type: 'number', description: 'Current packaged inventory' },
    { key: 'unitCost', label: 'Cost of Goods Sold ($)', required: false, type: 'number', description: 'COGS per unit' },
    { key: 'reorderPoint', label: 'Low Stock Alert Level', required: false, type: 'number', description: 'Minimum inventory threshold' },
    { key: 'description', label: 'Product Description', required: false, type: 'string', description: 'Short catalog description' },
    { key: 'category', label: 'Product Line / Category', required: false, type: 'string', description: 'Skincare, Bath, Candles' }
  ]
};

interface InventoryCSVImporterProps {
  onClose: () => void;
  defaultEntity?: ImportEntity;
}

export const InventoryCSVImporter: React.FC<InventoryCSVImporterProps> = ({ 
  onClose, 
  defaultEntity = 'raw_materials' 
}) => {
  const { bulkImportInventoryItems, bulkImportRecipes } = useArtisanData();
  
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [targetEntity, setTargetEntity] = useState<ImportEntity>(defaultEntity);
  const [file, setFile] = useState<File | null>(null);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [csvRows, setCsvRows] = useState<Record<string, any>[]>([]);
  const [columnMap, setColumnMap] = useState<Record<string, string>>({});
  const [validationErrors, setValidationErrors] = useState<{ rowIdx: number; message: string }[]>([]);
  const [parsedItems, setParsedItems] = useState<any[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importSummary, setImportSummary] = useState<{ imported: number; failed: number } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-heuristic column matching
  const autoMapHeaders = (headers: string[], entity: ImportEntity) => {
    const fields = ENTITY_FIELDS[entity];
    const newMap: Record<string, string> = {};

    fields.forEach(field => {
      const fieldKeyLower = field.key.toLowerCase();
      const fieldLabelLower = field.label.toLowerCase();
      
      const match = headers.find(h => {
        const hLower = h.toLowerCase().trim();
        return (
          hLower === fieldKeyLower ||
          hLower === fieldLabelLower ||
          (fieldKeyLower.includes('name') && (hLower.includes('item') || hLower.includes('product') || hLower.includes('title') || hLower.includes('name'))) ||
          (fieldKeyLower.includes('sku') && (hLower.includes('sku') || hLower.includes('code') || hLower.includes('id'))) ||
          (fieldKeyLower.includes('stock') && (hLower.includes('qty') || hLower.includes('quantity') || hLower.includes('stock') || hLower.includes('count'))) ||
          (fieldKeyLower.includes('cost') && (hLower.includes('cost') || hLower.includes('price') || hLower.includes('unit cost'))) ||
          (fieldKeyLower.includes('price') && (hLower.includes('price') || hLower.includes('msrp') || hLower.includes('retail'))) ||
          (fieldKeyLower.includes('unit') && (hLower.includes('unit') || hLower.includes('measure') || hLower.includes('uom')))
        );
      });

      if (match) {
        newMap[field.key] = match;
      }
    });

    setColumnMap(newMap);
  };

  const handleFileSelect = (selectedFile: File) => {
    if (!selectedFile.name.endsWith('.csv')) {
      toast.error('Please upload a valid .csv file');
      return;
    }

    setFile(selectedFile);
    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          console.warn('PapaParse warnings:', results.errors);
        }

        const headers = results.meta.fields || [];
        const rows = results.data as Record<string, any>[];

        if (headers.length === 0 || rows.length === 0) {
          toast.error('CSV file appears to be empty or unreadable.');
          return;
        }

        setCsvHeaders(headers);
        setCsvRows(rows);
        autoMapHeaders(headers, targetEntity);
        setStep(2);
        toast.success(`Loaded CSV with ${rows.length} rows and ${headers.length} columns.`);
      },
      error: (err) => {
        toast.error(`CSV Parsing error: ${err.message}`);
      }
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const validateAndBuildPreview = () => {
    const fields = ENTITY_FIELDS[targetEntity];
    const errors: { rowIdx: number; message: string }[] = [];
    const items: any[] = [];

    // Check required fields mapping
    const missingRequiredField = fields.find(f => f.required && !columnMap[f.key]);
    if (missingRequiredField) {
      toast.error(`Please map the required field: "${missingRequiredField.label}"`);
      return;
    }

    csvRows.forEach((row, idx) => {
      const itemPayload: Record<string, any> = {
        type: targetEntity === 'finished_goods' ? 'finished' : 'raw'
      };

      let rowHasFatalError = false;

      fields.forEach(field => {
        const mappedHeader = columnMap[field.key];
        const rawValue = mappedHeader ? row[mappedHeader] : undefined;
        
        if (field.required && (rawValue === undefined || rawValue === null || String(rawValue).trim() === '')) {
          errors.push({ rowIdx: idx + 1, message: `Missing required field: ${field.label}` });
          rowHasFatalError = true;
        } else if (rawValue !== undefined && rawValue !== null && String(rawValue).trim() !== '') {
          if (field.type === 'number') {
            const num = Number(String(rawValue).replace(/[^0-9.-]+/g, ''));
            if (isNaN(num)) {
              errors.push({ rowIdx: idx + 1, message: `Field "${field.label}" must be numeric (got "${rawValue}")` });
              itemPayload[field.key] = 0;
            } else {
              itemPayload[field.key] = num;
            }
          } else {
            itemPayload[field.key] = String(rawValue).trim();
          }
        }
      });

      if (!rowHasFatalError) {
        items.push(itemPayload);
      }
    });

    setValidationErrors(errors);
    setParsedItems(items);
    setStep(3);
  };

  const handleConfirmImport = async () => {
    setIsImporting(true);
    try {
      let result = { imported: 0, failed: 0 };
      if (targetEntity === 'raw_materials' || targetEntity === 'finished_goods') {
        result = await bulkImportInventoryItems(parsedItems);
      } else if (targetEntity === 'recipes') {
        result = await bulkImportRecipes(parsedItems);
      }

      setImportSummary(result);
      setStep(4);
      toast.success(`Successfully imported ${result.imported} record(s)!`);
    } catch (err: any) {
      toast.error(`Import failed: ${err.message || 'Unknown error'}`);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-4xl bg-[#0F0F12] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#6A2C91]/20 border border-[#6A2C91]/50 rounded-2xl text-[#C5A059]">
              <Table size={24} />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-white tracking-tight">CSV Import & Column Mapping Hub</h2>
              <p className="text-xs font-sans text-white/50">Direct relational importer for Raw Materials, Recipes & Finished Goods</p>
            </div>
          </div>
          <Button variant="outline" className="rounded-full px-4 py-1 text-xs text-white border-white/20 hover:bg-white/10" onClick={onClose}>
            Close
          </Button>
        </div>

        {/* Wizard Progress Steps */}
        <div className="px-8 py-3 bg-black/40 border-b border-white/5 flex items-center justify-between text-xs font-sans font-semibold">
          {[
            { num: 1, label: 'Upload CSV' },
            { num: 2, label: 'Column Mapping' },
            { num: 3, label: 'Validate & Preview' },
            { num: 4, label: 'Import Complete' }
          ].map((s) => (
            <div key={s.num} className={`flex items-center gap-2 ${step >= s.num ? 'text-[#C5A059]' : 'text-white/30'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step === s.num ? 'bg-[#C5A059] text-black' : step > s.num ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' : 'bg-white/5 text-white/40'
              }`}>
                {step > s.num ? '✓' : s.num}
              </span>
              <span>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Wizard Content Body */}
        <div className="p-8 overflow-y-auto flex-1 space-y-6">

          {/* STEP 1: UPLOAD */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Entity Selector */}
              <div>
                <label className="block text-xs font-sans font-bold uppercase tracking-widest text-white/70 mb-3">
                  Select Import Destination Target
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: 'raw_materials', title: 'Raw Materials / Ingredients', desc: 'Track base oils, packaging, waxes, chemicals', icon: Package },
                    { id: 'recipes', title: 'Recipes / Formulations', desc: 'BOM formulas, labor costs & yield targets', icon: Layers },
                    { id: 'finished_goods', title: 'Finished Goods', desc: 'Retail products ready to sell & ship', icon: Database }
                  ].map((e) => {
                    const Icon = e.icon;
                    const isSelected = targetEntity === e.id;
                    return (
                      <div 
                        key={e.id}
                        onClick={() => setTargetEntity(e.id as ImportEntity)}
                        className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 ${
                          isSelected 
                            ? 'bg-[#6A2C91]/20 border-[#C5A059] text-white shadow-lg' 
                            : 'bg-white/5 border-white/10 hover:border-white/20 text-white/60'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <Icon size={20} className={isSelected ? 'text-[#C5A059]' : 'text-white/40'} />
                          <span className="font-bold text-sm text-white font-sans">{e.title}</span>
                        </div>
                        <p className="text-xs text-white/40 leading-relaxed font-sans">{e.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Dropzone */}
              <div 
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-white/20 hover:border-[#C5A059]/60 rounded-3xl p-10 text-center bg-white/[0.01] hover:bg-white/[0.03] transition-all cursor-pointer space-y-4"
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  accept=".csv" 
                  className="hidden" 
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                />
                <div className="w-16 h-16 mx-auto rounded-full bg-[#6A2C91]/30 border border-[#6A2C91]/50 flex items-center justify-center text-[#C5A059]">
                  <Upload size={32} />
                </div>
                <div>
                  <h4 className="text-lg font-serif font-bold text-white">Click or drag & drop your CSV file here</h4>
                  <p className="text-xs font-sans text-white/40 mt-1">Supports standard CSV exports from Excel, Craftybase, Google Sheets, or Shopify</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: COLUMN MAPPING */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/10">
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider font-sans">
                    Mapping columns for: <span className="text-[#C5A059]">{targetEntity.replace('_', ' ').toUpperCase()}</span>
                  </h4>
                  <p className="text-xs text-white/40">File: {file?.name} ({csvRows.length} rows detected)</p>
                </div>
                <Button variant="outline" className="text-xs py-1 text-white border-white/20 hover:bg-white/10" onClick={() => autoMapHeaders(csvHeaders, targetEntity)}>
                  <RotateCcw size={14} className="mr-1" /> Re-detect Headers
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ENTITY_FIELDS[targetEntity].map((field) => (
                  <div key={field.key} className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between text-xs font-sans">
                      <span className="font-bold text-white">
                        {field.label} {field.required && <span className="text-red-400">*</span>}
                      </span>
                      <span className="text-white/40 italic">{field.description}</span>
                    </div>
                    <Select 
                      value={columnMap[field.key] || ''} 
                      onChange={(e) => setColumnMap({ ...columnMap, [field.key]: e.target.value })}
                      className="w-full bg-black text-xs text-white"
                    >
                      <option value="">-- Do Not Import / Ignore --</option>
                      {csvHeaders.map((header) => (
                        <option key={header} value={header}>{header}</option>
                      ))}
                    </Select>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: PREVIEW & VALIDATE */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-white uppercase tracking-wider font-sans">Data Preview & Sanity Check</h4>
                  <p className="text-xs text-white/50">{parsedItems.length} valid row(s) ready to import into Artisan Flow database.</p>
                </div>
                {validationErrors.length > 0 && (
                  <Badge color="amber">
                    <AlertTriangle size={14} className="mr-1" /> {validationErrors.length} validation warning(s)
                  </Badge>
                )}
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto border border-white/10 rounded-2xl bg-black/40 max-h-64">
                <table className="w-full text-left text-xs font-sans">
                  <thead className="bg-white/10 text-white/70 border-b border-white/10 uppercase tracking-widest font-bold">
                    <tr>
                      <th className="p-3">#</th>
                      {ENTITY_FIELDS[targetEntity].map(f => (
                        <th key={f.key} className="p-3">{f.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-white/80">
                    {parsedItems.slice(0, 8).map((row, idx) => (
                      <tr key={idx} className="hover:bg-white/5">
                        <td className="p-3 text-white/40">{idx + 1}</td>
                        {ENTITY_FIELDS[targetEntity].map(f => (
                          <td key={f.key} className="p-3">
                            {row[f.key] !== undefined ? String(row[f.key]) : <span className="text-white/20">-</span>}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {parsedItems.length > 8 && (
                <p className="text-xs text-center text-white/40 italic">...and {parsedItems.length - 8} more row(s) ready to import.</p>
              )}
            </div>
          )}

          {/* STEP 4: SUCCESS REPORT */}
          {step === 4 && importSummary && (
            <div className="text-center py-10 space-y-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
                <CheckCircle2 size={48} />
              </div>
              <div>
                <h3 className="text-2xl font-serif font-bold text-white uppercase tracking-wider">Import Process Completed!</h3>
                <p className="text-sm font-sans text-white/60 mt-2">
                  Successfully imported <strong className="text-emerald-400">{importSummary.imported}</strong> record(s) into your Artisan Flow database.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-5 border-t border-white/10 flex items-center justify-between bg-white/[0.02]">
          {step > 1 && step < 4 ? (
            <Button variant="outline" className="text-xs rounded-full px-5 text-white border-white/20 hover:bg-white/10" onClick={() => setStep((step - 1) as any)}>
              <ArrowLeft size={16} className="mr-1" /> Back
            </Button>
          ) : (
            <div />
          )}

          <div>
            {step === 1 && (
              <Button 
                variant="outline" 
                disabled={!file} 
                className="text-xs rounded-full px-6 bg-[#6A2C91] text-white hover:bg-[#5a257a]"
                onClick={() => setStep(2)}
              >
                Continue to Column Mapping <ArrowRight size={16} className="ml-1" />
              </Button>
            )}

            {step === 2 && (
              <Button 
                className="text-xs rounded-full px-6 bg-[#6A2C91] text-white hover:bg-[#5a257a]"
                onClick={validateAndBuildPreview}
              >
                Validate & Preview Data <ArrowRight size={16} className="ml-1" />
              </Button>
            )}

            {step === 3 && (
              <Button 
                disabled={isImporting || parsedItems.length === 0}
                className="text-xs rounded-full px-8 bg-[#C5A059] text-black font-bold hover:bg-[#b08e4d]"
                onClick={handleConfirmImport}
              >
                {isImporting ? 'Inserting Database Records...' : `Confirm & Import (${parsedItems.length} Records)`}
              </Button>
            )}

            {step === 4 && (
              <Button 
                className="text-xs rounded-full px-8 bg-[#6A2C91] text-white hover:bg-[#5a257a]"
                onClick={onClose}
              >
                Done / Close Importer
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
