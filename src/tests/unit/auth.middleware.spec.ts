import mockKnex from 'mock-knex';
import { Request, Response } from 'express';

import { authenticate } from '../../middlewares';
import { db } from '../../config';

mockKnex.mock(db);

describe('authenticate middleware', () => {
  const tracker = mockKnex.getTracker();

  beforeAll(() => tracker.install());
  afterAll(() => tracker.uninstall());

  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = {
      headers: {
        authorization: 'Bearer token_123',
      },
    };
    res = {};
    next = jest.fn();
  });

  it('should call next with CustomError when no authorization header', async () => {
    req.headers = {
      authorization: '',
    };

    await authenticate(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'User not authenticated',
        statusCode: 401,
      }),
    );
  });

  it('should call next with CustomError when invalid token format', async () => {
    req.headers = {
      authorization: 'Bearer invalidtoken',
    };

    await authenticate(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Invalid token format',
        statusCode: 401,
      }),
    );
  });

  it('should call next with CustomError when user not found', async () => {
    tracker.on('query', (query) => {
      expect(query.sql).toMatch(/select \* from `users` where `id` = \?/);
      expect(query.bindings).toContain('123');
      query.response([]);
    });

    await authenticate(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'User not found',
        statusCode: 401,
      }),
    );
  });

  it('should attach user to request and call next if user is found', async () => {
    tracker.on('query', (query) => {
      query.response([{ id: '123', name: 'a' }]);
    });

    await authenticate(req as Request, res as Response, next);
    expect((req as any).user).toEqual({ id: '123', name: 'a' });
  });
});
