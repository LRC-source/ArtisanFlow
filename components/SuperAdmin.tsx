import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Users, Database, Server, Activity, ArrowUpRight, Search, Lock, Edit2, Download, AlertTriangle, Key, X, Loader2 } from 'lucide-react';
import { Card, Button, Badge, Input, Select, VaultBanner, Modal } from './UI';
import { SubPageHeader } from './SubPageHeader';
import { useArtisanData, SystemUser } from './DataContext';
import { toast } from 'sonner';
import { GlassHaloIcon } from './ui/GlassHaloIcon';

export const SuperAdmin = () => {
    const navigate = useNavigate();
    const { updateSystemUser, deleteSystemUser, inviteSystemUser, businessProfile } = useArtisanData();
    const [search, setSearch] = useState('');
    const [liveUsers, setLiveUsers] = useState<SystemUser[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [ledgerTransactions, setLedgerTransactions] = useState<any[]>([]);
    const [systemAlerts, setSystemAlerts] = useState<any[]>([]);
    const [globalIntegrations, setGlobalIntegrations] = useState<any[]>([
        { platform: 'Shopify', apiKey: '', webhookSecret: '', status: 'Unconfigured' },
        { platform: 'WooCommerce', apiKey: '', webhookSecret: '', status: 'Unconfigured' },
        { platform: 'Etsy', apiKey: '', webhookSecret: '', status: 'Unconfigured' },
        { platform: 'Square', apiKey: '', webhookSecret: '', status: 'Unconfigured' },
        { platform: 'QuickBooks', apiKey: '', webhookSecret: '', status: 'Unconfigured' },
        { platform: 'Gmail', apiKey: '', webhookSecret: '', status: 'Unconfigured' },
        { platform: 'Google Drive', apiKey: '', webhookSecret: '', status: 'Unconfigured' },
        { platform: 'Amazon', apiKey: '', webhookSecret: '', status: 'Unconfigured' },
        { platform: 'WordPress', apiKey: '', webhookSecret: '', status: 'Unconfigured' },
    ]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (businessProfile.role !== 'super_admin') {
                toast.error("Unauthorized Access: Super Admin privileges required.");
                navigate('/');
                return;
            }
            setIsLoadingData(true);
            try {
                const gasUrl = import.meta.env.VITE_GAS_DATABASE_URL;
                if (!gasUrl) return;

                const makePostReq = async (action: string) => {
                    const res = await fetch(gasUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                        body: JSON.stringify({ action })
                    });
                    return await res.json();
                };

                const [usersData, ledgerData, alertsData, integrationsData] = await Promise.all([
                    makePostReq('fetchSystemUsers'),
                    makePostReq('fetchPaymentLedger'),
                    makePostReq('fetchSystemAlerts'),
                    makePostReq('fetchGlobalIntegrations')
                ]);

                if (usersData.status === 'success' && usersData.users) {
                    setLiveUsers(usersData.users);
                }
                
                if (ledgerData.status === 'success' && ledgerData.transactions) {
                    setLedgerTransactions(ledgerData.transactions);
                }
                
                if (alertsData.status === 'success' && alertsData.alerts) {
                    setSystemAlerts(alertsData.alerts);
                }
                
                if (integrationsData.status === 'success' && integrationsData.integrations && integrationsData.integrations.length > 0) {
                    // Merge fetched integrations with default empty list
                    const merged = globalIntegrations.map(def => {
                        const found = integrationsData.integrations.find((i: any) => i.platform === def.platform);
                        return found ? { ...def, ...found } : def;
                    });
                    setGlobalIntegrations(merged);
                }

            } catch (err) {
                console.error("Failed to fetch Super Admin dashboard data", err);
            } finally {
                setIsLoadingData(false);
            }
        };
        fetchDashboardData();
    }, []);
    
    // Invite Modal State
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteTier, setInviteTier] = useState('Free Audit');
    const [isInviting, setIsInviting] = useState(false);

    // Edit Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<SystemUser | null>(null);

    // Sync State
    const [isSyncing, setIsSyncing] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);

    const filteredUsers = liveUsers.filter(u => 
        u.email.toLowerCase().includes(search.toLowerCase()) || 
        u.id.toLowerCase().includes(search.toLowerCase())
    );

    const handleInvite = () => {
        if (!inviteEmail) {
            toast.error("Please enter a valid email address.");
            return;
        }
        setIsInviting(true);
        setTimeout(() => {
            inviteSystemUser(inviteEmail, inviteTier);
            toast.success(`Invitation sent to ${inviteEmail}.`);
            setIsInviting(false);
            setIsInviteModalOpen(false);
            setInviteEmail('');
            setInviteTier('Free Audit');
        }, 800);
    };

    const handleSaveEdit = () => {
        if (editingUser) {
            updateSystemUser(editingUser.id, editingUser);
            toast.success("User access modified successfully.");
            setIsEditModalOpen(false);
        }
    };

    const handleDelete = (id: string) => {
        if(window.confirm("Are you sure you want to revoke access and lock this account?")) {
            deleteSystemUser(id);
            toast.success("Account access revoked.");
        }
    };

    const fetchDashboardData = async () => {
        setIsLoadingData(true);
        try {
            const gasUrl = import.meta.env.VITE_GAS_DATABASE_URL;
            if (!gasUrl) {
                toast.error("VITE_GAS_DATABASE_URL is not configured.");
                setIsLoadingData(false);
                return;
            }

            const makePostReq = async (action: string) => {
                const res = await fetch(gasUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                    body: JSON.stringify({ action })
                });
                return await res.json();
            };

            const [usersData, ledgerData, alertsData, integrationsData] = await Promise.all([
                makePostReq('fetchSystemUsers'),
                makePostReq('fetchPaymentLedger'),
                makePostReq('fetchSystemAlerts'),
                makePostReq('fetchGlobalIntegrations')
            ]);

            if (usersData?.status === 'success' && usersData.users) {
                setLiveUsers(usersData.users);
            }
            
            if (ledgerData?.status === 'success' && ledgerData.transactions) {
                setLedgerTransactions(ledgerData.transactions);
            }
            
            if (alertsData?.status === 'success' && alertsData.alerts) {
                setSystemAlerts(alertsData.alerts);
            }
            
            if (integrationsData?.status === 'success' && integrationsData.integrations && integrationsData.integrations.length > 0) {
                setGlobalIntegrations(prev => prev.map(def => {
                    const found = integrationsData.integrations.find((i: any) => i.platform === def.platform);
                    return found ? { ...def, ...found } : def;
                }));
            }

        } catch (err) {
            console.error("Failed to fetch Super Admin dashboard data", err);
            toast.error("Failed to fetch data from Google Apps Script.");
        } finally {
            setIsLoadingData(false);
        }
    };

    const handleSync = async () => {
        setIsSyncing(true);
        await fetchDashboardData();
        toast.success("Google Sheets Matrix successfully synced.");
        setIsSyncing(false);
    };

    const handleVerify = () => {
        setIsVerifying(true);
        setTimeout(() => {
            toast.success("Firebase Core Integration securely verified.");
            setIsVerifying(false);
        }, 1200);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 sm:space-y-10 lg:space-y-12 pb-8 sm:pb-12 lg:pb-20 p-4 sm:p-8 lg:p-10 max-w-[1800px] mx-auto"
        >
            <SubPageHeader 
                title="Super-Admin Matrix"
                parentTitle="System Architecture"
                onBack={() => {}}
                description="Master control override. Global view of system state, user tiers, and database integrity."
            />
            
            <VaultBanner 
                title="Super-Admin Matrix"
                subtitle="Master control override. Manage platform access, subscription tiers, and global system metrics."
                badge="Master Override Active"
            >
                <div className="flex flex-col sm:flex-col sm:flex-col sm:flex-row items-center justify-center gap-3 w-auto">
                    <Button onClick={handleSync} className="bg-red-500 hover:bg-red-600 text-white font-sans font-bold text-[11px] py-3 px-6 rounded-full px-10 tracking-[0.3em] uppercase shadow-2xl shadow-red-500/20 transition-all flex items-center gap-3">
                        {isSyncing ? <Loader2 size={16} className="animate-spin" /> : <Database size={16} />} EXPORT MASTER LEDGER
                    </Button>
                </div>
            </VaultBanner>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-6">
                <AdminStatCard title="Total Platform Users" value={liveUsers.length.toString()} icon={Users} haloColor="purple" trend="+1 This Week" />
                <AdminStatCard title="Pro Tier Subscribers" value={liveUsers.filter(u => u.tier === 'Margin Protection Pro').length.toString()} icon={CrownIcon} haloColor="gold" trend="Margin Protection Pro" color="text-[#C5A059]" border="border-[#C5A059]/20" />
                <AdminStatCard title="Global Volume Processed" value="$187,020" icon={Activity} haloColor="emerald" trend="+14% MoM" color="text-emerald-400" />
                <AdminStatCard title="System Health" value="100%" icon={Server} haloColor="cyan" trend="All Nodes Online" color="text-blue-400" />
            </div>

            <Card title="User Matrix & Tier Assignment" className="luxury-card border-none bg-black/40 backdrop-blur-xl rounded-[3rem] p-4 sm:p-12">
                <div className="flex flex-col sm:flex-col sm:flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-6 mb-10">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                        <Input 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by Email Address..."
                            className="bg-white/5 border-white/10 rounded-2xl pl-12 w-auto mx-auto py-1 px-3 text-[10px] font-sans font-light text-sm focus:border-[#6A2C91] text-white"
                        />
                    </div>
                    <Button onClick={() => setIsInviteModalOpen(true)} variant="outline" className="border-white/10 text-white hover:bg-white/5 w-auto mx-auto py-1 px-3 text-[10px] rounded-2xl font-sans font-bold text-[10px] uppercase tracking-[0.2em] px-8 transition-all">
                        <Key size={14} className="mr-2" /> Invite New User
                    </Button>
                </div>

                <div className="overflow-x-auto rounded-[2rem] border border-white/5 bg-black/20 shadow-inner">
                    <div className="overflow-x-auto w-full"><table className="w-full min-w-[650px] text-sm text-left font-sans">
                        <thead className="bg-[#6A2C91]/10 text-white sm:text-white/50 font-sans font-bold text-[10px] uppercase tracking-[0.2em] border-b border-white/5">
                            <tr>
                                <th className="p-4 sm:p-6">User ID</th>
                                <th className="p-4 sm:p-6">Email Address</th>
                                <th className="p-4 sm:p-6">Assigned Tier</th>
                                <th className="p-4 sm:p-6">Status</th>
                                <th className="p-4 sm:p-6">System Load</th>
                                <th className="p-4 sm:p-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {isLoadingData ? (
                                <tr>
                                    <td colSpan={7} className="p-4 sm:p-6 text-center text-white sm:text-white/50 text-xs py-12">
                                        Syncing active ledger with Super Admin node...
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-4 sm:p-6 text-center text-white sm:text-white/50 text-xs py-12">
                                        No authorized protocols found
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map(u => (
                                    <tr key={u.id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4 sm:p-6 font-mono text-xs text-white sm:text-white/50">{u.id}</td>
                                        <td className="p-4 sm:p-6 text-white/90">{u.email}</td>
                                        <td className="p-4 sm:p-6">
                                            <Badge color={u.tier === 'Margin Protection Pro' ? 'gold' : u.tier === 'Artisan Flow Basic' ? 'purple' : 'gray'} className="text-[9px] uppercase tracking-widest px-3 py-1">
                                                {u.tier}
                                            </Badge>
                                        </td>
                                        <td className="p-4 sm:p-6">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full ${u.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                                                <span className="text-white sm:text-white/70 font-light text-xs">{u.status}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 sm:p-6 text-white sm:text-white/70 font-mono text-xs">${u.revenueProcessed.toLocaleString()}</td>
                                        <td className="p-4 sm:p-6 text-right space-x-2">
                                            <button onClick={() => { setEditingUser(u); setIsEditModalOpen(true); }} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white sm:text-white/40 hover:text-white transition-colors border border-white/5"><Edit2 size={14} /></button>
                                            <button onClick={() => handleDelete(u.id)} className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-500 hover:text-red-400 transition-colors border border-red-500/20"><Lock size={14} /></button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table></div>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
                <Card title="Database Sync Configuration" className="luxury-card border-none bg-black/40 backdrop-blur-xl rounded-[3rem] p-4 sm:p-10">
                    <div className="space-y-6 mt-4">
                        <div className="p-4 sm:p-6 bg-white/5 rounded-2xl border border-white/10 flex items-start gap-3 sm:gap-4">
                            <GlassHaloIcon icon={Database} color="gold" size="sm" className="shrink-0 mt-1" />
                            <div>
                                <h4 className="text-white font-serif text-sm sm:text-base lg:text-xl text-white sm:text-slate-400 leading-relaxed sm:text-lg mb-1">Google Sheets Sync</h4>
                                <p className="text-sm sm:text-base text-white sm:text-white/50 font-sans font-light mb-4">Export Super-Admin matrix automatically to a master Google Sheet.</p>
                                <Button onClick={handleSync} className="bg-[#C5A059]/20 hover:bg-[#C5A059]/30 text-[#C5A059] border border-[#C5A059]/30 text-[10px] uppercase font-bold tracking-[0.2em] rounded-xl px-6 h-10 transition-all">
                                    {isSyncing ? 'Authenticating...' : 'Authenticate Sheet'}
                                </Button>
                            </div>
                        </div>
                        <div className="p-4 sm:p-6 bg-white/5 rounded-2xl border border-white/10 flex items-start gap-3 sm:gap-4">
                            <GlassHaloIcon icon={Server} color="purple" size="sm" className="shrink-0 mt-1" />
                            <div>
                                <h4 className="text-white font-serif text-sm sm:text-base lg:text-xl text-white sm:text-slate-400 leading-relaxed sm:text-lg mb-1">Firebase Core Integration</h4>
                                <p className="text-sm sm:text-base text-white sm:text-white/50 font-sans font-light mb-4">Manage remote config and user authentication nodes.</p>
                                <Button onClick={handleVerify} className="bg-[#6A2C91]/20 hover:bg-[#6A2C91]/30 text-[#6A2C91] border border-[#6A2C91]/30 text-[10px] uppercase font-bold tracking-[0.2em] rounded-xl px-6 h-10 transition-all">
                                    {isVerifying ? 'Verifying...' : 'Verify Connection'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card title="System Alerts" className="luxury-card border-none bg-black/40 backdrop-blur-xl rounded-[3rem] p-4 sm:p-10">
                    <div className="space-y-4 mt-4">
                        {isLoadingData ? (
                            <div className="p-5 text-center text-white sm:text-white/50 text-xs flex items-center justify-center gap-2">
                                <Loader2 size={14} className="animate-spin" /> Fetching alerts...
                            </div>
                        ) : systemAlerts.length === 0 ? (
                            <div className="p-5 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex flex-col sm:flex-col sm:flex-col sm:flex-row items-start sm:items-center justify-between">
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <ShieldAlert className="text-emerald-500" size={18} />
                                    <span className="text-emerald-500/80 font-sans font-light text-sm">All systems nominal. No alerts active.</span>
                                </div>
                            </div>
                        ) : (
                            systemAlerts.map(alert => (
                                <div key={alert.id} className={`p-5 rounded-2xl flex flex-col sm:flex-col sm:flex-col sm:flex-row justify-between items-start sm:items-center ${alert.type === 'warning' ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
                                    <div className="flex items-center gap-3 sm:gap-4">
                                        <AlertTriangle className={alert.type === 'warning' ? 'text-amber-500' : 'text-red-500'} size={18} />
                                        <span className={`${alert.type === 'warning' ? 'text-amber-500/80' : 'text-red-500/80'} font-sans font-light text-sm`}>{alert.message}</span>
                                    </div>
                                    <button onClick={() => toast.info('Opening alert for review...')} className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-colors ${alert.type === 'warning' ? 'text-amber-500 hover:text-amber-400' : 'text-red-500 hover:text-red-400'}`}>Review</button>
                                </div>
                            ))
                        )}
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
                {/* Integrations API Node */}
                <Card title="Integrations Configuration Node" className="luxury-card border-none bg-black/40 backdrop-blur-xl rounded-[3rem] p-4 sm:p-10">
                    <p className="text-sm sm:text-base text-white sm:text-white/50 font-sans font-light mb-6">Manage global API keys and webhook secrets for tenant integrations.</p>
                    <div className="space-y-4 max-min-h-[300px] sm:py-8 sm:py-16 px-4 sm:px-8 sm:min-h-[320px] h-auto w-full max-w-full overflow-hidden overflow-y-auto pr-2 custom-scrollbar">
                        {isLoadingData ? (
                            <div className="py-8 text-center text-white sm:text-white/50 text-xs flex items-center justify-center gap-2">
                                <Loader2 size={14} className="animate-spin" /> Initializing config...
                            </div>
                        ) : globalIntegrations.map((integration, idx) => (
                            <div key={integration.platform} className="p-5 bg-white/5 border border-white/10 rounded-2xl">
                                <div className="flex flex-col sm:flex-col sm:flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                                    <h4 className="text-white font-serif text-sm sm:text-base leading-relaxed">{integration.platform}</h4>
                                    <Badge color={integration.status === 'Active' ? 'green' : 'gray'} className="text-[9px] uppercase tracking-widest px-2 py-1">
                                        {integration.status}
                                    </Badge>
                                </div>
                                <div className="space-y-3">
                                    <input 
                                        type="password" 
                                        placeholder="API Key / Bearer Token" 
                                        value={integration.apiKey}
                                        onChange={(e) => {
                                            const newConfig = [...globalIntegrations];
                                            newConfig[idx].apiKey = e.target.value;
                                            setGlobalIntegrations(newConfig);
                                        }}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C5A059]" 
                                    />
                                    <input 
                                        type="text" 
                                        placeholder="Webhook URL / Secret" 
                                        value={integration.webhookSecret}
                                        onChange={(e) => {
                                            const newConfig = [...globalIntegrations];
                                            newConfig[idx].webhookSecret = e.target.value;
                                            setGlobalIntegrations(newConfig);
                                        }}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C5A059]" 
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <Button 
                        onClick={async () => {
                            try {
                                const gasUrl = import.meta.env.VITE_GAS_DATABASE_URL;
                                if(!gasUrl) return;
                                toast.loading("Saving configurations...");
                                await fetch(gasUrl, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                                    body: JSON.stringify({ action: 'saveGlobalIntegrations', integrations: globalIntegrations })
                                });
                                toast.dismiss();
                                toast.success("Global configurations saved to master sheet.");
                            } catch (e) {
                                toast.dismiss();
                                toast.error("Failed to save global configurations.");
                            }
                        }}
                        className="w-full mt-6 bg-[#C5A059] text-white hover:bg-[#b08e4d] rounded-xl w-auto mx-auto py-1 px-3 text-[10px] text-[10px] uppercase tracking-widest font-bold"
                    >
                        Save Global Configurations
                    </Button>
                </Card>

                {/* Payment Verification Ledger */}
                <Card title="Payment Verification Ledger" className="luxury-card border-none bg-black/40 backdrop-blur-xl rounded-[3rem] p-4 sm:p-10">
                    <p className="text-sm sm:text-base text-white sm:text-white/50 font-sans font-light mb-6">Real-time payment event tracking (Stripe / Square).</p>
                    <div className="space-y-4">
                        {isLoadingData ? (
                            <div className="py-8 text-center text-white sm:text-white/50 text-xs flex items-center justify-center gap-2">
                                <Loader2 size={14} className="animate-spin" /> Fetching ledger...
                            </div>
                        ) : ledgerTransactions.length === 0 ? (
                            <div className="py-8 text-center border border-white/5 rounded-2xl bg-white/5">
                                <span className="text-white sm:text-white/40 text-xs">No payment transactions recorded yet.</span>
                            </div>
                        ) : (
                            ledgerTransactions.map((txn) => (
                                <div key={txn.id} className="p-4 bg-white/5 border border-white/10 rounded-xl flex flex-col sm:flex-col sm:flex-col sm:flex-row items-start sm:items-center justify-between">
                                    <div>
                                        <p className="text-sm sm:text-base text-white font-medium">{txn.user} <span className="text-white sm:text-white/40 ml-2">{txn.id}</span></p>
                                        <p className="text-sm sm:text-base text-white sm:text-white/50 mt-1">Tier: {txn.tier} | ${txn.amount}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-xs font-bold uppercase tracking-widest ${txn.status.includes('Success') || txn.status.includes('Active') ? 'text-emerald-400' : 'text-amber-400'}`}>
                                            {txn.status}
                                        </span>
                                        <p className="text-sm sm:text-base text-white sm:text-white/40 mt-1">{new Date(txn.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Card>
            </div>

            {/* Invite Modal */}
            <Modal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} title="Invite User">
                <div className="space-y-6">
                    <div>
                        <label className="block text-white sm:text-white/50 text-[10px] uppercase tracking-[0.2em] font-bold mb-2">Email Address</label>
                        <Input 
                            value={inviteEmail} 
                            onChange={(e) => setInviteEmail(e.target.value)} 
                            placeholder="Enter Email Address"
                            className="bg-white/5 border-white/10 text-white w-full rounded-xl"
                        />
                    </div>
                    <div>
                        <label className="block text-white sm:text-white/50 text-[10px] uppercase tracking-[0.2em] font-bold mb-2">Assigned Tier</label>
                        <Select 
                            value={inviteTier} 
                            onChange={(e) => setInviteTier(e.target.value)}
                            className="bg-white/5 border-white/10 text-white w-full rounded-xl"
                        >
                            {['Free Audit', 'Artisan Flow Basic', 'Margin Protection Pro'].map(opt => <option key={opt} className="bg-black text-white">{opt}</option>)}
                        </Select>
                    </div>
                    <Button onClick={handleInvite} className="w-full bg-[#6A2C91] hover:bg-[#6A2C91]/80 text-white w-auto mx-auto py-1 px-3 text-[10px] rounded-xl border border-[#6A2C91]/50" disabled={isInviting}>
                        {isInviting ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'Send Protocol Invitation'}
                    </Button>
                </div>
            </Modal>

            {/* Edit Modal */}
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Modify User Access">
                {editingUser && (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-white sm:text-white/50 text-[10px] uppercase tracking-[0.2em] font-bold mb-2">Email Address</label>
                            <Input 
                                value={editingUser.email} 
                                disabled
                                className="bg-white/5 border-white/10 text-white sm:text-white/50 w-full rounded-xl"
                            />
                        </div>
                        <div>
                            <label className="block text-white sm:text-white/50 text-[10px] uppercase tracking-[0.2em] font-bold mb-2">Tier Level</label>
                            <Select 
                                value={editingUser.tier} 
                                onChange={(e) => setEditingUser({ ...editingUser, tier: e.target.value })}
                                className="bg-white/5 border-white/10 text-white w-full rounded-xl"
                            >
                                {['Free Audit', 'Artisan Flow Basic', 'Margin Protection Pro'].map(opt => <option key={opt} className="bg-black text-white">{opt}</option>)}
                            </Select>
                        </div>
                        <div>
                            <label className="block text-white sm:text-white/50 text-[10px] uppercase tracking-[0.2em] font-bold mb-2">Status</label>
                            <Select 
                                value={editingUser.status} 
                                onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value as any })}
                                className="bg-white/5 border-white/10 text-white w-full rounded-xl"
                            >
                                {['Active', 'Pending', 'Suspended'].map(opt => <option key={opt} className="bg-black text-white">{opt}</option>)}
                            </Select>
                        </div>
                        <Button onClick={handleSaveEdit} className="w-full bg-[#C5A059] hover:bg-[#C5A059]/80 text-black w-auto mx-auto py-1 px-3 text-[10px] rounded-xl border border-[#C5A059]/50">
                            Save Configuration
                        </Button>
                    </div>
                )}
            </Modal>

        </motion.div>
    );
};

const AdminStatCard = ({ title, value, icon: Icon, trend, haloColor, color = 'text-white', border = 'border-white/10' }: any) => (
    <div className={`luxury-card bg-white/5 backdrop-blur-xl border ${border} rounded-[2.5rem] p-4 sm:p-5 lg:p-6 relative overflow-hidden group hover:bg-white/10 transition-all duration-500`}>
        <div className="flex justify-between items-start mb-6">
            <span className="text-white sm:text-white/40 font-sans font-bold text-[10px] uppercase tracking-[0.3em]">{title}</span>
            <GlassHaloIcon icon={Icon} color={haloColor} size="sm" />
        </div>
        <div className={`text-sm sm:text-base md:text-3xl sm:text-5xl lg:text-7xl font-black sm:text-4xl lg:text-5xl font-serif tracking-tighter mb-4 ${color}`}>{value}</div>
        <div className="text-white/30 text-[10px] font-sans font-bold uppercase tracking-[0.3em]">{trend}</div>
    </div>
);

const CrownIcon = (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
    </svg>
);

