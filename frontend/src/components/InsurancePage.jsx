import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const POLICIES = [
  {
    id: 1,
    type: 'Health Insurance',
    provider: 'Star Health',
    premium: '₹4,200 / yr',
    coverage: '₹5,00,000',
    status: 'active',
    icon: '🏥',
    color: '#10B981',
    renewsIn: '142 days',
  },
  {
    id: 2,
    type: 'Motor Cover',
    provider: 'Bajaj Allianz',
    premium: '₹7,800 / yr',
    coverage: '₹8,00,000',
    status: 'active',
    icon: '🚗',
    color: '#4F46E5',
    renewsIn: '67 days',
  },
  {
    id: 3,
    type: 'Mobile Protect',
    provider: 'Digit Insurance',
    premium: '₹1,199 / yr',
    coverage: '₹60,000',
    status: 'expired',
    icon: '📱',
    color: '#F43F5E',
    renewsIn: 'Expired',
  },
  {
    id: 4,
    type: 'Term Life',
    provider: 'LIC',
    premium: '₹12,000 / yr',
    coverage: '₹50,00,000',
    status: 'active',
    icon: '🛡️',
    color: '#6C63FF',
    renewsIn: '289 days',
  },
];

const SCENARIOS = [
  { name: 'Car Accident', covered: true,  icon: '🚘' },
  { name: 'Health Issue', covered: true,  icon: '🏥' },
  { name: 'Phone Drop',   covered: false, icon: '📱' },
  { name: 'Flight Delay', covered: true,  icon: '✈️' },
  { name: 'House Fire',   covered: false, icon: '🔥' },
  { name: 'Theft',        covered: true,  icon: '🔐' },
];

const InsurancePage = () => {
  const [activeScenario, setActiveScenario] = useState(SCENARIOS[0]);

  return (
    <div className="min-h-screen relative overflow-hidden">

      {/* ── 3D Spline Backdrop ── */}
      <iframe
        src="https://my.spline.design/umbrella-S1wKkIQe09hFlyZutWBR2uhC/"
        frameBorder="0"
        className="absolute inset-0 w-full h-full z-0 pointer-events-none"
        title="3D Umbrella"
      />

      {/* ── Dark overlay so text is readable ── */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-slate-900/60 via-slate-900/30 to-slate-900/70 pointer-events-none" />

      {/* ── UI Layer ── */}
      <div className="relative z-10 min-h-screen p-4 md:p-6 lg:p-8 flex flex-col max-w-[1200px] mx-auto">

        {/* Back button */}
        <Link
          to="/"
          className="self-start inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl border border-white/40 text-white font-bold text-sm shadow-sm transition-all hover:pr-5 group mb-6"
        >
          <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
          Back to Dashboard
        </Link>

        {/* Page title */}
        <div className="mb-6">
          <h1 className="text-white font-black text-3xl md:text-4xl tracking-tight drop-shadow-lg">
            🛡️ Insurance Visualizer
          </h1>
          <p className="text-white/70 text-sm mt-1">Your complete coverage at a glance</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-5 flex-1">

          {/* Left — Scenario tester */}
          <div className="w-full lg:w-1/3 flex flex-col gap-4">
            <div className="glass-panel p-5">
              <h2 className="text-slate-primary font-bold text-base mb-4">⚡ Damage Simulator</h2>
              <p className="text-xs text-slate-secondary mb-3">Tap a scenario to check your coverage instantly.</p>

              <div className="grid grid-cols-2 gap-2">
                {SCENARIOS.map(sc => (
                  <button
                    key={sc.name}
                    onClick={() => setActiveScenario(sc)}
                    className={`text-xs font-semibold p-3 rounded-xl border transition-all flex flex-col items-center gap-1 ${
                      activeScenario.name === sc.name
                        ? 'bg-white border-brand-primary text-brand-primary shadow-md'
                        : 'bg-white/50 border-white/40 text-slate-primary hover:bg-white/80'
                    }`}
                  >
                    <span className="text-xl">{sc.icon}</span>
                    <span>{sc.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Result card */}
            <div className={`glass-panel p-5 text-center border-2 transition-all ${
              activeScenario.covered ? 'border-success/40 bg-success/5' : 'border-danger/40 bg-danger/5'
            }`}>
              <div className="text-5xl mb-3">{activeScenario.covered ? '✅' : '❌'}</div>
              <p className="text-slate-primary font-bold text-base">{activeScenario.name}</p>
              <p className={`font-black text-xl mt-1 ${activeScenario.covered ? 'text-success' : 'text-danger'}`}>
                {activeScenario.covered ? 'YOU\'RE COVERED' : 'NOT COVERED'}
              </p>
              {!activeScenario.covered && (
                <p className="text-xs text-slate-secondary mt-2">Consider adding a policy for this risk.</p>
              )}
            </div>
          </div>

          {/* Right — Policy cards */}
          <div className="w-full lg:w-2/3 flex flex-col gap-4">
            <div className="glass-panel p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-slate-primary font-bold text-base">📋 My Policies</h2>
                <span className="text-xs bg-brand-primary/10 text-brand-primary font-bold px-3 py-1 rounded-full border border-brand-primary/20">
                  {POLICIES.filter(p => p.status === 'active').length} Active
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {POLICIES.map(policy => (
                  <div
                    key={policy.id}
                    className="bg-white/50 rounded-2xl p-4 border border-white/60 hover:bg-white/70 transition-all hover:shadow-md flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{policy.icon}</span>
                        <div>
                          <p className="text-slate-primary font-bold text-sm">{policy.type}</p>
                          <p className="text-slate-secondary text-[11px]">{policy.provider}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        policy.status === 'active'
                          ? 'bg-success/15 text-success'
                          : 'bg-danger/15 text-danger'
                      }`}>
                        {policy.status}
                      </span>
                    </div>

                    <div className="border-t border-white/40 pt-2 flex justify-between text-xs">
                      <div>
                        <p className="text-slate-secondary">Coverage</p>
                        <p className="font-bold text-slate-primary">{policy.coverage}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-slate-secondary">Premium</p>
                        <p className="font-bold text-slate-primary">{policy.premium}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-slate-secondary">Renews In</p>
                        <p className={`font-bold ${policy.status === 'expired' ? 'text-danger' : 'text-slate-primary'}`}>
                          {policy.renewsIn}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total coverage summary */}
            <div className="glass-panel p-5 flex flex-col sm:flex-row gap-4">
              {[
                { label: 'Total Active Policies', value: '3', color: 'text-success' },
                { label: 'Total Coverage',         value: '₹63.6L', color: 'text-brand-primary' },
                { label: 'Annual Premium',         value: '₹25,199', color: 'text-slate-primary' },
                { label: 'Renewal Alerts',         value: '1', color: 'text-amber-500' },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex-1 text-center">
                  <p className="text-xs text-slate-secondary uppercase tracking-wider font-semibold">{label}</p>
                  <p className={`font-black text-xl mt-1 ${color}`}>{value}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default InsurancePage;
