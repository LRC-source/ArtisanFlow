import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Upload, FileText, X, CheckCircle, AlertCircle, Lock, Crown, ShieldCheck, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useArtisanData } from './DataContext';
import { useFeatureGate } from '../hooks/useFeatureGate';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'premium' | 'danger' | 'success';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', className = '', children, style, ...props }) => {
  const baseStyle = "w-full md:w-auto px-6 py-3 rounded-full font-sans font-medium transition-all duration-500 flex items-center justify-center gap-2 uppercase tracking-[0.2em] text-[10px]";
  
  let variantClass = "";

  if (variant === 'primary') {
    variantClass = "bg-[#6A2C91] text-white hover:bg-[#5c247d] shadow-[0_8px_30px_rgba(106,44,145,0.3)] hover:shadow-[0_8px_30px_rgba(106,44,145,0.5)] active:scale-95";
  } else if (variant === 'premium') {
    variantClass = "bg-[#C5A059] text-[#140d24] hover:bg-[#b08e4d] shadow-[0_8px_30px_rgba(197,160,89,0.3)] hover:shadow-[0_8px_30px_rgba(197,160,89,0.4)] active:scale-95 font-black";
  } else if (variant === 'secondary') {
    variantClass = "bg-purple-900/10 text-purple-200 border border-purple-500/20 hover:border-purple-500/40 hover:bg-purple-900/30 shadow-sm active:scale-95";
  } else if (variant === 'outline') {
    variantClass = "border border-white/10 text-white/70 hover:bg-white/5 active:scale-95";
  } else if (variant === 'danger') {
    variantClass = "bg-red-500/10 text-red-300 border border-red-500/20 hover:bg-red-500/20 hover:text-red-200 shadow-sm active:scale-95";
  } else if (variant === 'success') {
    variantClass = "bg-green-600 text-white hover:bg-green-700 shadow-[0_8px_30px_rgba(22,163,74,0.3)] hover:shadow-[0_8px_30px_rgba(22,163,74,0.5)] active:scale-95 border-none font-black";
  } else {
    variantClass = "text-white/50 hover:bg-white/5 hover:text-white active:scale-95";
  }

  return (
    <button 
      className={`${baseStyle} ${variantClass} ${className}`} 
      style={style}
      {...props}
    >
      {children}
    </button>
  );
};

export const Card: React.FC<{ children: React.ReactNode; className?: string; title?: string; style?: React.CSSProperties; onClick?: () => void }> = ({ children, className = '', title, style, onClick }) => (
  <div 
    className={`luxury-card rounded-[2rem] p-8 ${className}`}
    style={style}
    onClick={onClick}
  >
    {title && (
      <h3 className="uppercase tracking-[0.2em] text-[10px] font-black mb-6 text-[#C5A059] flex items-center gap-2 italic">
        <div className="w-1.5 h-1.5 rounded-full bg-[#6A2C91]"></div> {title}
      </h3>
    )}
    {children}
  </div>
);

export const LRCLogo: React.FC<{ size?: number; className?: string }> = ({ size = 168, className = '' }) => {
  return (
    <div 
      className={`relative overflow-hidden rounded-2xl bg-black/40 backdrop-blur-xl shadow-2xl border border-white/10 shrink-0 ${className}`}
      style={{ 
        width: size, 
        height: size,
        backgroundImage: 'url("https://lrcholisticmarketing.online/wp-content/uploads/2025/11/Logo2025_1.webp")',
        backgroundSize: '80%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
      title="LRC Artisan Flow"
    />
  );
};

export const LockedNode: React.FC<{ children: React.ReactNode; isLocked?: boolean; requiredTier: string; onUpgrade?: () => void; featureKey?: string }> = ({ children, isLocked, requiredTier, onUpgrade, featureKey }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // If featureKey is provided, use the global TierContext gate
  const gate = featureKey ? useFeatureGate(featureKey) : { isLocked: !!isLocked, isTierLoading: false };
  const effectiveIsLocked = featureKey ? gate.isLocked : !!isLocked;

  const handleUpgradeClick = () => {
    if (onUpgrade) {
      onUpgrade();
    } else {
      navigate('/settings/subscription', { state: { from: location.pathname } });
    }
  };

  if (gate.isTierLoading) return <div className="flex items-center justify-center p-20"><Loader2 className="animate-spin text-[#C5A059]" size={32} /></div>;
  if (!effectiveIsLocked) return <>{children}</>;

  return (
    <div className="relative overflow-hidden rounded-[2rem] luxury-card group">
      <div className="blur-[6px] pointer-events-none transition-all duration-700 group-hover:blur-[8px]">
        {children}
      </div>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[4px] flex flex-col items-center justify-center p-4 sm:p-8 text-center animate-in fade-in duration-700">
        <div className="w-16 h-16 bg-white/10 text-white rounded-2xl flex items-center justify-center mb-6 shadow-2xl border border-white/10">
           <Lock size={28} strokeWidth={1.5} />
        </div>
        <h4 className="text-2xl font-serif text-white tracking-tight mb-3">Vault Node Locked</h4>
        <p className="text-white/50 font-sans font-light text-sm mb-8 max-w-[240px] leading-relaxed">This synaptic protocol requires a <span className="font-medium text-[#6A2C91]">{requiredTier}</span> authorization.</p>
        <Button variant="primary" onClick={handleUpgradeClick} className="h-12 px-10">
          <Crown size={16} className="mr-2 text-[#C5A059]" strokeWidth={1.5} /> UPGRADE ACCESS
        </Button>
      </div>
    </div>
  );
};

export const VaultBanner: React.FC<{ 
  title: string; 
  subtitle: string; 
  badge?: string;
  children?: React.ReactNode;
  className?: string;
}> = ({ title, subtitle, badge = "Secure Vault Access", children, className = "" }) => {
  return (
    <div 
      className={`relative w-full overflow-hidden py-20 px-12 md:px-20 rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(106,44,145,0.2)] ${className}`}
    >
      {/* Ombre Brand Background */}
      <div className="absolute inset-0 bg-[#0A0A0A]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#6A2C91_0%,transparent_60%)] opacity-40"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,#C5A059_0%,transparent_60%)] opacity-30"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#10b981_0%,transparent_70%)] opacity-20"></div>
      <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      
      {/* Static Light Accents */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C5A059]/30 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#10b981]/30 to-transparent"></div>
      <div className="absolute left-0 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-[#6A2C91]/30 to-transparent"></div>

      <div className="relative z-10 text-white flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="flex items-center gap-4 mb-8 px-6 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full"
        >
           <ShieldCheck size={20} className="text-[#C5A059]" />
           <span className="text-[12px] font-sans uppercase tracking-[0.4em] text-[#C5A059] font-bold">{badge}</span>
        </motion.div>

        <div className="mb-6">
          <h1 className="text-5xl md:text-7xl font-serif tracking-tighter text-white leading-none drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)]">
            {title}
          </h1>
        </div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-white/70 text-lg md:text-xl font-sans font-light mb-12 max-w-3xl leading-relaxed italic"
        >
          {subtitle}
        </motion.p>

        {children && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-6"
          >
            {children}
          </motion.div>
        )}
      </div>

      {/* Static Decorative Elements */}
      <div className="absolute top-4 sm:p-10 left-20 w-32 h-32 border border-[#C5A059]/10 rounded-2xl rotate-12"></div>
      <div className="absolute bottom-10 right-20 w-48 h-48 border border-[#6A2C91]/10 rounded-full"></div>
    </div>
  );
};

export const Badge: React.FC<{ children: React.ReactNode; color?: 'gold' | 'purple' | 'red' | 'green' | 'blue' | 'gray'; className?: string }> = ({ children, color = 'purple', className = '' }) => {
  let colorStyles = "";
  
  if (color === 'gold') {
    colorStyles = "bg-amber-500/10 text-amber-500 border border-amber-500/20";
  } else if (color === 'purple') {
    colorStyles = "bg-purple-500/10 text-[#6A2C91] border border-purple-500/20";
  } else if (color === 'red') {
    colorStyles = "bg-red-500/10 text-red-500 border border-red-500/20";
  } else if (color === 'green') {
    colorStyles = "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20";
  } else if (color === 'blue') {
    colorStyles = "bg-blue-500/10 text-blue-500 border border-blue-500/20";
  } else {
    colorStyles = "bg-white/5 text-white/60 border border-white/10";
  }
  
  return (
    <span 
      className={`px-3 py-1.5 rounded-full text-[9px] font-sans font-medium uppercase tracking-[0.2em] ${colorStyles} ${className}`}
    >
      {children}
    </span>
  );
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input 
    {...props}
    className={`bg-white/5 border border-white/10 text-white p-4 rounded-2xl w-full focus:outline-none focus:bg-white/10 focus:ring-1 focus:ring-[#6A2C91]/40 focus:shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-all duration-500 placeholder-white/20 font-medium text-sm ${props.className}`} 
  />
);

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => (
  <select 
    {...props}
    className={`bg-white/5 border border-white/10 text-white p-4 rounded-2xl w-full focus:outline-none focus:bg-white/10 focus:ring-1 focus:ring-[#6A2C91]/40 focus:shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-all duration-500 font-medium text-sm appearance-none ${props.className}`} 
  >
    {props.children}
  </select>
);

export const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xl z-50 flex items-center justify-center p-6 animate-in fade-in duration-500">
      <div className="luxury-card bg-[#0A0A0A] border border-white/10 rounded-[3rem] w-full max-w-xl overflow-hidden relative animate-in zoom-in-95 slide-up-5 duration-700">
        <div className="flex justify-between items-center p-4 sm:p-10 pb-6">
          <h3 className="font-serif text-3xl text-white tracking-tight">{title}</h3>
          <button 
            onClick={onClose} 
            className="p-3 -mr-2 text-white/30 hover:text-red-500 transition-colors rounded-full hover:bg-white/5"
            aria-label="Close modal"
          >
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>
        <div className="p-4 sm:p-10 pt-4 max-h-[80vh] overflow-y-auto scrollbar-hide">
            {children}
        </div>
      </div>
    </div>
  );
};

export const FileUploader: React.FC<{ 
  onUpload?: (files: File[]) => void; 
  acceptedFormats?: string; 
  label?: string;
}> = ({ onUpload, acceptedFormats = ".csv, .pdf, .xlsx, .xls", label = "Synaptic Data Ingestion" }) => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (newFiles: File[]) => {
    setFiles([...files, ...newFiles]);
    if (onUpload) onUpload(newFiles);
  };

  const removeFile = (idx: number) => {
    const newFiles = [...files];
    newFiles.splice(idx, 1);
    setFiles(newFiles);
  };

  return (
    <div className="w-full">
        <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-3 ml-1">{label}</label>
        <div 
            className={`relative border border-dashed rounded-[2rem] p-10 text-center transition-all duration-500 ${dragActive ? 'border-[#6A2C91] bg-purple-500/5 shadow-inner' : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-[#6A2C91]/30 hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)]'}`}
            onDragEnter={handleDrag} 
            onDragLeave={handleDrag} 
            onDragOver={handleDrag} 
            onDrop={handleDrop}
        >
            <input 
                ref={inputRef}
                type="file" 
                multiple 
                className="hidden" 
                onChange={handleChange}
                accept={acceptedFormats}
            />
            
            <div className="flex flex-col items-center gap-4 cursor-pointer" onClick={() => inputRef.current?.click()}>
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 ${dragActive ? 'bg-[#6A2C91] text-white shadow-lg shadow-purple-500/20 scale-110' : 'bg-white/10 text-white/30 shadow-sm group-hover:scale-105'}`}>
                    <Upload size={28} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-sm font-serif text-white tracking-tight">
                      Initialize Handshake
                  </p>
                  <p className="text-[10px] text-white/30 font-sans font-medium uppercase tracking-[0.2em] mt-2">
                      Drag files or click to browse
                  </p>
                </div>
            </div>
        </div>

        {files.length > 0 && (
            <div className="mt-6 space-y-3">
                {files.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] animate-in slide-up duration-500">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/5 rounded-xl text-[#6A2C91]">
                                <FileText size={20} strokeWidth={1.5} />
                            </div>
                            <div>
                                <p className="text-sm font-sans font-medium text-white truncate max-w-[200px]">{file.name}</p>
                                <p className="text-[10px] font-sans font-medium text-white/30 uppercase tracking-[0.2em] mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center">
                              <CheckCircle size={14} strokeWidth={2} />
                            </div>
                            <button onClick={() => removeFile(idx)} className="p-2 text-white/20 hover:text-red-500 transition-colors rounded-full hover:bg-white/5">
                                <X size={18} strokeWidth={1.5} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
  );
};

export const SocialMediaAuthModal = ({ isOpen, onClose, platform }: { isOpen: boolean; onClose: () => void; platform: string }) => {
    const { toggleChannelConnection } = useArtisanData();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isConnecting, setIsConnecting] = useState(false);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Authenticate ${platform}`}>
            <div className="space-y-6">
                <p className="text-white/60 font-sans font-light text-sm">
                    Enter your {platform} credentials to authorize automated scheduling and posting from the Artisan Flow Marketing Studio.
                </p>
                <Input 
                    placeholder="Email Address" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    className="w-full"
                />
                <Input 
                    placeholder="Password" 
                    type="password"
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className="w-full"
                />
                <Button 
                    onClick={() => {
                        setIsConnecting(true);
                        setTimeout(() => {
                            setIsConnecting(false);
                            toggleChannelConnection(platform);
                            onClose();
                            toast.success(`${platform} authenticated successfully.`);
                        }, 1500);
                    }} 
                    disabled={isConnecting}
                    className="w-full h-12 bg-[#6A2C91] hover:bg-[#5a257a] text-white rounded-xl font-sans font-bold tracking-widest text-[10px] uppercase"
                >
                    {isConnecting ? <Loader2 size={16} className="animate-spin mx-auto" /> : `Connect ${platform} Account`}
                </Button>
            </div>
        </Modal>
    );
};

export const HubCard = ({ title, icon: Icon, color, desc, onClick }: any) => (
  <div onClick={onClick} className="luxury-card bg-[#1A1A1A] border border-white/5 p-8 rounded-[2rem] hover:border-[#C5A059]/30 transition-all cursor-pointer group">
    <div className={"$color mb-6"}><Icon size={32} /></div>
    <h3 className="text-lg font-bold font-playfair text-white mb-2">{title}</h3>
    <p className="text-xs text-white/50 font-sans leading-relaxed">{desc}</p>
  </div>
);

