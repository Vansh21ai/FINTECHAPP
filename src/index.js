// src/index.js
require('dotenv').config(); // loads .env variables

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { Pool } = require('pg');          // PostgreSQL connection pool
const Redis = require('ioredis');        // Redis client

const app = express();
const PORT = process.env.PORT || 3000;

// ---------------------------------------------------
// Database & Cache setup
// ---------------------------------------------------

// PostgreSQL pool (Neon requires SSL)
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

// Test PostgreSQL connection
pool.connect((err, client, release) => {
    if (err) {
        console.error('❌ PostgreSQL connection error:', err.stack);
    } else {
        console.log('✅ Connected to PostgreSQL');
        release();
    }
});

// Redis client (secure TLS connection)
const redis = new Redis(process.env.REDIS_URL);

// Test Redis connection
redis
    .ping()
    .then(() => console.log('✅ Connected to Redis'))
    .catch((err) => console.error('❌ Redis connection error:', err));

// ---------------------------------------------------
// Middleware
// ---------------------------------------------------
app.use(cors());
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

// Start listening for Background Tasks (BullMQ Workers)
startEventConsumers(pool);

app.use('/auth', authRoutes);
app.use('/transaction', transactionRoutes);
app.use('/api', financialRoutes); // This mounts the new 3 financial routes
app.use('/api/onboarding', onboardingRoutes); // 3-Question Onboarding flow

// AI Voice route (must be before server start)
const aiVoiceRoutes = require('./routes/aiVoice')(pool);
app.use('/api/voice', aiVoiceRoutes);

// Simple health‑check route
app.get('/', (req, res) => res.send('🚀 Backend is up!'));

// Extended health‑check that also verifies DB & Redis
app.get('/ping', async (req, res) => {
    try {
        // Simple DB query to ensure connection works
        const dbResult = await pool.query('SELECT 1');
        // Redis ping (already performed above, but we repeat for safety)
        await redis.ping();

        res.json({
            status: 'ok',
            db: dbResult.rowCount === 1,
            redis: true,
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
