import crypto from 'crypto';

import { db } from '../config';
import {
  compareHash,
  CustomError,
  generateFauxToken,
  generateHash,
  isBlacklistedUser,
} from '../utils';
import { CreateUserDto, LoginUserDto } from '../interfaces';

export class AuthService {
  async register(payload: CreateUserDto) {
    const isBlacklisted = await isBlacklistedUser(payload.email);
    if (isBlacklisted) {
      throw new CustomError('User is blacklisted and cannot be onboarded', 403);
    }

    const existing = await db('users').where({ email: payload.email }).first();
    if (existing) {
      throw new CustomError('User with this email already exists', 400);
    }

    try {
      const hashedPassword = await generateHash(payload.password);
      const userId = crypto.randomUUID();

      await db.transaction(async (trx) => {
        await trx('users').insert({
          ...payload,
          id: userId,
          password: hashedPassword,
        });
        await trx('wallets').insert({
          user_id: userId,
          id: crypto.randomUUID(),
        });
      });

      return { ...payload, id: userId, password: undefined };
    } catch (err: any) {
      if (err.code === 'ER_DUP_ENTRY') {
        throw new CustomError('Email already exists', 400);
      }
      throw new CustomError('Unable to register user', 400);
    }
  }

  async login(payload: LoginUserDto) {
    const user = await db('users').where({ email: payload.email }).first();

    if (!user) {
      throw new CustomError('Invalid email or password', 401);
    }

    const isValid = await compareHash(payload.password, user.password);
    if (!isValid) {
      throw new CustomError('Invalid email or password', 401);
    }

    const token = generateFauxToken(user.id);
    return { token };
  }
}
