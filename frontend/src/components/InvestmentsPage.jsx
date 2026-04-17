import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const InvestmentsPage = () => {
  const [walletBalance, setWalletBalance] = useState(120.50);
  
  // Asset Explorer State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicker, setSelectedTicker] = useState(null);
  
  // Execution Bar State
  const [tradeAmount, setTradeAmount] = useState(10);
  const [isTrading, setIsTrading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // ─── Search Logic (Mocked Yahoo API) ───────────────────────────────────────
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    // Simulate hitting our upcoming /api/chart/history route
    const symbol = searchQuery.toUpperCase();
    const mockPrice = (Math.random() * 300 + 50).toFixed(2);
    const isUp = Math.random() > 0.4; // Slightly rigged for green days
    const mockChange = (Math.random() * 5).toFixed(2);

    setSelectedTicker({
      sym: symbol,
      price: mockPrice,
      change: `${isUp ? '+' : '-'}${mockChange}%`,
      up: isUp
    });
    
    // Auto-select a reasonable amount to invest based on balance
    setTradeAmount(Math.max(1, Math.min(10, walletBalance))); 
  };

  // ─── Trade Execution ───────────────────────────────────────────────────────
  const handleTrade = () => {
    const amount = Number(tradeAmount);
    if (!selectedTicker || amount <= 0 || amount > walletBalance) return;
    
    setIsTrading(true);
    
    // Simulate Transaction Delay
    setTimeout(() => {
      setWalletBalance(prev => prev - amount);
      setToastMessage(`Success! $${amount.toFixed(2)} invested into ${selectedTicker.sym}.`);
      setIsTrading(false);
      setSelectedTicker(null);
      setSearchQuery('');
      
      setTimeout(() => setToastMessage(''), 4000);
    }, 1500);
  };

  return (
    <div className="min-h-screen relative overflow-y-auto overflow-x-hidden bg-slate-950 text-white font-sans flex flex-col items-center justify-center p-4">
      
      {/* ── Constraint: 3D Engine Backdrop ── */}
      <iframe
        src="https://my.spline.design/untitled-cZMAraBwt4YPnKQezLm3ES6V/"
        frameBorder="0"
        className="fixed inset-0 w-full h-full z-0 pointer-events-none opacity-80"
        title="3D Coin Backdrop"
      />

      {/* Back Button */}
      <Link
        to="/"
        className="fixed top-14 left-4 lg:left-8 z-20 pointer-events-auto inline-flex items-center gap-2 px-4 py-2 bg-slate-900/40 hover:bg-slate-800/60 backdrop-blur-md rounded-xl border border-white/10 text-white font-bold text-sm shadow-xl transition-all hover:-translate-x-1 group"
      >
        <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
        Back to Dashboard
      </Link>

      {/* Toast Alert */}
      <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-out ${toastMessage ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-8 scale-95 pointer-events-none'}`}>
        <div className="bg-success text-white font-bold px-6 py-3.5 rounded-full shadow-2xl shadow-success/20 flex items-center gap-3 border border-success/50 backdrop-blur-md">
          <span className="text-xl">✨</span>
          {toastMessage}
        </div>
      </div>

      {/* ── Main Layout Container ── */}
      <div className="relative z-10 w-full max-w-md flex flex-col gap-6 mt-16 mb-16 pointer-events-none">
        
        {/* ── Task 1: Wallet Hero ── */}
        <div className="pointer-events-auto bg-slate-900/60 backdrop-blur-2xl border border-brand-primary/20 rounded-3xl p-8 shadow-[0_0_40px_rgba(0,0,0,0.5)] text-center flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-brand-primary/20 rounded-full blur-[60px] -z-10 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-slate-500/20 rounded-full blur-[50px] -z-10 pointer-events-none"></div>
          
          <img src="https://img.icons8.com/color/96/wallet--v1.png" alt="Wallet" className="w-16 h-16 mb-4 drop-shadow-lg" />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-2">Available Cashback</p>
          <h1 className="text-5xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            ${walletBalance.toFixed(2)}
          </h1>
        </div>

        {/* ── Task 2: Asset Explorer ── */}
        <div className="pointer-events-auto bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col gap-5">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <h2 className="text-white font-black text-lg tracking-tight">Asset Explorer</h2>
            <span className="text-[10px] uppercase font-bold text-success bg-success/10 px-2 py-1 rounded-lg border border-success/20">Live Sync</span>
          </div>

          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl drop-shadow-xl">🔍</span>
              <input 
                type="text" 
                value={searchQuery} 
                onChange={e => setSearchQuery(e.target.value)} 
                placeholder="Search Ticker (e.g. AAPL)" 
                className="w-full bg-slate-950/50 border border-white/10 text-white rounded-2xl pl-12 pr-4 py-3.5 outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary font-bold placeholder-slate-500 transition-all uppercase shadow-inner" 
              />
            </div>
            <button 
              type="submit" 
              disabled={!searchQuery.trim()}
              className="bg-white hover:bg-slate-200 text-slate-900 disabled:opacity-50 disabled:hover:bg-white px-6 rounded-2xl font-black text-sm transition-all shadow-md active:scale-95"
            >
              Find
            </button>
          </form>

          {/* Mini Dashboard */}
          {selectedTicker && (
            <div className="bg-slate-950/60 rounded-2xl p-5 border border-white/10 flex justify-between items-center transition-all duration-300 shadow-inner">
              <div>
                <h3 className="text-2xl font-black text-white drop-shadow-md">{selectedTicker.sym}</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Market Price</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-white">${selectedTicker.price}</p>
                <div className={`mt-1 text-xs font-black px-2 py-0.5 rounded-md inline-flex items-center gap-1 border ${selectedTicker.up ? 'bg-success/10 border-success/20 text-success' : 'bg-danger/10 border-danger/20 text-danger'}`}>
                  {selectedTicker.up ? '▲' : '▼'} {selectedTicker.change}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Task 3 & 4: Execution Bar ── */}
        {selectedTicker && (
          <div className="pointer-events-auto bg-slate-900/60 backdrop-blur-3xl border border-brand-primary/40 rounded-3xl p-6 shadow-[0_0_50px_rgba(0,0,0,0.6)] flex flex-col gap-6 relative overflow-hidden transition-all duration-500 transform translate-y-0 opacity-100">
            
            {/* Range Slider Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">Allocation Amount</span>
                <div className="bg-slate-950/50 px-3 py-1.5 rounded-xl border border-white/5 shadow-inner">
                  <span className="text-brand-primary font-bold mr-0.5">$</span>
                  <span className="text-xl font-black text-white">{Number(tradeAmount).toFixed(2)}</span>
                </div>
              </div>
              
              <input 
                type="range"
                min={walletBalance >= 1 ? "1" : "0"}
                max={walletBalance}
                step="1"
                value={tradeAmount}
                onChange={(e) => setTradeAmount(e.target.value)}
                disabled={walletBalance < 1}
                className="w-full accent-brand-primary h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
              
              <div className="flex justify-between mt-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <span>$1 Min</span>
                <span>Max (${walletBalance.toFixed(2)})</span>
              </div>
            </div>

            {/* Dynamic Confirmation Text */}
            <div className="text-center bg-brand-primary/5 border border-brand-primary/20 rounded-2xl p-4">
              <p className="text-sm font-semibold text-slate-300 leading-relaxed">
                You are trading <span className="font-black text-white bg-slate-800 px-2 py-0.5 rounded-md border border-white/10 mx-1">${Number(tradeAmount).toFixed(2)}</span> for <span className="font-black text-white bg-slate-800 px-2 py-0.5 rounded-md border border-white/10 mx-1">{selectedTicker.sym}</span> at market price.
              </p>
            </div>

            {/* Execute Button */}
            <button
              onClick={handleTrade}
              disabled={isTrading || tradeAmount <= 0 || tradeAmount > walletBalance}
              className="w-full py-4 bg-brand-primary hover:bg-brand-secondary text-white font-black text-lg rounded-2xl shadow-[0_4px_20px_rgba(var(--brand-primary),0.3)] transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:hover:-translate-y-0 flex items-center justify-center gap-2"
            >
              {isTrading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Executing...
                </>
              ) : (
                `Execute Trade`
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default InvestmentsPage;
