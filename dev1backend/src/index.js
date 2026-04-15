// src/index.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dns = require('dns');
const { Pool } = require('pg');
const Redis = require('ioredis');

// 1. DNS Setup — force Google/Cloudflare public DNS so Neon hostname resolves even on restrictive ISPs
const PUBLIC_DNS_ENABLED = process.env.FORCE_PUBLIC_DNS !== 'false';
if (PUBLIC_DNS_ENABLED) {
    try {
        dns.setServers(['8.8.8.8', '1.1.1.1']);
    } catch (err) {
        console.warn('⚠️ Could not set custom DNS servers:', err.message);
    }
}

const app = express();
const PORT = process.env.PORT || 3000;
const REDIS_ENABLED = process.env.ENABLE_REDIS === 'true';
const EVENT_BUS_ENABLED = process.env.ENABLE_EVENT_BUS === 'true';

// 2. CORS — explicitly whitelist allowed origins (MUST be before other middleware)
const ALLOWED_ORIGINS = [
    // Local development
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    // Production frontend (Cloudflare Pages)
    'https://fintechapp.pages.dev',
    'https://evloveai.pages.dev',
    'https://evlove-superapp.pages.dev',
    // Render backend itself (for health-check pings)
    'https://fintechapp-cljw.onrender.com',
];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (curl, Postman, mobile apps, server-to-server)
        if (!origin) return callback(null, true);
        if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
        console.warn(`🚫 CORS blocked: ${origin}`);
        callback(new Error(`CORS policy: origin "${origin}" is not allowed.`));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

app.use(helmet({
    contentSecurityPolicy: false, // Set to false so 3D models/external APIs aren't blocked
}));
app.use(express.json());

// 3. Database & Redis Setup
const baseSsl = { rejectUnauthorized: false };
let poolConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: baseSsl,
};

if (process.env.DATABASE_URL) {
    try {
        const dbUrl = new URL(process.env.DATABASE_URL);
        const overrideHost = process.env.DATABASE_HOSTADDR || dbUrl.hostname;
        poolConfig = {
            user: decodeURIComponent(dbUrl.username),
            password: decodeURIComponent(dbUrl.password),
            host: overrideHost,
            port: Number(dbUrl.port || 5432),
            database: dbUrl.pathname.replace(/^\//, ''),
            ssl: { ...baseSsl, servername: dbUrl.hostname },
        };
        if (process.env.DATABASE_HOSTADDR) {
            console.log(`ℹ️ Using DATABASE_HOSTADDR override: ${process.env.DATABASE_HOSTADDR}`);
        }
    } catch (err) {
        console.warn('⚠️ Failed to parse DATABASE_URL, using raw connectionString:', err.message);
    }
}

const pool = new Pool(poolConfig);

let redis = null;
if (REDIS_ENABLED && process.env.REDIS_URL) {
    redis = new Redis(process.env.REDIS_URL, { lazyConnect: true });
    redis.on('error', (err) => console.error('❌ Redis error:', err.message));
    redis
        .connect()
        .then(() => redis.ping())
        .then(() => console.log('✅ Connected to Redis'))
        .catch((err) => console.error('❌ Redis connection error:', err.message));
}

// 4. Rate Limiting
const rateLimit = require('express-rate-limit');
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: "Too many requests, please slow down." }
});
app.use('/api/', apiLimiter);

// 5. Routes & Event Bus
const { startEventConsumers } = require('./queues/eventBus');
if (EVENT_BUS_ENABLED) {
    startEventConsumers(pool).catch(err => console.error('❌ Event Bus Error:', err.message));
}

app.use('/auth', require('./routes/auth')(pool));
app.use('/transaction', require('./routes/transaction')(pool));
app.use('/api', require('./routes/financials')(pool));
app.use('/api/onboarding', require('./routes/onboarding')(pool));
app.use('/api/voice', require('./routes/aiVoice')(pool));

// Market data route — real OHLC candlestick data for Sandbox
const marketRoutes = require('./routes/market');
app.use('/api/market', marketRoutes);

// 6. Health Checks
app.get('/', (req, res) => res.send('🚀 Backend is up and CORS enabled!'));

app.get('/ping', async (req, res) => {
    try {
        console.log("--- Diagnostic Check ---");
        console.log("DATABASE_URL status:", process.env.DATABASE_URL ? "✅ DEFINED" : "❌ UNDEFINED");
        await pool.query('SELECT 1');
        res.json({
            status: 'ok',
            db: true,
            redis: !!redis,
            msg: "Database connection is healthy!"
        });
    } catch (e) {
        console.error('❌ CRITICAL DB ERROR:', e.message);
        res.status(500).json({
            status: 'error',
            message: e.message,
            hint: "Check your terminal for the full error stack"
        });
    }
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));