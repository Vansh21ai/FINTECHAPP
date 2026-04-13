import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const policies = [
  {
    id: 1,
    name: 'AI Cyber Shield',
    icon: '🛡️',
    premium: '₹899 / mo',
    coverage: '₹25,00,000',
    status: 'Active',
    statusColor: 'text-emerald-400',
    badgeColor: 'bg-emerald-400/15 border-emerald-400/30',
    description: 'Full protection against data breaches, ransomware, identity theft, and AI-generated fraud.',
    tags: ['Cyber', 'Identity', 'AI Fraud'],
  },
  {
    id: 2,
    name: 'Digital Asset Protection',
    icon: '💎',
    premium: '₹1,299 / mo',
    coverage: '₹50,00,000',
    status: 'Active',
    statusColor: 'text-indigo-400',
    badgeColor: 'bg-indigo-400/15 border-indigo-400/30',
    description: 'Covers crypto wallets, NFTs, digital securities, and UPI-linked account loss.',
    tags: ['Crypto', 'NFTs', 'UPI'],
  },
  {
    id: 3,
    name: 'Next-Gen Auto',
    icon: '🚗',
    premium: '₹2,199 / mo',
    coverage: '₹1,00,00,000',
    status: 'Recommended',
    statusColor: 'text-amber-400',
    badgeColor: 'bg-amber-400/15 border-amber-400/30',
    description: 'Zero-depreciation EV cover with OTA update failure protection and autonomous driving liability.',
    tags: ['EV', 'Autonomous', 'Zero-Dep'],
  },
  {
    id: 4,
    name: 'Health Infinity+',
    icon: '🩺',
    premium: '₹3,499 / mo',
    coverage: '₹2,00,00,000',
    status: 'Active',
    statusColor: 'text-emerald-400',
    badgeColor: 'bg-emerald-400/15 border-emerald-400/30',
    description: 'Unlimited hospitalisation, mental wellness sessions, and gene-therapy trials covered globally.',
    tags: ['Unlimited', 'Mental Health', 'Global'],
  },
];

const scenarios = [
  { name: 'Car Accident', covered: true },
  { name: 'Health Issue', covered: true },
  { name: 'Phone Drop', covered: false },
  { name: 'Flight Delay', covered: true },
  { name: 'Cyber Attack', covered: true },
  { name: 'Crypto Theft', covered: true },
];

const InsurancePage = () => {
  const [activeScenario, setActiveScenario] = useState('Car Accident');
  const activeCoverage = scenarios.find(s => s.name === activeScenario)?.covered;

  return (
    <div className="relative min-h-screen w-full overflow-hidden">

      {/* ── 3D Umbrella Backdrop ── */}
      <iframe
        src="https://my.spline.design/umbrella-S1wKkIQe09hFlyZutWBR2uhC/"
        frameBorder="0"
        className="absolute inset-0 w-full h-full z-0 pointer-events-none"
        title="Umbrella 3D"
      />

      {/* Dark overlay so text stays legible */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-br from-slate-900/70 via-indigo-900/50 to-slate-900/70" />

      {/* ── Foreground UI ── */}
      <div className="relative z-10 min-h-screen flex flex-col px-4 py-6 md:px-10 md:py-8 max-w-[1200px] mx-auto">

        {/* Top Nav */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl border border-white/20 text-white font-bold text-sm shadow transition-all hover:pr-5 group"
          >
            <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
            Back to Dashboard
          </Link>
          <div className="text-white/50 font-bold text-sm tracking-wider uppercase hidden sm:block">
            2026 Protection Suite
          </div>
        </div>

        {/* Hero Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
            2026 Protection<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-teal-300">
              Plans
            </span>
          </h1>
          <p className="text-white/50 mt-2 text-sm font-medium max-w-md">
            AI-curated insurance stack built for your digital-first lifestyle. Every policy adapts to your risk profile in real time.
          </p>
        </motion.div>

        {/* Main Grid */}
        <div className="flex flex-col lg:flex-row gap-6 flex-1">

          {/* Left — Policy Cards */}
          <div className="flex flex-col gap-4 w-full lg:w-2/3">
            <h2 className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Suggested 2026 Policies</h2>
            {policies.map((policy, i) => (
              <motion.div
                key={policy.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="group bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/15 hover:border-white/30 rounded-2xl p-5 flex items-start gap-4 cursor-pointer transition-all hover:-translate-y-0.5 shadow-lg"
              >
                {/* Icon */}
                <div className="text-3xl mt-0.5 flex-shrink-0">{policy.icon}</div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-white font-bold text-base">{policy.name}</span>
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${policy.badgeColor} ${policy.statusColor}`}>
                      {policy.status}
                    </span>
                  </div>
                  <p className="text-white/50 text-xs leading-relaxed mb-3">{policy.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {policy.tags.map(tag => (
                      <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-white/10 text-white/60 font-semibold border border-white/10">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-6">
                    <div>
                      <div className="text-[10px] text-white/40 uppercase tracking-wider">Premium</div>
                      <div className="text-white font-bold text-sm">{policy.premium}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-white/40 uppercase tracking-wider">Coverage</div>
                      <div className="text-emerald-300 font-bold text-sm">{policy.coverage}</div>
                    </div>
                  </div>
                </div>

                {/* Arrow */}
                <div className="text-white/20 group-hover:text-white/60 text-xl transition-colors self-center flex-shrink-0">→</div>
              </motion.div>
            ))}
          </div>

          {/* Right — Coverage Simulator */}
          <div className="w-full lg:w-1/3 flex flex-col gap-4">

            {/* Scenario Simulator Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5"
            >
              <h3 className="text-white/60 text-xs font-bold uppercase tracking-widest mb-4">Live Coverage Simulator</h3>

              {/* Dynamic Shield */}
              <div className="flex items-center justify-center py-6 relative">
                <div className={`absolute w-28 h-28 rounded-full animate-ping ${activeCoverage ? 'bg-emerald-400/15' : 'bg-red-400/15'}`} style={{ animationDuration: '2.5s' }} />
                <div className={`w-20 h-20 rounded-full flex items-center justify-center border-2 shadow-xl ${activeCoverage ? 'border-emerald-400/40 bg-emerald-400/10' : 'border-red-400/40 bg-red-400/10'}`}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                    className={activeCoverage ? 'text-emerald-300' : 'text-red-400'}>
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="absolute bottom-2">
                  <div className="bg-white/10 backdrop-blur px-4 py-1.5 rounded-full border border-white/20 flex items-center gap-2">
                    <span className="text-xs font-bold text-white/70">{activeScenario}:</span>
                    <span className={`text-xs font-black tracking-wider ${activeCoverage ? 'text-emerald-300' : 'text-red-400'}`}>
                      {activeCoverage ? '✓ COVERED' : '✗ NOT COVERED'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Scenario Buttons */}
              <div className="grid grid-cols-2 gap-2 mt-2">
                {scenarios.map((scenario, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveScenario(scenario.name)}
                    className={`text-xs font-semibold p-2.5 rounded-xl border transition-all flex items-center justify-between
                      ${activeScenario === scenario.name
                        ? 'bg-white/20 border-white/40 text-white'
                        : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'
                      }`}
                  >
                    <span>{scenario.name}</span>
                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${scenario.covered ? 'bg-emerald-400' : 'bg-red-400'} ${activeScenario === scenario.name ? 'animate-pulse' : ''}`} />
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Summary Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5"
            >
              <h3 className="text-white/60 text-xs font-bold uppercase tracking-widest mb-4">Your Coverage Summary</h3>
              <div className="flex flex-col gap-3">
                {[
                  { label: 'Active Policies', value: '3', color: 'text-emerald-300' },
                  { label: 'Total Coverage', value: '₹3.75 Cr', color: 'text-indigo-300' },
                  { label: 'Monthly Premium', value: '₹7,896', color: 'text-white' },
                  { label: 'Claim Success Rate', value: '98.6%', color: 'text-teal-300' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="flex justify-between items-center border-b border-white/10 pb-2 last:border-0 last:pb-0">
                    <span className="text-xs text-white/50 font-medium">{label}</span>
                    <span className={`text-sm font-black ${color}`}>{value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default InsurancePage;
