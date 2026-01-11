const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../utils/database');
const logger = require('../utils/logger');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
      'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
      [username, hashedPassword, email],
      function (err) {
        if (err) {
          logger.error('Registration error:', err);
          return res.status(400).json({ error: 'User already exists' });
        }

        const token = jwt.sign(
          { id: this.lastID, username },
          process.env.JWT_SECRET || 'jwt-secret-key-v33',
          { expiresIn: '24h' }
        );

        res.json({ token, username });
      }
    );
  } catch (error) {
    logger.error('Register endpoint error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (! username || !password) {
      return res.status(400).json({ error: 'Missing credentials' });
    }

    db.get('SELECT * FROM users WHERE username = ? ', [username], async (err, user) => {
      if (err || !user) {
        logger.warn(`Login attempt for non-existent user: ${username}`);
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET || 'jwt-secret-key-v33',
        { expiresIn:  '24h' }
      );

      res.json({ token, username: user.username });
    });
  } catch (error) {
    logger.error('Login endpoint error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
