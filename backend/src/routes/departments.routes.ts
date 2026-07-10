import { Router } from 'express';
import { getDepartments, getDepartmentBySlug, createDepartment, updateDepartment, deleteDepartment } from '../controllers/departments.controller';
import { verifyJWT } from '../middleware/auth';
import { authorize } from '../middleware/authorize';

const router = Router();

router.get('/', getDepartments);
router.get('/:slug', getDepartmentBySlug);

router.use(verifyJWT, authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'));
router.post('/', createDepartment);
router.put('/:id', updateDepartment);
router.delete('/:id', deleteDepartment);

export default router;
