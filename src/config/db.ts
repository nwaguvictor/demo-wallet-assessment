import { Knex, knex } from 'knex';

const config: Knex.Config = {
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  },
  // pool: { min: 0, max: 10 },
};

let knexInstance: Knex | null = null;

const getConnection = (): Knex => {
  if (!knexInstance) {
    try {
      knexInstance = knex(config);
    } catch (error: any) {
      console.error('Error connecting to database:', error.message);
      throw error;
    }
  }
  return knexInstance;
};

export const db = getConnection();
