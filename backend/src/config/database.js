import { Sequelize } from 'sequelize';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const host = process.env.DB_HOST || '127.0.0.1';
const port = parseInt(process.env.DB_PORT || '3306', 10);
const dbName = process.env.DB_NAME || 'luxury_hotel';
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : '';

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
    const connection = await mysql.createConnection({
      host,
      port,
      user: dbUser,
      password: dbPassword,
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await connection.end();

    await sequelize.authenticate();
    console.log(`✅ Connected successfully to MySQL database: ${dbName}`);
    return true;
  } catch (error) {
    const errorCode = error.code || (error.original && error.original.code);
    if (errorCode === 'ECONNREFUSED') {
      console.error(`❌ Database Connection Error: connect ECONNREFUSED ${host}:${port}`);
      console.error(`👉 Reason: MySQL server is not running on ${host}:${port}. Please start your MySQL service (e.g. net start MySQL80 or XAMPP).`);
    } else if (errorCode === 'ER_ACCESS_DENIED_ERROR') {
      console.error(`❌ Database Access Error: Access denied for user '${dbUser}'@'${host}' (check password).`);
    } else {
      console.error(`❌ Database Connection Error: ${error.message}`);
    }
    return false;
  }
};

