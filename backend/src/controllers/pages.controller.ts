import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

export const getPages = async (req: Request, res: Response) => {
  try {
    const pages = await prisma.page.findMany();
    res.json({ success: true, data: pages });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch pages' });
  }
};

export const getPageBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const page = await prisma.page.findUnique({ where: { slug } });
    if (!page) return res.status(404).json({ success: false, message: 'Page not found' });
    res.json({ success: true, data: page });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch page' });
  }
};

export const createPage = async (req: Request, res: Response) => {
  try {
    const page = await prisma.page.create({ data: req.body });
    res.status(201).json({ success: true, data: page });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create page' });
  }
};

export const updatePage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const page = await prisma.page.update({ where: { id }, data: req.body });
    res.json({ success: true, data: page });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update page' });
  }
};

export const deletePage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.page.delete({ where: { id } });
    res.json({ success: true, message: 'Page deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete page' });
  }
};
