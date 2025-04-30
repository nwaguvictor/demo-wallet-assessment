import { Router } from 'express';

import { fundUserWalletSchema } from '../validators';
import { userController as ctr } from '../controllers';
import { authenticate, validateBody } from '../middlewares';

const router = Router();

router.get('/me', [authenticate, ctr.me]);
router.post('/me/wallet/fund', [
  authenticate,
  validateBody(fundUserWalletSchema),
  ctr.fundWallet,
]);
router.post('/me/wallet/transfer', ctr.transferFromWallet);
router.post('/me/wallet/withdraw', ctr.withdrawFromWallet);

export default router;
