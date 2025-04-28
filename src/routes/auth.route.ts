import { NextFunction, Request, Response, Router } from 'express';
import { authController as ctr } from '../controllers';

const router = Router();

router.get('/register', ctr.register);

export default router;
