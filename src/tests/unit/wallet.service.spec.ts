import mockKnex from 'mock-knex';

import { db } from '../../config';
import { WalletService } from '../../services';
import { CustomError } from '../../utils';

mockKnex.mock(db);

describe('WalletService', () => {
  const tracker = mockKnex.getTracker();
  const walletService = new WalletService();
  const userId = 'user_123';

  beforeAll(() => tracker.install());
  afterAll(() => tracker.uninstall());

  describe('fund', () => {
    it('should throw if wallet not found', async () => {
      tracker.on('query', (query) => query.response([]));

      await expect(
        walletService.fund({ userId, amount: 1000 }),
      ).rejects.toThrow(new CustomError('Wallet not found', 404));
    });

    it('should fund user wallet', async () => {
      tracker.on('query', (query) => {
        if (query.sql.includes('from `wallets`')) {
          query.response([{ id: '123', user_id: userId, balance: 2000 }]);
        } else if (query.sql.includes('insert into `transactions`')) {
          query.response([1]);
        } else if (query.sql.includes('update `wallets`')) {
          query.response([1]);
        } else {
          query.response([]);
        }
      });

      const result = await walletService.fund({ userId, amount: 1000 });

      expect(result).toEqual({
        id: '123',
        user_id: userId,
        balance: 2000,
      });
    });
  });

  describe('withdraw', () => {
    it('should withdraw from wallet', async () => {
      tracker.on('query', (query) => {
        query.response([{ id: '123', user_id: userId, balance: 500 }]);
      });

      const result = await walletService.withdraw({
        userId: userId,
        amount: 500,
      });

      expect(result).toEqual({
        id: '123',
        user_id: userId,
        balance: 500,
      });
    });

    it('should throw if insufficient balance', async () => {
      tracker.on('query', (query) => {
        query.response([{ id: '123', user_id: userId, balance: 100 }]);
      });

      await expect(
        walletService.withdraw({ userId, amount: 200 }),
      ).rejects.toThrow(new CustomError('Insufficient balance', 400));
    });
  });

  describe('transfer', () => {
    it('should transfer funds from sender to receiver', async () => {
      tracker.on('query', (query) => {
        query.response([{ id: '123', user_id: userId, balance: 1000 }]);
        query.response([{ id: '456', user_id: 'abc', balance: 500 }]);
        query.response([{ id: '123', user_id: userId, balance: 500 }]);
      });

      const result = await walletService.transfer({
        userId: userId,
        receiverId: 'abc',
        amount: 500,
      });

      expect(result).toEqual({
        id: '123',
        user_id: userId,
        balance: 500,
      });
    });

    it('should throw if sender or receiver wallet not found', async () => {
      tracker.on('query', (query) => query.response([]));

      await expect(
        walletService.transfer({
          userId,
          receiverId: 'receiver',
          amount: 500,
        }),
      ).rejects.toThrow(
        new CustomError('Sender or receiver wallet not found', 404),
      );
    });

    it('should throw if sender has insufficient balance', async () => {
      tracker.on('query', (query) => {
        query.response([{ id: '123', user_id: userId, balance: 100 }]);
        query.response([{ id: '456', user_id: 'abc', balance: 200 }]);
      });

      await expect(
        walletService.transfer({
          userId,
          receiverId: 'receiver',
          amount: 500,
        }),
      ).rejects.toThrow(
        new CustomError('Insufficient balance in sender wallet', 400),
      );
    });
  });
});
