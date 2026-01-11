const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const sessionMiddleware = require('./middleware/session');
const authRoutes = require('./routes/auth');
const terminalRoutes = require('./routes/terminal');
const { SocketManager } = require('./socket/manager');
const logger = require('./utils/logger');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: process.env.CLIENT_URL || 'http://localhost:5173' },
  transports: ['websocket', 'polling']
});

// Security Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')));

// Session Management
app. use(sessionMiddleware);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/terminal', terminalRoutes);

// Socket.IO Connection
const socketManager = new SocketManager(io);
socketManager.initialize();

// Error Handling
app.use((err, req, res, next) => {
  logger.error('Application error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// 404 Handler
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  logger.info(`WebTermux OMNI v.33 running on port ${PORT}`);
});

module.exports = server;
