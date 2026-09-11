import { createLogger, format, transports } from 'winston';
import { MSSQLTransport } from './postgresLoggerTransport';
import dotenv from 'dotenv';
dotenv.config();

const {
  error_log_db_host,
  error_log_db_port,
  error_log_db_name,
  error_log_db_user,
  error_log_db_password,
} = process.env;

const { combine, timestamp, printf, colorize } = format;

// const logFormat = printf(({ level, message, timestamp }) => {
//   return `${timestamp} ${level}: ${message}`;
// });

const logFormat = printf(({ level, message, timestamp }) => {
  const formattedMessage =
    typeof message === 'object'
      ? JSON.stringify(message)
      : message;

  return `${timestamp} ${level}: ${formattedMessage}`;
});

const Logger = createLogger({
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    colorize(),
    logFormat,
  ),
  transports: [
    new transports.Console(),
    new MSSQLTransport({
      connectionConfig: {
        domain: undefined,
        user: error_log_db_user,
        password: error_log_db_password,
        server: error_log_db_host,
        port: Number(error_log_db_port),
        database: error_log_db_name,
        options: {
          encrypt: true, // for Azure, otherwise false
          trustServerCertificate: true, // change based on your SSL cert
        },
      },
      level: 'error', // Log only errors to the database
    }),
  ],
});

export default Logger;
