/**
 * WebTermux OMNI v.33 - Service Contracts (TypeScript Interfaces)
 * Defines all data structures and interfaces used throughout the application
 */

// ============================================================================
// Authentication & User Management
// ============================================================================

export interface User {
  id: number;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPublic {
  id: number;
  username: string;
  email: string;
  createdAt: Date;
}

export interface AuthCredentials {
  username: string;
  password: string;
}

export interface RegisterRequest extends AuthCredentials {
  email: string;
}

export interface AuthToken {
  token: string;
  username: string;
  expiresIn: string;
}

export interface JWTPayload {
  id: number;
  username: string;
  iat: number;
  exp: number;
}

// ============================================================================
// Terminal Sessions
// ============================================================================

export type ShellType = 'bash' | 'sh' | 'zsh' | 'fish';

export interface TerminalSession {
  id: string; // UUID
  userId: number;
  name: string;
  shellType: ShellType;
  rows: number;
  cols: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastActivityAt?: Date;
}

export interface CreateSessionRequest {
  name: string;
  shellType?: ShellType;
  rows?: number;
  cols?: number;
}

export interface ResizeTerminalRequest {
  rows: number;
  cols: number;
}

// ============================================================================
// Command History
// ============================================================================

export interface CommandHistory {
  id: number;
  sessionId: string;
  userId: number;
  command: string;
  output?: string;
  exitCode?: number;
  executedAt: Date;
  duration?: number; // milliseconds
}

export interface CommandHistoryQuery {
  sessionId: string;
  limit?: number;
  offset?: number;
  sortBy?: 'recent' | 'oldest' | 'exitCode';
}

// ============================================================================
// WebSocket Events & Messages
// ============================================================================

export interface SocketMessage<T = any> {
  type: string;
  payload: T;
  timestamp: number;
}

export interface TerminalDataMessage {
  sessionId: string;
  data: string;
}

export interface CommandExecutionMessage {
  sessionId: string;
  command: string;
}

export interface SessionStatusMessage {
  sessionId: string;
  status: 'active' | 'inactive' | 'closed';
  timestamp: number;
}

export interface ErrorMessage {
  code: string;
  message: string;
  details?: Record<string, any>;
}

// ============================================================================
// Request/Response Envelopes
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  timestamp: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
  timestamp: number;
}

export interface ErrorResponse {
  success: false;
  error: string;
  code: string;
  details?: Record<string, any>;
  timestamp: number;
}

// ============================================================================
// Server Configuration
// ============================================================================

export interface ServerConfig {
  port: number;
  host: string;
  environment: 'development' | 'production' | 'testing';
  jwtSecret: string;
  sessionSecret: string;
  clientUrl: string;
  databasePath: string;
  logLevel: 'error' | 'warn' | 'info' | 'debug';
  maxSessions: number;
  sessionTimeout: number; // minutes
  maxHistorySize: number; // records per session
}

// ============================================================================
// Logging & Monitoring
// ============================================================================

export interface LogEntry {
  timestamp: Date;
  level: 'error' | 'warn' | 'info' | 'debug';
  message: string;
  context?: Record<string, any>;
  error?: Error;
}

export interface SessionMetrics {
  sessionId: string;
  userId: number;
  connectTime: Date;
  lastActivityTime: Date;
  commandCount: number;
  dataTransferred: number; // bytes
}

// ============================================================================
// Database Queries & Filters
// ============================================================================

export interface UserFilter {
  id?: number;
  username?: string;
  email?: string;
  createdAfter?: Date;
  createdBefore?: Date;
}

export interface SessionFilter {
  userId?: number;
  isActive?: boolean;
  createdAfter?: Date;
  createdBefore?: Date;
}

// ============================================================================
// Middleware & Authentication
// ============================================================================

export interface AuthenticatedRequest {
  user?: JWTPayload;
  session?: {
    userId: number;
    username: string;
  };
}

export interface PermissionRequest {
  userId: number;
  resource: string;
  action: 'read' | 'write' | 'delete' | 'execute';
}

// ============================================================================
// Validation Schemas
// ============================================================================

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}
