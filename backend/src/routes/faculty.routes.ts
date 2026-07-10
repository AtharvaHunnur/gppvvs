import { Router } from 'express';
import { getFaculty, getFacultyById, createFaculty, updateFaculty, deleteFaculty } from '../controllers/faculty.controller';
import { verifyJWT } from '../middleware/auth';
import { authorize } from '../middleware/authorize';

const router = Router();

router.get('/', getFaculty);
router.get('/:id', getFacultyById);

router.use(verifyJWT, authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'));
router.post('/', createFaculty);
router.put('/:id', updateFaculty);
router.delete('/:id', deleteFaculty);

export default router;
