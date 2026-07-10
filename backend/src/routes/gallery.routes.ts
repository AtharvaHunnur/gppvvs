import { Router } from 'express';
import { 
  getAlbums, getAlbumById, createAlbum, deleteAlbum, 
  addImageToAlbum, deleteImage 
} from '../controllers/gallery.controller';
import { verifyJWT } from '../middleware/auth';
import { authorize } from '../middleware/authorize';

const router = Router();

router.get('/albums', getAlbums);
router.get('/albums/:id', getAlbumById);

router.use(verifyJWT, authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'));
router.post('/albums', createAlbum);
router.delete('/albums/:id', deleteAlbum);

router.post('/albums/:albumId/images', addImageToAlbum);
router.delete('/images/:id', deleteImage);

export default router;
