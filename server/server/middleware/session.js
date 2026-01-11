const session = require('express-session');
const path = require('path');

const sessionMiddleware = session({
  secret:  process.env.SESSION_SECRET || 'webtermux-omni-secret-key-v33',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env. NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
});

module.exports = sessionMiddleware;
