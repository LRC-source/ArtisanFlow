import React from 'react';
import { useFunnelMetrics } from '../../hooks/useFunnelMetrics';
import { motion } from 'framer-motion';
import { ArrowRight, Calculator, Activity, ShieldCheck, Star, PackageOpen, Zap } from 'lucide-react';
import './MakerFunnel.css';

const MakerFunnel = () => {
  const { trackCtaClick } = useFunnelMetrics();
  const navigateToAuth = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    trackCtaClick('');
    window.location.href = '/auth?tier=Free%20Audit';
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const staggerContainer = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true, margin: "-100px" },
    transition: { staggerChildren: 0.2 }
  };

  return (
    <div className="mf-container">
      {/* Hero Section */}
      <section className="mf-hero">
        <motion.div 
          className="mf-hero-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="mf-badge">For Bespoke Handcrafters & Artisans</span>
          <h1 className="mf-title">Stop Guessing. Start Profiting.</h1>
          <p className="mf-subtitle">
            Whether you make candles, jewelry, soap, or baked goods, guessing your material costs and labor means you're likely losing money. Take control of your margins today.
          </p>
          <a href="/auth?tier=Free%20Audit" onClick={navigateToAuth} className="mf-cta-primary">
            Calculate Your True Margins <ArrowRight size={20} />
          </a>
        </motion.div>
      </section>

      {/* Problem Section */}
      <section className="mf-section">
        <motion.div 
          initial="initial"
          whileInView="whileInView"
          variants={fadeInUp}
        >
          <h2 className="mf-section-title">The Artisan's Dilemma</h2>
          <p className="mf-section-subtitle">You put your heart into your craft, but pricing it feels like a shot in the dark.</p>
        </motion.div>

        <motion.div 
          className="mf-grid"
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
        >
          <motion.div className="mf-card" variants={fadeInUp}>
            <div className="mf-icon-wrapper">
              <Calculator size={28} />
            </div>
            <h3 className="mf-card-title">Underpricing Products</h3>
            <p className="mf-card-desc">
              Relying on competitor pricing or gut feelings leaves money on the table. You are undervaluing your unique skills and time.
            </p>
          </motion.div>

          <motion.div className="mf-card" variants={fadeInUp}>
            <div className="mf-icon-wrapper">
              <PackageOpen size={28} />
            </div>
            <h3 className="mf-card-title">Material Cost Chaos</h3>
            <p className="mf-card-desc">
              Fluctuating costs for wax, essential oils, metals, and packaging make it impossible to know your true COGS (Cost of Goods Sold).
            </p>
          </motion.div>

          <motion.div className="mf-card" variants={fadeInUp}>
            <div className="mf-icon-wrapper">
              <Activity size={28} />
            </div>
            <h3 className="mf-card-title">Lost Labor Hours</h3>
            <p className="mf-card-desc">
              You're working for free. When you don't accurately factor in your active making time and prep time, your hourly wage drops to zero.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Solution Section */}
      <section className="mf-section mf-solution">
        <motion.div 
          initial="initial"
          whileInView="whileInView"
          variants={fadeInUp}
        >
          <h2 className="mf-section-title">Meet Artisan Flow</h2>
          <p className="mf-section-subtitle">The intelligent toolkit designed specifically for makers to protect their profits.</p>
        </motion.div>

        <motion.div 
          className="mf-grid"
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
        >
          <motion.div className="mf-card" variants={fadeInUp}>
            <div className="mf-icon-wrapper">
              <ShieldCheck size={28} />
            </div>
            <h3 className="mf-card-title">BOM Manager</h3>
            <p className="mf-card-desc">
              Build exact Bill of Materials for every product. Track every drop of oil, gram of wax, and inch of wire down to the penny.
            </p>
          </motion.div>

          <motion.div className="mf-card" variants={fadeInUp}>
            <div className="mf-icon-wrapper">
              <Zap size={28} />
            </div>
            <h3 className="mf-card-title">Profit Guard</h3>
            <p className="mf-card-desc">
              Set your target profit margins and hourly labor rates. Artisan Flow instantly calculates the exact retail and wholesale prices you need.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Testimonial / Social Proof */}
      <section className="mf-section">
        <motion.div 
          className="mf-testimonial"
          initial="initial"
          whileInView="whileInView"
          variants={fadeInUp}
        >
          <div className="mf-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} size={24} fill="currentColor" />
            ))}
          </div>
          <p className="mf-quote">
            "Before Artisan Flow, I was selling my hand-poured candles for $25 because that's what everyone else did. I realized I was actually losing $2 per candle when accounting for my time. Now, I price confidently at $42 and my customers happily pay it."
          </p>
          <img 
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150" 
            alt="Sarah M." 
            className="mf-author-img"
          />
          <div className="mf-author">Sarah M.</div>
          <div className="mf-author-title">Founder, Lumina Candle Co.</div>
        </motion.div>
      </section>

      {/* Footer CTA */}
      <section className="mf-footer">
        <motion.div 
          initial="initial"
          whileInView="whileInView"
          variants={fadeInUp}
        >
          <h2 className="mf-title" style={{ fontSize: '3rem', marginBottom: '32px' }}>Ready to value your craft?</h2>
          <a href="/auth?tier=Free%20Audit" onClick={navigateToAuth} className="mf-cta-primary">
            Calculate Your True Margins <ArrowRight size={20} />
          </a>
        </motion.div>
      </section>
    </div>
  );
};

export default MakerFunnel;


