import 'reflect-metadata';
import * as sql from 'mssql';
import { DataSource, ILike, Like, In, Not, Raw } from 'typeorm';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { Encrypt } from '../../helpers/encrypt';

dotenv.config();

let { db_host, db_port, db_name, db_user, db_password, node_env } = process.env;

let CompanyDb: DataSource | null = null;
let pool: sql.ConnectionPool | null = null;

const GetCompanyDb = async (secret: string = ''): Promise<DataSource> => {
  if (CompanyDb && CompanyDb.isInitialized) return CompanyDb; // Ensure singleton

  let decryptedSecret: any;
  if (secret != undefined && secret != '') {
    decryptedSecret = JSON.parse(Encrypt.decrypt(secret));
  }

  if (decryptedSecret) {
    db_host = decryptedSecret.hst;
    db_name = decryptedSecret.name;
    db_user = decryptedSecret.usrname;
    db_password = decryptedSecret.pwd;
    db_port = decryptedSecret.pt;
  }

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
        appName: "Recruitment-App",
      },
      keepAlive: true,
      max: 50,
      min: 10,
      idleTimeoutMillis: 120000,
      connectionTimeoutMillis: 120000,
    },
  });

  try {
    await CompanyDb.initialize();
    const driver: any = CompanyDb.driver;
    pool = driver.master;
    // console.log('Database connected successfully!');
    return CompanyDb;
  } catch (error) {
    CompanyDb = null;
    //  console.error('Error initializing database:', error);
    throw error;
  }
};

async function getMssqlPool(): Promise<sql.ConnectionPool> {
  if (pool && pool.connected) {
    return pool;
  }

  if (pool && pool.connecting) {
    return pool;
  }

  const config: sql.config = {
    user: db_user,
    password: db_password,
    server: db_host!,
    database: db_name,
    port: Number(db_port || 1433),

    pool: {
      max: 20,
      min: 2,
      idleTimeoutMillis: 120000,
    },

    options: {
      encrypt: false,
      trustServerCertificate: true,
    },
  };

  pool = await sql.connect(config);

  return pool;
}

// async function getResultSets(
//   dataSource: DataSource,
//   procedureName: string,
//   parameters: { [key: string]: any } = {},
// ): Promise<any> {
//   const queryRunner = dataSource.createQueryRunner();
//   await queryRunner.connect();

//   try {
//     const driver: any = queryRunner.connection.driver;
//     const rawPool = driver.master as sql.ConnectionPool;
//     const request = rawPool.request();

//     // Add parameters to the request
//     for (const [key, value] of Object.entries(parameters)) {
//       request.input(key, value);
//     }

//     const result = await request.execute(procedureName);
//     return result.recordsets;
//   } finally {
//     await queryRunner.release();
//   }
// }

async function getResultSets(
  dataSource: DataSource,
  procedureName: string,
  parameters: { [key: string]: any } = {},
): Promise<any> {

  if (!dataSource.isInitialized) {
    console.log('Database connection issue dbSource is not initialized ');
    //throw new Error('DataSource is not initialized');
  }

  // Get TypeORM's existing MSSQL connection pool
  const driver: any = dataSource.driver;
  const rawPool = driver.master as sql.ConnectionPool;

  // Use the existing pool
  const request = rawPool.request();

  // Add parameters
  for (const [key, value] of Object.entries(parameters)) {
    request.input(key, value);
  }

  // Execute stored procedure
  const result = await request.execute(procedureName);

  return result.recordsets;
}

export { GetCompanyDb, ILike, Like, In, Not, Raw, getResultSets };
