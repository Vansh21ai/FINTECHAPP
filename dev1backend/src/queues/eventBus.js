const { Queue, Worker } = require('bullmq');
const Redis = require('ioredis');
const { processCashbackInvestment } = require('../services/cashbackInvestment');

let connection = null;
let redisReady = false;
let investQueue = null;
let rewardQueue = null;
let insuranceQueue = null;
let trustQueue = null;

const initRedisAndQueues = async () => {
    if (!process.env.REDIS_URL) {
        console.warn('⚠️ REDIS_URL not configured. Background queues are disabled.');
        return false;
    }

    try {
        // BullMQ requires maxRetriesPerRequest to be null.
        connection = new Redis(process.env.REDIS_URL, {
            maxRetriesPerRequest: null,
            lazyConnect: true,
            tls: { rejectUnauthorized: false },
        });
        connection.on('error', (err) => {
            console.error('❌ Redis runtime error:', err.message);
        });
        await connection.connect();
        await connection.ping();

        investQueue = new Queue('invest', { connection });
        rewardQueue = new Queue('reward', { connection });
        insuranceQueue = new Queue('insurance', { connection });
        trustQueue = new Queue('trust', { connection });
        redisReady = true;
        console.log('✅ Event bus connected to Redis');
        return true;
    } catch (err) {
        redisReady = false;
        console.error('❌ Event bus Redis init failed:', err.message);
        return false;
    }
};

// ==========================================
// 2. THE PRODUCER (Fires events to all queues)
// ==========================================
const triggerFinancialEvents = async (transactionData) => {
    if (!redisReady) {
        console.warn('⚠️ Event bus skipped: Redis unavailable.');
        return false;
    }

    console.log('\n🚀 [Event Bus] Transaction received! Executing SuperApp logic in background...');

    await investQueue.add('analyze-investment', transactionData);
    await rewardQueue.add('calculate-rewards', transactionData);
    await insuranceQueue.add('check-insurance', transactionData);
    await trustQueue.add('log-consent', transactionData);
    return true;
};

// ==========================================
// 3. THE CONSUMERS (Workers that listen and process)
// ==========================================
const startEventConsumers = async (pool) => {
    const initialized = await initRedisAndQueues();
    if (!initialized) {
        console.warn('⚠️ Event consumers not started.');
        return;
    }
    console.log('🎧 Event Bus Consumers are listening...');

    // Worker 1: Invest
    new Worker('invest', async job => {
        console.log(`🤑 [Invest Queue] Analyzing auto-invest slice for $${job.data.amount}`);
        // Future logic: Calculate round-ups and insert into `invest_sandbox` table
    }, { connection });

    // Worker 2: Reward (Micro-Invest + XP addition)
    new Worker('reward', async job => {
        const { user_id } = job.data;
        const investment = await processCashbackInvestment(pool, job.data);
        console.log(
            `🎁 [Reward Queue] Invested cashback for user ${user_id}: ${investment.units_allocated} units of ${investment.fund_symbol}`
        );
    }, { connection });

    // Worker 3: Insurance
    new Worker('insurance', async job => {
        const { user_id, description } = job.data;
        const descLower = description.toLowerCase();

        console.log(`🛡️ [Insurance Queue] Checking if "${description}" needs coverage...`);

        // Dynamic 3D Umbrella triggers
        if (descLower.includes('phone') || descLower.includes('laptop') || descLower.includes('tv') || descLower.includes('fridge') || descLower.includes('electrical')) {
            console.log(`🛡️ [Insurance Queue] 🚨 EXPENSIVE GADGET DETECTED! Pushing 'Gadget Insurance' suggestion to user's dashboard!`);
        } else if (descLower.includes('bike') || descLower.includes('car')) {
            console.log(`🛡️ [Insurance Queue] 🚨 VEHICLE DETECTED! Pushing 'Motor Cover' suggestion to user's dashboard!`);
        } else if (descLower.includes('private jet')) {
            console.log(`🛡️ [Insurance Queue] 🚨 VIP DETECTED! Pushing 'Aviation Cover' suggestion to user's dashboard!`);
        } else {
            console.log(`🛡️ [Insurance Queue] No special insurance needed for this routine item.`);
        }
    }, { connection });

    // Worker 4: Trust/Consent
    new Worker('trust', async job => {
        console.log(`🤝 [Trust Queue] Logging ledger & transparent consent...`);
        await pool.query(
            'INSERT INTO consent_logs (user_id, action, reason) VALUES ($1, $2, $3)',
            [job.data.user_id, 'TRANSACTION_SYNC', 'Core app functionality']
        );
    }, { connection });
};

module.exports = {
    triggerFinancialEvents,
    startEventConsumers
};
