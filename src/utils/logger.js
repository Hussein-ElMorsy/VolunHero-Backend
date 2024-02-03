import winston from 'winston';

// Define the log levels and corresponding colors
const logLevels = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  debug: 'white',
};

// Initialize the Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.printf(({ level, message, timestamp }) => {
      return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({ filename: 'app.log' }),
  ],
});

// Extend logger with custom log levels and colors
winston.addColors(logLevels);

export default logger;