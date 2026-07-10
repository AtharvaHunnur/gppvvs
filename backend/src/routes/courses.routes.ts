import { Router } from 'express';
import { getCourses, getCourseById, createCourse, updateCourse, deleteCourse } from '../controllers/courses.controller';
import { verifyJWT } from '../middleware/auth';
import { authorize } from '../middleware/authorize';

const router = Router();

// Public routes
router.get('/', getCourses);
router.get('/:id', getCourseById);

// Admin routes
router.use(verifyJWT, authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'));

router.post('/', createCourse);
router.put('/:id', updateCourse);
router.delete('/:id', deleteCourse);

export default router;
