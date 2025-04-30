import { Router } from 'express';

import { userController as ctr } from '../controllers';
import { authenticate } from '../middlewares';

const router = Router();

router.get('/me', [authenticate, ctr.me]);
router.post('/me/wallet/fund', ctr.fundWallet);
router.post('/me/wallet/transfer', ctr.transferFromWallet);
router.post('/me/wallet/withdraw', ctr.withdrawFromWallet);

export default router;
