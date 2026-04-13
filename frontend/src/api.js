/**
 * api.js — Centralized API client for EvloveAI Finance
 *
 * In development: Vite proxy forwards all /auth, /api, /transaction requests
 *   to http://localhost:3000 (dev1backend) automatically.
 *
 * In production: set VITE_API_BASE_URL in your .env to the deployed backend URL.
 */

export const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

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
