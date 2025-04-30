import { Request, Response } from 'express';

import { UserService, WalletService } from '../services';

class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly walletService: WalletService,
  ) {}

  me = async (req: Request, res: Response) => {
    const authUser = (req as any).user;
    const user = await this.userService.profile(authUser.id);
    res.status(200).json({ success: true, data: user });
  };

  fundWallet = async (req: Request, res: Response) => {
    const authUser = (req as any).user;
    const data = await this.walletService.fund({
      ...req.body,
      userId: authUser.id,
    });
    res.status(200).json({ success: true, data });
  };

  transferFromWallet = async (req: Request, res: Response) => {
    const authUser = (req as any).user;
    const data = await this.walletService.transfer({
      ...req.body,
      userId: authUser.id,
    });
    res.status(200).json({ success: true, data });
  };

  withdrawFromWallet = async (req: Request, res: Response) => {
    const authUser = (req as any).user;
    const data = await this.walletService.withdraw({
      ...req.body,
      userId: authUser.id,
    });
    res.status(200).json({ success: true, data });
  };
}

export const userController = new UserController(
  new UserService(),
  new WalletService(),
);
