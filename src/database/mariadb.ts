import { createPool } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = createPool({
  host: process.env.mariadb_host,
  user: process.env.mariadb_user,
  password: process.env.mariadb_password,
  database: process.env.mariadb_database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;