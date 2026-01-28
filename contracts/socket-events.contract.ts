/**
 * WebTermux OMNI v.33 - Socket.IO Events Contract
 * Defines all WebSocket event structures and communication protocols
 */

import type {
  TerminalDataMessage,
  CommandExecutionMessage,
  SessionStatusMessage,
  ErrorMessage,
} from './types.contract';

// ============================================================================
// Event Names
// ============================================================================

export const SocketEvents = {
  // Connection events
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  RECONNECT: 'reconnect',
  RECONNECT_ATTEMPT: 'reconnect_attempt',

  // Authentication events
  AUTHENTICATE: 'authenticate',
  AUTHENTICATED: 'authenticated',
  AUTHENTICATION_FAILED: 'authentication_failed',

  // Session management events
  CREATE_SESSION: 'session:create',
  SESSION_CREATED: 'session:created',
  CLOSE_SESSION: 'session:close',
  SESSION_CLOSED: 'session:closed',
  LIST_SESSIONS: 'session:list',
  SESSIONS_LIST: 'session:list:response',
  RESIZE_TERMINAL: 'terminal:resize',
  TERMINAL_RESIZED: 'terminal:resized',

  // Terminal I/O events
  TERMINAL_INPUT: 'terminal:input',
  TERMINAL_OUTPUT: 'terminal:output',
  TERMINAL_DATA: 'terminal:data',

  // Command execution events
  EXECUTE_COMMAND: 'command:execute',
  COMMAND_EXECUTED: 'command:executed',
  COMMAND_OUTPUT: 'command:output',
  COMMAND_ERROR: 'command:error',

  // Status & monitoring events
  PING: 'ping',
  PONG: 'pong',
  STATUS_UPDATE: 'status:update',
  SESSION_STATUS: 'session:status',
  CONNECTION_STATUS: 'connection:status',

  // Error handling
  ERROR: 'error',
  FATAL_ERROR: 'fatal:error',
};

// ============================================================================
// Server → Client Events (Incoming)
// ============================================================================

export interface ServerEvents {
  // Authentication
  authenticated: (data: {
    token: string;
    username: string;
    expiresIn: string;
  }) => void;

  authentication_failed: (error: ErrorMessage) => void;

  // Session Management
  'session:created': (session: {
    id: string;
    name: string;
    shellType: string;
    rows: number;
    cols: number;
  }) => void;

  'session:closed': (data: { sessionId: string }) => void;

  'session:list:response': (sessions: Array<{
    id: string;
    name: string;
    isActive: boolean;
    createdAt: string;
  }>) => void;

  'terminal:resized': (data: {
    sessionId: string;
    rows: number;
    cols: number;
  }) => void;

  // Terminal Output
  'terminal:output': (data: TerminalDataMessage) => void;

  'terminal:data': (data: {
    sessionId: string;
    data: string;
    timestamp: number;
  }) => void;

  // Command Execution
  'command:executed': (data: {
    sessionId: string;
    command: string;
    exitCode: number;
    timestamp: number;
  }) => void;

  'command:output': (data: {
    sessionId: string;
    output: string;
    timestamp: number;
  }) => void;

  'command:error': (error: ErrorMessage) => void;

  // Status Events
  pong: (data?: any) => void;

  'status:update': (data: {
    activeSessionCount: number;
    serverLoad: number;
    uptime: number;
  }) => void;

  'session:status': (data: SessionStatusMessage) => void;

  'connection:status': (data: {
    status: 'connected' | 'disconnected' | 'reconnecting';
    timestamp: number;
  }) => void;

  // Error Handling
  error: (error: ErrorMessage) => void;

  'fatal:error': (error: ErrorMessage) => void;
}

// ============================================================================
// Client → Server Events (Outgoing)
// ============================================================================

export interface ClientEvents {
  // Authentication
  authenticate: (credentials: {
    token?: string;
    username?: string;
    password?: string;
  }) => void;

  // Session Management
  'session:create': (options: {
    name: string;
    shellType?: string;
    rows?: number;
    cols?: number;
  }) => void;

  'session:close': (data: { sessionId: string }) => void;

  'session:list': (data?: {}) => void;

  'terminal:resize': (data: {
    sessionId: string;
    rows: number;
    cols: number;
  }) => void;

  // Terminal Input
  'terminal:input': (data: TerminalDataMessage) => void;

  // Command Execution
  'command:execute': (data: CommandExecutionMessage) => void;

  // Monitoring
  ping: (data?: any) => void;

  'status:request': (data?: {}) => void;
}

// ============================================================================
// Event Payloads (Detailed Structures)
// ============================================================================

export namespace EventPayloads {
  // Authentication
  export interface Authenticate {
    token?: string;
    username?: string;
    password?: string;
    sessionId?: string;
  }

  export interface Authenticated {
    token: string;
    username: string;
    userId: number;
    expiresIn: string;
  }

  export interface AuthenticationFailed {
    code: string;
    message: string;
    reason: 'invalid_token' | 'invalid_credentials' | 'session_expired';
  }

  // Session Management
  export interface SessionCreate {
    name: string;
    shellType: 'bash' | 'sh' | 'zsh' | 'fish';
    rows: number;
    cols: number;
  }

  export interface SessionCreated {
    id: string;
    name: string;
    shellType: string;
    rows: number;
    cols: number;
    createdAt: string;
  }

  export interface SessionList {
    sessions: Array<{
      id: string;
      name: string;
      isActive: boolean;
      rows: number;
      cols: number;
      createdAt: string;
      lastActivityAt?: string;
    }>;
  }

  export interface TerminalResize {
    sessionId: string;
    rows: number;
    cols: number;
  }

  // Terminal I/O
  export interface TerminalInput {
    sessionId: string;
    data: string;
    timestamp: number;
  }

  export interface TerminalOutput {
    sessionId: string;
    data: string;
    timestamp: number;
  }

  // Command Execution
  export interface CommandExecute {
    sessionId: string;
    command: string;
    timestamp: number;
  }

  export interface CommandExecuted {
    sessionId: string;
    command: string;
    exitCode: number;
    duration: number;
    timestamp: number;
  }

  // Status
  export interface StatusUpdate {
    activeSessionCount: number;
    serverLoad: number;
    memoryUsage: {
      used: number;
      total: number;
      percentage: number;
    };
    uptime: number;
    timestamp: number;
  }

  export interface SessionStatus {
    sessionId: string;
    status: 'active' | 'inactive' | 'closed';
    bytesTransferred: number;
    commandCount: number;
    lastActivityTime: string;
  }

  // Errors
  export interface SocketError {
    code: string;
    message: string;
    details?: Record<string, any>;
    timestamp: number;
  }
}

// ============================================================================
// Socket Middleware & Hooks
// ============================================================================

export interface SocketMiddleware {
  preConnect?: (socket: any, next: (err?: Error) => void) => void;
  postConnect?: (socket: any) => void;
  preDisconnect?: (socket: any) => void;
  preEvent?: (
    event: string,
    data: any,
    socket: any,
    next: (err?: Error) => void
  ) => void;
  postEvent?: (event: string, data: any, socket: any, response?: any) => void;
}

// ============================================================================
// Connection Options
// ============================================================================

export interface SocketConnectionOptions {
  reconnection: boolean;
  reconnectionDelay: number;
  reconnectionDelayMax: number;
  reconnectionAttempts: number;
  transports: ('websocket' | 'polling')[];
  autoConnect: boolean;
}

export const DefaultSocketOptions: SocketConnectionOptions = {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
  transports: ['websocket', 'polling'],
  autoConnect: true,
};
