import { db } from '../config';
import { CustomError } from '../utils';
import {
  FundOrWithdrawUserWalletDto,
  TransactionStatus,
  TransactionType,
  TransferFundDto,
} from '../interfaces';

export class WalletService {
  async fund(payload: FundOrWithdrawUserWalletDto) {
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

      await trx('transactions').insert({
        id: crypto.randomUUID(),
        amount: payload.amount,
        type: TransactionType.FUND,
        reference: crypto.randomUUID(),
        status: TransactionStatus.SUCCESS,
        receiver_wallet: payload.userId,
      });

      const updated = await trx('wallets')
        .where({ id: wallet.id })
        .first()
        .select('id', 'user_id', 'balance');

      return updated;
    });
  }

  async transfer(payload: TransferFundDto) {
    return db.transaction(async (trx) => {
      const senderWallet = await trx('wallets')
        .where({ user_id: payload.userId })
        .first();
      const receiverWallet = await trx('wallets')
        .where({ user_id: payload.receiverId })
        .first();

      if (!senderWallet || !receiverWallet) {
        throw new CustomError('Sender or receiver wallet not found', 404);
      }

      if (senderWallet.balance < payload.amount) {
        throw new CustomError('Insufficient balance in sender wallet', 400);
      }

      await trx('wallets')
        .where({ id: senderWallet.id })
        .decrement('balance', payload.amount);

      await trx('wallets')
        .where({ id: receiverWallet.id })
        .increment('balance', payload.amount);

      await trx('transactions').insert({
        id: crypto.randomUUID(),
        amount: payload.amount,
        type: TransactionType.TRANSFER,
        status: TransactionStatus.SUCCESS,
        reference: crypto.randomUUID(),
        sender_wallet: senderWallet.id,
        receiver_wallet: receiverWallet.id,
      });

      const updated = trx('wallets')
        .where({ id: senderWallet.id })
        .first()
        .select('id', 'user_id', 'balance');

      return updated;
    });
  }

  async withdraw(payload: FundOrWithdrawUserWalletDto) {
    return db.transaction(async (trx) => {
      const wallet = await trx('wallets')
        .where({ user_id: payload.userId })
        .first();

      if (!wallet) {
        throw new CustomError('Wallet not found', 404);
      }

      if (wallet.balance < payload.amount) {
        throw new CustomError('Insufficient balance', 400);
      }

      await trx('wallets')
        .where({ id: wallet.id })
        .decrement('balance', payload.amount);

      await trx('transactions').insert({
        id: crypto.randomUUID(),
        amount: payload.amount,
        type: TransactionType.WITHDRAW,
        reference: crypto.randomUUID(),
        status: TransactionStatus.SUCCESS,
        sender_wallet: wallet.id,
      });

      const updated = await trx('wallets')
        .where({ id: wallet.id })
        .first()
        .select('id', 'user_id', 'balance');

      return updated;
    });
  }
}
