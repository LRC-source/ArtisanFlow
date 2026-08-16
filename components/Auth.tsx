import React, { useState } from 'react';
import { Card, Button, Input, LRCLogo } from './UI';
import { useArtisanData, UserTier } from './DataContext';
import { Chrome, Mail, Lock, ArrowRight, ShieldCheck, Zap, Crown, CheckCircle, CreditCard, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { z } from 'zod';
import { toast } from 'sonner';
import { useLocation } from 'react-router-dom';
import { PaymentForm, CreditCard as SquareCreditCard } from 'react-square-web-payments-sdk';

export const AuthGateway = ({ initialView = 'login', selectedTier: propSelectedTier, onBack }: { initialView?: 'login' | 'signup' | 'tiers' | 'payment', selectedTier?: UserTier, onBack?: () => void }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const urlTier = queryParams.get('tier') as UserTier | null;
  const activeTier = propSelectedTier || urlTier || undefined;
  
  const { login, googleLogin, signUp } = useArtisanData();
  const [view, setView] = useState<'login' | 'signup' | 'tiers' | 'payment'>(
    activeTier ? (activeTier === 'Free Audit' ? 'signup' : 'payment') : initialView
  );
  const [selectedTier, setSelectedTier] = useState<UserTier | undefined>(activeTier);
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [isNewUser, setIsNewUser] = useState(!!activeTier);

  const authSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    pass: z.string().min(8, { message: "Vault Key (Password) must be at least 8 characters long" })
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = authSchema.safeParse({ email, pass });
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }

    if (view === 'signup') {
      if (selectedTier === 'Free Audit') {
        try {
          await signUp({ email, password: pass, tier: 'Free Audit', status: 'Active' });
        } catch (e) {
          toast.error("Account creation failed. You may already have an account with this email.");
        }
      } else if (selectedTier) {
        setView('payment');
      } else {
        setView('tiers');
      }
    } else {
      await login(email, pass);
    }
  };

  const handleGoogleAuth = async () => {
    /* 
     * PRODUCTION OAUTH INTEGRATION TEMPLATE:
     * To transition away from mock authentication, swap the code below with your provider:
     *
     * 1. Firebase Auth:
     *    import { auth, googleProvider } from '../services/firebase';
     *    import { signInWithPopup } from 'firebase/auth';
     *    const result = await signInWithPopup(auth, googleProvider);
     *    const user = result.user;
     *
     * 2. Supabase Auth:
     *    import { supabase } from '../services/supabase';
     *    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } });
     *
     * 3. Native OAuth 2.0 Redirect:
     *    const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID;
     *    const REDIRECT_URI = window.location.origin + '/oauth/callback';
     *    const OAUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?` +
     *      `client_id=${CLIENT_ID}&` +
     *      `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
     *      `response_type=token&` +
     *      `scope=openid%20email%20profile`;
     *    window.location.href = OAUTH_URL;
     *    return;
     */

    try {
      const user = await googleLogin();
      if (user) {
        if (isNewUser) {
          if (selectedTier === 'Free Audit') {
            try {
              await signUp({ email: user.email, name: user.displayName || 'New Artisan Business', password: '', tier: 'Free Audit', status: 'Active' });
            } catch (e) {
              console.error(e);
            }
          } else if (selectedTier) {
            setEmail(user.email); // Pre-fill the email state for the payment gateway
            setView('payment');
          } else {
            setEmail(user.email);
            setView('tiers');
          }
        }
        // If not new user, onAuthStateChanged in DataContext will handle routing automatically.
      }
    } catch (error) {
      console.error("Google OAuth handshake failed:", error);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {view === 'tiers' ? (
        <motion.div
          key="tiers"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="w-full min-h-screen"
        >
          <TierSelection onSelect={(tier) => signUp({ email, password: pass, tier, status: 'Active' })} />
        </motion.div>
      ) : view === 'payment' && selectedTier ? (
        <motion.div
          key="payment"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="w-full min-h-screen"
        >
          <PaymentGateway 
             tier={selectedTier} 
             email={email}
             onSuccess={async () => {
               try {
                 await signUp({ email, password: pass, tier: selectedTier, status: 'Active' });
               } catch (e) {
                 alert("Account creation failed. You may already have an account with this email.");
               }
             }}
             onBack={() => setView('signup')} 
          />
        </motion.div>
      ) : (
        <motion.div
          key="auth"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="min-h-screen flex items-center justify-center bg-black p-6 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-black"></div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md z-10"
          >
            {onBack && (
              <button onClick={onBack} className="absolute -top-4 sm:p-12 left-0 text-sm font-bold text-white/50 hover:text-white transition-colors">
                &larr; Back to Platform
              </button>
            )}
            <div className="flex flex-col items-center mb-12">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                className="relative mb-8"
              >
                 <div className="flex items-center justify-center cursor-pointer group">
                     <span className="text-4xl sm:text-5xl tracking-tight flex items-center font-extrabold">
                         <span className="text-white mr-3">LRC</span>
                         <span className="text-white">Artisan</span>
                         <span className="font-black bg-gradient-to-r from-[#06B6D4] via-[#A855F7] via-[#D946EF] to-[#C5A059] text-transparent bg-clip-text">Flow</span>
                     </span>
                 </div>
              </motion.div>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                className="text-white/30 font-sans text-sm mt-3 tracking-wide uppercase text-[10px] font-medium"
              >
                Orchestrating High-Precision Manufacturing
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
            >
              <Card className="luxury-card p-4 sm:p-8 sm:p-4 sm:p-10 bg-black/40 backdrop-blur-3xl border-white/5">
                <h2 className="text-lg font-serif text-white mb-8 flex items-center justify-center gap-3 text-center">
                  {view === 'login' ? <Lock size={18} className="text-[#C5A059]"/> : <Mail size={18} className="text-[#C5A059]"/>}
                  {view === 'login' ? 'Sign Into Your Account' : 'Create New Account'}
                </h2>

                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-sans text-white/30 uppercase tracking-[0.15em] ml-1">Work Email</label>
                    <Input type="email" placeholder="alex@artisanflow.ai" value={email} onChange={e => setEmail(e.target.value)} required className="h-12 bg-white/5 border-white/10 text-white focus-visible:ring-1 focus-visible:ring-[#C5A059]/50 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-sans text-white/30 uppercase tracking-[0.15em] ml-1">Vault Key (Password)</label>
                    <Input type="password" placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} required className="h-12 bg-white/5 border-white/10 text-white focus-visible:ring-1 focus-visible:ring-[#C5A059]/50 transition-all" />
                  </div>

                  <Button variant={view === 'login' ? 'success' : 'premium'} type="submit" className="w-full md:w-full flex items-center justify-center h-12 font-black tracking-widest shadow-2xl">
                    ENTER DASHBOARD <ArrowRight size={18} className="ml-1" />
                  </Button>
                </form>

                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                  <div className="relative flex justify-center text-[10px] font-black uppercase bg-transparent px-4 text-white/20 tracking-[0.2em]">Secure Entry Point</div>
                </div>

                <Button type="button" variant="outline" onClick={handleGoogleAuth} className="w-full md:w-full flex items-center justify-center h-12 font-bold border-white/10 hover:bg-white/5 text-white">
                  <Chrome size={18} className="mr-2 text-[#4285F4]" /> Continue with Google
                </Button>

                <div className="mt-4">
                  <Button 
                    type="button"
                    variant="primary"
                    onClick={() => { setView(view === 'login' ? 'signup' : 'login'); setIsNewUser(view === 'login'); }}
                    className="w-full md:w-full flex items-center justify-center h-12 font-bold bg-[#6A2C91] hover:bg-purple-800 border-none text-white transition-colors"
                  >
                    {view === 'login' ? "Don't have an access key? Initialize here" : "Already Have An Account? Sign In Here"}
                  </Button>
                </div>
              </Card>

              <div className="mt-12 flex items-center justify-center gap-6 opacity-30">
                <ShieldCheck size={24} className="text-white" />
                <div className="h-4 w-px bg-white/20"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-white">End-to-End Encryption Active</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const TierSelection = ({ onSelect }: { onSelect: (tier: UserTier) => void }) => {
  return (
    <div className="min-h-screen bg-[#0A0A0A] p-6 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="carbon-texture"></div>
      <div className="light-streak-top"></div>
      <div className="light-streak-bottom"></div>
      <div className="light-streak-left"></div>

      {/* Ombre Brand Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#6A2C91_0%,transparent_60%)] opacity-30"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,#C5A059_0%,transparent_60%)] opacity-20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#10b981_0%,transparent_70%)] opacity-10"></div>

      <div className="max-w-6xl w-full z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
           <h1 className="text-5xl font-serif text-white mb-6 tracking-tight">Select Your Architecture</h1>
           <p className="text-white/50 text-lg font-sans max-w-2xl mx-auto font-light leading-relaxed">Every great system starts with a solid foundation. Choose the tier that aligns with your operational scale.</p>
        </motion.div>

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.15 } }
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:p-8 lg:gap-4 sm:p-12"
        >
           <TierCard 
             title="Free Audit" 
             price="$0" 
             icon={ShieldCheck} 
             color="bg-slate-500"
             features={['Public Resources', 'Initial Strategy Session', 'Manual Batch Entry', 'Basic Inventory List']}
             onSelect={() => onSelect('Free Audit')}
           />
           <TierCard 
             title="Artisan Flow Basic" 
             price="$49" 
             isPopular 
             icon={Zap}
             color="bg-[#6A2C91]"
             features={['Omnichannel Sync', 'Automated Inventory', 'Lola AI Basic Access', 'Production Scheduler']}
             onSelect={() => onSelect('Artisan Flow Basic')}
           />
           <TierCard 
             title="Margin Protection Pro" 
             price="$149" 
             icon={Crown}
             color="bg-[#C5A059]"
             features={['Everything in Basic', 'Margin Anomaly Detection', 'AI Competitive Intelligence', 'Advanced Forecast Generator']}
             onSelect={() => onSelect('Margin Protection Pro')}
           />
        </motion.div>
      </div>
    </div>
  );
};

const TierCard = ({ title, price, features, icon: Icon, color, isPopular, onSelect }: any) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
    }}
    className="h-full"
  >
    <Card className={`luxury-card relative flex flex-col h-full p-10 bg-black/40 backdrop-blur-3xl border-white/5 ${isPopular ? 'ring-1 ring-[#C5A059]/30' : ''}`}>
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#C5A059] text-white text-[9px] font-sans uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-sm">
          Recommended
        </div>
      )}
      <div className="mb-10">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-white/5 text-white border border-white/10`}>
          <Icon size={24} strokeWidth={1.5} />
        </div>
        <h3 className="text-2xl font-serif text-white tracking-tight mb-2">{title}</h3>
        <div className="flex items-baseline mt-4">
          <span className="text-4xl font-serif text-white">{price}</span>
          <span className="text-white/30 text-xs font-sans tracking-widest uppercase ml-2">/month</span>
        </div>
      </div>

      <div className="space-y-5 mb-12 flex-1">
        {features.map((f: string) => (
          <div key={f} className="flex items-start gap-4">
            <CheckCircle size={18} className="text-[#C5A059] shrink-0 mt-0.5" strokeWidth={1.5} />
            <span className="text-sm font-sans text-white/60 leading-relaxed">{f}</span>
          </div>
        ))}
      </div>

      <Button 
        variant={isPopular ? 'premium' : 'outline'} 
        onClick={onSelect}
        className={`w-full h-14 font-sans text-[11px] font-medium tracking-[0.2em] uppercase transition-all duration-300 ${isPopular ? 'shadow-2xl' : 'border-white/10 text-white hover:bg-white/5'}`}
      >
        Initialize {title}
      </Button>
    </Card>
  </motion.div>
);

export const PaymentGateway = ({ tier, email, onSuccess, onBack }: { tier: UserTier, email: string, onSuccess: () => void, onBack: () => void }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    cardNumber: '',
    expiry: '',
    cvc: ''
  });

  const handlePayment = async (token?: string) => {
    setIsProcessing(true);

    try {
      if (!token) throw new Error("Missing payment token");
      
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceId: token,
          amount: tier === 'Margin Protection Pro' ? 14900 : 4900, // in cents
          currency: 'USD'
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Payment authorization was declined by the gateway.');
      }

      // Payment successfully captured by Square backend! Proceed with granting access.
      setIsProcessing(false);
      onSuccess();
    } catch (error: any) {
      console.error("Payment error:", error);
      setIsProcessing(false);
      toast.error(error.message || "Payment failed. Please check your credentials.");
      // CRITICAL: Removed the demo onSuccess() call here so failed payments actually block entry.
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[#0A0A0A]">
      <div className="carbon-texture"></div>
      <button onClick={onBack} className="absolute top-4 sm:p-10 left-10 text-sm font-bold text-white/50 hover:text-white transition-colors z-20">
        &larr; Back to Account Creation
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl z-10"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-serif text-white tracking-tight mb-3">Secure Checkout</h2>
          <p className="text-white/50 font-sans text-sm tracking-widest uppercase">Initializing {tier} Architecture</p>
          <div className="mt-4 inline-block px-6 py-2 rounded-full border border-[#C5A059]/30 bg-[#C5A059]/10">
            <span className="text-xl font-serif text-[#C5A059]">Total: ${tier === 'Margin Protection Pro' ? '149.00' : '49.00'} / mo</span>
          </div>
        </div>

        <Card className="luxury-card p-4 sm:p-8 sm:p-4 sm:p-10 bg-black/60 backdrop-blur-3xl border-white/10 shadow-2xl">
          <div className="space-y-8">
            {/* Billing Details */}
            <div className="space-y-4">
              <h3 className="text-white font-serif text-lg mb-4 border-b border-white/10 pb-2">Billing Details</h3>
              <div className="space-y-2">
                <label className="text-[10px] font-sans text-white/30 uppercase tracking-[0.15em] ml-1">Full Name</label>
                <Input type="text" placeholder="Alex Morgan" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-white/5 border-white/10 text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-sans text-white/30 uppercase tracking-[0.15em] ml-1">Street Address</label>
                <Input type="text" placeholder="123 Artisan Way" required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="bg-white/5 border-white/10 text-white" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1 space-y-2">
                  <label className="text-[10px] font-sans text-white/30 uppercase tracking-[0.15em] ml-1">City</label>
                  <Input type="text" placeholder="New York" required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="bg-white/5 border-white/10 text-white" />
                </div>
                <div className="col-span-1 space-y-2">
                  <label className="text-[10px] font-sans text-white/30 uppercase tracking-[0.15em] ml-1">State</label>
                  <Input type="text" placeholder="NY" required value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className="bg-white/5 border-white/10 text-white" />
                </div>
                <div className="col-span-1 space-y-2">
                  <label className="text-[10px] font-sans text-white/30 uppercase tracking-[0.15em] ml-1">ZIP</label>
                  <Input type="text" placeholder="10001" required value={formData.zip} onChange={e => setFormData({...formData, zip: e.target.value})} className="bg-white/5 border-white/10 text-white" />
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="space-y-4 pt-4">
              <h3 className="text-white font-serif text-lg mb-4 border-b border-white/10 pb-2 flex items-center gap-2">
                <CreditCard size={18} className="text-[#C5A059]" /> Payment Information
              </h3>
              
              <PaymentForm
                applicationId={(import.meta as any).env.VITE_SQUARE_APP_ID || 'sandbox-sq0idb-app-id'}
                locationId={(import.meta as any).env.VITE_SQUARE_LOCATION_ID || 'L7APSEDCE2RJX'}
                cardTokenizeResponseReceived={async (tokenResult: any, verifiedBuyer?: any) => {
                  if (tokenResult.status === 'OK') {
                    await handlePayment(tokenResult.token);
                  } else {
                    toast.error("Payment tokenization failed. Please check your card details.");
                    console.error("Tokenization error:", tokenResult.errors);
                  }
                }}
              >
                <SquareCreditCard
                  buttonProps={{
                    css: {
                      backgroundColor: '#6A2C91',
                      fontSize: '14px',
                      color: '#fff',
                      height: '56px',
                      fontWeight: '900',
                      letterSpacing: '0.1em',
                      '&:hover': {
                        backgroundColor: '#522272',
                      },
                    },
                    isLoading: isProcessing,
                  }}
                  focus="cardNumber"
                >
                  {isProcessing ? "PROCESSING SECURE PAYMENT..." : `PAY $${tier === 'Margin Protection Pro' ? '149.00' : '49.00'} & INITIALIZE`}
                </SquareCreditCard>
              </PaymentForm>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-white/30 mt-4">
              <ShieldCheck size={14} />
              <span className="text-[9px] uppercase tracking-widest">256-bit SSL Encrypted Transaction</span>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

