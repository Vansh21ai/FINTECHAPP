<div align="center">

<img src="https://img.shields.io/badge/FinGen-Gen--Z%20Financial%20Super%20App-6C63FF?style=for-the-badge&logo=lightning&logoColor=white" alt="FinGen Banner"/>

# ⚡ FinGen: The Gen-Z Financial Super App

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare%20Pages-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://pages.cloudflare.com/)
[![Railway](https://img.shields.io/badge/Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)](https://railway.app/)

**Open Innovation Hackathon | 2-Day Sprint** 🏆

*Solving the "Trust Deficit" and "Investing Fear" for the Next Generation*

</div>

---

## 📖 About FinGen

FinGen is a **unified financial ecosystem** designed specifically for Gen-Z. It bridges the gap between financial products and young users through radical transparency, gamified education, and intelligent automation — all delivered as a blazing-fast, zero-latency web and mobile experience.

> 💡 **Core Philosophy:** "Practice before you invest. Trust before you transact."

---

## 🌟 Core Features

### 1. 🎮 Risk Simulation Sandbox
> *Because everyone deserves to learn without losing real money.*

| Aspect | Details |
|:---|:---|
| **The Problem** | Young users fear losing money because they don't understand market volatility. |
| **The Solution** | A "practice-first" playground to invest **virtual Rs. 10,000** into Mutual Funds, Stocks, or Gold. |
| **Data Source** | Real historical market data — COVID-19 crash, 2021 bull run, and more. |
| **Visuals** | Real-time line graphs + **"Risk Speedometer"** (Green 🟢 → Red 🔴) |

---

### 2. 🔐 Consent Ledger *(The Transparency Engine)*
> *Every data access. Every time. Logged forever.*

| Aspect | Details |
|:---|:---|
| **The Problem** | Gen-Z distrusts apps and fears their data is being sold behind their backs. |
| **The Solution** | A **live, append-only log** showing exactly when and why the app accesses user data. |
| **Unique Value** | A **"Financial Privacy Feed"** — no other fintech app offers this level of transparency. |

---

### 3. ⚡ Financial Event Bus *(Micro-Investing)*
> *Your money works even when you're not thinking about it.*

| Aspect | Details |
|:---|:---|
| **The Problem** | Saving feels like a chore, leading to procrastination. |
| **The Solution** | Every action (paying a bill, receiving money) triggers a background **Event Bus**. |
| **Automation** | Spare change is automatically diverted into insurance or micro-investments. |
| **Tech** | Powered by **BullMQ** queue system on the backend. |

---

### 4. 🧠 Personalised 3-Question Onboarding
> *Your dashboard, your rules — in under 30 seconds.*

| Aspect | Details |
|:---|:---|
| **The Problem** | Generic dashboards lead to high bounce rates. |
| **The Solution** | A **30-second quiz** (Income → Worries → Goals) that reconfigures the entire UI. |
| **Outcome** | The most relevant features are always shown first, reducing friction. |

---

## 🏗️ Technical Architecture

> Our stack is chosen for **maximum speed, zero cold-start latency**, and **100% free-tier scalability**.

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                             │
│              React.js + Tailwind CSS                            │
│              Hosted on Cloudflare Pages (0ms cold-start)        │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS / REST
┌────────────────────────────▼────────────────────────────────────┐
│                        API LAYER                                │
│              Node.js + Express (Railway)                        │
│              JWT Auth | BullMQ Event Bus                        │
└───────────┬───────────────────────────────────┬─────────────────┘
            │ SQL                               │ Cache / Queue
┌───────────▼──────────────┐   ┌───────────────▼─────────────────┐
│  PostgreSQL (Neon)       │   │  Redis (Upstash)                │
│  Serverless DB           │   │  Rate Limiting + Job Queues     │
└──────────────────────────┘   └─────────────────────────────────┘
```

### 🛠️ Tech Stack Summary

| Layer | Technology | Hosting |
|:---|:---|:---|
| **Frontend** | React.js + Tailwind CSS | Cloudflare Pages |
| **Backend** | Node.js + Express | Railway |
| **Database** | PostgreSQL (Serverless) | Neon |
| **Cache / Queue** | Redis + BullMQ | Upstash |
| **Mobile** | Android Studio (TWA Wrapper) | — |
| **Data Viz** | Chart.js / Recharts | — |
| **Auth** | JWT (JSON Web Tokens) | — |

---

## 👥 Team & Workflow

| Member | Role | Key Deliverables |
|:---|:---|:---|
| **Dev 1** | Backend Architect | Node.js API, Neon DB Schema, BullMQ Event Bus, JWT Auth |
| **Dev 2** | Frontend Lead | React Dashboard, Chart.js/Recharts integration, Onboarding flow |
| **Dev 3** | UI/UX & Motion | Figma Mockups, Spline 3D assets, Lottie animations, Color System |
| **Dev 4** | DevOps & Quality | GitHub Repo, Postman Testing, Cloudflare/Railway Deployment, TWA Wrap |

---

## 🚀 Quick Start & Deployment

### Prerequisites
- Node.js v18+
- A [Neon](https://neon.tech) account (free PostgreSQL)
- An [Upstash](https://upstash.com) account (free Redis)

---

### 🖥️ Backend Setup

```bash
# 1. Clone the repository
git clone https://github.com/Vansh21ai/FINTECHAPP.git
cd FINTECHAPP

# 2. Create your environment file
cp .env.example .env
# Fill in your DATABASE_URL (Neon) and UPSTASH_REDIS_URL

# 3. Install dependencies and start
npm install
npm start
```

**Required `.env` variables:**
```env
DATABASE_URL=postgresql://user:password@neon.tech/dbname
UPSTASH_REDIS_URL=rediss://default:...@upstash.io:6380
JWT_SECRET=your_super_secret_key
PORT=3000
```

---

### 🌐 Frontend Setup

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Build for Cloudflare Pages deployment
npm run build
```

---

### 📱 Android TWA Wrapper Setup

To remove the browser bar during the demo (Full-screen experience):

```bash
# Step 1: Generate SHA-256 fingerprint
keytool -list -v -keystore my-release-key.jks -alias my-key-alias
```

1. Upload `assetlinks.json` to `https://yourdomain.com/.well-known/assetlinks.json`
2. Update `AndroidManifest.xml` with your live URL
3. Build the APK and install on the demo device

---

## 🛠️ The "Magic" Behind the Scenes

### ⚡ Zero Latency Architecture
We chose **Cloudflare Pages** over Vercel to ensure the app **never sleeps** during the judges' demo. No cold-start. Instant response. Always on.

### 🔒 Immutable Consent Ledger
Our Consent Ledger uses **append-only database logic**, ensuring that even the developers themselves cannot delete or alter the history of any data access event. Full transparency. Forever.

### 🤖 Smart Event Bus
Every financial micro-event (bill payment, UPI credit, subscription renewal) is captured by **BullMQ** and processed asynchronously — ensuring zero UI blocking while investments happen silently in the background.

### 🔐 JWT Auth Flow
Stateless, scalable authentication using JSON Web Tokens ensures our backend remains horizontally scalable with **zero session storage overhead**.

---

## 📁 Project Structure

```
FINTECHAPP/
├── 📁 backend/
│   ├── 📁 routes/          # Express API routes
│   ├── 📁 controllers/     # Business logic
│   ├── 📁 models/          # DB schemas (Neon/PostgreSQL)
│   ├── 📁 middleware/       # JWT auth, error handlers
│   ├── 📁 queues/          # BullMQ event bus workers
│   └── server.js           # Entry point
├── 📁 frontend/
│   ├── 📁 src/
│   │   ├── 📁 components/  # React components
│   │   ├── 📁 pages/       # Route pages
│   │   └── 📁 charts/      # Chart.js / Recharts
│   └── package.json
├── 📁 android/             # TWA wrapper project
├── .env.example
└── README.md
```

---

## 🗺️ Roadmap

- [x] Backend API scaffold (Node.js + Express)
- [x] Database schema design (PostgreSQL / Neon)
- [x] JWT Authentication system
- [x] BullMQ Financial Event Bus
- [ ] Risk Simulation Sandbox (frontend)
- [ ] Consent Ledger UI
- [ ] 3-Question Onboarding flow
- [ ] Chart.js/Recharts integration
- [ ] Android TWA deployment
- [ ] Cloudflare Pages CI/CD pipeline

---

## 📜 License

This project is built for **Open Innovation Hackathon** purposes.

---

<div align="center">

**Built with ❤️ for Gen-Z, by Gen-Z**

*FinGen — Invest Smart. Stay Transparent. Automate Everything.*

</div>
