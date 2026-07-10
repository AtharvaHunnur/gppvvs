import { Router } from 'express';
import { getNotices, getNoticeById, createNotice, updateNotice, deleteNotice } from '../controllers/notices.controller';
import { verifyJWT } from '../middleware/auth';
import { authorize } from '../middleware/authorize';

const router = Router();

router.get('/', getNotices);
router.get('/:id', getNoticeById);

router.use(verifyJWT, authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'));
router.post('/', createNotice);
router.put('/:id', updateNotice);
router.delete('/:id', deleteNotice);

export default router;
