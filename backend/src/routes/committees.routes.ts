import { Router } from 'express';
import { 
  getCommittees, getCommitteeById, createCommittee, updateCommittee, deleteCommittee,
  addCommitteeMember, deleteCommitteeMember
} from '../controllers/committees.controller';
import { verifyJWT } from '../middleware/auth';
import { authorize } from '../middleware/authorize';

const router = Router();

// Public routes
router.get('/', getCommittees);
router.get('/:id', getCommitteeById);

// Admin routes
router.use(verifyJWT, authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'));

router.post('/', createCommittee);
router.put('/:id', updateCommittee);
router.delete('/:id', deleteCommittee);

router.post('/:committeeId/members', addCommitteeMember);
router.delete('/members/:id', deleteCommitteeMember);

export default router;
