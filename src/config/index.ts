import dotenv from 'dotenv';

dotenv.config();

export const configs = () => ({
  APP_NAME: 'Demo Wallet App',
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV || 'development',
  API_KEY: process.env.ADJUTOR_API_KEY,
  ALLOW_BLACKLIST_CHECK: process.env.ALLOW_BLACKLIST_CHECK || false,
});

export { db } from './db';
