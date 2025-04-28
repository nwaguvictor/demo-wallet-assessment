import { Router } from 'express';
import { userController as ctr } from '../controllers';

const router = Router();

router.get('/me', ctr.me);
router.post('/me/wallet/fund', ctr.fundWallet);
router.post('/me/wallet/transfer', ctr.transferFromWallet);
router.post('/me/wallet/withdraw', ctr.withdrawFromWallet);

export default router;
