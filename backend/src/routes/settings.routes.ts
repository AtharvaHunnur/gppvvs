import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settings.controller';
import { verifyJWT } from '../middleware/auth';
import { authorize } from '../middleware/authorize';

const router = Router();

// Public routes (anyone can read settings)
router.get('/', getSettings);

// Admin routes
router.use(verifyJWT, authorize('SUPER_ADMIN', 'ADMIN'));
router.put('/', updateSettings);

export default router;
