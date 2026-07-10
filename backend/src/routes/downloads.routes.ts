import { Router } from 'express';
import { getDownloads, createDownload, updateDownload, deleteDownload } from '../controllers/downloads.controller';
import { verifyJWT } from '../middleware/auth';
import { authorize } from '../middleware/authorize';

const router = Router();

router.get('/', getDownloads);

router.use(verifyJWT, authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'));
router.post('/', createDownload);
router.put('/:id', updateDownload);
router.delete('/:id', deleteDownload);

export default router;
