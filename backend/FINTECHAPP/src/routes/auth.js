const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

module.exports = (pool) => {
    
    // ============================================
    // 1. REGISTER (/auth/register)
    // ============================================
    router.post('/register', async (req, res) => {
        try {
            const { email, password } = req.body;
            
            // Check if user gave us email and password
            if (!email || !password) {
                return res.status(400).json({ error: 'Email and password are required' });
            }

            // Check if this user already exists in the database
            const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
            if (userExists.rows.length > 0) {
                return res.status(400).json({ error: 'User already exists' });
            }

            // 🔒 Hash the password using bcryptjs for security
            const salt = await bcrypt.genSalt(10);
            const password_hash = await bcrypt.hash(password, salt);

            // Insert into Neon Postgres Database
            const newUser = await pool.query(
                'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, xp, tier',
                [email, password_hash]
            );

            // 🎟️ Generate a JWT token directly so they don't have to login again
            const token = jwt.sign(
                { id: newUser.rows[0].id, email: newUser.rows[0].email },
                process.env.JWT_SECRET || 'my_super_secret_hackathon_key',
                { expiresIn: '1d' } // token expires in 1 day
            );

            res.status(201).json({
                message: '✅ User registered successfully!',
                user: newUser.rows[0],
                token: token
            });

        } catch (err) {
            console.error('Registration Error:', err.message);
            res.status(500).json({ error: 'Server error' });
        }
    });

    // ============================================
    // 2. LOGIN (/auth/login)
    // ============================================
    router.post('/login', async (req, res) => {
        try {
            const { email, password } = req.body;

            // 1. Find User by email
            const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
            if (userResult.rows.length === 0) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const user = userResult.rows[0];

            // 2. Compare passwords
            const isMatch = await bcrypt.compare(password, user.password_hash);
            if (!isMatch) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // 3. Generate JWT Token
            const token = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET || 'my_super_secret_hackathon_key',
                { expiresIn: '1d' }
            );

            res.json({
                message: '🔓 Login successful',
                token: token,
                user: { id: user.id, email: user.email, xp: user.xp, tier: user.tier }
            });

        } catch (err) {
            console.error('Login Error:', err.message);
            res.status(500).json({ error: 'Server error' });
        }
    });

    return router;
};
