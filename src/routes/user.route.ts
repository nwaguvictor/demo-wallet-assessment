import { Router } from 'express';

import {
  fundOrWithdrawUserWalletSchema,
  transferFundSchema,
} from '../validators';
import { userController as ctr } from '../controllers';
import { authenticate, validateBody } from '../middlewares';

const router = Router();

router.get('/me', [authenticate, ctr.me]);
router.post('/me/wallet/fund', [
  authenticate,
  validateBody(fundOrWithdrawUserWalletSchema),
  ctr.fundWallet,
]);
router.post('/me/wallet/transfer', [
  authenticate,
  validateBody(transferFundSchema),
  ctr.transferFromWallet,
]);
router.post('/me/wallet/withdraw', [
  authenticate,
  validateBody(fundOrWithdrawUserWalletSchema),
  ctr.withdrawFromWallet,
]);

export default router;
