type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  event: string;
  requestId?: string;
  [key: string]: unknown;
}

/**
 * A lightweight structured logger that emits JSON objects.
 */
class Logger {
  private format(level: LogLevel, context: LogContext, message?: string) {
    return JSON.stringify({
      level,
      timestamp: new Date().toISOString(),
      ...context,
      message,
    });
  }

  debug(context: LogContext, message?: string) {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(this.format('debug', context, message));
    }
  }

  info(context: LogContext, message?: string) {
    console.info(this.format('info', context, message));
  }

  warn(context: LogContext, message?: string) {
    console.warn(this.format('warn', context, message));
  }

  error(context: LogContext, message?: string) {
    console.error(this.format('error', context, message));
  }

  /**
   * Create a child logger with default context fields (e.g. requestId).
   */
  child(defaultContext: Partial<LogContext>) {
    return {
      debug: (context: Omit<LogContext, 'event'> & { event?: string }, message?: string) =>
        this.debug({ ...defaultContext, ...context } as LogContext, message),
      info: (context: Omit<LogContext, 'event'> & { event?: string }, message?: string) =>
        this.info({ ...defaultContext, ...context } as LogContext, message),
      warn: (context: Omit<LogContext, 'event'> & { event?: string }, message?: string) =>
        this.warn({ ...defaultContext, ...context } as LogContext, message),
      error: (context: Omit<LogContext, 'event'> & { event?: string }, message?: string) =>
        this.error({ ...defaultContext, ...context } as LogContext, message),
      child: (childContext: Partial<LogContext>) =>
        this.child({ ...defaultContext, ...childContext }),
    };
  }
}

export const logger = new Logger();
