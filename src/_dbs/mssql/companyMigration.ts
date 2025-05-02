import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

const { db_host, db_port, db_name, db_user, db_password, node_env } =
  process.env;

const config = {
  type: 'mssql',
  host: db_host,
  port: parseInt(db_port || '1443'),
  database: db_name,
  username: db_user,
  password: db_password,
  entities: [path.join(__dirname, '../../entities/company') + '/*.{ts,js}'],
  migrations: [
    path.join(__dirname + '../../../migrations/company') + '/*.{ts,js}',
  ],
  logging: false, // new DatabaseLogger()
  synchronize: true, // don't use TRUE in production!
  migrationsRun: true,
} as DataSourceOptions;
const datasource = new DataSource(config);
datasource.initialize();
export default datasource;
