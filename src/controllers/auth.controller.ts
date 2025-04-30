import { Request, Response } from 'express';

import { AuthService } from '../services';

class AuthController {
  constructor(private readonly authService: AuthService) {}

  register = async (req: Request, res: Response) => {
    const user = await this.authService.register(req.body);
    res.json({ success: true, data: user });
  };

  login = async (req: Request, res: Response) => {
    const data = await this.authService.login(req.body);
    res.json({ success: true, data });
  };
}

export const authController = new AuthController(new AuthService());
