import dotenv from 'dotenv';
dotenv.config();

export const configs = () => ({
  APP_NAME: 'Demo Wallet App',
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV || 'development',
});
