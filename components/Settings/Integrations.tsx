import { useArtisanData } from '../DataContext';
import { db, auth } from '../../services/firebase';
import { collection, addDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { ShoppingBag, Globe, Share2, ArrowLeft, Loader2, Link as LinkIcon, Database, HardDrive, Bell } from 'lucide-react';
import { Button, Card, Badge, Modal, Input } from '../UI';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { UniversalImporter } from '../UniversalImporter';

export const Integrations = () => {
    const { isDemoMode } = useArtisanData();
    const navigate = useNavigate();
    const [notifyEmail, setNotifyEmail] = useState('');
    const [activeModal, setActiveModal] = useState<string | null>(null);

    const platformCards = [
        { id: 'etsy', name: 'Etsy', icon: <ShoppingBag size={24} />, category: 'Marketplace', status: 'Coming Soon', desc: 'Sync orders and update stock back to Etsy instantly.' },
        { id: 'shopify', name: 'Shopify', icon: <Globe size={24} />, category: 'E-commerce', status: 'Coming Soon', desc: 'Two-way sync for materials, products, and fulfillment.' },
        { id: 'woocommerce', name: 'WooCommerce', icon: <Share2 size={24} />, category: 'E-commerce', status: 'Coming Soon', desc: 'Connect your self-hosted WooCommerce store using REST API.' },
        { id: 'square', name: 'Square POS', icon: <Database size={24} />, category: 'POS', status: 'Coming Soon', desc: 'Sync in-person sales and deduct from master inventory.' },
        { id: 'gdrive', name: 'Google Drive', icon: <HardDrive size={24} />, category: 'Storage', status: 'Coming Soon', desc: 'Auto-backup your ledger and store recipe attachments.' },
    ];

    const handleNotifyMe = async () => {
        if (!notifyEmail) {
            toast.error("Please enter your email to be notified.");
            return;
        }
        
        try {
            const uid = auth.currentUser ? auth.currentUser.uid : 'anonymous';
            if (!isDemoMode) await addDoc(collection(db, 'integrationWaitlist'), {
                email: notifyEmail,
                platform: activeModal,
                uid: uid,
                createdAt: new Date().toISOString()
            });
            toast.success("You will be notified as soon as this integration is live!");
            setActiveModal(null);
            setNotifyEmail('');
        } catch (e: any) {
            toast.error("Failed to join waitlist. Please try again.");
            console.error(e);
        }
    };
    
    const [wooUrl, setWooUrl] = useState('');
    const [wooKey, setWooKey] = useState('');
    const [wooSecret, setWooSecret] = useState('');
    
    const handleWooConnect = async () => {
        if (!wooUrl || !wooKey || !wooSecret) {
            toast.error("Please fill out all fields.");
            return;
        }
        
        try {
            const token = auth.currentUser ? await auth.currentUser.getIdToken() : '';
            const res = await fetch('/api/woocommerce-validate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ url: wooUrl, key: wooKey, secret: wooSecret })
            });
            
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Failed to validate WooCommerce store.");
            }
            
            toast.success("WooCommerce Store Connected Successfully!");
            setActiveModal(null);
            
            // Mark connected in UI
            const el = document.getElementById('woocommerce-status');
            if (el) el.innerHTML = 'Connected';
            
        } catch (e: any) {
            toast.error(e.message || "Failed to connect.");
        }
    };


    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 sm:p-8 lg:p-10 space-y-6 sm:space-y-10 lg:space-y-12 max-w-7xl mx-auto pb-8 sm:pb-12 lg:pb-20"
        >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <button onClick={() => navigate('/command-center')} className="flex items-center gap-2 text-white/50 hover:text-[#C5A059] font-sans text-xs uppercase tracking-widest transition-colors mb-6 w-fit">
                        <ArrowLeft size={16} /> Back to Dashboard
                    </button>
                    <h1 className="text-3xl lg:text-5xl font-bold font-serif tracking-tight text-white mb-4">Connections Hub</h1>
                    <p className="text-base text-white/40 font-sans font-light max-w-2xl">
                        Connect Artisan Flow to your storefronts and migrate your legacy data. We are building native integrations to keep your stock perfectly synced.
                    </p>
                </div>
            </div>

            {/* Direct Connect Platforms */}
            <div>
                <h2 className="text-xl font-bold text-white mb-6 font-serif">Native Integrations</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {platformCards.map(platform => (
                        <Card key={platform.id} className="bg-white/5 border border-white/10 p-6 flex flex-col justify-between hover:bg-white/10 transition-colors">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white">
                                        {platform.icon}
                                    </div>
                                    <Badge id={`${platform.id}-status`} color="gray" className="text-[10px] uppercase">{platform.status}</Badge>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">{platform.name}</h3>
                                <p className="text-sm text-white/50">{platform.desc}</p>
                            </div>
                            <Button 
                                variant="outline" 
                                className="w-full mt-6 border-white/20 text-white hover:bg-white/10"
                                onClick={() => setActiveModal(platform.name)}
                            >
                                <><Bell size={16} className="mr-2" /> COMING SOON</>
                            </Button>
                        </Card>
                    ))}
                </div>
            </div>

            <hr className="border-white/10 my-12" />

            {/* Universal Importer Module */}
            <div id="migration-tool">
                <UniversalImporter />
            </div>

            {/* Notify Modal */}
            <Modal isOpen={!!activeModal} onClose={() => setActiveModal(null)} title={`${activeModal} Integration`}>
                <div className="space-y-4">
                    <p className="text-sm text-white/70">
                        We're building this integration now. Enter your email to be notified when it goes live. for our <strong>{activeModal}</strong>. 
                        Enter your email below to get early access the moment it goes live.
                    </p>
                    <Input 
                        placeholder="your@email.com" 
                        value={notifyEmail} 
                        onChange={(e: any) => setNotifyEmail(e.target.value)} 
                    />
                    <Button className="w-full bg-[#C5A059] text-black hover:bg-[#b08d4a]" onClick={handleNotifyMe}>
                        Notify Me
                    </Button>
                </div>
            </Modal>
        </motion.div>
    );
};
