import React, { useState } from 'react';
import { Card, Button, Input, LRCLogo } from './UI';
import { useArtisanData, UserTier } from './DataContext';
import { TIER_CONFIGS, TierName } from '../context/TierContext';
import { Chrome, Mail, Lock, ArrowRight, ShieldCheck, Zap, Crown, CheckCircle, CreditCard, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { z } from 'zod';
import { toast } from 'sonner';
import { useLocation, useNavigate } from 'react-router-dom';
import { PaymentForm, CreditCard as SquareCreditCard } from 'react-square-web-payments-sdk';

export const AuthGateway = ({ initialView = 'login', selectedTier: propSelectedTier, onBack }: { initialView?: 'login' | 'signup' | 'tiers' | 'payment', selectedTier?: UserTier, onBack?: () => void }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const urlTier = queryParams.get('tier') as UserTier | null;
  const activeTier = propSelectedTier || urlTier || undefined;
  
  const { login, googleLogin, signUp } = useArtisanData();
  const [view, setView] = useState<'login' | 'signup' | 'tiers' | 'payment'>(
    activeTier ? (activeTier === 'Free Trial' ? 'signup' : 'payment') : initialView
  );
  const [selectedTier, setSelectedTier] = useState<UserTier | undefined>(activeTier);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [isNewUser, setIsNewUser] = useState(!!activeTier);
  const [hasPaid, setHasPaid] = useState(false);

  const authSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    pass: z.string().min(8, { message: "Password must be at least 8 characters long" })
  });

  const handleLogin = async (e?: React.FormEvent) => {
    if (e && e.preventDefault) e.preventDefault();

    const trimmedEmail = email.trim();
    const trimmedPass = pass.trim();

    if (!trimmedEmail) { toast.error("Please enter your email."); return; }
    if (trimmedPass.length < 8) { toast.error("Password must be at least 8 characters."); return; }

    const ADMIN_EMAILS = ['lacarmsu38@gmail.com', 'lcarter@lrcholisticmarketing.online', 'lrenee@herbalisticwellness.com'];

    if (view === 'signup') {
      if (ADMIN_EMAILS.includes(trimmedEmail.toLowerCase())) {
        try {
          await signUp({ email: trimmedEmail, name: 'Admin Hub', password: trimmedPass, tier: 'Pro Artisan', status: 'Active' });
        } catch (e: any) {
          toast.error(e.message || "Failed to initialize Admin access.");
        }
        return;
      }
      if (selectedTier === 'Free Trial') {
        try {
          await signUp({ email: trimmedEmail, password: trimmedPass, tier: 'Free Trial', status: 'Active' });
          navigate('/dashboard');
        } catch (e: any) {
          toast.error(e.message || "Account creation failed. You may already have an account.");
        }
      } else if (selectedTier) {
        // ALWAYS CREATE ACCOUNT FIRST (Pending Payment state)
        try {
          await signUp({ email: trimmedEmail, password: trimmedPass, tier: selectedTier, status: 'Pending Payment' });
          // If successful, transition view to payment
          setView('payment');
        } catch (e: any) {
          toast.error(e.message || "Account creation failed.");
        }
      } else {
        setView('tiers');
      }
    } else {
      try {
        await login(trimmedEmail, trimmedPass);
      } catch (err: any) {
        toast.error(err.message || "Failed to sign in. Please check your credentials.");
      }
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
          const ADMIN_EMAILS = ['lacarmsu38@gmail.com', 'lcarter@lrcholisticmarketing.online', 'lrenee@herbalisticwellness.com'];
          
          if (user.email && ADMIN_EMAILS.includes(user.email.toLowerCase())) {
            try {
              await signUp({ email: user.email, name: user.displayName || 'Admin Hub', password: '', tier: 'Pro Artisan', status: 'Active' });
              return;
            } catch (e: any) {
              console.error(e);
              toast.error(e.message || "Account creation failed. You may already have an account.");
            }
          }

          if (selectedTier === 'Free Trial') {
            try {
              await signUp({ email: user.email, name: user.displayName || 'New Artisan Business', password: '', tier: 'Free Trial', status: 'Active' });
              navigate('/dashboard');
            } catch (e: any) {
              console.error(e);
              toast.error(e.message || "Account creation failed. You may already have an account.");
            }
          } else if (selectedTier) {
            try {
              await signUp({ email: user.email, name: user.displayName || 'New Artisan Business', password: '', tier: selectedTier, status: 'Pending Payment' });
              setEmail(user.email); // Pre-fill the email state for the payment gateway
              setView('payment');
            } catch (e: any) {
              console.error(e);
              toast.error(e.message || "Account creation failed. You may already have an account.");
            }
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
          <TierSelection onSelect={async (tier) => {
            try {
              if (tier === 'Free Trial') {
                await signUp({ email, password: pass, tier, status: 'Active' });
              } else {
                setSelectedTier(tier);
                setView('payment');
              }
            } catch (error: any) {
              toast.error(error.message || "Account creation failed. Please try again.");
            }
          }} />
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
             onSuccess={() => {
                 setHasPaid(true);
                 setView('signup');
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
          className="min-h-screen flex items-center justify-center bg-black p-4 sm:p-6 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-black"></div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md z-10"
          >
            {onBack && (
              <button onClick={onBack} className="absolute -top-4 sm:p-12 left-0 text-sm font-bold text-white sm:text-white/50 hover:text-white transition-colors">
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
                     <span className="text-sm sm:text-base md:text-3xl sm:text-5xl lg:text-7xl font-black sm:text-4xl lg:text-5xl sm:text-5xl tracking-tight flex items-center font-extrabold">
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
              <Card className="luxury-card p-3.5 sm:p-6 lg:p-12 sm:p-4 sm:p-10 bg-black/40 backdrop-blur-3xl border-white/5">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl leading-relaxed font-serif text-white mb-8 flex items-center justify-center gap-3 text-center">
                  {view === 'login' ? <Lock size={18} className="text-[#C5A059]"/> : <Mail size={18} className="text-[#C5A059]"/>}
                  {view === 'login' ? 'Sign Into Your Account' : 'Create New Account'}
                </h2>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-sans text-white/30 uppercase tracking-[0.15em] ml-1">Email</label>
                    <Input
                      type="email"
                      autoComplete="email"
                      placeholder="alex@artisanflow.ai"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                      className="w-auto mx-auto py-1 px-3 text-[10px] bg-white/5 border-white/10 text-white focus-visible:ring-1 focus-visible:ring-[#C5A059]/50 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-sans text-white/30 uppercase tracking-[0.15em] ml-1">Password</label>
                    <Input
                      type="password"
                      autoComplete={view === 'login' ? 'current-password' : 'new-password'}
                      placeholder="••••••••"
                      value={pass}
                      onChange={e => setPass(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                      className="w-auto mx-auto py-1 px-3 text-[10px] bg-white/5 border-white/10 text-white focus-visible:ring-1 focus-visible:ring-[#C5A059]/50 transition-all"
                    />
                  </div>
                  <Button variant={view === 'login' ? 'success' : 'premium'} type="button" onClick={handleLogin} className="w-full md:w-full flex items-center justify-center w-auto mx-auto py-1 px-3 text-[10px] font-black tracking-widest shadow-2xl">
                    ENTER DASHBOARD <ArrowRight size={18} className="ml-1" />
                  </Button>
                </div>

                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                  <div className="relative flex justify-center text-[10px] font-black uppercase bg-transparent px-4 text-white/20 tracking-[0.2em]">Secure Entry Point</div>
                </div>

                <Button type="button" variant="outline" onClick={handleGoogleAuth} className="w-full md:w-full flex items-center justify-center w-auto mx-auto py-1 px-3 text-[10px] font-bold border-white/10 hover:bg-white/5 text-white transition-colors">
                  <Chrome size={18} className="mr-2 text-[#4285F4]" /> Continue with Google
                </Button>

                <div className="mt-4">
                  <Button 
                    type="button"
                    variant="primary"
                    onClick={() => { setView(view === 'login' ? 'signup' : 'login'); setIsNewUser(view === 'login'); }}
                    className="w-full md:w-full flex items-center justify-center w-auto mx-auto py-1 px-3 text-[10px] font-bold bg-[#6A2C91] hover:bg-purple-800 border-none text-white transition-colors"
                  >
                    {view === 'login' ? "Don't have an access key? Initialize here" : "Already Have An Account? Sign In Here"}
                  </Button>
                </div>
              </Card>

              <div className="mt-6 sm:mt-8 lg:mt-12 flex items-center justify-center gap-3 sm:gap-6 opacity-30">
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
  const [isYearly, setIsYearly] = useState(true);

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-4 sm:p-6 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="carbon-texture"></div>
      <div className="light-streak-top"></div>
      <div className="light-streak-bottom"></div>
      <div className="light-streak-left"></div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#6A2C91_0%,transparent_60%)] opacity-30"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,#C5A059_0%,transparent_60%)] opacity-20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#10b981_0%,transparent_70%)] opacity-10"></div>

      <div className="max-w-6xl w-full z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-10"
        >
           <h1 className="text-xl sm:text-3xl lg:text-5xl font-bold sm:font-black font-serif tracking-tight text-white mb-4">Select Your Architecture</h1>
           <p className="text-sm sm:text-base text-white sm:text-white/50 leading-relaxed mb-8">Every great system starts with a solid foundation. Choose the tier that aligns with your operational scale.</p>
           
           <div className="flex justify-center items-center gap-4 mb-4">
               <span className={`text-sm font-semibold tracking-wider ${!isYearly ? 'text-white' : 'text-gray-500'}`}>MONTHLY</span>
               <button 
                   onClick={() => setIsYearly(!isYearly)}
                   className="w-16 h-8 bg-white/10 rounded-full p-1 relative transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
               >
                   <div className={`w-6 h-6 bg-gradient-to-r from-[#A855F7] to-[#C5A059] rounded-full shadow-md transform transition-transform duration-300 ${isYearly ? 'translate-x-8' : 'translate-x-0'}`} />
               </button>
               <span className={`text-sm font-semibold tracking-wider ${isYearly ? 'text-white' : 'text-gray-500'}`}>ANNUALLY <span className="text-[#10b981] ml-2 text-xs">(-20%)</span></span>
           </div>
           <div className="inline-block bg-[#C5A059]/20 text-[#C5A059] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-[#C5A059]/50 shadow-[0_0_15px_rgba(197,160,89,0.2)]">
               🔥 Charter Offer: First 25 Makers get 50% OFF Year One!
           </div>
        </motion.div>

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.15 } }
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6 lg:gap-4 sm:px-12"
        >
           <TierCard 
             title="Basic Artisan" 
             price={isYearly ? "$147" : "$15"}
             period={isYearly ? "/yr" : "/mo"}
             icon={ShieldCheck} 
             color="bg-slate-500"
             features={['Core Vault Modules (Ops, Fin, Mktg)', 'Lola AI: FAST Mode Only', '15 AI Questions / Day', 'Universal CSV Importer', 'Inventory Tracking']}
             onSelect={() => onSelect('Basic Artisan' as any)}
           />
           <TierCard 
             title="Pro Artisan" 
             price={isYearly ? "$297" : "$29"}
             period={isYearly ? "/yr" : "/mo"}
             isPopular 
             icon={Zap}
             color="bg-[#A855F7]"
             features={['Everything in Basic, plus:', 'Profit GuardT Real-Time Alerts', 'Lola AI: FAST + THINK Modes', '50 AI Questions / Day', 'Advanced Demand Forecasting']}
             onSelect={() => onSelect('Pro Artisan' as any)}
           />
           <TierCard 
             title="Master Artisan" 
             price={isYearly ? "$797" : "$79"}
             period={isYearly ? "/yr" : "/mo"}
             icon={Crown}
             color="bg-[#C5A059]"
             features={['Everything in Pro, plus:', 'Lola AI: SEARCH Mode (Live Web)', '150 AI Questions / Day', 'All Current & Future Vault Modules', 'Priority Support & Onboarding']}
             onSelect={() => onSelect('Master Artisan' as any)}
           />
        </motion.div>
        
        <div className="mt-8 text-center">
            <button onClick={() => onSelect('Free Trial' as any)} className="text-sm text-gray-400 hover:text-white underline decoration-gray-600 transition-colors">
                Or start with a 14-Day Free Trial (No Credit Card Required)
            </button>
        </div>
      </div>
    </div>
  );
};
const TierCard = ({ title, price, period, features, icon: Icon, color, isPopular, onSelect }: any) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
    }}
    className="h-full"
  >
    <Card className={`luxury-card relative flex flex-col h-full p-4 sm:p-10 bg-black/40 backdrop-blur-3xl border-white/5 ${isPopular ? 'ring-1 ring-[#C5A059]/30' : ''}`}>
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#C5A059] text-white text-[9px] font-sans uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-sm">
          Recommended
        </div>
      )}
      <div className="mb-10">
        <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center mb-6 bg-white/5 text-white border border-white/10`}>
          <Icon size={24} strokeWidth={1.5} />
        </div>
        <h3 className="text-lg sm:text-2xl lg:text-3xl font-black font-serif tracking-tight text-white mb-4">{title}</h3>
        <div className="flex items-baseline mt-4">
          <span className="text-xl sm:text-3xl lg:text-5xl font-bold sm:font-black font-serif tracking-tight text-white mb-4">{price}</span>
          <span className="text-white/30 text-xs font-sans tracking-widest uppercase ml-2">/month</span>
        </div>
      </div>

      <div className="space-y-5 mb-12 flex-1">
        {features.map((f: string) => (
          <div key={f} className="flex items-start gap-3 sm:gap-4">
            <CheckCircle size={18} className="text-[#C5A059] shrink-0 mt-0.5" strokeWidth={1.5} />
            <span className="text-sm font-sans text-white sm:text-white/60 leading-relaxed">{f}</span>
          </div>
        ))}
      </div>

      <Button 
        variant={isPopular ? 'premium' : 'outline'} 
        onClick={onSelect}
        className={`w-full w-auto mx-auto py-1 px-3 text-[10px] font-sans text-[11px] font-medium tracking-[0.2em] uppercase transition-all duration-300 ${isPopular ? 'shadow-2xl' : 'border-white/10 text-white hover:bg-white/5'}`}
      >
        Initialize {title}
      </Button>
    </Card>
  </motion.div>
);

export const PaymentGateway = ({ tier, email, onSuccess, onBack }: { tier: UserTier, email: string, onSuccess: () => void, onBack: () => void }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { activateAccount } = useArtisanData();
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

  const [isYearly, setIsYearly] = useState(false);
  const tierConfig = TIER_CONFIGS[tier as TierName] || TIER_CONFIGS['Pro Artisan'];
  const finalAmountInCents = isYearly ? tierConfig.yearlyPrice * 100 : tierConfig.monthlyPrice * 100;

  const handlePayment = async (token?: string) => {
    setIsProcessing(true);

    try {
      if (!token) throw new Error("Missing payment token");
      
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceId: token,
          amount: finalAmountInCents,
          currency: 'USD'
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Payment authorization was declined by the gateway.');
      }

      // Activate the account locally and in Firestore now that payment cleared!
      await activateAccount();

      // Payment successfully captured by Square backend! 
      
      // LOG TO GOOGLE SHEETS
      const gasUrl = import.meta.env.VITE_GAS_DATABASE_URL;
      if (gasUrl) {
        try {
          fetch(gasUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'processPayment', // Updated to match user's GAS script
              payload: {
                userId: email, // Changed from email to userId to match processPayment
                email: email, // Kept for safety
                customerName: email,
                tier: tier,
                amount: finalAmountInCents, 
                status: 'Successful',
                date: new Date().toISOString(),
                transactionId: result.paymentId || 'square_tx_captured'
              }
            })
          }).catch(console.error);
        } catch (e) {
          console.error("Failed to log payment to GAS", e);
        }
      }

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
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 relative overflow-hidden bg-[#0A0A0A]">
      <div className="carbon-texture"></div>
      <button onClick={onBack} className="absolute top-4 sm:p-6 lg:p-8 left-10 text-sm font-bold text-white sm:text-white/50 hover:text-white transition-colors z-20">
        &larr; Back to Account Creation
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl z-10"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-serif tracking-tight text-white mb-4">Secure Checkout</h2>
          <p className="text-sm sm:text-base text-white sm:text-white/50 font-sans tracking-widest uppercase">Initializing {tier} Architecture</p>
          <div className="mt-6 flex flex-col items-center gap-4">
            <div className="flex items-center justify-center gap-4 text-sm font-bold tracking-widest uppercase">
              <span className={!isYearly ? "text-white" : "text-gray-500"}>Monthly</span>
              <button 
                  onClick={() => setIsYearly(!isYearly)}
                  className="relative w-14 h-7 bg-white/10 rounded-full flex items-center transition-all p-1"
              >
                  <div className={`w-5 h-5 bg-gradient-to-r from-[#06B6D4] to-[#A855F7] rounded-full shadow-lg transform transition-transform ${isYearly ? 'translate-x-7' : 'translate-x-0'}`} />
              </button>
              <span className={isYearly ? "text-white flex items-center gap-2" : "text-gray-500 flex items-center gap-2"}>
                  Yearly <span className="bg-gradient-to-r from-[#06B6D4] to-[#A855F7] text-transparent bg-clip-text text-[10px] bg-white/10 border border-white/20 px-2 py-0.5 rounded-full">Save ~15%</span>
              </span>
            </div>
            
            <div className="inline-block px-8 py-3 rounded-full border border-[#C5A059]/50 bg-[#C5A059]/20 shadow-[0_0_15px_rgba(197,160,89,0.3)]">
              <span className="text-xl sm:text-2xl font-black tracking-widest text-[#E2C792]">TOTAL: ${(finalAmountInCents / 100).toFixed(2)} {isYearly ? '/ yr' : '/ mo'}</span>
            </div>
          </div>
        </div>

        <Card className="luxury-card p-3.5 sm:p-6 lg:p-12 sm:p-4 sm:p-10 bg-black/60 backdrop-blur-3xl border-white/10 shadow-2xl">
          <div className="space-y-8">
            {/* Billing Details */}
            <div className="space-y-4">
              <h3 className="text-lg sm:text-2xl lg:text-3xl text-white font-serif leading-relaxed mb-4 border-b border-white/10 pb-2">Billing Details</h3>
              <div className="space-y-2">
                <label className="text-[10px] font-sans text-white/30 uppercase tracking-[0.15em] ml-1">Full Name</label>
                <Input type="text" placeholder="" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-white/5 border-white/10 text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-sans text-white/30 uppercase tracking-[0.15em] ml-1">Street Address</label>
                <Input type="text" placeholder="" required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="bg-white/5 border-white/10 text-white" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                <div className="col-span-1 space-y-2">
                  <label className="text-[10px] font-sans text-white/30 uppercase tracking-[0.15em] ml-1">City</label>
                  <Input type="text" placeholder="" required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="bg-white/5 border-white/10 text-white" />
                </div>
                <div className="col-span-1 space-y-2">
                  <label className="text-[10px] font-sans text-white/30 uppercase tracking-[0.15em] ml-1">State</label>
                  <Input type="text" placeholder="" required value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className="bg-white/5 border-white/10 text-white" />
                </div>
                <div className="col-span-1 space-y-2">
                  <label className="text-[10px] font-sans text-white/30 uppercase tracking-[0.15em] ml-1">ZIP</label>
                  <Input type="text" placeholder="" required value={formData.zip} onChange={e => setFormData({...formData, zip: e.target.value})} className="bg-white/5 border-white/10 text-white" />
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="space-y-4 pt-4">
              <h3 className="text-lg sm:text-2xl lg:text-3xl text-white font-serif leading-relaxed mb-4 border-b border-white/10 pb-2 flex items-center gap-2">
                <CreditCard size={18} className="text-[#C5A059]" /> Payment Information
              </h3>
              
              <PaymentForm
                applicationId={(import.meta as any).env.VITE_SQUARE_APP_ID || 'sq0idp-Xv5GTHrrJ5sC2kVOm2wR-g'}
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
                  {isProcessing ? "PROCESSING SECURE PAYMENT..." : `PAY $${(finalAmountInCents / 100).toFixed(2)} & INITIALIZE`}
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

