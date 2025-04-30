import { db } from '../config';
import { CustomError } from '../utils';
import { FundUserWalletDto } from '../interfaces';

export class WalletService {
  async fund(payload: FundUserWalletDto) {
    return db.transaction(async (trx) => {
      const wallet = await trx('wallets')
        .where({ user_id: payload.userId })
        .first();

      if (!wallet) {
        throw new CustomError('Wallet not found', 404);
      }

      await trx('wallets')
        .where({ user_id: payload.userId })
        .increment('balance', payload.amount);

      const updated = await trx('wallets')
        .where({ id: wallet.id })
        .first()
        .select('id', 'user_id', 'balance');

      return updated;
    });
  }

  async tranfer() {}
  async withdraw() {}
}
