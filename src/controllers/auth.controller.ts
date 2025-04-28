import { Request, Response } from 'express';
import { AuthService } from '../services';

class AuthController {
  constructor(private readonly authService: AuthService) {}

  register = async (req: Request, res: Response) => {
    res.json({ message: 'Success' });
  };
}

export const authController = new AuthController(new AuthService());
