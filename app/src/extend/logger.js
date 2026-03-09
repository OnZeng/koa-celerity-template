import winston from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const logDir = path.resolve(__dirname, '../../logs');

const transportOptions = {
  datePattern: 'YYYY-MM-DD',
  dirname: logDir,
  maxSize: '20m',
  maxFiles: '14d',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.json()
  )
};

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  levels: winston.config.npm.levels,
  transports: [
    new winston.transports.DailyRotateFile({
      ...transportOptions,
      filename: 'info-%DATE%.log',
      level: 'info'
    }),
    new winston.transports.DailyRotateFile({
      ...transportOptions,
      filename: 'error-%DATE%.log',
      level: 'error'
    })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ timestamp, level, message }) => {
          return `[${timestamp}] ${level}: ${message}`;
        })
      )
    })
  );
}

export default logger;
