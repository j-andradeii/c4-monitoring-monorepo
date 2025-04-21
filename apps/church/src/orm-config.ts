import { registerAs } from "@nestjs/config";
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from "typeorm";

dotenvConfig({ path: '.env' });
const entitiesPath = process.env.NODE_ENV === 'production'
  ? __dirname + '/entities/*.entity.js' // Use JS files in production
  : __dirname + '/entities/*.entity.ts';  // Use TS files in development

const migrationsPath = process.env.NODE_ENV === 'production'
  ? __dirname + '/db/migrations/*.js' // Use JS files in production
  : __dirname + '/db/migrations/*.ts';  // Use TS files in development

console.log('__dirname: ', __dirname);
console.log('__dirname: ', __dirname + '../../dist');

const churchDir = __dirname + '../../'

console.log(churchDir);


// Log the paths for debugging
console.log('Entities Path:', entitiesPath);
console.log('Migrations Path:', migrationsPath);

console.log("HOST-->", process.env.POSTGRES_HOST);
console.log("PORT-->", process.env.POSTGRES_PORT);
console.log("USERNAME-->", process.env.POSTGRES_USER);
console.log("PASSWORD-->", process.env.POSTGRES_PASSWORD);
console.log("DATABASE-->", process.env.POSTGRES_DB);
console.log("DATABASEurl-->", process.env.DATABASE_URL);

const config = {
  type: 'postgres',
  url: process.env.DATABASE_URL, // Add this line to use the full 
  // host: process.env.POSTGRES_HOST,
  // port: parseInt(process.env.POSTGRES_PORT), // Ensure port is a number
  // username: process.env.POSTGRES_USER,
  // password: process.env.POSTGRES_PASSWORD,
  // database: process.env.POSTGRES_DB,

  // Use the resolved paths
  entities: [entitiesPath],
  migrations: [migrationsPath],
  
  autoLoadEntities: true,
  synchronize: false,
  extra: {
    poolSize: parseInt(process.env.DB_POOL_SIZE || '10'), // Max connections per app instance
    connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT || '15000'), // How long to wait for a connection from the pool (Increased default to 15s)
    idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000'), // How long a connection can be idle before being closed
    query_timeout: parseInt(process.env.DB_QUERY_TIMEOUT || '10000'), // Max time (ms) per query (client-side)
  },
}
console.log("CHURCH-DB CONFIG", config)

export default registerAs('typeorm', () => config)
export const connectionSource = new DataSource(config as DataSourceOptions);