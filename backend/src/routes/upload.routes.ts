import { Router } from 'express';
import { uploadSingle, uploadMultiple } from '../controllers/upload.controller';
import { verifyJWT } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { upload } from '../middleware/upload';

const router = Router();

// Only authenticated admins can upload files
router.use(verifyJWT, authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'));

router.post('/single', upload.single('file'), uploadSingle);
router.post('/multiple', upload.array('files', 10), uploadMultiple);

export default router;
