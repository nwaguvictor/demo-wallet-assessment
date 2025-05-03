import { generateFauxToken } from '../../utils';
import { authController } from '../../controllers';
import { AuthService } from '../../services';

describe('AuthController', () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = {
      body: { email: 'test@example.com', password: 'a' },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('register()', () => {
    it('should call AuthService.register and return a successful response', async () => {
      const id = crypto.randomUUID();
      const mockResponse = { id, name: 'b', email: 'c', password: undefined };

      const registerSpy = jest
        .spyOn(AuthService.prototype, 'register')
        .mockResolvedValue(mockResponse);

      await authController.register(req, res);

      expect(registerSpy).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockResponse,
      });

      registerSpy.mockRestore();
    });
  });

  describe('login()', () => {
    it('should call AuthService.login and return a successful response', async () => {
      const userId = crypto.randomUUID();
      const mockResponse = { token: generateFauxToken(userId) };

      const loginSpy = jest
        .spyOn(AuthService.prototype, 'login')
        .mockResolvedValue(mockResponse);

      await authController.login(req, res);

      expect(loginSpy).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockResponse,
      });

      loginSpy.mockRestore();
    });
  });
});
