import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE } from '../api';

const PORTFOLIO = [
  { name: 'LIQUIDBEES ETF',  alloc: 45, value: '₹6,420',  change: '+2.3%',  positive: true  },
  { name: 'Nifty 50 Index',  alloc: 25, value: '₹3,560',  change: '+5.1%',  positive: true  },
  { name: 'Gold ETF',        alloc: 15, value: '₹2,136',  change: '+0.8%',  positive: true  },
  { name: 'US Equity Fund',  alloc: 10, value: '₹1,424',  change: '-1.2%',  positive: false },
  { name: 'Debt Fund',       alloc: 5,  value: '₹712',    change: '+0.3%',  positive: true  },
];

const HISTORY = [
  { date: 'Apr 13',  amount: '₹28.50',  type: 'Cashback',  status: 'invested' },
  { date: 'Apr 12',  amount: '₹65.00',  type: 'Cashback',  status: 'invested' },
  { date: 'Apr 10',  amount: '₹12.25',  type: 'Cashback',  status: 'invested' },
  { date: 'Apr 08',  amount: '₹144.00', type: 'Cashback',  status: 'invested' },
  { date: 'Apr 05',  amount: '₹35.75',  type: 'Cashback',  status: 'invested' },
];

// Lightweight live ticker that scrolls symbols
const TICKERS = [
  { sym: 'NIFTY 50', val: '22,643', chg: '+0.42%', up: true  },
  { sym: 'SENSEX',   val: '74,671', chg: '+0.38%', up: true  },
  { sym: 'AAPL',     val: '$196.4', chg: '-0.21%', up: false },
  { sym: 'RELIANCE', val: '₹2,918', chg: '+1.04%', up: true  },
  { sym: 'BTC',      val: '$63.2k', chg: '+2.81%', up: true  },
  { sym: 'HDFC',     val: '₹1,651', chg: '+0.67%', up: true  },
  { sym: 'TSLA',     val: '$174.3', chg: '-1.53%', up: false },
  { sym: 'INFY',     val: '₹1,422', chg: '+0.29%', up: true  },
];

const InvestmentsPage = () => {
  const [totalInvested] = useState(14252);
  const [currentValue]  = useState(15483);
  const [tickerIndex, setTickerIndex]   = useState(0);

  // Rotate live ticker every 2.5s
  useEffect(() => {
    const t = setInterval(() => setTickerIndex(i => (i + 1) % TICKERS.length), 2500);
    return () => clearInterval(t);
  }, []);

  const returnPct = (((currentValue - totalInvested) / totalInvested) * 100).toFixed(1);

  return (
    <div className="min-h-screen relative overflow-hidden">

      {/* ── 3D Spline Coin Backdrop ── */}
      <iframe
        src="https://my.spline.design/untitled-cZMAraBwt4YPnKQezLm3ES6V/"
        frameBorder="0"
        className="absolute inset-0 w-full h-full z-0 pointer-events-none"
        title="3D Coin"
      />

      {/* ── UI Layer ── */}
      <div className="relative z-10 min-h-screen p-4 md:p-6 lg:p-8 flex flex-col max-w-[1200px] mx-auto pointer-events-none">

        {/* Back */}
        <Link
          to="/"
          className="self-start pointer-events-auto inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl border border-white/40 text-white font-bold text-sm shadow-sm transition-all hover:pr-5 group mb-4"
        >
          <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
          Back to Dashboard
        </Link>

        {/* Live Ticker Banner */}
        <div className="glass-panel px-5 py-3 mb-5 flex items-center gap-4 overflow-hidden pointer-events-auto">
          <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded-full border border-brand-primary/20 flex-shrink-0">
            LIVE
          </span>
          <div className="flex gap-6 overflow-hidden">
            {TICKERS.concat(TICKERS).slice(tickerIndex, tickerIndex + 5).map((t, i) => (
              <span key={i} className="flex items-center gap-1.5 text-xs font-bold flex-shrink-0">
                <span className="text-slate-secondary">{t.sym}</span>
                <span className="text-slate-primary">{t.val}</span>
                <span className={t.up ? 'text-success' : 'text-danger'}>{t.chg}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Page title */}
        <div className="mb-5">
          <h1 className="text-white font-black text-3xl md:text-4xl tracking-tight drop-shadow-lg">
            💰 Micro-Invest Tracker
          </h1>
          <p className="text-white/70 text-sm mt-1">Every rupee of cashback — invested automatically</p>
        </div>

        {/* Summary strip */}
        <div className="glass-panel p-5 mb-5 grid grid-cols-2 sm:grid-cols-4 gap-4 pointer-events-auto">
          {[
            { label: 'Total Invested', value: `₹${totalInvested.toLocaleString()}`, color: 'text-slate-primary' },
            { label: 'Current Value',  value: `₹${currentValue.toLocaleString()}`,  color: 'text-success'        },
            { label: 'Total Returns',  value: `+${returnPct}%`,                     color: 'text-success'        },
            { label: 'Cashback Rate',  value: '5% auto',                            color: 'text-brand-primary'  },
          ].map(({ label, value, color }) => (
            <div key={label} className="text-center">
              <p className="text-[10px] text-slate-secondary uppercase tracking-widest font-semibold">{label}</p>
              <p className={`font-black text-xl mt-1 ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-5 flex-1 pointer-events-none">

          {/* Left — Portfolio breakdown */}
          <div className="w-full lg:w-1/2 glass-panel p-5 pointer-events-auto">
            <h2 className="text-slate-primary font-bold text-base mb-4">📊 Portfolio Breakdown</h2>
            <div className="flex flex-col gap-3">
              {PORTFOLIO.map(asset => (
                <div key={asset.name}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-slate-primary">{asset.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-primary">{asset.value}</span>
                      <span className={`text-xs font-black ${asset.positive ? 'text-success' : 'text-danger'}`}>
                        {asset.change}
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-white/30 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary transition-all duration-700"
                      style={{ width: `${asset.alloc}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-secondary">{asset.alloc}% allocation</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Transaction history */}
          <div className="w-full lg:w-1/2 glass-panel p-5 pointer-events-auto">
            <h2 className="text-slate-primary font-bold text-base mb-4">🕒 Cashback History</h2>
            <div className="flex flex-col gap-2">
              {HISTORY.map((tx, i) => (
                <div key={i} className="flex items-center justify-between bg-white/40 rounded-xl px-4 py-3 border border-white/50">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-success/15 flex items-center justify-center text-base">💸</span>
                    <div>
                      <p className="text-xs font-bold text-slate-primary">{tx.type}</p>
                      <p className="text-[10px] text-slate-secondary">{tx.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-success">{tx.amount}</p>
                    <span className="text-[10px] bg-success/10 text-success px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* How it works note */}
            <div className="mt-4 p-3 bg-brand-primary/5 border border-brand-primary/15 rounded-xl">
              <p className="text-[11px] text-slate-secondary leading-relaxed">
                <span className="font-bold text-brand-primary">How it works:</span> Every transaction you make earns {' '}
                <span className="font-bold">5% cashback</span>, which is automatically invested into LIQUIDBEES ETF units via the background event bus.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default InvestmentsPage;
