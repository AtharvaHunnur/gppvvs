import { Router } from 'express';
import { login, refresh, getMe } from '../controllers/auth.controller';
import { verifyJWT } from '../middleware/auth';

const router = Router();

router.post('/login', login);
router.post('/refresh', refresh);
router.get('/me', verifyJWT, getMe);

export default router;
