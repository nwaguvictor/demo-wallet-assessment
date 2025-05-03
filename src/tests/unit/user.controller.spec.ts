import { userController } from '../../controllers';
import { UserService, WalletService } from '../../services';

describe('UserController', () => {
  let req: any;
  let res: any;
  const id = crypto.randomUUID();

  beforeEach(() => {
    req = {
      body: { email: 'test@example.com', password: 'a' },
      user: { id },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  beforeAll(() => {
    jest.clearAllMocks();
  });

  describe('me()', () => {
    it('should call UserService.profile and return a successful response', async () => {
      const mockResponse = { id, name: 'b', email: 'c', password: undefined };

      const profileSpy = jest
        .spyOn(UserService.prototype, 'profile')
        .mockResolvedValue(mockResponse);

      await userController.me(req, res);

      expect(profileSpy).toHaveBeenCalledWith(id);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockResponse,
      });

      profileSpy.mockRestore();
    });
  });

  describe('fundWallet()', () => {
    beforeEach(() => {
      req = { ...req, body: { amount: 100 } };
    });

    it('should call WalletService.fund method and return a successful response', async () => {
      const mockResponse = {
        userId: id,
        id: crypto.randomUUID(),
        balance: 100,
      };

      const fundSpy = jest
        .spyOn(WalletService.prototype, 'fund')
        .mockResolvedValue(mockResponse);

      await userController.fundWallet(req, res);

      expect(fundSpy).toHaveBeenCalledWith({ ...req.body, userId: id });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockResponse,
      });

      fundSpy.mockRestore();
    });
  });

  describe('transferFromWallet()', () => {
    beforeEach(() => {
      req = { ...req, body: { amount: 100, receiverId: crypto.randomUUID() } };
    });

    it('should call WalletService.transfer method and return a successful response', async () => {
      const mockResponse = {
        userId: id,
        id: crypto.randomUUID(),
        balance: 0,
      };

      const transferSpy = jest
        .spyOn(WalletService.prototype, 'transfer')
        .mockResolvedValue(mockResponse);

      await userController.transferFromWallet(req, res);

      expect(transferSpy).toHaveBeenCalledWith({ ...req.body, userId: id });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockResponse,
      });

      transferSpy.mockRestore();
    });
  });

  describe('withdrawFromWallet()', () => {
    beforeEach(() => {
      req = { ...req, body: { amount: 100 } };
    });

    it('should call WalletService.withdraw method and return a successful response', async () => {
      const mockResponse = {
        userId: id,
        id: crypto.randomUUID(),
        balance: 0,
      };

      const withdrawSpy = jest
        .spyOn(WalletService.prototype, 'withdraw')
        .mockResolvedValue(mockResponse);

      await userController.withdrawFromWallet(req, res);

      expect(withdrawSpy).toHaveBeenCalledWith({ ...req.body, userId: id });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockResponse,
      });

      withdrawSpy.mockRestore();
    });
  });
});
