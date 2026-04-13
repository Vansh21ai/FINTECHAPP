const express = require('express');
const router = express.Router();

module.exports = (pool) => {
    
    // ============================================
    // POST /api/onboarding
    // The "3-Question Flow" logic from the hackathon spec
    // ============================================
    router.post('/', async (req, res) => {
        try {
            // Note: In an actual production scenario, we'd also grab the user_id
            // via a JWT token. This lets anyone test it right now via Postman/Browser.
            const { income, worry, goal } = req.body;

            // Logic matching the JSON config map described in File 1
            let heroPanel = 'Micro-Invest Tracker'; // Default
            
            if (worry === 'Losing money') {
                heroPanel = 'Trust Dashboard';
            } else if (goal === 'Start a business' || goal === 'Travel fund') {
                heroPanel = 'Risk Sandbox';
            }

            // In an expanded version, we would save these answers into the PostgreSQL DB here.
            
            res.json({
                message: "Onboarding complete! Your dashboard is beautifully personalized.",
                dashboard_config: {
                    show_first: heroPanel,
                    theme: "dark" // Setting the Gen-Z mesh theme
                }
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Server error during onboarding processing" });
        }
    });

    return router;
};
