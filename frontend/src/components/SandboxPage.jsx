import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Chart from 'react-apexcharts';
import RadialGaugeChart from './charts/RadialGaugeChart';



const assetProfiles = {
  'Tech Stocks': {
    risk: 42,
    color: '#0EA5E9', // --accent-secondary
    multipliers: [1, 1.05, 0.95, 1.15, 1.08, 0.90, 0.82, 1.0, 1.2, 1.35, 1.25, 1.5]
  },
  'Index Funds': {
    risk: 15,
    color: '#4F46E5', // --accent-primary
    multipliers: [1, 1.02, 1.03, 1.01, 1.04, 1.06, 1.05, 1.07, 1.08, 1.09, 1.10, 1.12]
  },
  'Gold': {
    risk: 8,
    color: '#F59E0B', // --warning
    multipliers: [1, 1.01, 0.99, 1.0, 1.01, 1.02, 1.02, 1.01, 1.03, 1.04, 1.03, 1.05]
  }
};

const SandboxPage = () => {
  const [amount, setAmount] = useState(10000);
  const [assetType, setAssetType] = useState('Tech Stocks');

  const selectedProfile = assetProfiles[assetType];
  const maxDrawdown = amount * (selectedProfile.risk / 100);

  // Generate last 12 months for X-axis
  const timelineCategories = useMemo(() => {
    const dates = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      dates.push(d.toLocaleDateString('default', { month: 'short', year: 'numeric' }));
    }
    return dates;
  }, []);

  // Compute the absolute values based on the initial amount and multipliers
  const chartData = useMemo(() => {
    return selectedProfile.multipliers.map(m => Math.round(amount * m));
  }, [amount, selectedProfile]);

  const chartOptions = {
    chart: {
      type: 'area',
      fontFamily: 'inherit',
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    colors: [selectedProfile.color],
    stroke: {
      curve: 'smooth',
      width: 3
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.05,
        stops: [0, 100]
      }
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: timelineCategories,
      labels: {
        style: { colors: '#64748B', fontWeight: 500 }
      },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      labels: {
        formatter: (val) => `$${val.toLocaleString()}`,
        style: { colors: '#64748B', fontWeight: 500 }
      }
    },
    grid: {
      borderColor: 'rgba(255, 255, 255, 0.3)',
      strokeDashArray: 4,
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: true } }
    },
    tooltip: {
      theme: 'light',
      y: { formatter: (val) => `$${val.toLocaleString()}` }
    }
  };

  const chartSeries = [{
    name: 'Portfolio Value',
    data: chartData
  }];

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 max-w-[1200px] mx-auto w-full flex flex-col relative pb-20">

      {/* Top Navigation */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/40 hover:bg-white/60 backdrop-blur-md rounded-xl border border-white/50 text-slate-primary font-bold text-sm shadow-sm transition-all hover:pr-5 group"
        >
          <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
          Back to Dashboard
        </Link>
        <span className="text-slate-secondary font-bold text-lg hidden sm:block">Full Sandbox Simulator</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 w-full flex-1">

        {/* Left Column: Visualizer & Controls */}
        <div className="flex flex-col gap-6 w-full lg:w-2/3">

          {/* Controls Panel */}
          <div className="glass-panel p-6 flex flex-col sm:flex-row gap-6 items-end relative overflow-hidden">

            <div className="flex-1 w-full">
              <label className="block text-xs font-bold text-slate-secondary mb-2 uppercase tracking-wider">Investment Amount ($)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full bg-white/50 border border-white/60 focus:border-brand-primary/50 focus:bg-white/80 rounded-xl px-4 py-3 text-slate-primary font-bold text-lg outline-none transition-all"
              />
            </div>

            <div className="flex-1 w-full">
              <label className="block text-xs font-bold text-slate-secondary mb-2 uppercase tracking-wider">Asset Class</label>
              <select
                value={assetType}
                onChange={(e) => setAssetType(e.target.value)}
                className="w-full bg-white/50 border border-white/60 focus:border-brand-primary/50 focus:bg-white/80 rounded-xl px-4 py-3 text-slate-primary font-bold text-lg outline-none transition-all appearance-none cursor-pointer"
              >
                {Object.keys(assetProfiles).map(key => (
                  <option key={key} value={key}>{key}</option>
                ))}
              </select>
            </div>

          </div>

          {/* Asset Visual Card */}
          <div className="glass-panel p-5 flex items-center gap-5 relative overflow-hidden">
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 flex items-center justify-center border border-brand-primary/20 shadow-lg">
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-brand-primary">
                  <rect x="1" y="3" width="15" height="13" rx="2" />
                  <path d="M16 8h4l3 3v5h-7V8z" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
              </div>
              <div className="absolute -inset-1 rounded-2xl bg-brand-primary/10 animate-ping" style={{ animationDuration: '3s' }} />
            </div>
            <div className="flex-1">
              <p className="text-xs text-slate-secondary font-bold uppercase tracking-wider mb-1">Simulating Asset</p>
              <p className="text-xl font-black text-slate-primary">{assetType}</p>
              <p className="text-xs text-brand-primary font-semibold mt-1">Risk Exposure: {selectedProfile.risk}% · Max Loss: ${maxDrawdown.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
            </div>
          </div>

          {/* Main Chart Card */}
          <div className="glass-panel p-6 flex-1 min-h-[400px] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-slate-primary font-bold text-xl uppercase tracking-tight">12-Month Projection</h2>
                <p className="text-slate-secondary text-sm">Historical volatility applied bounds</p>
              </div>
              <div className="px-3 py-1 bg-white/50 rounded-lg text-xs font-bold text-brand-primary border border-white/50 shadow-sm">
                Live Simulation
              </div>
            </div>

            <div className="w-full h-full min-h-[350px]">
              <Chart options={chartOptions} series={chartSeries} type="area" height="100%" />
            </div>
          </div>

        </div>

        {/* Right Column: Risk Metrics & Speedometer */}
        <div className="flex flex-col gap-6 w-full lg:w-1/3">

          {/* Risk Gauge Card */}
          <div className="glass-panel p-6 flex flex-col items-center justify-center relative shadow-xl">
            <h3 className="text-slate-primary font-bold text-lg w-full text-center mb-1">Exposure Level</h3>
            <p className="text-[11px] text-slate-secondary uppercase tracking-widest font-semibold mb-[-20px] z-10 w-full text-center">Market Volatility</p>
            <div className="w-full transform scale-125 pt-8">
              <RadialGaugeChart risk={selectedProfile.risk} />
            </div>
            <div className="mt-[-10px] z-10 bg-white/70 px-4 py-1.5 rounded-full border border-white shadow-sm flex flex-col items-center">
              <span className="text-xs text-slate-secondary font-bold uppercase tracking-widest">Loss Probability</span>
              <span className="text-danger font-black text-xl">{selectedProfile.risk}%</span>
            </div>
          </div>

          {/* Max Drawdown Card */}
          <div className="glass-panel p-6 flex flex-col relative overflow-hidden group">
            {/* Decorative Danger Glow */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-danger/10 rounded-full blur-3xl group-hover:bg-danger/20 transition-all duration-700"></div>

            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-danger animate-pulse box-shadow-[0_0_8px_rgba(244,63,94,0.8)]"></div>
              <h3 className="text-slate-primary font-bold text-sm uppercase tracking-wider">Maximum Drawdown</h3>
            </div>

            <p className="text-slate-secondary text-xs mb-4">Estimated worst-case capital loss based on stress testing bounds.</p>

            <div className="text-4xl font-black text-slate-primary tracking-tighter">
              ${maxDrawdown.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default SandboxPage;
