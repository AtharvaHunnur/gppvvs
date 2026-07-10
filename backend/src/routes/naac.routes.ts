import { Router } from 'express';
import { 
  getCriteria, getCriterionById, createCriterion, updateCriterion,
  getDocuments, createDocument, deleteDocument 
} from '../controllers/naac.controller';
import { verifyJWT } from '../middleware/auth';
import { authorize } from '../middleware/authorize';

const router = Router();

// Public routes
router.get('/criteria', getCriteria);
router.get('/criteria/:id', getCriterionById);
router.get('/documents', getDocuments);

// Admin routes
router.use(verifyJWT, authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'));

router.post('/criteria', createCriterion);
router.put('/criteria/:id', updateCriterion);

router.post('/documents', createDocument);
router.delete('/documents/:id', deleteDocument);

export default router;
