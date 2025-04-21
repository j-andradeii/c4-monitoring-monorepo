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

// Log the paths for debugging
console.log('Entities Path:', entitiesPath);
console.log('Migrations Path:', migrationsPath);


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
}

console.log("MEMBERS-DB CONFIG", config)
export default registerAs('typeorm', () => config)
export const connectionSource = new DataSource(config as DataSourceOptions);