import { Kysely, MysqlDialect } from 'kysely';
import { createPool } from 'mysql2';
import { DB } from './types';

const dialect = new MysqlDialect({
  pool: createPool({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: 3306,
    connectionLimit: 10,
  }),
});

export const db = new Kysely<DB>({ dialect });
