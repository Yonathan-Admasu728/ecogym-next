/* eslint-disable no-console */
type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogMessage {
  message: string;
  data?: unknown;
  timestamp: string;
  level: LogLevel;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private formatMessage(level: LogLevel, message: string, data?: unknown): LogMessage {
    return {
      message,
      data,
      timestamp: new Date().toISOString(),
      level,
    };
  }

  private log(level: LogLevel, message: string, data?: unknown) {
    const logMessage = this.formatMessage(level, message, data);

    // In development, log to console with appropriate styling
    if (this.isDevelopment) {
      const styles = {
        info: 'color: #00bcd4',
        warn: 'color: #ff9800',
        error: 'color: #f44336',
        debug: 'color: #9c27b0',
      };

      console[level](
        `%c[${logMessage.level.toUpperCase()}] ${logMessage.timestamp}`,
        styles[level],
        '\n',
        logMessage.message,
        logMessage.data ? '\n' : '',
        logMessage.data || ''
      );
    } else {
      // In production, we might want to send logs to a service
      // For now, only log errors to console in production
      if (level === 'error') {
        console.error(logMessage);
      }
    }

    // Here you could add logic to send logs to a service like Sentry, LogRocket, etc.
  }

  info(message: string, data?: unknown) {
    this.log('info', message, data);
  }

  warn(message: string, data?: unknown) {
    this.log('warn', message, data);
  }

  error(message: string, error?: Error | unknown) {
    this.log('error', message, error);
  }

  debug(message: string, data?: unknown) {
    if (this.isDevelopment) {
      this.log('debug', message, data);
    }
  }
}

export const logger = new Logger();
