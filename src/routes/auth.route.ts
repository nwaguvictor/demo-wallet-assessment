import { NextFunction, Request, Response, Router } from 'express';

import { authController as ctr } from '../controllers';
import { validateBody } from '../middlewares';
import { createUserSchema, loginUserSchema } from '../validators';

const router = Router();

router.post('/register', validateBody(createUserSchema), ctr.register);
router.post('/login', validateBody(loginUserSchema), ctr.login);

export default router;
