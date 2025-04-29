import dotenv from 'dotenv';
import { db } from './db';
dotenv.config();

export const configs = () => ({
  APP_NAME: 'Demo Wallet App',
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV || 'development',
});

export { db } from './db';
