import { NextFunction, Request, Response } from 'express';

import { db } from '../config';
import { CustomError } from '../utils';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new CustomError('User not authenticated', 401));
    }

    const token = authHeader.split(' ')[1];
    const userId = token?.split('_')[1]; // faux decoding logic

    if (!userId) {
      return next(new CustomError('Invalid token format', 401));
    }

    const user = await db('users').where({ id: userId }).first();
    if (!user) {
      return next(new CustomError('User not found', 401));
    }

    (req as any).user = user;
    next();
  } catch (error) {
    return next(new CustomError('Authentication failed', 401));
  }
};
