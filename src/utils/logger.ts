import { createLogger, format, transports } from 'winston';
import { MSSQLTransport } from './postgresLoggerTransport';
import dotenv from 'dotenv';
dotenv.config();

const { db_host, db_port, db_name, db_user, db_password } = process.env;

const { combine, timestamp, printf, colorize } = format;

const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
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
        user: db_user,
        password: db_password,
        server: db_host,
        port: Number(db_port),
        database: db_name,
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
