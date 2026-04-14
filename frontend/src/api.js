/**
 * api.js — Centralized API client for EvloveAI Finance
 *
 * API_BASE always points to the live Render backend.
 * In local dev the Vite proxy intercepts these calls automatically
 * (see vite.config.js server.proxy), but the hardcoded URL also works
 * directly in production builds without any env-var setup.
 */

export const API_BASE = 'https://fintechapp-cljw.onrender.com';

// ─── Auth ─────────────────────────────────────────────────────────────────

export const loginUser = (email, password) =>
  fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

export const registerUser = (email, password) =>
  fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

// ─── Onboarding ───────────────────────────────────────────────────────────

export const submitOnboarding = (income, worry, goal) =>
  fetch(`${API_BASE}/api/onboarding`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ income, worry, goal }),
  });

// ─── AI Voice ─────────────────────────────────────────────────────────────

export const askAIVoice = (spoken_text, stock_symbol = null) =>
  fetch(`${API_BASE}/api/voice/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ spoken_text, stock_symbol, mode: 'present' }),
  });

// ─── Financials ───────────────────────────────────────────────────────────

export const fetchUserXP = (userId) =>
  fetch(`${API_BASE}/api/user/xp/${userId}`);

export const fetchTrustLog = (userId) =>
  fetch(`${API_BASE}/api/trust-log/${userId}`);

export const fetchInvestSimulation = () =>
  fetch(`${API_BASE}/api/invest/simulation`);

export const fetchInvestmentSummary = (userId) =>
  fetch(`${API_BASE}/api/investment/${userId}/summary`);

export const fetchInvestmentHistory = (userId) =>
  fetch(`${API_BASE}/api/investment/${userId}/history`);

export const fetchInvestmentPerformance = (userId) =>
  fetch(`${API_BASE}/api/investment/${userId}/performance`);

// ─── Transactions ─────────────────────────────────────────────────────────

export const postTransaction = (userId, amount, type, description) =>
  fetch(`${API_BASE}/transaction`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, amount, type, description }),
  });

// ─── Market / Sandbox ─────────────────────────────────────────────────────────
// scenario: 'live' | 'covid' | 'tech-selloff' | 'nifty2020' | 'dotcom' | '1y' | '3mo' | 'custom'
export const fetchMarketChart = (symbol, scenario, from, to) => {
  let url = `${API_BASE}/api/market/chart/${encodeURIComponent(symbol)}/${scenario}`;
  if (scenario === 'custom' && from && to) url += `?from=${from}&to=${to}`;
  return fetch(url);
};
