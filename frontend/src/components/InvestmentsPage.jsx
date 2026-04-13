import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const investmentStats = [
  {
    label: 'Total Auto-Invested Cashback',
    value: '₹12,450',
    sub: 'Across 38 transactions',
    icon: '💸',
    color: 'from-indigo-500/20 to-indigo-500/5',
    borderColor: 'border-indigo-400/20',
    valueColor: 'text-indigo-300',
  },
  {
    label: 'Liquid Mutual Funds',
    value: '₹11,834',
    sub: 'LIQUIDBEES.NS · NAV ₹1,001.2',
    icon: '📈',
    color: 'from-emerald-500/20 to-emerald-500/5',
    borderColor: 'border-emerald-400/20',
    valueColor: 'text-emerald-300',
  },
  {
    label: 'Projected 2026 Returns',
    value: '₹13,605',
    sub: '+15.0% at current rate',
    icon: '🎯',
    color: 'from-teal-500/20 to-teal-500/5',
    borderColor: 'border-teal-400/20',
    valueColor: 'text-teal-300',
  },
  {
    label: 'Unrealised Gain',
    value: '₹1,384',
    sub: '+11.1% since first investment',
    icon: '✨',
    color: 'from-amber-500/20 to-amber-500/5',
    borderColor: 'border-amber-400/20',
    valueColor: 'text-amber-300',
  },
];

const cashbackHistory = [
  { date: 'Apr 12', merchant: 'Swiggy', amount: 48, cashback: 2.4, invested: true },
  { date: 'Apr 10', merchant: 'Amazon', amount: 1299, cashback: 64.95, invested: true },
  { date: 'Apr 08', merchant: 'Uber', amount: 220, cashback: 11.0, invested: true },
  { date: 'Apr 06', merchant: 'Netflix', amount: 649, cashback: 32.45, invested: true },
  { date: 'Apr 04', merchant: 'BigBasket', amount: 856, cashback: 42.8, invested: false },
  { date: 'Apr 02', merchant: 'Zara', amount: 3499, cashback: 174.95, invested: true },
];

const InvestmentsPage = () => {
  const [trackerValue, setTrackerValue] = useState(12450);
  const [pulse, setPulse] = useState(false);

  // Simulate live ticking
  useEffect(() => {
    const interval = setInterval(() => {
      setTrackerValue(prev => {
        const delta = Math.random() * 2 - 0.5;
        return parseFloat((prev + delta).toFixed(2));
      });
      setPulse(true);
      setTimeout(() => setPulse(false), 600);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">

      {/* ── 3D Coin Backdrop ── */}
      <iframe
        src="https://my.spline.design/coin-79RQGmU4dHmZqNrVhpkRvfth/"
        frameBorder="0"
        className="absolute inset-0 w-full h-full z-0 pointer-events-none"
        title="Coin 3D"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-br from-slate-900/75 via-amber-900/30 to-slate-900/75" />

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
            Micro-Invest Engine
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
            Current Investment<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-emerald-300">
              Info
            </span>
          </h1>
          <p className="text-white/50 mt-2 text-sm font-medium max-w-md">
            Every rupee of cashback is automatically converted into Liquid Mutual Fund units. Your money never sleeps.
          </p>
        </motion.div>

        {/* Live Ticker Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="bg-white/10 backdrop-blur-md border border-amber-400/20 rounded-2xl p-4 mb-6 flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white/60 text-sm font-semibold">Live Portfolio Value</span>
          </div>
          <div className={`text-2xl font-black tabular-nums transition-colors duration-300 ${pulse ? 'text-emerald-300' : 'text-white'}`}>
            ₹{trackerValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="hidden sm:flex items-center gap-2 text-emerald-400 text-sm font-bold">
            <span>+₹1,384</span>
            <span className="text-white/30">|</span>
            <span>+11.1%</span>
          </div>
        </motion.div>

        {/* Main Grid */}
        <div className="flex flex-col lg:flex-row gap-6 flex-1">

          {/* Left — Stat Cards + History */}
          <div className="flex flex-col gap-5 w-full lg:w-2/3">

            {/* 4 Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {investmentStats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                  className={`bg-gradient-to-br ${stat.color} backdrop-blur-md border ${stat.borderColor} rounded-2xl p-5`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-2xl">{stat.icon}</span>
                    <div className={`text-xl font-black tabular-nums ${stat.valueColor}`}>{stat.value}</div>
                  </div>
                  <div className="text-white/80 font-bold text-sm mb-0.5">{stat.label}</div>
                  <div className="text-white/40 text-xs">{stat.sub}</div>
                </motion.div>
              ))}
            </div>

            {/* Cashback History Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5"
            >
              <h3 className="text-white/60 text-xs font-bold uppercase tracking-widest mb-4">Recent Cashback Investments</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-white/30 text-[10px] uppercase tracking-wider">
                      <th className="text-left pb-3 font-semibold">Date</th>
                      <th className="text-left pb-3 font-semibold">Merchant</th>
                      <th className="text-right pb-3 font-semibold">Spent</th>
                      <th className="text-right pb-3 font-semibold">Cashback</th>
                      <th className="text-right pb-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {cashbackHistory.map((tx, i) => (
                      <tr key={i} className="text-white/70 hover:bg-white/5 transition-colors">
                        <td className="py-2.5 text-white/40 text-xs">{tx.date}</td>
                        <td className="py-2.5 font-semibold">{tx.merchant}</td>
                        <td className="py-2.5 text-right tabular-nums">₹{tx.amount.toLocaleString()}</td>
                        <td className="py-2.5 text-right tabular-nums text-amber-300 font-bold">+₹{tx.cashback.toFixed(2)}</td>
                        <td className="py-2.5 text-right">
                          {tx.invested
                            ? <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-400/15 border border-emerald-400/30 text-emerald-400 font-bold">Invested</span>
                            : <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-400 font-bold">Pending</span>
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

          </div>

          {/* Right — Fund Detail + Breakdown */}
          <div className="w-full lg:w-1/3 flex flex-col gap-4">

            {/* Fund Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-400/20 flex items-center justify-center text-xl border border-amber-400/30">💰</div>
                <div>
                  <div className="text-white font-bold text-sm">LIQUIDBEES.NS</div>
                  <div className="text-white/40 text-xs">Nippon India Liquid BeES ETF</div>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                {[
                  { label: 'Current NAV', value: '₹1,001.20' },
                  { label: 'Units Held', value: '11.82' },
                  { label: '7-Day Yield', value: '6.82% p.a.', highlight: true },
                  { label: 'Category', value: 'Liquid ETF' },
                  { label: 'Risk Grade', value: 'Very Low 🟢' },
                ].map(({ label, value, highlight }) => (
                  <div key={label} className="flex justify-between border-b border-white/10 pb-2 last:border-0 last:pb-0">
                    <span className="text-xs text-white/40 font-medium">{label}</span>
                    <span className={`text-xs font-bold ${highlight ? 'text-emerald-300' : 'text-white/80'}`}>{value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Projection Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5"
            >
              <h3 className="text-white/60 text-xs font-bold uppercase tracking-widest mb-4">Projected 2026 Returns</h3>
              <div className="flex flex-col gap-3">
                {[
                  { label: 'Conservative (6%)', value: '₹13,197', color: 'text-white/70' },
                  { label: 'Moderate (8%)', value: '₹13,446', color: 'text-indigo-300' },
                  { label: 'Optimistic (10%)', value: '₹13,695', color: 'text-emerald-300' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="flex justify-between items-center">
                    <span className="text-xs text-white/40">{label}</span>
                    <span className={`text-sm font-black tabular-nums ${color}`}>{value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-white/10 text-[10px] text-white/30 text-center">
                Based on ₹12,450 principal at LIQUIDBEES 7-day yield
              </div>
            </motion.div>

            {/* Auto-Invest Toggle */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="bg-gradient-to-br from-emerald-500/15 to-teal-500/5 backdrop-blur-md border border-emerald-400/20 rounded-2xl p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-bold text-sm">Auto-Invest Rewards</div>
                  <div className="text-white/40 text-xs mt-0.5">5% cashback → LIQUIDBEES</div>
                </div>
                <div className="w-12 h-6 rounded-full bg-emerald-400 flex items-center justify-end pr-1 shadow-inner shadow-emerald-300/30 cursor-pointer">
                  <div className="w-4 h-4 rounded-full bg-white shadow" />
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentsPage;
