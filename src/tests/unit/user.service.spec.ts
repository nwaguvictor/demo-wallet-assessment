import mockKnex from 'mock-knex';

import { db } from '../../config';
import { UserService } from '../../services';

mockKnex.mock(db);

describe('UserService', () => {
  describe('profile', () => {
    const tracker = mockKnex.getTracker();
    const userService = new UserService();

    beforeAll(() => tracker.install());
    afterAll(() => tracker.uninstall());

    const userId = 'user_123';

    it('should throw if user not found', async () => {
      tracker.on('query', (query) => {
        if (query.sql.includes('from `users`')) {
          query.response([]);
        }
      });

      await expect(userService.profile(userId)).rejects.toThrow();
    });

    it('should return user with wallet', async () => {
      tracker.on('query', (query) => {
        if (query.sql.includes('from `users`')) {
          query.response([
            {
              id: userId,
              name: 'a',
              email: 'a@b.com',
              created_at: '2023-01-01T00:00:00Z',
            },
          ]);
        } else if (query.sql.includes('from `wallets`')) {
          query.response([
            {
              id: 'wallet_123',
              balance: 5000,
              created_at: '2023-01-02T00:00:00Z',
            },
          ]);
        } else {
          query.response([]);
        }
      });

      const result = await userService.profile(userId);

      expect(result).toEqual({
        id: userId,
        name: 'a',
        email: 'a@b.com',
        created_at: '2023-01-01T00:00:00Z',
        wallet: {
          id: 'wallet_123',
          balance: 5000,
          created_at: '2023-01-02T00:00:00Z',
        },
      });
    });

    it('should return user with empty wallet if no wallet record', async () => {
      tracker.on('query', (query) => {
        if (query.sql.includes('from `users`')) {
          query.response([
            {
              id: userId,
              name: 'Test User',
              email: 'test@example.com',
              created_at: '2023-01-01T00:00:00Z',
            },
          ]);
        } else if (query.sql.includes('from `wallets`')) {
          query.response([]);
        }
      });

      const result = await userService.profile(userId);

      expect(result).toEqual({
        id: userId,
        name: 'Test User',
        email: 'test@example.com',
        created_at: '2023-01-01T00:00:00Z',
        wallet: {
          balance: 0,
        },
      });
    });
  });
});
