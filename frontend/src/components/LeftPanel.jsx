import React, { useState } from 'react';

const LeftPanel = () => {
  const [activeScenario, setActiveScenario] = useState('Car Accident');

  const scenarios = [
    { name: 'Car Accident', covered: true },
    { name: 'Health Issue', covered: true },
    { name: 'Phone Drop', covered: false },
    { name: 'Flight Delay', covered: true }
  ];

  const activeCoverage = scenarios.find(s => s.name === activeScenario)?.covered;

  return (
    <div className="glass-panel p-5 col-span-1 lg:col-span-3 flex flex-col gap-4">
      <div>
        <h2 className="text-slate-primary font-bold text-lg">Insurance Visualizer</h2>
        <p className="text-xs text-slate-secondary mt-1">Simulate damage and check your active coverage instantly.</p>
      </div>

      {/* Animated Shield Visual */}
      <div className="flex-1 mt-2 relative rounded-2xl bg-gradient-to-b from-white/60 to-white/20 border border-white/60 overflow-hidden shadow-inner flex flex-col items-center justify-center" style={{ minHeight: 180 }}>
        <div className="relative flex items-center justify-center">
          <div className="absolute w-32 h-32 rounded-full bg-brand-primary/10 animate-ping" style={{ animationDuration: '2.5s' }} />
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-secondary/30 to-brand-primary/20 flex items-center justify-center border-2 border-brand-primary/30 shadow-xl">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-brand-primary">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Dynamic Status Badge */}
        <div className="absolute bottom-3 z-10">
          <div className="bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-white shadow-sm flex items-center gap-2">
            <span className="text-xs font-bold text-slate-primary">{activeScenario}:</span>
            <span className={`text-xs font-black tracking-wider ${activeCoverage ? 'text-success' : 'text-danger'}`}>
              {activeCoverage ? 'COVERED' : 'NOT COVERED'}
            </span>
          </div>
        </div>
      </div>

      {/* Scenario Buttons */}
      <div className="grid grid-cols-2 gap-2 mt-2">
        {scenarios.map((scenario, index) => (
          <button
            key={index}
            onClick={() => setActiveScenario(scenario.name)}
            className={`text-xs font-semibold p-2.5 rounded-xl border transition-all shadow-sm flex items-center justify-between
              ${activeScenario === scenario.name
                ? 'bg-white border-brand-primary text-brand-primary'
                : 'bg-white/50 border-white/40 text-slate-primary hover:bg-white/80'
              }`}
          >
            <span>{scenario.name}</span>
            <div className={`w-1.5 h-1.5 rounded-full ${scenario.covered ? 'bg-success' : 'bg-danger'} ${activeScenario === scenario.name ? 'animate-pulse' : ''}`} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default LeftPanel;
