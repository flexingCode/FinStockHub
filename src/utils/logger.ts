/**
 * Logger utility that only logs in development mode
 * Prevents sensitive data and excessive logging in production
 */

type LogLevel = 'log' | 'warn' | 'error' | 'info' | 'debug';

class Logger {
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = __DEV__;
  }

  private shouldLog(level: LogLevel): boolean {
    // In production, only log errors
    if (!this.isDevelopment) {
      return level === 'error';
    }
    return true;
  }

  private sanitizeData(data: unknown): unknown {
    // Remove potentially sensitive data from logs
    if (typeof data === 'string') {
      // Don't log tokens or API keys
      if (data.includes('token=') || data.includes('Bearer ') || data.length > 100) {
        return '[REDACTED]';
      }
      return data;
    }
    
    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeData(item));
    }
    
    if (data && typeof data === 'object') {
      const sanitized: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(data)) {
        if (key.toLowerCase().includes('token') || key.toLowerCase().includes('password') || key.toLowerCase().includes('secret')) {
          sanitized[key] = '[REDACTED]';
        } else {
          sanitized[key] = this.sanitizeData(value);
        }
      }
      return sanitized;
    }
    
    return data;
  }

  log(message: string, ...args: unknown[]): void {
    if (this.shouldLog('log')) {
      console.log(`[LOG] ${message}`, ...args.map(arg => this.sanitizeData(arg)));
    }
  }

  info(message: string, ...args: unknown[]): void {
    if (this.shouldLog('info')) {
      console.info(`[INFO] ${message}`, ...args.map(arg => this.sanitizeData(arg)));
    }
  }

  warn(message: string, ...args: unknown[]): void {
    if (this.shouldLog('warn')) {
      console.warn(`[WARN] ${message}`, ...args.map(arg => this.sanitizeData(arg)));
    }
  }

  error(message: string, error?: Error | unknown, ...args: unknown[]): void {
    if (this.shouldLog('error')) {
      const errorDetails = error instanceof Error 
        ? { message: error.message, stack: error.stack }
        : error;
      console.error(`[ERROR] ${message}`, errorDetails, ...args.map(arg => this.sanitizeData(arg)));
    }
  }

  debug(message: string, ...args: unknown[]): void {
    if (this.shouldLog('debug')) {
      console.log(`[DEBUG] ${message}`, ...args.map(arg => this.sanitizeData(arg)));
    }
  }
}

const logger = new Logger();

export default logger;
