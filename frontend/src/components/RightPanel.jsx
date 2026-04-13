import React from 'react';
import { Link } from 'react-router-dom';
import RadialGaugeChart from './charts/RadialGaugeChart';
import RiskLineChart from './charts/RiskLineChart';

const RightPanel = () => {
  return (
    <Link 
      to="/sandbox"
      className="glass-panel p-5 col-span-1 lg:col-span-3 flex flex-col gap-4 group hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all duration-300 cursor-pointer relative overflow-hidden"
    >
      <div className="flex items-center justify-between z-10">
        <h2 className="text-slate-primary font-bold text-lg">Risk Sandbox</h2>
        <span className="text-[10px] uppercase font-bold bg-brand-primary/10 text-brand-primary px-2 py-1 rounded-full group-hover:bg-brand-primary group-hover:text-white transition-colors">
          Tap to Simulate
        </span>
      </div>
      
      <p className="text-sm text-slate-secondary z-10 w-4/5 pt-1">Run complex crash simulations.</p>

      {/* Speedometer Gauge Implementation */}
      <div className="mt-2 bg-white/30 rounded-2xl p-4 border border-white/50 flex flex-col items-center z-10 pointer-events-none group-hover:border-white/80 transition-colors">
        <RadialGaugeChart />
        <div className="mt-[-20px] flex flex-col items-center">
          <span className="text-xs font-semibold text-slate-secondary uppercase tracking-wider">Loss Probability</span>
        </div>
      </div>

      {/* Line Graph Implementation */}
      <div className="flex-1 mt-2 relative rounded-xl border border-dashed border-slate-300 bg-white/20 flex flex-col items-center justify-center min-h-[120px] p-2 overflow-hidden z-10 pointer-events-none group-hover:bg-white/40 transition-colors">
        <div className="w-full h-full relative">
          <RiskLineChart />
        </div>
      </div>
    </Link>
  );
};

export default RightPanel;
