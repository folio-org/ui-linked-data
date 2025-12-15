class LoggerService {
  error(message: string, error?: unknown): void {
    if (error) {
      console.error(message, error);
    } else {
      console.error(message);
    }
  }

  warn(message: string, context?: unknown): void {
    if (context) {
      console.warn(message, context);
    } else {
      console.warn(message);
    }
  }

  info(message: string, context?: unknown): void {
    if (context) {
      console.info(message, context);
    } else {
      console.info(message);
    }
  }

  debug(message: string, context?: unknown): void {
    if (process.env.NODE_ENV === 'development') {
      if (context) {
        console.debug(message, context);
      } else {
        console.debug(message);
      }
    }
  }
}

export const logger = new LoggerService();
