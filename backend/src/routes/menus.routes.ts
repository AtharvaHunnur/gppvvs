import { Router } from 'express';
import { getMenus, getAllMenus, createMenu, updateMenu, deleteMenu } from '../controllers/menus.controller';
import { verifyJWT } from '../middleware/auth';
import { authorize } from '../middleware/authorize';

const router = Router();

// Public routes
router.get('/', getMenus);

// Admin routes
router.use(verifyJWT, authorize('SUPER_ADMIN', 'ADMIN'));
router.get('/all', getAllMenus);
router.post('/', createMenu);
router.put('/:id', updateMenu);
router.delete('/:id', deleteMenu);

export default router;
