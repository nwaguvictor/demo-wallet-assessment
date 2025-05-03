import mockKnex from 'mock-knex';

import { db } from '../../config';
import * as utils from '../../utils';
import { AuthService } from '../../services';
import { CreateUserDto, LoginUserDto } from '../../interfaces';

mockKnex.mock(db);

jest.mock('../../utils', () => ({
  ...jest.requireActual('../../utils'),
  isBlacklistedUser: jest.fn(),
  generateHash: jest.fn(),
  compareHash: jest.fn(),
  generateFauxToken: jest.fn(),
}));

describe('AuthService', () => {
  const tracker = mockKnex.getTracker();
  const authService = new AuthService();

  beforeAll(() => tracker.install());
  afterAll(() => tracker.uninstall());

  describe('register', () => {
    const payload: CreateUserDto = {
      name: 'a',
      email: 'a@b.com',
      password: 'password123',
    };

    it('should throw if user is blacklisted', async () => {
      jest.spyOn(utils, 'isBlacklistedUser').mockResolvedValueOnce(true);

      await expect(authService.register(payload)).rejects.toThrow();
    });

    it('should throw if user already exists', async () => {
      jest.spyOn(utils, 'isBlacklistedUser').mockResolvedValueOnce(false);

      tracker.on('query', (query) => {
        if (query.sql.includes('select')) {
          query.response([{ id: 'user123', email: 'a@b.com' }]);
        }
      });

      await expect(authService.register(payload)).rejects.toThrow();
    });

    it('should register a new user and create wallet', async () => {
      jest.spyOn(utils, 'isBlacklistedUser').mockResolvedValueOnce(false);
      jest.spyOn(utils, 'generateHash').mockResolvedValueOnce('hashed_pw');

      tracker.on('query', (query) => {
        if (query.sql.includes('select')) {
          query.response([]);
        } else if (query.sql.includes('insert into `users`')) {
          query.response([1]);
        } else if (query.sql.includes('insert into `wallets`')) {
          query.response([1]);
        } else {
          query.response([]);
        }
      });

      const result = await authService.register(payload);

      expect(result).toEqual(
        expect.objectContaining({
          name: 'a',
          email: 'a@b.com',
          id: expect.any(String),
        }),
      );
    });
  });

  describe('login', () => {
    const payload: LoginUserDto = {
      email: 'a@b.com',
      password: 'password123',
    };

    it('should throw if user not found', async () => {
      tracker.on('query', (query) => query.response([]));

      await expect(authService.login(payload)).rejects.toThrow();
    });

    it('should throw if password is invalid', async () => {
      tracker.on('query', (query) => {
        query.response([
          { id: 'user123', email: 'a@b.com', password: 'hashed_pw' },
        ]);
      });

      jest.spyOn(utils, 'compareHash').mockResolvedValueOnce(false);

      await expect(authService.login(payload)).rejects.toThrow();
    });

    it('should return token if login is successful', async () => {
      tracker.on('query', (query) => {
        query.response([
          { id: 'user123', email: 'a@b.com', password: 'hashed_pw' },
        ]);
      });

      jest.spyOn(utils, 'compareHash').mockResolvedValueOnce(true);
      jest.spyOn(utils, 'generateFauxToken').mockReturnValue('mocked-token');

      const result = await authService.login(payload);

      expect(result).toEqual({ token: 'mocked-token' });
    });
  });
});
