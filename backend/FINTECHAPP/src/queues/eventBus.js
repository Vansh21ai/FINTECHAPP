const { Queue, Worker } = require('bullmq');
const Redis = require('ioredis');

const redisUrl = process.env.REDIS_URL || '';
const isTLS = redisUrl.startsWith('rediss://');

// BullMQ requires a special Redis configuration setting
const connectionConfig = {
    maxRetriesPerRequest: null
};

if (isTLS) {
    connectionConfig.tls = { rejectUnauthorized: false }; // Required for Upstash / secure redis
}

const connection = new Redis(redisUrl, connectionConfig);

// Critical: Catch background connection errors so node doesn't terminate!
connection.on('error', (err) => {
    console.error('⚠️ [Event Bus] Redis Connection Error Ignored:', err.message);
});

// ==========================================
// 1. CREATE QUEUES (The "Waiting Rooms")
// ==========================================
const investQueue = new Queue('invest', { connection });
const rewardQueue = new Queue('reward', { connection });
const insuranceQueue = new Queue('insurance', { connection });
const trustQueue = new Queue('trust', { connection });

// ==========================================
// 2. THE PRODUCER (Fires events to all queues)
// ==========================================
const triggerFinancialEvents = async (transactionData) => {
    console.log(`\n🚀 [Event Bus] Transaction received! Executing SuperApp logic in background...`);
    
    // Send the data to all 4 queues simultaneously!
    await investQueue.add('analyze-investment', transactionData);
    await rewardQueue.add('calculate-rewards', transactionData);
    await insuranceQueue.add('check-insurance', transactionData);
    await trustQueue.add('log-consent', transactionData);
};

// ==========================================
// 3. THE CONSUMERS (Workers that listen and process)
// ==========================================
const startEventConsumers = (pool) => {
    console.log('🎧 Event Bus Consumers are listening...');

    // Worker 1: Invest
    new Worker('invest', async job => {
        console.log(`🤑 [Invest Queue] Analyzing auto-invest slice for $${job.data.amount}`);
        // Future logic: Calculate round-ups and insert into `invest_sandbox` table
    }, { connection });

    // Worker 2: Reward (Micro-Invest + XP addition)
    new Worker('reward', async job => {
        const { user_id, amount } = job.data;
        
        // 1. Calculate 5% wealth-back reward
        const rewardAmount = (amount * 0.05).toFixed(2);
        console.log(`🎁 [Reward Queue] Auto-investing $${rewardAmount} into Liquid MF for user ${user_id}`);
        
        await pool.query(
            'INSERT INTO rewards (user_id, amount) VALUES ($1, $2)', 
            [user_id, rewardAmount]
        );

        // 2. Add 10 XP for spending wisely
        console.log(`🎁 [Reward Queue] Adding +10 XP to user ${user_id}`);
        await pool.query('UPDATE users SET xp = xp + 10 WHERE id = $1', [user_id]);
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
