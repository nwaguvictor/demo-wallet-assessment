import axios from 'axios';

import {
  generateHash,
  compareHash,
  generateFauxToken,
  isBlacklistedUser,
  CustomError,
} from '../../utils';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Helper Utils', () => {
  describe('generateHash', () => {
    const password = 'a';

    it('should return a string hash of length 60', async () => {
      const hash = await generateHash(password);

      expect(typeof hash).toBe('string');
      expect(hash).toHaveLength(60);
      expect(hash).not.toEqual(password);
    });

    it('should match the hash when compared using compareHash()', async () => {
      const hash = await generateHash(password);
      const isMatch = await compareHash(password, hash);

      expect(isMatch).toBe(true);
    });
  });

  describe('compareHash', () => {
    const password = 'a';
    let hash: string;

    beforeAll(async () => {
      hash = await generateHash(password);
    });

    it('should return true for matching value and hash', async () => {
      const isMatch = await compareHash(password, hash);
      expect(isMatch).toBe(true);
    });

    it('should return false for non-matching value and hash', async () => {
      const isMatch = await compareHash('b', hash);
      expect(isMatch).toBe(false);
    });
  });

  describe('generateFauxToken', () => {
    it('should return a token containing the userId and a UUID', () => {
      const userId = '123';
      const token = generateFauxToken(userId);

      expect(token).toMatch(/^faux_123_[\w-]{36}$/);
      expect(token.includes(userId)).toBe(true);
    });

    it('should generate unique tokens for the same user', () => {
      const userId = '123';
      const token1 = generateFauxToken(userId);
      const token2 = generateFauxToken(userId);

      expect(token1).not.toEqual(token2);
    });
  });

  describe('isBlacklistedUser', () => {
    const identity = 'test@example.com';

    it('should return true when user is blacklisted (status: success)', async () => {
      mockedAxios.get.mockResolvedValue({
        data: {
          status: 'success',
          data: {
            karma_identity: identity,
          },
        },
      });

      const result = await isBlacklistedUser(identity);
      expect(result).toBe(true);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining(`/verification/karma/${identity}`),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: expect.any(String),
          }),
        }),
      );
    });

    it('should throw CustomError when request fails', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Network error'));

      await expect(isBlacklistedUser(identity)).rejects.toThrow(CustomError);
      await expect(isBlacklistedUser(identity)).rejects.toThrow(
        'Unable to verify blacklist status',
      );
    });
  });
});
