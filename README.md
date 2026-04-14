<div align="center">

<img src="https://img.shields.io/badge/EvloveAI-Gen--Z%20Financial%20Super%20App-6C63FF?style=for-the-badge&logo=lightning&logoColor=white" alt="EvloveAI Banner"/>

# ⚡ EvloveAI Finance — Gen-Z Financial Super App

[![React](https://img.shields.io/badge/React-19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://neon.tech/)
[![Vite](https://img.shields.io/badge/Vite-Tailwind%20v4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Yahoo Finance](https://img.shields.io/badge/Yahoo%20Finance-Real%20OHLC-6001D2?style=for-the-badge&logo=yahoo&logoColor=white)](https://github.com/gadicc/yahoo-finance2)
[![Gemini AI](https://img.shields.io/badge/Google-Gemini%20AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)

*Solving the "Trust Deficit" and "Investing Fear" for the Next Generation*

</div>

---

## 📖 What is EvloveAI Finance?

A **full-stack financial super app** built for Gen-Z. It combines an AI Voice Financial Advisor, real-time candlestick market data, immersive 3D Spline pages, micro-investing automation, and glassmorphism UI — all in one.

> 💡 **Core Philosophy:** *"Practice before you invest. Trust before you transact."*

---

## 🌟 Features

| # | Feature | Description |
|:--|:--------|:------------|
| 1 | 🤖 **AI Voice Advisor** | Talk to a Gemini-powered financial advisor. Speaks back via TTS. Fetches live stock prices from Yahoo Finance in real time. |
| 2 | 📉 **Crash Simulator Sandbox** | Real historical OHLC candlestick charts (COVID-19 crash, 2022 tech selloff, Dot-Com bust etc.) pulled live from Yahoo Finance for **any ticker** (AAPL, RELIANCE.NS, ^NSEI, BTC-USD). |
| 3 | 🛡️ **Insurance Visualizer** | Immersive page with a 3D Spline umbrella backdrop + glassmorphism policy cards. Live coverage scenario tester. |
| 4 | 💰 **Micro-Invest Tracker** | 3D Spline coin backdrop. Live portfolio ticker. Auto-invests 5% cashback into LIQUIDBEES ETF. Full transaction history. |
| 5 | 🧠 **3-Question Onboarding** | 30-second quiz personalises the dashboard layout to the user's income, worries, and goals. |
| 6 | 🔐 **Consent Ledger** | Append-only log of every data access event — full transparency to the user. |
| 7 | 🚗 **3D Car Showroom** | Spline 3D car embedded in the dashboard for auto-insurance discovery. |
| 8 | 📊 **Hub & Spoke Routing** | Dashboard → `/insurance` → `/investments` → `/sandbox` — all deep-linked routes with Back buttons. |

---

## 🏗️ Architecture

```
┌────────────────────────────────────────────────────────────────────┐
│                         BROWSER (React 19 + Vite)                  │
│  Tailwind v4 · ApexCharts · Framer Motion · Spline 3D · Lottie    │
└──────────────────────────────┬─────────────────────────────────────┘
                               │  /api/* proxied by Vite (dev)
                               │  Direct fetch in production
┌──────────────────────────────▼─────────────────────────────────────┐
│                    BACKEND  (Node.js + Express 5)                   │
│  Routes: /auth · /api/voice · /api/market · /api/onboarding        │
│  Yahoo Finance 2 · Google Gemini AI · JWT · bcrypt · rate-limit    │
└──────────┬──────────────────────────────────┬───────────────────────┘
           │ SQL (pg)                         │ Cache (ioredis)
┌──────────▼────────────┐     ┌──────────────▼────────────────────────┐
│  PostgreSQL (Neon)    │     │  Redis (Upstash) — optional           │
│  Users · Transactions │     │  Rate limit · BullMQ event bus        │
│  Onboarding · Consent │     │  Set ENABLE_REDIS=true to activate    │
└───────────────────────┘     └───────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|:------|:-----------|
| **Frontend framework** | React 19 + Vite 8 |
| **Styling** | Tailwind CSS v4 (via `@tailwindcss/vite`) |
| **Charts** | ApexCharts (react-apexcharts) — candlestick OHLC |
| **Animation** | Framer Motion · Lottie |
| **3D Visuals** | Spline (`@splinetool/react-spline`) embedded via iframe |
| **Backend** | Node.js + Express 5 |
| **Database** | PostgreSQL via [Neon](https://neon.tech) (serverless) |
| **Cache / Queue** | Redis via [Upstash](https://upstash.com) + BullMQ (optional) |
| **AI** | Google Gemini (`@google/generative-ai`) |
| **Market Data** | `yahoo-finance2` v3 — real OHLC + live quotes + search |
| **Auth** | JWT + bcrypt |

---

## 📁 Project Structure

```
FINTECHAPP/
│
├── 📁 frontend/                   ← React 19 + Vite app
│   ├── index.html                 ← Google Fonts (Inter, Kalam, Outfit)
│   ├── vite.config.js             ← Dev proxy → localhost:3000
│   └── src/
│       ├── api.js                 ← Centralised fetch helpers
│       ├── App.jsx                ← Router (/, /sandbox, /insurance, /investments)
│       ├── index.css              ← Glassmorphism + blob animations + CSS vars
│       └── components/
│           ├── AuthPage.jsx
│           ├── Dashboard.jsx
│           ├── LeftPanel.jsx      ← Insurance gateway card
│           ├── CenterPanel.jsx    ← Micro-Invest gateway card
│           ├── HeaderBar.jsx
│           ├── AiInsightsFeed.jsx
│           ├── FloatingAIAssistant.jsx  ← AI voice + Kalam cursive + scrollable
│           ├── SandboxPage.jsx    ← Real OHLC candlestick simulator
│           ├── InsurancePage.jsx  ← 3D umbrella + policy cards
│           ├── InvestmentsPage.jsx← 3D coin + live ticker + cashback history
│           └── charts/
│               └── RadialGaugeChart.jsx
│
└── 📁 dev1backend/                ← Node.js + Express 5 backend
    ├── .env.example               ← Copy → .env and fill in values
    └── src/
        ├── index.js               ← Server entry, DB pool, DNS override, routes
        ├── setupDb.js             ← Creates all PostgreSQL tables
        └── routes/
            ├── auth.js            ← POST /auth/register, /auth/login (JWT)
            ├── onboarding.js      ← POST /api/onboarding
            ├── transaction.js     ← POST /transaction
            ├── financials.js      ← GET /api/investment, /api/chart/history
            ├── aiVoice.js         ← POST /api/voice (Gemini + Yahoo live quotes)
            └── market.js          ← GET /api/market/chart/:symbol/:scenario (OHLC)
```

---

## 🚀 Local Setup — Step by Step

### Prerequisites

- **Node.js v18+** (v20+ recommended)
- A **[Neon](https://neon.tech)** account — free PostgreSQL (create a project, copy the connection string)
- A **[Google AI Studio](https://aistudio.google.com)** account — free Gemini API key
- *(Optional)* An **[Upstash](https://upstash.com)** account — free Redis (only needed if `ENABLE_REDIS=true`)

---

### 1. Clone the repo

```bash
git clone https://github.com/Vansh21ai/FINTECHAPP.git
cd FINTECHAPP
```

---

### 2. Set up the Backend

```bash
cd dev1backend
npm install
```

Create your `.env` file by copying the example:

```bash
cp .env.example .env
```

Open `.env` and fill in every value:

```env
# Neon PostgreSQL connection string (copy from Neon dashboard → Connection string)
DATABASE_URL=postgresql://<user>:<password>@<host>/<database>?sslmode=require

# (Optional) If DNS fails for the Neon hostname on your network, add the raw IP:
# DATABASE_HOSTADDR=<ip-address>

# Upstash Redis — only needed if ENABLE_REDIS=true
REDIS_URL=rediss://default:<password>@<host>:6379

# Set to true to enable Redis rate-limiting & BullMQ event bus
ENABLE_REDIS=false
ENABLE_EVENT_BUS=false

# Cashback automation settings
CASHBACK_PERCENT=5
LIQUID_FUND_SYMBOL=LIQUIDBEES.NS

# Google Gemini API key (free at https://aistudio.google.com)
GEMINI_API_KEY=<your_gemini_api_key>
```

Initialize the database tables (run once):

```bash
node src/setupDb.js
```

Start the backend dev server:

```bash
npm run dev        # nodemon — auto-restarts on file changes
# or
npm start          # plain node
```

The backend runs on **http://localhost:3000**

Health check: open http://localhost:3000/ → should return `🚀 Backend is up!`

---

### 3. Set up the Frontend

Open a **new terminal** (keep the backend running):

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on **http://localhost:5173**

> The Vite dev server automatically proxies all `/api/*`, `/auth/*`, and `/transaction/*` requests to `localhost:3000` — no CORS config needed.

---

### 4. Open the App

1. Go to **http://localhost:5173**
2. Click **Create Account** → register with any email/password
3. Complete the **3-question onboarding**
4. Explore the dashboard:
   - Click the **Insurance Visualizer** card → `/insurance` (3D umbrella)
   - Click the **Micro-Invest Tracker** → `/investments` (3D coin)
   - Click **Sandbox** in the nav → `/sandbox` (real candlestick charts)
   - Click the **mic button** (bottom-right) → AI Voice Advisor

---

## 🔑 API Endpoints

### Auth
| Method | Endpoint | Description |
|:-------|:---------|:------------|
| POST | `/auth/register` | Create account (name, email, password) |
| POST | `/auth/login` | Login → returns JWT token |

### AI Voice
| Method | Endpoint | Description |
|:-------|:---------|:------------|
| POST | `/api/voice` | Send spoken text → Gemini response + live market data |

### Market Data (Sandbox)
| Method | Endpoint | Description |
|:-------|:---------|:------------|
| GET | `/api/market/chart/:symbol/:scenario` | Real OHLC candlestick data for any Yahoo Finance ticker |

**Scenarios:** `live` · `1mo` · `3mo` · `1y` · `covid` · `tech-selloff` · `dotcom` · `nifty2020` · `custom`

**Example:**
```
GET /api/market/chart/AAPL/covid
GET /api/market/chart/RELIANCE.NS/tech-selloff
GET /api/market/chart/BTC-USD/live
GET /api/market/chart/QQQ/custom?from=2021-01-01&to=2021-12-31
```

### Investments & Financials
| Method | Endpoint | Description |
|:-------|:---------|:------------|
| GET | `/api/investment/:user_id/summary` | Total cashback invested, current NAV |
| GET | `/api/investment/:user_id/history` | All cashback investment events |
| GET | `/api/investment/:user_id/performance` | Time-series for chart |

### Onboarding
| Method | Endpoint | Description |
|:-------|:---------|:------------|
| POST | `/api/onboarding` | Save user's 3-question quiz answers |

---

## ⚠️ Known Issues & Troubleshooting

### `ENOTFOUND` — Cannot connect to Neon PostgreSQL
Your ISP's DNS may block the Neon hostname. Add the raw IP to your `.env`:
```env
DATABASE_HOSTADDR=<ip-of-your-neon-host>
```
The backend will connect via IP and pass the hostname as SSL `servername`.

### Yahoo Finance returning no data
- Ensure the ticker is valid on Yahoo Finance (e.g. `RELIANCE.NS` not `RELIANCE`)
- Indian stocks: append `.NS` (NSE) or `.BO` (BSE)
- Crypto: use `BTC-USD`, `ETH-USD`
- Indices: use `^NSEI` (Nifty 50), `^GSPC` (S&P 500)

### `fetch failed` in the backend
This is a transient Yahoo Finance rate-limit. Wait a few seconds and retry — the backend has a direct-fetch → search-fallback pipeline that handles most cases.

### AI Voice not responding
Ensure `GEMINI_API_KEY` is set in `dev1backend/.env`. Get a free key at https://aistudio.google.com.

---

## ✅ Roadmap

- [x] JWT Auth (register / login)
- [x] 3-Question Onboarding
- [x] AI Voice Advisor (Gemini + Yahoo live quotes + TTS)
- [x] Real OHLC Candlestick Sandbox (Yahoo Finance — any ticker)
- [x] Immersive Insurance Page (3D Spline umbrella)
- [x] Immersive Investments Page (3D Spline coin + live ticker)
- [x] Micro-Invest Tracker (5% cashback → LIQUIDBEES)
- [x] Glassmorphism UI + Framer Motion animations
- [x] Hub & Spoke routing (/insurance, /investments, /sandbox)
- [ ] Consent Ledger UI
- [ ] Redis + BullMQ event bus (infrastructure ready, toggle with `ENABLE_REDIS=true`)
- [ ] Production deployment (Cloudflare Pages + Railway)
- [ ] Android TWA wrapper

---

<div align="center">

**Built with ❤️ for Gen-Z, by Gen-Z**

*EvloveAI Finance — Invest Smart. Stay Transparent. Automate Everything.*

</div>
