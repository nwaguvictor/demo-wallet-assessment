import { Request, Response } from 'express';
import { UserService, WalletService } from '../services';

class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly walletService: WalletService,
  ) {}

  me = async (req: Request, res: Response) => {
    const user = (req as any).user;
    delete user.password;
    res.status(200).json({ success: true, data: user });
  };

  fundWallet = async (req: Request, res: Response) => {
    const user = (req as any).user;
    const data = await this.walletService.fund({
      ...req.body,
      userId: user.id,
    });
    res.status(200).json({ success: true, data });
  };

  transferFromWallet = async (req: Request, res: Response) => {
    res.status(200).json({ message: 'transfer' });
  };

  withdrawFromWallet = async (req: Request, res: Response) => {
    res.status(200).json({ message: 'withdraw' });
  };
}

export const userController = new UserController(
  new UserService(),
  new WalletService(),
);
