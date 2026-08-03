import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

export const getHeroSlides = async (req: Request, res: Response) => {
  try {
    const { all } = req.query;
    const where = all === 'true' ? {} : { isVisible: true };
    const slides = await prisma.heroSlide.findMany({
      where,
      orderBy: { position: 'asc' },
    });
    res.json({ success: true, data: slides });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch hero slides' });
  }
};

export const getHeroSlideById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const slide = await prisma.heroSlide.findUnique({ where: { id } });
    if (!slide) return res.status(404).json({ success: false, message: 'Slide not found' });
    res.json({ success: true, data: slide });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch slide' });
  }
};

export const createHeroSlide = async (req: Request, res: Response) => {
  try {
    const { title, subtitle, imageUrl, linkUrl, position, isVisible } = req.body;
    const slide = await prisma.heroSlide.create({
      data: {
        title: title || null,
        subtitle: subtitle || null,
        imageUrl,
        linkUrl: linkUrl || null,
        position: position ?? 0,
        isVisible: isVisible !== undefined ? isVisible : true,
      },
    });
    res.status(201).json({ success: true, data: slide });
  } catch (error) {
    console.error('Create hero slide error:', error);
    res.status(500).json({ success: false, message: 'Failed to create slide' });
  }
};

export const updateHeroSlide = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, subtitle, imageUrl, linkUrl, position, isVisible } = req.body;
    const data: any = {};
    if (title !== undefined) data.title = title || null;
    if (subtitle !== undefined) data.subtitle = subtitle || null;
    if (imageUrl !== undefined) data.imageUrl = imageUrl;
    if (linkUrl !== undefined) data.linkUrl = linkUrl || null;
    if (position !== undefined) data.position = position;
    if (isVisible !== undefined) data.isVisible = isVisible;

    const slide = await prisma.heroSlide.update({ where: { id }, data });
    res.json({ success: true, data: slide });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update slide' });
  }
};

export const deleteHeroSlide = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.heroSlide.delete({ where: { id } });
    res.json({ success: true, message: 'Slide deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete slide' });
  }
};
