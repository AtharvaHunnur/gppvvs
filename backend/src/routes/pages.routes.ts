import { Router } from 'express';
import { getPages, getPageBySlug, createPage, updatePage, deletePage } from '../controllers/pages.controller';
import { verifyJWT } from '../middleware/auth';
import { authorize } from '../middleware/authorize';

const router = Router();

router.get('/', getPages);
router.get('/:slug', getPageBySlug);

// Admin routes
router.use(verifyJWT, authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'));
router.post('/', createPage);
router.put('/:id', updatePage);
router.delete('/:id', deletePage);

export default router;
