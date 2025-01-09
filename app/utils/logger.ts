type LogLevel = 'debug' | 'info' | 'warn' | 'error';

type Loggable = Record<string, unknown> | Error | string | number | boolean | null | undefined | unknown;

interface LogMessage {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: Loggable;
}

function isLoggable(data: unknown): data is Loggable {
  const type = typeof data;
  return (
    data === null ||
    data === undefined ||
    type === 'string' ||
    type === 'number' ||
    type === 'boolean' ||
    data instanceof Error ||
    (type === 'object' && !Array.isArray(data))
  );
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private formatMessage(level: LogLevel, message: string, data?: unknown): LogMessage {
    let formattedData: Loggable | undefined;
    
    if (data !== undefined && data !== null) {
      if (isLoggable(data)) {
        formattedData = data;
      } else if (typeof data === 'object') {
        formattedData = JSON.parse(JSON.stringify(data));
      } else {
        formattedData = String(data);
      }
    }

    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data: formattedData,
    };
  }

  private log(level: LogLevel, message: string, data?: unknown): void {
    const formattedMessage = this.formatMessage(level, message, data);

    if (this.isDevelopment) {
      const consoleMethod = level === 'error' ? 'error' : 
                          level === 'warn' ? 'warn' : 
                          level === 'info' ? 'info' : 'debug';

      // eslint-disable-next-line no-console
      console[consoleMethod](
        `[${level.toUpperCase()}] ${formattedMessage.timestamp}\n`,
        message,
        data ? '\n' : '',
        data || ''
      );
    }

    // In production, you might want to send logs to a service
    if (!this.isDevelopment && (level === 'error' || level === 'warn')) {
      // TODO: Implement production logging service
      // e.g., send to Sentry, LogRocket, etc.
    }
  }

  debug(message: string, data?: unknown) {
    // Always show debug logs
    this.log('debug', message, data);
  }

  info(message: string, data?: unknown) {
    this.log('info', message, data);
  }

  warn(message: string, data?: unknown) {
    this.log('warn', message, data);
  }

  error(message: string, error?: unknown) {
    this.log('error', message, error);
  }
}

export const logger = new Logger();
