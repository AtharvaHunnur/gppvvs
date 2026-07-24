import { Router } from 'express';
import {
  getDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
} from '../controllers/pageDocuments.controller';
import { verifyJWT } from '../middleware/auth';
import { authorize } from '../middleware/authorize';

const router = Router();

// Public: fetch documents for a given section + entity
router.get('/:section/:entityId', getDocuments);

// Admin-only: create, update, delete
router.post('/', verifyJWT, authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'), createDocument);
router.put('/:id', verifyJWT, authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'), updateDocument);
router.delete('/:id', verifyJWT, authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'), deleteDocument);

export default router;
