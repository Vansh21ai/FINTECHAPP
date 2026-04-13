const express = require('express');
const { triggerFinancialEvents } = require('../queues/eventBus');
const { processCashbackInvestment } = require('../services/cashbackInvestment');

const router = express.Router();

module.exports = (pool) => {
    
    // ============================================
    // THE 'MAGIC' TRANSACTION ROUTE
    // ============================================
    router.post('/', async (req, res) => {
        try {
            // In a real app, user_id comes from the JWT token.
            // For now, we will just send it in the request body for testing.
            const { user_id, amount, type, description } = req.body;

            // 1. Save the transaction in our Ledger (Database)
            const newTx = await pool.query(
                'INSERT INTO ledger (user_id, amount, type, description) VALUES ($1, $2, $3, $4) RETURNING *',
                [user_id, amount, type, description]
            );

            // 2. Prefer event bus, but fallback to direct cashback investment if queueing fails.
            let cashbackInfo = null;
            try {
                const queued = await triggerFinancialEvents(newTx.rows[0]);
                if (!queued) {
                    cashbackInfo = await processCashbackInvestment(pool, newTx.rows[0]);
                }
            } catch (eventErr) {
                console.error('Event Bus Error:', eventErr.message);
                cashbackInfo = await processCashbackInvestment(pool, newTx.rows[0]);
            }

            // 3. Immediately reply to the user (Super Fast Experience!)
            res.status(200).json({
                message: '💸 Transaction successful! Background engines activated.',
                transaction: newTx.rows[0],
                cashback_investment: cashbackInfo,
            });

        } catch (err) {
            console.error('Transaction Error:', err.message);
            res.status(500).json({ error: 'Server error parsing transaction' });
        }
    });

    return router;
};
