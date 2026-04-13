const express = require('express');

const router = express.Router();

module.exports = (pool) => {
    
    // ============================================
    // 1. GET /user/xp (Fetch current XP and tier)
    // ============================================
    router.get('/user/xp/:user_id', async (req, res) => {
        try {
            const { user_id } = req.params;
            const result = await pool.query('SELECT xp, tier FROM users WHERE id = $1', [user_id]);
            
            if (result.rows.length === 0) return res.status(404).json({ error: "User not found" });
            
            res.json({
                message: "XP Data Retrieved",
                data: result.rows[0]
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Server error fetching XP" });
        }
    });

    // ============================================
    // 2. GET /trust-log (Fetch the transparent consent ledger)
    // ============================================
    router.get('/trust-log/:user_id', async (req, res) => {
        try {
            const { user_id } = req.params;
            const result = await pool.query('SELECT action, reason, timestamp FROM consent_logs WHERE user_id = $1 ORDER BY timestamp DESC', [user_id]);
            
            res.json({ 
                message: "Here is your transparent privacy log",
                trust_logs: result.rows 
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Server error fetching Trust Logs" });
        }
    });

    // ============================================
    // 3. GET /invest/simulation (Historical growth data for Sandbox)
    // ============================================
    router.get('/invest/simulation', (req, res) => {
        // Because the frontend "sandbox" needs visual charts, we send mock data!
        // The UI devs can use this to draw beautiful glassmorphism charts.
        const simulatedDataPoints = [
            { label: 'Day 1', balance: 50.00 },
            { label: 'Day 5', balance: 50.12 },
            { label: 'Day 10', balance: 52.40 },
            { label: 'Day 15', balance: 51.90 },
            { label: 'Day 20', balance: 54.10 },
            { label: 'Day 30', balance: 58.75 }
        ];

        res.json({
            message: "Simulated S&P 500 fractional growth (Last 30 Days)",
            simulation: simulatedDataPoints
        });
    });

    return router;
};
