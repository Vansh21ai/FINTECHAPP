import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CompoundInterestChart from './charts/CompoundInterestChart';
import { Player } from '@lottiefiles/react-lottie-player';



const CenterPanel = () => {
  const [totalWealth, setTotalWealth] = useState(142850.00);
  const [trackerValue, setTrackerValue] = useState(45);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleAutoInvest = () => {
    setTotalWealth(prev => prev + 5);
    setTrackerValue(prev => prev + 5);
    setShowConfetti(true);
  };

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 2500); // confetti lasts a few seconds
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  return (
    <Link to="/investments" className="contents">
    <div className="glass-panel p-6 col-span-1 lg:col-span-6 flex flex-col gap-6 relative overflow-hidden group cursor-pointer hover:scale-[1.015] transition-transform duration-200 hover:shadow-xl">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 rounded-full blur-3xl -z-10 group-hover:bg-brand-primary/20 transition-all duration-700"></div>

      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-slate-secondary text-sm font-semibold uppercase tracking-wider mb-1">Total Wealth</h2>
          <div className="text-5xl font-black text-slate-primary tracking-tight tabular-nums transition-all">
            ${totalWealth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).split('.')[0]}.<span className="text-slate-400 text-3xl">{totalWealth.toFixed(2).split('.')[1]}</span>
          </div>
          <div className="text-success text-sm font-medium mt-2 flex items-center gap-1">
            <span className="bg-success/20 px-1.5 py-0.5 rounded text-success text-xs font-bold">+2.4%</span>
            <span>vs last month</span>
          </div>
        </div>

        {/* Micro-Invest Tracker & Control */}
        <div className="flex flex-col items-end gap-2 relative">
          
          <div className="bg-white/40 p-3 rounded-2xl border border-white/60 shadow-sm backdrop-blur-sm relative">
            <h3 className="text-xs text-slate-secondary font-semibold uppercase mb-2 text-center">Micro-Invest Tracker</h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border-4 border-brand-secondary border-t-brand-primary flex items-center justify-center animate-[spin_4s_linear_infinite]">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-bold text-slate-primary text-xs animate-[spin_4s_linear_infinite_reverse] transition-all">
                  ${trackerValue}
                </div>
              </div>
              <div className="flex flex-col text-xs">
                <span className="text-slate-primary font-medium">Weekly Goal</span>
                <span className="text-slate-secondary mt-0.5">Round-ups active</span>
              </div>
            </div>

            {/* Confetti Explosion Overlay */}
            {showConfetti && (
              <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none transform scale-150">
                <Player
                  autoplay
                  keepLastFrame
                  src="https://lottie.host/294b684d-d6b4-4116-ab35-85346618991c/P8U9XFvwZt.json" // generic confetti burst
                  style={{ height: '200px', width: '200px' }}
                />
              </div>
            )}
          </div>

          {/* Gamification trigger */}
          <button 
            onClick={handleAutoInvest}
            className="text-[10px] bg-brand-secondary/10 hover:bg-brand-secondary/20 text-brand-secondary font-bold px-2 py-1 flex items-center justify-center rounded-md border border-brand-secondary/20 transition-all uppercase tracking-wider"
          >
            Demo: Trigger Auto-Invest
          </button>
        </div>
      </div>

      {/* Animated Coin Visual */}
      <div className="relative rounded-2xl overflow-hidden border border-white/50 bg-gradient-to-br from-amber-50/60 to-white/20 shadow-inner flex items-center justify-center gap-6 px-6" style={{ height: 100 }}>
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-300 to-amber-500 shadow-lg flex items-center justify-center border-4 border-yellow-200"
               style={{ animation: 'spin 6s linear infinite' }}>
            <span className="text-yellow-900 font-black text-xl">$</span>
          </div>
          <div className="absolute -inset-1 rounded-full bg-amber-400/20 animate-ping" style={{ animationDuration: '2s' }} />
        </div>
        <div>
          <p className="text-xs text-slate-secondary font-semibold uppercase tracking-wider">Wealth Accumulator</p>
          <p className="text-2xl font-black text-slate-primary tabular-nums">${totalWealth.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          <p className="text-xs text-success font-bold">↑ Growing daily</p>
        </div>
      </div>

      {/* Area Chart Implementation */}
      <div className="flex-1 min-h-[200px] mt-2 relative rounded-xl border border-dashed border-slate-300 bg-white/20 p-4">
        <div className="absolute inset-x-0 inset-y-0 opacity-10" style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}></div>
        <div className="relative w-full h-[180px]">
          <CompoundInterestChart />
        </div>
      </div>
    </div>
    </Link>
  );
};

export default CenterPanel;
