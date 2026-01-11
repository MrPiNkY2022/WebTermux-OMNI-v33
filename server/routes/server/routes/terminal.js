Enterconst express = require('express');
const { authenticateToken } = require('../middleware/auth');
const db = require('../utils/database');
const logger = require('../utils/logger');

const router = express.Router();

router.get('/sessions', authenticateToken, (req, res) => {
  db.all(
    'SELECT * FROM sessions WHERE user_id = ? ORDER BY created_at DESC',
    [req. user.id],
    (err, sessions) => {
      if (err) {
        logger.error('Error fetching sessions:', err);
        return res.status(500).json({ error: 'Failed to fetch sessions' });
      }
      res.json(sessions);
    }
  );
});

router.post('/sessions', authenticateToken, (req, res) => {
  const { name } = req.body;
  const sessionId = Date.now().toString();

  db.run(
    'INSERT INTO sessions (session_id, user_id, name) VALUES (?, ?, ?)',
    [sessionId, req.user.id, name || 'Terminal Session'],
    (err) => {
      if (err) {
        logger.error('Error creating session:', err);
        return res.status(500).json({ error: 'Failed to create session' });
      }
      res.json({ sessionId, name });
    }
  );
});

router.delete('/sessions/:sessionId', authenticateToken, (req, res) => {
  db.run(
    'DELETE FROM sessions WHERE session_id = ?  AND user_id = ?',
    [req.params.sessionId, req.user.id],
    (err) => {
      if (err) {
        logger.error('Error deleting session:', err);
        return res.status(500).json({ error: 'Failed to delete session' });
      }
      res.json({ message: 'Session deleted' });
    }
  );
});

router.get('/history/:sessionId', authenticateToken, (req, res) => {
  db.all(
    'SELECT * FROM command_history WHERE session_id = ?  ORDER BY created_at ASC LIMIT 100',
    [req.params.sessionId],
    (err, history) => {
      if (err) {
        logger.error('Error fetching history:', err);
        return res.status(500).json({ error: 'Failed to fetch history' });
      }
      res.json(history);
    }
  );
});

module.exports = router;
