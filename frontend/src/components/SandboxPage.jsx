import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Chart from 'react-apexcharts';
import RadialGaugeChart from './charts/RadialGaugeChart';

// ─── Scenario config ──────────────────────────────────────────────────────────
const SCENARIOS = [
  {
    key:          'live',
    label:        '📈 Live – Last 30 Days',
    defaultTicker: 'AAPL',
    riskScore:    22,
    description:  'Real-time rolling window — last 30 trading days',
    accentColor:  '#4F46E5',
  },
  {
    key:          'covid',
    label:        '🦠 COVID-19 Crash (Feb – May 2020)',
    defaultTicker: 'AAPL',
    riskScore:    75,
    description:  'WHO pandemic declared Mar 11, 2020 — AAPL fell -32%',
    accentColor:  '#F43F5E',
  },
  {
    key:          'tech-selloff',
    label:        '📉 2022 Tech Selloff',
    defaultTicker: 'AAPL',
    riskScore:    58,
    description:  'Fed raised rates 7× — fastest tightening since 1980s',
    accentColor:  '#F59E0B',
  },
  {
    key:          'nifty2020',
    label:        '🇮🇳 Nifty 50 COVID Crash (2020)',
    defaultTicker: '^NSEI',
    riskScore:    65,
    description:  'Indian markets hit circuit breakers twice in March 2020',
    accentColor:  '#10B981',
  },
  {
    key:          'dotcom',
    label:        '💀 Dot-Com Bust (1999 – 2002)',
    defaultTicker: 'QQQ',
    riskScore:    94,
    description:  'NASDAQ peaked Mar 10, 2000 and lost 78% over 2.5 years',
    accentColor:  '#6C63FF',
  },
  {
    key:          '1y',
    label:        '📆 1 Year – Rolling',
    defaultTicker: 'AAPL',
    riskScore:    30,
    description:  'Last 12 months of daily OHLC',
    accentColor:  '#0EA5E9',
  },
];

// ─── ApexCharts config factory ────────────────────────────────────────────────
function buildChartOptions(yMin, yMax, accentColor) {
  return {
    chart: {
      type:       'candlestick',
      fontFamily: 'Inter, sans-serif',
      background: 'transparent',
      toolbar: {
        show: true,
        tools: { download: false, selection: true, zoom: true, zoomin: true, zoomout: true, pan: true, reset: true },
      },
      animations: { enabled: true, speed: 500, easing: 'easeinout' },
      zoom: { enabled: true, type: 'x' },
    },
    plotOptions: {
      candlestick: {
        colors:  { upward: '#10B981', downward: '#F43F5E' },
        wick:    { useFillColor: true },
      },
    },
    xaxis: {
      type: 'datetime',
      labels: {
        style:       { colors: '#64748B', fontSize: '11px', fontWeight: 500 },
        datetimeUTC: false,
        rotate:      -30,
      },
      axisBorder: { show: false },
      axisTicks:  { show: false },
    },
    yaxis: {
      min: yMin,
      max: yMax,
      tickAmount: 6,
      labels: {
        formatter: val =>
          val >= 1000
            ? '$' + (val / 1000).toFixed(1) + 'k'
            : '$' + val.toFixed(2),
        style: { colors: '#64748B', fontSize: '11px', fontWeight: 500 },
      },
      tooltip: { enabled: true },
    },
    grid: {
      borderColor:     'rgba(99,102,241,0.10)',
      strokeDashArray:  4,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true  } },
    },
    tooltip: {
      theme: 'dark',
      custom({ seriesIndex, dataPointIndex, w }) {
        const d = w.globals.initialSeries[seriesIndex]?.data[dataPointIndex];
        if (!d) return '';
        const [o, h, l, c] = d.y;
        const up    = c >= o;
        const col   = up ? '#10B981' : '#F43F5E';
        const arrow = up ? '▲' : '▼';
        const chg   = (((c - o) / o) * 100).toFixed(2);
        return `
          <div style="padding:12px 16px;background:#0f172a;border:1px solid ${col}44;border-radius:12px;
                      font-family:Inter,sans-serif;font-size:12px;line-height:2;min-width:160px">
            <div style="font-weight:800;color:${col};margin-bottom:2px">
              ${d.x}  ${arrow} ${chg}%
            </div>
            <div style="color:#94a3b8">Open  <b style="color:#e2e8f0;float:right;margin-left:16px">$${Number(o).toFixed(2)}</b></div>
            <div style="color:#94a3b8">High  <b style="color:#10B981;float:right;margin-left:16px">$${Number(h).toFixed(2)}</b></div>
            <div style="color:#94a3b8">Low   <b style="color:#F43F5E;float:right;margin-left:16px">$${Number(l).toFixed(2)}</b></div>
            <div style="color:#94a3b8">Close <b style="color:${col};float:right;margin-left:16px">$${Number(c).toFixed(2)}</b></div>
          </div>`;
      },
    },
  };
}

// ─── Stats computed from real OHLC candles ────────────────────────────────────
function computeStats(candles) {
  if (!candles || candles.length < 2) return null;

  let peak     = candles[0].y[1]; // high of first candle
  let maxDD    = 0;
  let bestDay  = -Infinity;
  let worstDay = Infinity;

  candles.forEach((c, i) => {
    const high  = c.y[1];
    const close = c.y[3];
    if (high > peak) peak = high;
    const dd = (close - peak) / peak;
    if (dd < maxDD) maxDD = dd;

    if (i > 0) {
      const prevClose = candles[i - 1].y[3];
      const chg = (close - prevClose) / prevClose;
      if (chg > bestDay)  bestDay  = chg;
      if (chg < worstDay) worstDay = chg;
    }
  });

  const firstClose = candles[0].y[3];
  const lastClose  = candles[candles.length - 1].y[3];
  const total      = (lastClose - firstClose) / firstClose;
  const vol        = candles.reduce((acc, c, i) => {
    if (i === 0) return acc;
    return acc + Math.abs((c.y[3] - candles[i - 1].y[3]) / candles[i - 1].y[3]);
  }, 0) / (candles.length - 1);

  return {
    maxDD:       (maxDD  * 100).toFixed(2) + '%',
    bestDay:     '+' + (bestDay  * 100).toFixed(2) + '%',
    worstDay:    (worstDay * 100).toFixed(2) + '%',
    totalReturn: (total >= 0 ? '+' : '') + (total * 100).toFixed(1) + '%',
    avgVol:      (vol * 100).toFixed(2) + '%',
    isPositive:  total >= 0,
    firstClose:  firstClose.toFixed(2),
    lastClose:   lastClose.toFixed(2),
  };
}

// ─── Component ────────────────────────────────────────────────────────────────
const SandboxPage = () => {
  const [scenarioKey,    setScenarioKey]    = useState('covid');
  const [tickerInput,    setTickerInput]    = useState('AAPL');
  const [activeTicker,   setActiveTicker]   = useState('AAPL');
  const [resolvedSymbol, setResolvedSymbol] = useState('');   // set when Yahoo renames the input

  const [candles,   setCandles]   = useState([]);
  const [yMin,      setYMin]      = useState(undefined);
  const [yMax,      setYMax]      = useState(undefined);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');
  const [errorType, setErrorType] = useState('');  // 'nodata' | 'invalid' | 'server'

  const scenario = SCENARIOS.find(s => s.key === scenarioKey) || SCENARIOS[0];

  // ── Fetch real OHLC from backend — strict, no mock fallback ───────────────
  const fetchCandles = useCallback(async (ticker, scKey) => {
    setLoading(true);
    setError('');
    setErrorType('');
    setCandles([]);
    setResolvedSymbol('');

    try {
      const url = `/api/market/chart/${encodeURIComponent(ticker.trim())}/${scKey}`;
      const res  = await fetch(url);
      let json;

      try {
        json = await res.json();
      } catch {
        throw Object.assign(new Error('Server returned an invalid response.'), { type: 'server' });
      }

      // Classify error by HTTP status
      if (!res.ok || !json.success) {
        const msg = json.error || `HTTP ${res.status}`;
        const type = res.status === 404
          ? 'nodata'
          : res.status === 400
          ? 'invalid'
          : 'server';
        throw Object.assign(new Error(msg), { type });
      }

      if (!json.data || json.data.length === 0) {
        throw Object.assign(
          new Error(`No trading data found for "${ticker}" in this timeframe.`),
          { type: 'nodata' }
        );
      }

      // Yahoo may have auto-corrected the symbol (e.g. "tesla" → "TSLA")
      if (json.symbol && json.symbol !== ticker.trim().toUpperCase()) {
        setResolvedSymbol(json.symbol);
      }

      setCandles(json.data);
      setYMin(json.yMin);
      setYMax(json.yMax);

    } catch (err) {
      console.error('Chart fetch error:', err.message);
      setError(err.message);
      setErrorType(err.type || 'server');
      setCandles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-fetch when scenario changes (intentionally NOT re-running on activeTicker
  // to avoid double-fetch — the second useEffect below handles ticker sync)
  useEffect(() => {
    fetchCandles(activeTicker, scenarioKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenarioKey, activeTicker]);

  // Reset ticker input to scenario default on scenario change
  useEffect(() => {
    const sc = SCENARIOS.find(s => s.key === scenarioKey);
    if (sc) {
      setTickerInput(sc.defaultTicker);
      setActiveTicker(sc.defaultTicker);
    }
  }, [scenarioKey]);

  const handleLoad = () => {
    const tk = tickerInput.trim();
    if (!tk) return;
    setActiveTicker(tk.toUpperCase());
    fetchCandles(tk, scenarioKey);
  };

  const stats         = computeStats(candles);
  const chartOptions  = buildChartOptions(yMin, yMax, scenario.accentColor);
  const chartSeries   = [{ name: activeTicker, data: candles }];

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 max-w-[1300px] mx-auto w-full flex flex-col pb-24">

      {/* ── Top Nav ── */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/40 hover:bg-white/60 backdrop-blur-md rounded-xl border border-white/50 text-slate-primary font-bold text-sm shadow-sm transition-all hover:pr-5 group"
        >
          <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
          Back to Dashboard
        </Link>
        <div className="text-slate-secondary font-bold text-sm tracking-tight hidden sm:flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          Real-Time Yahoo Finance Data
        </div>
      </div>

      {/* ── Controls ── */}
      <div className="glass-panel p-5 mb-5 flex flex-col sm:flex-row gap-4 items-end">

        {/* Scenario picker */}
        <div className="flex-[2] min-w-0">
          <label className="block text-xs font-bold text-slate-secondary mb-2 uppercase tracking-wider">
            Crash Simulation
          </label>
          <select
            value={scenarioKey}
            onChange={e => setScenarioKey(e.target.value)}
            className="w-full bg-white/50 border border-white/60 focus:border-brand-primary/50 rounded-xl px-4 py-3 text-slate-primary font-bold text-sm outline-none transition-all appearance-none cursor-pointer"
          >
            {SCENARIOS.map(s => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* Ticker input */}
        <div className="flex-1 min-w-0">
          <label className="block text-xs font-bold text-slate-secondary mb-2 uppercase tracking-wider">
            Stock Ticker
          </label>
          <input
            type="text"
            value={tickerInput}
            onChange={e => setTickerInput(e.target.value.toUpperCase())}
            onKeyDown={e => e.key === 'Enter' && handleLoad()}
            placeholder="AAPL, RELIANCE.NS, ^NSEI…"
            className="w-full bg-white/50 border border-white/60 focus:border-brand-primary/50 rounded-xl px-4 py-3 text-slate-primary font-bold text-sm outline-none transition-all placeholder:text-slate-400 uppercase tracking-widest"
          />
        </div>

        {/* Load button */}
        <button
          onClick={handleLoad}
          disabled={loading}
          className="h-[50px] px-7 rounded-xl bg-brand-primary hover:bg-indigo-700 disabled:opacity-60 text-white font-bold text-sm transition-all shadow-lg shadow-brand-primary/30 flex items-center gap-2 flex-shrink-0"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Fetching...
            </>
          ) : '⚡ Load'}
        </button>
      </div>

      {/* Scenario description strip */}
      <div
        className="mb-5 px-4 py-3 rounded-xl border text-xs font-semibold flex items-center gap-2"
        style={{ background: scenario.accentColor + '12', borderColor: scenario.accentColor + '30', color: scenario.accentColor }}
      >
        <span className="font-black uppercase tracking-widest">{activeTicker}</span>
        <span className="text-slate-400 font-medium">·</span>
        <span className="text-slate-secondary font-medium">{scenario.description}</span>
        {candles.length > 0 && !loading && (
          <span className="ml-auto text-slate-400 font-medium">{candles.length} candles · Yahoo Finance</span>
        )}
      </div>

      {/* Resolved-symbol notice (Yahoo auto-corrected the ticker) */}
      {resolvedSymbol && !loading && (
        <div className="mb-4 px-4 py-2.5 rounded-xl bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-semibold flex items-center gap-2">
          <span>🔍</span>
          <span>Yahoo Finance resolved <b>{activeTicker}</b> → <b>{resolvedSymbol}</b></span>
        </div>
      )}

      {/* ── Main Grid ── */}
      <div className="flex flex-col lg:flex-row gap-6 flex-1">

        {/* Left — Chart */}
        <div className="w-full lg:w-2/3 flex flex-col gap-5">
          <div className="glass-panel p-4 sm:p-6 flex-1 min-h-[420px] flex flex-col">

            {/* Chart header */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-slate-primary font-black text-xl tracking-tight">
                  {activeTicker}
                  <span className="text-slate-400 font-medium text-sm ml-2">Candlestick</span>
                </h2>
                <p className="text-slate-secondary text-xs mt-0.5">{scenario.label}</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm" style={{ background: '#10B981' }} /> Bullish
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm" style={{ background: '#F43F5E' }} /> Bearish
                </span>
              </div>
            </div>

            {/* Chart body */}
            <div className="flex-1 min-h-[360px] relative">
              {loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-white/60 backdrop-blur-sm rounded-xl z-10">
                  <div className="w-12 h-12 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin" />
                  <div className="text-slate-primary font-bold text-sm">
                    Fetching real OHLC data for <span className="text-brand-primary">{activeTicker}</span>…
                  </div>
                  <div className="text-slate-secondary text-xs">Powered by Yahoo Finance</div>
                </div>
              )}

              {!loading && candles.length > 0 && (
                <Chart
                  key={`${activeTicker}-${scenarioKey}`}
                  options={chartOptions}
                  series={chartSeries}
                  type="candlestick"
                  height="100%"
                />
              )}

              {/* Empty state — no data fetched yet */}
              {!loading && candles.length === 0 && !error && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-slate-secondary text-sm">Choose a scenario and press ⚡ Load</p>
                </div>
              )}

              {/* Error state — clean message, no chart rendered */}
              {!loading && candles.length === 0 && error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8">
                  <div className="text-4xl">
                    {errorType === 'nodata' ? '📭' : errorType === 'invalid' ? '🔎' : '⚠️'}
                  </div>
                  <div className="text-center max-w-sm">
                    <p className="text-slate-primary font-bold text-base mb-1">
                      {errorType === 'nodata'
                        ? 'Data not available for this asset during this timeframe.'
                        : errorType === 'invalid'
                        ? 'Ticker not recognised by Yahoo Finance.'
                        : 'Something went wrong fetching market data.'}
                    </p>
                    <p className="text-slate-secondary text-xs leading-relaxed">{error}</p>
                  </div>
                  {errorType === 'nodata' && (
                    <p className="text-xs text-slate-400 italic text-center max-w-xs">
                      This stock may not have existed or traded during this period (e.g. a recent IPO during the 2020 crash window).
                    </p>
                  )}
                  {errorType === 'invalid' && (
                    <p className="text-xs text-slate-400 italic text-center max-w-xs">
                      Try an exact ticker: <code className="bg-white/60 px-1 rounded">AAPL</code>,
                      <code className="bg-white/60 px-1 rounded ml-1">RELIANCE.NS</code>,
                      <code className="bg-white/60 px-1 rounded ml-1">^NSEI</code>
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right — Metrics */}
        <div className="w-full lg:w-1/3 flex flex-col gap-5">

          {/* Volatility Gauge */}
          <div className="glass-panel p-6 flex flex-col items-center relative shadow-xl">
            <h3 className="text-slate-primary font-bold text-base w-full text-center mb-1">Volatility Index</h3>
            <p className="text-[11px] text-slate-secondary uppercase tracking-widest font-semibold mb-[-20px] z-10 w-full text-center">
              Scenario Risk
            </p>
            <div className="w-full transform scale-125 pt-8">
              <RadialGaugeChart risk={scenario.riskScore} />
            </div>
            <div className="mt-[-10px] z-10 bg-white/70 px-4 py-1.5 rounded-full border border-white shadow-sm flex flex-col items-center">
              <span className="text-xs text-slate-secondary font-bold uppercase tracking-widest">Risk Score</span>
              <span className="text-danger font-black text-xl">{scenario.riskScore}</span>
            </div>
          </div>

          {/* Real Stats from Data */}
          <div className="glass-panel p-5 flex flex-col gap-0.5">
            <h3 className="text-slate-primary font-bold text-sm uppercase tracking-wider mb-3">📊 Real Stats</h3>

            {loading && (
              <div className="flex items-center gap-2 py-4 justify-center">
                <span className="w-4 h-4 border-2 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin" />
                <span className="text-slate-secondary text-xs">Computing…</span>
              </div>
            )}

            {!loading && stats ? (
              <div className="flex flex-col gap-0">
                {[
                  { label: 'Entry Price',    value: '$' + stats.firstClose,  color: 'text-slate-primary' },
                  { label: 'Exit Price',     value: '$' + stats.lastClose,   color: 'text-slate-primary' },
                  { label: 'Total Return',   value: stats.totalReturn,       color: stats.isPositive ? 'text-success' : 'text-danger' },
                  { label: 'Max Drawdown',   value: stats.maxDD,             color: 'text-danger'  },
                  { label: 'Best Day',       value: stats.bestDay,           color: 'text-success' },
                  { label: 'Worst Day',      value: stats.worstDay,          color: 'text-danger'  },
                  { label: 'Avg Daily Vol',  value: stats.avgVol,            color: 'text-brand-secondary' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="flex justify-between items-center border-b border-white/25 py-2.5 last:border-0">
                    <span className="text-xs text-slate-secondary font-medium">{label}</span>
                    <span className={`text-sm font-black tabular-nums ${color}`}>{value}</span>
                  </div>
                ))}
              </div>
            ) : !loading && (
              <p className="text-slate-secondary text-xs text-center py-4">Load a chart to see stats</p>
            )}
          </div>

          {/* Tips */}
          <div className="glass-panel p-4 text-xs text-slate-secondary leading-relaxed">
            <div className="font-bold text-slate-primary mb-2 text-sm">💡 Tips</div>
            <ul className="flex flex-col gap-1.5 list-none">
              <li>🔍 Indian stocks: <code className="bg-white/60 px-1 rounded">RELIANCE.NS</code></li>
              <li>📊 Nifty 50 index: <code className="bg-white/60 px-1 rounded">^NSEI</code></li>
              <li>📈 Nasdaq 100: <code className="bg-white/60 px-1 rounded">QQQ</code></li>
              <li>🪙 Crypto: <code className="bg-white/60 px-1 rounded">BTC-USD</code></li>
              <li>🖱️ Drag to zoom · Double-click to reset</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SandboxPage;
