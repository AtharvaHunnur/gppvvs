import { Router } from 'express';
import { 
  getHomepageSections, createHomepageSection, updateHomepageSection, deleteHomepageSection,
  getQuickLinks, createQuickLink, updateQuickLink, deleteQuickLink,
  getStatistics, createStatistic, updateStatistic, deleteStatistic
} from '../controllers/homepage.controller';
import { verifyJWT } from '../middleware/auth';
import { authorize } from '../middleware/authorize';

const router = Router();

// Public routes
router.get('/sections', getHomepageSections);
router.get('/quicklinks', getQuickLinks);
router.get('/statistics', getStatistics);

// Admin routes
router.use(verifyJWT, authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'));

// Sections
router.post('/sections', createHomepageSection);
router.put('/sections/:id', updateHomepageSection);
router.delete('/sections/:id', deleteHomepageSection);

// Quick Links
router.post('/quicklinks', createQuickLink);
router.put('/quicklinks/:id', updateQuickLink);
router.delete('/quicklinks/:id', deleteQuickLink);

// Statistics
router.post('/statistics', createStatistic);
router.put('/statistics/:id', updateStatistic);
router.delete('/statistics/:id', deleteStatistic);

export default router;
