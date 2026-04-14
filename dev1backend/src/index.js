// src/index.js
require('dotenv').config(); // loads .env variables

const dns = require('dns');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { Pool } = require('pg');          // PostgreSQL connection pool
const Redis = require('ioredis');        // Redis client

// Force Google/Cloudflare public DNS so Neon hostname resolves even on restrictive ISPs
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

// ---------------------------------------------------
// Database & Cache setup
// ---------------------------------------------------

// PostgreSQL pool (Neon requires SSL)
// DATABASE_HOSTADDR lets us bypass DNS entirely by using a raw IP
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

// Test PostgreSQL connection
pool.connect((err, client, release) => {
    if (err) {
        console.error('❌ PostgreSQL connection error:', err.stack);
    } else {
        console.log('✅ Connected to PostgreSQL');
        release();
    }
});

let redis = null;
if (REDIS_ENABLED && process.env.REDIS_URL) {
    redis = new Redis(process.env.REDIS_URL, { lazyConnect: true });
    redis.on('error', (err) => {
        console.error('❌ Redis runtime error:', err.message);
    });
} else {
    console.warn('⚠️ Redis disabled. Set ENABLE_REDIS=true to enable.');
}

// Test Redis connection
if (redis) {
    redis
        .connect()
        .then(() => redis.ping())
        .then(() => console.log('✅ Connected to Redis'))
        .catch((err) => console.error('❌ Redis connection error:', err.message));
}

// ---------------------------------------------------
// CORS — explicitly whitelist allowed origins
// ---------------------------------------------------
const ALLOWED_ORIGINS = [
    // Local development
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    // Production frontend (Cloudflare Pages)
    'https://fintechapp.pages.dev',
    'https://evloveai.pages.dev',
    'https://evlove-superapps.pages.dev',
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
app.use(helmet());
app.use(express.json());

// ---------------------------------------------------
// Security & Rate Limiting
// ---------------------------------------------------
const rateLimit = require('express-rate-limit');
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: { error: "Too many requests, please slow down." }
});
// Apply the rate limiter to all API calls to prevent spam/DDoS
app.use('/', apiLimiter);

// ---------------------------------------------------
// Routes & Event Bus Start
// ---------------------------------------------------
const authRoutes = require('./routes/auth')(pool);
const transactionRoutes = require('./routes/transaction')(pool);
const financialRoutes = require('./routes/financials')(pool);
const onboardingRoutes = require('./routes/onboarding')(pool);
const { startEventConsumers } = require('./queues/eventBus');

if (EVENT_BUS_ENABLED) {
    // Start listening for Background Tasks (BullMQ Workers)
    startEventConsumers(pool).catch((err) => {
        console.error('❌ Failed to start event consumers:', err.message);
    });
} else {
    console.warn('⚠️ Event bus disabled. Set ENABLE_EVENT_BUS=true to enable.');
}

app.use('/auth', authRoutes);
app.use('/transaction', transactionRoutes);
app.use('/api', financialRoutes); // This mounts the new 3 financial routes
app.use('/api/onboarding', onboardingRoutes); // 3-Question Onboarding flow

// AI Voice route (must be before server start)
const aiVoiceRoutes = require('./routes/aiVoice')(pool);
app.use('/api/voice', aiVoiceRoutes);

// Market data route — real OHLC candlestick data for Sandbox
const marketRoutes = require('./routes/market');
app.use('/api/market', marketRoutes);

// Simple health‑check route
app.get('/', (req, res) => res.send('🚀 Backend is up!'));

// Extended health‑check that also verifies DB & Redis
app.get('/ping', async (req, res) => {
    try {
        // Simple DB query to ensure connection works
        const dbResult = await pool.query('SELECT 1');
        let redisOk = false;
        if (redis) {
            await redis.ping();
            redisOk = true;
        }

        res.json({
            status: 'ok',
            db: dbResult.rowCount === 1,
            redis: redisOk,
        });
    } catch (e) {
        console.error('Health‑check error:', e);
        res.status(500).json({ status: 'error', error: e.message });
    }
});

// Start server
app.listen(PORT, () =>
    console.log(`Server listening on http://localhost:${PORT}`)
);
