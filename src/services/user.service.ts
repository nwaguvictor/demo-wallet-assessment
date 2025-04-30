import { db } from '../config';
import { CustomError } from '../utils';

export class UserService {
  async profile(userId: string) {
    const user = await db('users')
      .where({ id: userId })
      .select('id', 'name', 'email', 'created_at')
      .first();

    if (!user) {
      throw new CustomError('User not found', 404);
    }

    const wallet = await db('wallets')
      .where({ user_id: userId })
      .select('id', 'balance', 'created_at')
      .first();

    return {
      ...user,
      wallet: wallet || { balance: 0 },
    };
  }
}
