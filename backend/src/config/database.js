import { Sequelize } from 'sequelize';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

const PLACEHOLDER_STRINGS = [
  'your_mysql_host',
  'your_mysql_user',
  'your_mysql_password',
  'your_database_name',
  'replace_with_secure_secret',
  'replace_with_a_secure_secret',
];

function isPlaceholderValue(val) {
  if (!val || typeof val !== 'string') return false;
  const normalized = val.trim().toLowerCase();
  return PLACEHOLDER_STRINGS.some((p) => normalized.includes(p));
}

// Support both standard DB_* and Railway MYSQL* environment variable names
const rawHost = process.env.DB_HOST || process.env.MYSQLHOST;
const rawPort = process.env.DB_PORT || process.env.MYSQLPORT;
const rawUser = process.env.DB_USER || process.env.MYSQLUSER;
const rawPassword = process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : process.env.MYSQLPASSWORD;
const rawDbName = process.env.DB_NAME || process.env.MYSQLDATABASE;

if (isProduction) {
  const missingVars = [];
  if (!rawHost || isPlaceholderValue(rawHost)) missingVars.push('DB_HOST (or MYSQLHOST)');
  if (!rawUser || isPlaceholderValue(rawUser)) missingVars.push('DB_USER (or MYSQLUSER)');
  if (rawPassword === undefined || rawPassword === null || isPlaceholderValue(rawPassword)) {
    missingVars.push('DB_PASSWORD (or MYSQLPASSWORD)');
  }
  if (!rawDbName || isPlaceholderValue(rawDbName)) missingVars.push('DB_NAME (or MYSQLDATABASE)');

  if (missingVars.length > 0) {
    console.error('❌ FATAL DATABASE ERROR: Production database configuration is incomplete or contains placeholder values.');
    console.error(`👉 Unconfigured / Placeholder variable(s): ${missingVars.join(', ')}`);
    console.error('👉 Placeholder values (e.g. your_mysql_host) and localhost fallbacks are strictly prohibited in NODE_ENV=production.');
    process.exit(1);
  }

  if (rawHost === '127.0.0.1' || rawHost === 'localhost') {
    console.error(`❌ FATAL DATABASE ERROR: Production DB_HOST cannot be '${rawHost}'.`);
    console.error('👉 Localhost database hosts are prohibited in production mode.');
    process.exit(1);
  }
}

// In local development, sanitize placeholders to local MySQL defaults
export const host = !rawHost || isPlaceholderValue(rawHost) ? '127.0.0.1' : rawHost;
export const port = parseInt(rawPort || '3306', 10);
export const dbUser = !rawUser || isPlaceholderValue(rawUser) ? 'root' : rawUser;
export const dbPassword =
  rawPassword === undefined || rawPassword === null || isPlaceholderValue(rawPassword) ? '12345678' : rawPassword;
export const dbName = !rawDbName || isPlaceholderValue(rawDbName) ? 'luxury_hotel' : rawDbName;

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
