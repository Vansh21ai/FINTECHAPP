// src/setupDb.js
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

const setupDatabase = async () => {
    try {
        console.log('⏳ Creating database tables...');
        
        await pool.query(`
            -- 1. Users Table
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                xp INTEGER DEFAULT 0,
                tier VARCHAR(50) DEFAULT 'Bronze',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            -- 2. Ledger Table (Transactions)
            CREATE TABLE IF NOT EXISTS ledger (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                amount DECIMAL(10, 2) NOT NULL,
                type VARCHAR(50) NOT NULL, -- e.g., 'credit', 'debit'
                description TEXT,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            -- 3. Consent Logs Table (Privacy)
            CREATE TABLE IF NOT EXISTS consent_logs (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                action VARCHAR(255) NOT NULL,
                reason TEXT,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            -- 4. Rewards Table
            CREATE TABLE IF NOT EXISTS rewards (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                amount DECIMAL(10, 2) NOT NULL,
                invested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            -- 5. Cashback Investment Units Table
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
        
        console.log('✅ Database tables created successfully!');
    } catch (err) {
        console.error('❌ Error creating tables:', err);
    } finally {
        // Close the connection when done
        pool.end();
    }
};

setupDatabase();
