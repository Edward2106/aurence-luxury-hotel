import { Sequelize } from 'sequelize';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

// Support both standard DB_* and Railway MYSQL* environment variable names
const hostInput = process.env.DB_HOST || process.env.MYSQLHOST;
const portInput = process.env.DB_PORT || process.env.MYSQLPORT;
const dbUserInput = process.env.DB_USER || process.env.MYSQLUSER;
const dbPasswordInput = process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : process.env.MYSQLPASSWORD;
const dbNameInput = process.env.DB_NAME || process.env.MYSQLDATABASE;

if (isProduction) {
  const missingVars = [];
  if (!hostInput) missingVars.push('DB_HOST (or MYSQLHOST)');
  if (!dbUserInput) missingVars.push('DB_USER (or MYSQLUSER)');
  if (dbPasswordInput === undefined || dbPasswordInput === null) missingVars.push('DB_PASSWORD (or MYSQLPASSWORD)');
  if (!dbNameInput) missingVars.push('DB_NAME (or MYSQLDATABASE)');

  if (missingVars.length > 0) {
    console.error('❌ FATAL DATABASE ERROR: Production database configuration is incomplete.');
    console.error(`👉 Missing required variable(s): ${missingVars.join(', ')}`);
    console.error('👉 Localhost fallbacks are strictly prohibited in NODE_ENV=production.');
    process.exit(1);
  }

  if (hostInput === '127.0.0.1' || hostInput === 'localhost') {
    console.error(`❌ FATAL DATABASE ERROR: Production DB_HOST cannot be '${hostInput}'.`);
    console.error('👉 Localhost hosts are prohibited in production mode.');
    process.exit(1);
  }
}

export const host = hostInput || '127.0.0.1';
export const port = parseInt(portInput || '3306', 10);
export const dbUser = dbUserInput || 'root';
export const dbPassword = dbPasswordInput !== undefined && dbPasswordInput !== null ? dbPasswordInput : '12345678';
export const dbName = dbNameInput || 'luxury_hotel';

export const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host,
  port,
  dialect: 'mysql',
  logging: false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    timestamps: true,
    underscored: true,
  },
});

export const checkDatabaseConnection = async () => {
  try {
    try {
      const connection = await mysql.createConnection({
        host,
        port,
        user: dbUser,
        password: dbPassword,
      });
      await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
      await connection.end();
    } catch (createDbErr) {
      // In Railway or managed MySQL environments, CREATE DATABASE might be restricted or pre-created
    }

    await sequelize.authenticate();
    console.log(`✅ Connected successfully to MySQL database '${dbName}' on host '${host}:${port}'`);
    return true;
  } catch (error) {
    const errorCode = error.code || (error.original && error.original.code);
    if (errorCode === 'ECONNREFUSED') {
      console.error(`❌ Database Connection Error: connect ECONNREFUSED ${host}:${port}`);
      console.error(`👉 Reason: MySQL server is not reachable on ${host}:${port}.`);
    } else if (errorCode === 'ER_ACCESS_DENIED_ERROR') {
      console.error(`❌ Database Access Error: Access denied for user '${dbUser}'@'${host}'.`);
    } else {
      console.error(`❌ Database Connection Error: ${error.message}`);
    }
    return false;
  }
};
