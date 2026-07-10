import { Router } from 'express';
import { 
  getTestimonials, getTestimonialById, createTestimonial, updateTestimonial, deleteTestimonial 
} from '../controllers/testimonials.controller';
import { verifyJWT } from '../middleware/auth';
import { authorize } from '../middleware/authorize';

const router = Router();

// Public routes
router.get('/', getTestimonials);
router.get('/:id', getTestimonialById);

// Admin routes
router.use(verifyJWT, authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'));

router.post('/', createTestimonial);
router.put('/:id', updateTestimonial);
router.delete('/:id', deleteTestimonial);

export default router;
