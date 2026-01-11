Enterconst { authenticateSocket } = require('../middleware/auth');
const PTY = require('pty.js');
const db = require('../utils/database');
const logger = require('../utils/logger');

class SocketManager {
  constructor(io) {
    this.io = io;
    this.terminals = new Map();
  }

  initialize() {
    this.io.use(authenticateSocket);

    this.io.on('connection', (socket) => {
      logger.info(`User connected: ${socket.user.username}`);

      // Create Terminal Session
      socket.on('create-terminal', (data) => {
        const { sessionId, shell } = data;
        this.createTerminal(socket, sessionId, shell || '/bin/bash');
      });

      // Write Command to Terminal
      socket.on('terminal-input', (data) => {
        const { sessionId, input } = data;
        this. writeToTerminal(socket, sessionId, input);
      });

      // Resize Terminal
      socket.on('terminal-resize', (data) => {
        const { sessionId, rows, cols } = data;
        this.resizeTerminal(sessionId, rows, cols);
      });

      // Close Terminal
      socket.on('close-terminal', (data) => {
        const { sessionId } = data;
        this.closeTerminal(socket, sessionId);
      });

      // Disconnect
      socket.on('disconnect', () => {
        logger. info(`User disconnected: ${socket.user.username}`);
        this.terminals.forEach((term, sessionId) => {
          if (term.socket === socket) {
            this.closeTerminal(socket, sessionId);
          }
        });
      });
    });
  }

  createTerminal(socket, sessionId, shell) {
    try {
      const ptyProcess = PTY.spawn(shell, [], {
        name: 'xterm-color',
        cols: 80,
        rows: 24
      });

      const terminalData = {
        process: ptyProcess,
        socket: socket,
        sessionId:  sessionId
      };

      this.terminals. set(sessionId, terminalData);

      ptyProcess.on('data', (data) => {
        socket.emit('terminal-output', { sessionId, output: data. toString() });
        this.saveCommandHistory(sessionId, data.toString());
      });

      ptyProcess.on('exit', () => {
        this.closeTerminal(socket, sessionId);
      });

      socket.emit('terminal-created', { sessionId });
      logger.info(`Terminal created for session:  ${sessionId}`);
    } catch (error) {
      logger.error('Error creating terminal:', error);
      socket.emit('terminal-error', { sessionId, error: error.message });
    }
  }

  writeToTerminal(socket, sessionId, input) {
    const terminalData = this.terminals.get(sessionId);
    if (terminalData && terminalData.process) {
      try {
        terminalData.process.write(input);
      } catch (error) {
        logger.error('Error writing to terminal:', error);
        socket.emit('terminal-error', { sessionId, error: error.message });
      }
    }
  }

  resizeTerminal(sessionId, rows, cols) {
    const terminalData = this. terminals.get(sessionId);
    if (terminalData && terminalData.process) {
      terminalData.process.resize(cols, rows);
    }
  }

  closeTerminal(socket, sessionId) {
    const terminalData = this.terminals.get(sessionId);
    if (terminalData) {
      try {
        terminalData.process.kill();
      } catch (error) {
        logger.error('Error killing terminal process:', error);
      }
      this.terminals.delete(sessionId);
      socket.emit('terminal-closed', { sessionId });
    }
  }

  saveCommandHistory(sessionId, output) {
    db.run(
      'INSERT INTO command_history (session_id, command, output) VALUES (?, ?, ?)',
      [sessionId, '', output],
      (err) => {
        if (err) logger.error('Error saving command history:', err);
      }
    );
  }
}

module. exports = { SocketManager };
