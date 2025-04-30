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
    res.status(200).json({ data: user });
  };

  fundWallet = async (req: Request, res: Response) => {
    res.status(200).json({ message: 'fund' });
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
