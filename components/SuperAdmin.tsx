import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Users, Database, Server, Activity, ArrowUpRight, Search, Lock, Edit2, Download, AlertTriangle, Key, X, Loader2 } from 'lucide-react';
import { Card, Button, Badge, Input, Select, VaultBanner, Modal } from './UI';
import { SubPageHeader } from './SubPageHeader';
import { useArtisanData, SystemUser } from './DataContext';
import { toast } from 'sonner';

export const SuperAdmin = () => {
    const { systemUsers, updateSystemUser, deleteSystemUser, inviteSystemUser } = useArtisanData();
    const [search, setSearch] = useState('');
    
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

    const filteredUsers = systemUsers.filter(u => 
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

    const handleSync = () => {
        setIsSyncing(true);
        setTimeout(() => {
            toast.success("Google Sheets Matrix successfully synced.");
            setIsSyncing(false);
        }, 1200);
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
            className="space-y-12 pb-20 p-10 md:p-16 max-w-[1600px] mx-auto"
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
                <div className="flex gap-4">
                    <Button onClick={handleSync} className="bg-red-500 hover:bg-red-600 text-white font-sans font-bold text-[11px] h-16 rounded-full px-10 tracking-[0.3em] uppercase shadow-2xl shadow-red-500/20 transition-all flex items-center gap-3">
                        {isSyncing ? <Loader2 size={16} className="animate-spin" /> : <Database size={16} />} EXPORT MASTER LEDGER
                    </Button>
                </div>
            </VaultBanner>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <AdminStatCard title="Total Platform Users" value={systemUsers.length.toString()} icon={Users} trend="+1 This Week" />
                <AdminStatCard title="Pro Tier Subscribers" value={systemUsers.filter(u => u.tier === 'Margin Protection Pro').length.toString()} icon={CrownIcon} trend="Margin Protection Pro" color="text-[#C5A059]" border="border-[#C5A059]/20" />
                <AdminStatCard title="Global Volume Processed" value="$187,020" icon={Activity} trend="+14% MoM" color="text-emerald-400" />
                <AdminStatCard title="System Health" value="100%" icon={Server} trend="All Nodes Online" color="text-blue-400" />
            </div>

            <Card title="User Matrix & Tier Assignment" className="luxury-card border-none bg-black/40 backdrop-blur-xl rounded-[3rem] p-12">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                        <Input 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by Email Address..."
                            className="bg-white/5 border-white/10 rounded-2xl pl-12 h-14 font-sans font-light text-sm focus:border-[#6A2C91] text-white"
                        />
                    </div>
                    <Button onClick={() => setIsInviteModalOpen(true)} variant="outline" className="border-white/10 text-white hover:bg-white/5 h-14 rounded-2xl font-sans font-bold text-[10px] uppercase tracking-[0.2em] px-8 transition-all">
                        <Key size={14} className="mr-2" /> Invite New User
                    </Button>
                </div>

                <div className="overflow-x-auto rounded-[2rem] border border-white/5 bg-black/20 shadow-inner">
                    <table className="w-full text-sm text-left font-sans">
                        <thead className="bg-[#6A2C91]/10 text-white/50 font-sans font-bold text-[10px] uppercase tracking-[0.2em] border-b border-white/5">
                            <tr>
                                <th className="p-6">User ID</th>
                                <th className="p-6">Email Address</th>
                                <th className="p-6">Assigned Tier</th>
                                <th className="p-6">Status</th>
                                <th className="p-6">System Load</th>
                                <th className="p-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredUsers.map(u => (
                                <tr key={u.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-6 font-mono text-xs text-white/50">{u.id}</td>
                                    <td className="p-6 text-white/90">{u.email}</td>
                                    <td className="p-6">
                                        <Badge color={u.tier === 'Margin Protection Pro' ? 'gold' : u.tier === 'Artisan Flow Basic' ? 'purple' : 'gray'} className="text-[9px] uppercase tracking-widest px-3 py-1">
                                            {u.tier}
                                        </Badge>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${u.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                                            <span className="text-white/70 font-light text-xs">{u.status}</span>
                                        </div>
                                    </td>
                                    <td className="p-6 text-white/70 font-mono text-xs">${u.revenueProcessed.toLocaleString()}</td>
                                    <td className="p-6 text-right space-x-2">
                                        <button onClick={() => { setEditingUser(u); setIsEditModalOpen(true); }} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-colors border border-white/5"><Edit2 size={14} /></button>
                                        <button onClick={() => handleDelete(u.id)} className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-500 hover:text-red-400 transition-colors border border-red-500/20"><Lock size={14} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card title="Database Sync Configuration" className="luxury-card border-none bg-black/40 backdrop-blur-xl rounded-[3rem] p-10">
                    <div className="space-y-6 mt-4">
                        <div className="p-6 bg-white/5 rounded-2xl border border-white/10 flex items-start gap-4">
                            <Database className="text-[#C5A059] shrink-0 mt-1" size={20} />
                            <div>
                                <h4 className="text-white font-serif text-xl mb-1">Google Sheets Sync</h4>
                                <p className="text-white/50 text-sm font-sans font-light mb-4">Export Super-Admin matrix automatically to a master Google Sheet.</p>
                                <Button onClick={handleSync} className="bg-[#C5A059]/20 hover:bg-[#C5A059]/30 text-[#C5A059] border border-[#C5A059]/30 text-[10px] uppercase font-bold tracking-[0.2em] rounded-xl px-6 h-10 transition-all">
                                    {isSyncing ? 'Authenticating...' : 'Authenticate Sheet'}
                                </Button>
                            </div>
                        </div>
                        <div className="p-6 bg-white/5 rounded-2xl border border-white/10 flex items-start gap-4">
                            <Server className="text-[#6A2C91] shrink-0 mt-1" size={20} />
                            <div>
                                <h4 className="text-white font-serif text-xl mb-1">Firebase Core Integration</h4>
                                <p className="text-white/50 text-sm font-sans font-light mb-4">Manage remote config and user authentication nodes.</p>
                                <Button onClick={handleVerify} className="bg-[#6A2C91]/20 hover:bg-[#6A2C91]/30 text-[#6A2C91] border border-[#6A2C91]/30 text-[10px] uppercase font-bold tracking-[0.2em] rounded-xl px-6 h-10 transition-all">
                                    {isVerifying ? 'Verifying...' : 'Verify Connection'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card title="System Alerts" className="luxury-card border-none bg-black/40 backdrop-blur-xl rounded-[3rem] p-10">
                    <div className="space-y-4 mt-4">
                        <div className="p-5 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <AlertTriangle className="text-amber-500" size={18} />
                                <span className="text-amber-500/80 font-sans font-light text-sm">2 Users approaching API rate limits.</span>
                            </div>
                            <button className="text-[10px] text-amber-500 font-bold uppercase tracking-[0.2em] hover:text-amber-400">Review</button>
                        </div>
                        <div className="p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <ShieldAlert className="text-emerald-500" size={18} />
                                <span className="text-emerald-500/80 font-sans font-light text-sm">Automated backup completed successfully.</span>
                            </div>
                            <button className="text-[10px] text-emerald-500 font-bold uppercase tracking-[0.2em] hover:text-emerald-400">Log</button>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Invite Modal */}
            <Modal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} title="Invite User">
                <div className="space-y-6">
                    <div>
                        <label className="block text-white/50 text-[10px] uppercase tracking-[0.2em] font-bold mb-2">Email Address</label>
                        <Input 
                            value={inviteEmail} 
                            onChange={(e) => setInviteEmail(e.target.value)} 
                            placeholder="Enter Email Address"
                            className="bg-white/5 border-white/10 text-white w-full rounded-xl"
                        />
                    </div>
                    <div>
                        <label className="block text-white/50 text-[10px] uppercase tracking-[0.2em] font-bold mb-2">Assigned Tier</label>
                        <Select 
                            value={inviteTier} 
                            onChange={(e) => setInviteTier(e.target.value)}
                            className="bg-white/5 border-white/10 text-white w-full rounded-xl"
                        >
                            {['Free Audit', 'Artisan Flow Basic', 'Margin Protection Pro'].map(opt => <option key={opt} className="bg-black text-white">{opt}</option>)}
                        </Select>
                    </div>
                    <Button onClick={handleInvite} className="w-full bg-[#6A2C91] hover:bg-[#6A2C91]/80 text-white h-12 rounded-xl border border-[#6A2C91]/50" disabled={isInviting}>
                        {isInviting ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'Send Protocol Invitation'}
                    </Button>
                </div>
            </Modal>

            {/* Edit Modal */}
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Modify User Access">
                {editingUser && (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-white/50 text-[10px] uppercase tracking-[0.2em] font-bold mb-2">Email Address</label>
                            <Input 
                                value={editingUser.email} 
                                disabled
                                className="bg-white/5 border-white/10 text-white/50 w-full rounded-xl"
                            />
                        </div>
                        <div>
                            <label className="block text-white/50 text-[10px] uppercase tracking-[0.2em] font-bold mb-2">Tier Level</label>
                            <Select 
                                value={editingUser.tier} 
                                onChange={(e) => setEditingUser({ ...editingUser, tier: e.target.value })}
                                className="bg-white/5 border-white/10 text-white w-full rounded-xl"
                            >
                                {['Free Audit', 'Artisan Flow Basic', 'Margin Protection Pro'].map(opt => <option key={opt} className="bg-black text-white">{opt}</option>)}
                            </Select>
                        </div>
                        <div>
                            <label className="block text-white/50 text-[10px] uppercase tracking-[0.2em] font-bold mb-2">Status</label>
                            <Select 
                                value={editingUser.status} 
                                onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value as any })}
                                className="bg-white/5 border-white/10 text-white w-full rounded-xl"
                            >
                                {['Active', 'Pending', 'Suspended'].map(opt => <option key={opt} className="bg-black text-white">{opt}</option>)}
                            </Select>
                        </div>
                        <Button onClick={handleSaveEdit} className="w-full bg-[#C5A059] hover:bg-[#C5A059]/80 text-black h-12 rounded-xl border border-[#C5A059]/50">
                            Save Configuration
                        </Button>
                    </div>
                )}
            </Modal>

        </motion.div>
    );
};

const AdminStatCard = ({ title, value, icon: Icon, trend, color = 'text-white', border = 'border-white/10' }: any) => (
    <div className={`luxury-card bg-white/5 backdrop-blur-xl border ${border} rounded-[2.5rem] p-8 relative overflow-hidden group hover:bg-white/10 transition-all duration-500`}>
        <div className="flex justify-between items-start mb-6">
            <span className="text-white/40 font-sans font-bold text-[10px] uppercase tracking-[0.3em]">{title}</span>
            <div className={`p-3 rounded-xl bg-white/5 ${color} border border-white/5`}>
                <Icon size={18} strokeWidth={1.5} />
            </div>
        </div>
        <div className={`text-4xl font-serif tracking-tighter mb-4 ${color}`}>{value}</div>
        <div className="text-white/30 text-[10px] font-sans font-bold uppercase tracking-[0.3em]">{trend}</div>
    </div>
);

const CrownIcon = (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
    </svg>
);
