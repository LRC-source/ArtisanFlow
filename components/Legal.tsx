import React from 'react';
import { SubPageHeader } from './SubPageHeader';
import { Shield, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

export const TermsAndConditions = () => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto space-y-8"
        >
            <SubPageHeader title="Terms & Conditions" description="Please read these terms carefully before using ArtisanFlow." />
            
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-8 space-y-6 text-white/70">
                <section className="space-y-3">
                    <h2 className="text-[#C5A059] font-black text-xl uppercase tracking-widest">1. Acceptance of Terms</h2>
                    <p className="leading-relaxed">By accessing and using ArtisanFlow, you accept and agree to be bound by the terms and provision of this agreement. Any participation in this service will constitute acceptance of this agreement.</p>
                </section>
                
                <section className="space-y-3">
                    <h2 className="text-[#C5A059] font-black text-xl uppercase tracking-widest">2. Use License</h2>
                    <p className="leading-relaxed">Permission is granted to temporarily access the materials (information or software) on ArtisanFlow's proprietary system for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.</p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-[#C5A059] font-black text-xl uppercase tracking-widest">3. Disclaimer</h2>
                    <p className="leading-relaxed">The materials on ArtisanFlow's system are provided on an 'as is' basis. ArtisanFlow makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
                </section>
            </div>
        </motion.div>
    );
};

export const PrivacyPolicy = () => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto space-y-8"
        >
            <SubPageHeader title="Privacy Policy" description="How we collect, use, and protect your data." />
            
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-8 space-y-6 text-white/70">
                <section className="space-y-3">
                    <h2 className="text-[#C5A059] font-black text-xl uppercase tracking-widest">1. Data Collection</h2>
                    <p className="leading-relaxed">We collect information from you when you register on our site, place an order, subscribe to our newsletter, respond to a survey, or fill out a form. The collected information includes your name, email address, and operational metrics necessary for ArtisanFlow systems to function.</p>
                </section>
                
                <section className="space-y-3">
                    <h2 className="text-[#C5A059] font-black text-xl uppercase tracking-widest">2. Data Protection</h2>
                    <p className="leading-relaxed">We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information. We offer the use of a secure server. All supplied sensitive/credit information is transmitted via Secure Socket Layer (SSL) technology and then encrypted into our Database.</p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-[#C5A059] font-black text-xl uppercase tracking-widest">3. Ecosystem Data & AI Processing</h2>
                    <p className="leading-relaxed">Your privacy is our utmost priority. We do not sell, trade, or otherwise transfer your proprietary business data to any outside third parties. ArtisanFlow operates exclusively within the LRC Digital Systems ecosystem. Data processed by the Lola AI Assistant is strictly utilized internally across the LRC Digital Systems platform to continuously enhance our automated AI functions, providing you with a seamless, highly integrated, and increasingly intelligent operational experience.</p>
                </section>
            </div>
        </motion.div>
    );
};
