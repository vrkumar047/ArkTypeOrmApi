import 'reflect-metadata';
import * as sql from 'mssql';
import { DataSource, ILike, Like, In, Not, Raw } from 'typeorm';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { Encrypt } from '../../helpers/encrypt';

dotenv.config();

let { db_host, db_port, db_name, db_user, db_password, node_env } = process.env;

let CompanyDb: DataSource | null = null;

const GetCompanyDb = async (): Promise<DataSource> => {
  if (CompanyDb && CompanyDb.isInitialized) return CompanyDb; // Ensure singleton

  CompanyDb = new DataSource({
    type: 'mssql',
    host: db_host,
    port: parseInt(db_port || '1443'),
    username: db_user,
    password: db_password,
    database: db_name,
    synchronize: false,
    logging: false,
    entities: [path.join(__dirname, '../../entities/company') + `/*.{ts,js}`],
    extra: {
      trustServerCertificate: true, // skip certificate validation
      options: {
        encrypt: false, // true if you're using Azure or SSL
        enableArithAbort: true,
      },
      keepAlive: true,
      max: 50,
      min: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    },
  });

  try {
    await CompanyDb.initialize();
    // console.log('Database connected successfully!');
    return CompanyDb;
  } catch (error) {
    CompanyDb = null;
    //  console.error('Error initializing database:', error);
    throw error;
  }
};

async function getResultSets(
  dataSource: DataSource,
  procedureName: string,
  parameters: { [key: string]: any } = {},
): Promise<any> {
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();

  try {
    const driver: any = queryRunner.connection.driver;
    const rawPool = driver.master as sql.ConnectionPool;
    const request = rawPool.request();

    // Add parameters to the request
    for (const [key, value] of Object.entries(parameters)) {
      request.input(key, value);
    }

    const result = await request.execute(procedureName);
    return result.recordsets;
  } finally {
    await queryRunner.release();
  }
}

export { GetCompanyDb, ILike, Like, In, Not, Raw, getResultSets };
