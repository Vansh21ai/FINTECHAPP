'use strict';

/**
 * src/routes/market.js
 * GET /api/market/chart/:symbol/:scenario
 *
 * Flow:
 *  1. Resolve strict Date objects for the scenario window
 *  2. Try yahooFinance.historical() with the exact user symbol
 *  3. On failure → yahooFinance.search() → retry historical() with top hit
 *  4. Map to ApexCharts [{ x, y:[O,H,L,C] }] and return
 *  5. Both fail → strict 404, no mock data
 */

const express = require('express');
const router  = express.Router();

const YahooFinance = require('yahoo-finance2').default;
const yahooFinance = new YahooFinance({ suppressNotices: ['ripHistorical'] });

// ─── Scenario → strict Date-object windows ────────────────────────────────────
function daysAgo(n) {
    const d = new Date();
    d.setDate(d.getDate() - n);
    d.setHours(0, 0, 0, 0);
    return d;
}

function today() {
    const d = new Date();
    d.setHours(23, 59, 59, 999);
    return d;
}

const SCENARIO_WINDOWS = {
    live:           () => ({ period1: daysAgo(35),  period2: today(),                              interval: '1d'  }),
    '1mo':          () => ({ period1: daysAgo(35),  period2: today(),                              interval: '1d'  }),
    '3mo':          () => ({ period1: daysAgo(95),  period2: today(),                              interval: '1d'  }),
    '1y':           () => ({ period1: daysAgo(370), period2: today(),                              interval: '1d'  }),
    covid:          () => ({ period1: new Date('2020-02-01'), period2: new Date('2020-05-30'),      interval: '1d'  }),
    'tech-selloff': () => ({ period1: new Date('2022-01-01'), period2: new Date('2022-12-31'),      interval: '1d'  }),
    dotcom:         () => ({ period1: new Date('1999-10-01'), period2: new Date('2002-12-31'),      interval: '1wk' }),
    nifty2020:      () => ({ period1: new Date('2020-01-01'), period2: new Date('2020-11-30'),      interval: '1d'  }),
};

const VALID_SCENARIOS = [...Object.keys(SCENARIO_WINDOWS), 'custom'];

// ─── Attempt yahooFinance.historical() — returns rows or throws ───────────────
async function fetchHistorical(symbol, queryOpts) {
    const rows = await yahooFinance.historical(symbol, queryOpts);
    // Treat empty as a failure so the caller can try the fallback
    if (!rows || rows.length === 0) {
        throw new Error(`Empty dataset for ${symbol}`);
    }
    return rows;
}

// ─── Main route ───────────────────────────────────────────────────────────────
router.get('/chart/:symbol/:scenario', async (req, res) => {
    const { symbol: rawSymbol, scenario } = req.params;
    const { from, to } = req.query;

    // ── Validate scenario ─────────────────────────────────────────────────────
    if (!VALID_SCENARIOS.includes(scenario)) {
        return res.status(400).json({
            success: false,
            error: `Unknown scenario "${scenario}". Valid: ${VALID_SCENARIOS.join(', ')}`,
        });
    }
    if (scenario === 'custom' && (!from || !to)) {
        return res.status(400).json({
            success: false,
            error: 'The "custom" scenario requires ?from=YYYY-MM-DD&to=YYYY-MM-DD.',
        });
    }

    // ── Step 1: Build strict Date objects for the window ──────────────────────
    let queryOpts;
    if (scenario === 'custom') {
        queryOpts = {
            period1:  new Date(from),
            period2:  new Date(to),
            interval: '1d',
        };
    } else {
        queryOpts = SCENARIO_WINDOWS[scenario]();
    }

    const directSymbol = rawSymbol.trim().toUpperCase();
    let resolvedSymbol = directSymbol;
    let raw = null;

    // ── Step 2: Direct fetch with the user's exact input ──────────────────────
    try {
        console.log(`📊 [direct] ${directSymbol} | ${scenario}`);
        raw = await fetchHistorical(directSymbol, queryOpts);
    } catch (directErr) {
        console.warn(`⚠️  Direct fetch failed for "${directSymbol}": ${directErr.message}`);

        // ── Step 3: Fallback — search for the real ticker, retry historical ────
        try {
            console.log(`🔍 Searching Yahoo for: "${rawSymbol}"`);
            const searchResult = await yahooFinance.search(rawSymbol.trim(), { newsCount: 0 });

            const hit = (searchResult.quotes || []).find(q =>
                q.isYahooFinance &&
                ['EQUITY', 'ETF', 'INDEX', 'MUTUALFUND'].includes(q.quoteType) &&
                q.symbol
            );

            if (!hit) {
                throw new Error(`No Yahoo Finance symbol found for "${rawSymbol}"`);
            }

            resolvedSymbol = hit.symbol;
            console.log(`✅ Resolved "${rawSymbol}" → ${resolvedSymbol} (${hit.shortname || ''})`);

            raw = await fetchHistorical(resolvedSymbol, queryOpts);
        } catch (fallbackErr) {
            console.error(`❌ Fallback also failed: ${fallbackErr.message}`);
            // ── Step 4 (failure): Both attempts failed → strict 404 ────────────
            return res.status(404).json({
                success: false,
                error: `Market data not available for "${rawSymbol}" during this timeframe. The asset may be invalid, delisted, or did not trade in this period.`,
            });
        }
    }

    // ── Step 4 (success): Filter & map to ApexCharts format ──────────────────
    const validRows = raw.filter(
        d => d.open != null && d.high != null && d.low != null && d.close != null
    );

    if (validRows.length === 0) {
        return res.status(404).json({
            success: false,
            error: `Market data not available for "${resolvedSymbol}" during this timeframe.`,
        });
    }

    const candles = validRows.map(d => ({
        x: (d.date instanceof Date ? d.date : new Date(d.date))
            .toISOString()
            .split('T')[0],
        y: [
            parseFloat(d.open.toFixed(4)),
            parseFloat(d.high.toFixed(4)),
            parseFloat(d.low.toFixed(4)),
            parseFloat(d.close.toFixed(4)),
        ],
    }));

    // Pre-compute axis bounds with 6% padding so candles fill the viewport
    const lows   = candles.map(c => c.y[2]);
    const highs  = candles.map(c => c.y[1]);
    const rawMin = Math.min(...lows);
    const rawMax = Math.max(...highs);
    const pad    = (rawMax - rawMin) * 0.06;

    return res.json({
        success:        true,
        symbol:         resolvedSymbol,
        originalInput:  directSymbol !== resolvedSymbol ? directSymbol : undefined,
        scenario,
        count:          candles.length,
        yMin:           parseFloat((rawMin - pad).toFixed(4)),
        yMax:           parseFloat((rawMax + pad).toFixed(4)),
        data:           candles,
    });
});

module.exports = router;
