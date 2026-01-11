# WebTermux OMNI v.33

Advanced web-based terminal emulator with multi-session support, real-time command execution, and persistent history tracking.

## Features

✨ **Core Features:**
- 🔐 User authentication with JWT tokens
- 💻 Real-time terminal emulation via XTerm. js
- 🔄 Multi-session terminal support
- 📊 Command history tracking
- 🎨 Dark theme with customizable styling
- 📱 Responsive design
- 🔌 WebSocket-based real-time communication

✅ **Advanced Capabilities:**
- Custom shell support (/bin/bash, /bin/sh, /bin/zsh, etc.)
- Terminal resizing on demand
- Secure session management
- User-specific session isolation
- Command output logging
- Connection status monitoring

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Socket.IO** - Real-time bidirectional communication
- **pty.js** - Pseudo-terminal management
- **SQLite3** - Data persistence
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Winston** - Logging

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **XTerm.js** - Terminal emulator
- **Socket.IO Client** - WebSocket client
- **React Router** - Navigation

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/MrPiNkY2022/WebTermux-OMNI-v33.git
   cd WebTermux-OMNI-v33
