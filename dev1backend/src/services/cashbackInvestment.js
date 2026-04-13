const YahooFinance = require('yahoo-finance2').default;

const yahooFinance = new YahooFinance();

const CASHBACK_PERCENT = Number(process.env.CASHBACK_PERCENT || 5);
const LIQUID_FUND_SYMBOL = process.env.LIQUID_FUND_SYMBOL || 'LIQUIDBEES.NS';

const toMoney = (value) => Number(value).toFixed(2);
const toUnits = (value) => Number(value).toFixed(8);

const ensureInvestmentTables = async (pool) => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS cashback_investments (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            ledger_id INTEGER REFERENCES ledger(id) ON DELETE CASCADE,
            fund_symbol VARCHAR(30) NOT NULL,
            cashback_amount DECIMAL(10, 2) NOT NULL,
            nav_price DECIMAL(12, 4) NOT NULL,
            units DECIMAL(18, 8) NOT NULL,
            invested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);
};

const getLiveNav = async () => {
    const quote = await yahooFinance.quote(LIQUID_FUND_SYMBOL);
    const nav = Number(quote.regularMarketPrice);
    if (!Number.isFinite(nav) || nav <= 0) {
        throw new Error('Failed to fetch valid live NAV');
    }
    return nav;
};

const processCashbackInvestment = async (pool, transactionData) => {
    const amount = Number(transactionData.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
        throw new Error('Invalid transaction amount for cashback processing');
    }

    await ensureInvestmentTables(pool);

    const cashbackAmount = Number((amount * CASHBACK_PERCENT) / 100);
    const navPrice = await getLiveNav();
    const units = cashbackAmount / navPrice;

    await pool.query('BEGIN');
    try {
        await pool.query(
            'INSERT INTO rewards (user_id, amount) VALUES ($1, $2)',
            [transactionData.user_id, toMoney(cashbackAmount)]
        );

        await pool.query(
            `INSERT INTO cashback_investments (user_id, ledger_id, fund_symbol, cashback_amount, nav_price, units)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [
                transactionData.user_id,
                transactionData.id,
                LIQUID_FUND_SYMBOL,
                toMoney(cashbackAmount),
                Number(navPrice).toFixed(4),
                toUnits(units),
            ]
        );

        await pool.query('UPDATE users SET xp = xp + 10 WHERE id = $1', [transactionData.user_id]);
        await pool.query('COMMIT');
    } catch (err) {
        await pool.query('ROLLBACK');
        throw err;
    }

    return {
        cashback_percent: CASHBACK_PERCENT,
        cashback_amount: Number(toMoney(cashbackAmount)),
        fund_symbol: LIQUID_FUND_SYMBOL,
        nav_price: Number(Number(navPrice).toFixed(4)),
        units_allocated: Number(toUnits(units)),
    };
};

const getInvestmentSummary = async (pool, userId) => {
    await ensureInvestmentTables(pool);

    const navPrice = await getLiveNav();
    const result = await pool.query(
        `SELECT
            COALESCE(SUM(cashback_amount), 0) AS principal_invested,
            COALESCE(SUM(units), 0) AS total_units,
            COUNT(*)::INTEGER AS total_cashback_events
         FROM cashback_investments
         WHERE user_id = $1`,
        [userId]
    );

    const row = result.rows[0];
    const principal = Number(row.principal_invested || 0);
    const totalUnits = Number(row.total_units || 0);
    const currentValue = totalUnits * navPrice;
    const gainAmount = currentValue - principal;
    const gainPercent = principal > 0 ? (gainAmount / principal) * 100 : 0;

    return {
        user_id: Number(userId),
        fund_symbol: LIQUID_FUND_SYMBOL,
        cashback_percent: CASHBACK_PERCENT,
        principal_invested: Number(toMoney(principal)),
        total_units: Number(toUnits(totalUnits)),
        live_nav_price: Number(Number(navPrice).toFixed(4)),
        current_value: Number(toMoney(currentValue)),
        gain_amount: Number(toMoney(gainAmount)),
        gain_percent: Number(gainPercent.toFixed(2)),
        total_cashback_events: row.total_cashback_events || 0,
    };
};

const getInvestmentHistory = async (pool, userId) => {
    await ensureInvestmentTables(pool);
    const result = await pool.query(
        `SELECT id, ledger_id, fund_symbol, cashback_amount, nav_price, units, invested_at
         FROM cashback_investments
         WHERE user_id = $1
         ORDER BY invested_at DESC`,
        [userId]
    );
    return result.rows;
};

const getInvestmentPerformanceSeries = async (pool, userId) => {
    await ensureInvestmentTables(pool);
    const rowsResult = await pool.query(
        `SELECT cashback_amount, units, invested_at
         FROM cashback_investments
         WHERE user_id = $1
         ORDER BY invested_at ASC`,
        [userId]
    );

    const events = rowsResult.rows;
    if (events.length === 0) {
        return {
            user_id: Number(userId),
            fund_symbol: LIQUID_FUND_SYMBOL,
            points: [],
        };
    }

    const navPrice = await getLiveNav();
    let cumulativeInvested = 0;
    let cumulativeUnits = 0;

    const points = events.map((event) => {
        cumulativeInvested += Number(event.cashback_amount || 0);
        cumulativeUnits += Number(event.units || 0);

        const currentValue = cumulativeUnits * navPrice;
        const gainAmount = currentValue - cumulativeInvested;
        const gainPercent = cumulativeInvested > 0 ? (gainAmount / cumulativeInvested) * 100 : 0;

        return {
            date: new Date(event.invested_at).toISOString().split('T')[0],
            invested_total: Number(toMoney(cumulativeInvested)),
            current_value: Number(toMoney(currentValue)),
            gain_amount: Number(toMoney(gainAmount)),
            gain_percent: Number(gainPercent.toFixed(2)),
            live_nav_price: Number(Number(navPrice).toFixed(4)),
        };
    });

    return {
        user_id: Number(userId),
        fund_symbol: LIQUID_FUND_SYMBOL,
        points,
    };
};

module.exports = {
    processCashbackInvestment,
    getInvestmentSummary,
    getInvestmentHistory,
    getInvestmentPerformanceSeries,
    ensureInvestmentTables,
};
