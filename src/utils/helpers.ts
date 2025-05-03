import crypto from 'crypto';

import bcrypt from 'bcrypt';
import axios from 'axios';

import { configs } from '../config';

export class CustomError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const generateHash = async (token: string): Promise<string> => {
  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(token, salt);
  return hash;
};

export const compareHash = async (
  value: string,
  hash: string,
): Promise<boolean> => {
  return await bcrypt.compare(value, hash);
};

export const generateFauxToken = (userId: string): string => {
  return `faux_${userId}_${crypto.randomUUID()}`;
};

export const isBlacklistedUser = async (identity: string): Promise<boolean> => {
  try {
    const baseUrl = 'https://adjutor.lendsqr.com/v2';
    const response = await axios.get(
      `${baseUrl}/verification/karma/${identity}`,
      { headers: { Authorization: `Bearer ${configs().API_KEY}` } },
    );

    const { status, data } = response.data;
    return data && status === 'success';
  } catch (error: any) {
    throw new CustomError('Unable to verify blacklist status', 400);
  }
};
