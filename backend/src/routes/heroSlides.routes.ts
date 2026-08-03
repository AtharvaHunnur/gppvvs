import { Router } from 'express';
import { getHeroSlides, getHeroSlideById, createHeroSlide, updateHeroSlide, deleteHeroSlide } from '../controllers/heroSlides.controller';
import { verifyJWT } from '../middleware/auth';
import { authorize } from '../middleware/authorize';

const router = Router();

router.get('/', getHeroSlides);
router.get('/:id', getHeroSlideById);

router.use(verifyJWT, authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'));
router.post('/', createHeroSlide);
router.put('/:id', updateHeroSlide);
router.delete('/:id', deleteHeroSlide);

export default router;
