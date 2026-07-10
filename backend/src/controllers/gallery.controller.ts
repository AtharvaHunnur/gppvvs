import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

export const getAlbums = async (req: Request, res: Response) => {
  try {
    const albums = await prisma.galleryAlbum.findMany({
      orderBy: { position: 'asc' },
      include: {
        images: { take: 1, orderBy: { position: 'asc' } }
      }
    });
    res.json({ success: true, data: albums });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch albums' });
  }
};

export const getAlbumById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const album = await prisma.galleryAlbum.findUnique({
      where: { id },
      include: {
        images: { orderBy: { position: 'asc' } }
      }
    });
    if (!album) return res.status(404).json({ success: false, message: 'Album not found' });
    res.json({ success: true, data: album });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch album' });
  }
};

export const createAlbum = async (req: Request, res: Response) => {
  try {
    const { title, description, coverImage } = req.body;
    // Generate slug from title
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const album = await prisma.galleryAlbum.create({
      data: { title, slug, description, coverImage }
    });
    res.status(201).json({ success: true, data: album });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create album' });
  }
};

export const deleteAlbum = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.galleryAlbum.delete({ where: { id } });
    res.json({ success: true, message: 'Album deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete album' });
  }
};

export const addImageToAlbum = async (req: Request, res: Response) => {
  try {
    const { albumId } = req.params;
    const { url, caption } = req.body;

    const album = await prisma.galleryAlbum.findUnique({ where: { id: albumId } });
    if (!album) return res.status(404).json({ success: false, message: 'Album not found' });

    const image = await prisma.galleryImage.create({
      data: { url, caption, albumId }
    });
    res.status(201).json({ success: true, data: image });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add image' });
  }
};

export const deleteImage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.galleryImage.delete({ where: { id } });
    res.json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete image' });
  }
};
