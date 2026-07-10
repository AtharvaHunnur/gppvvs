import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

// ---------------------------------------------------------
// Homepage Sections
// ---------------------------------------------------------
export const getHomepageSections = async (req: Request, res: Response) => {
  try {
    const { isVisible } = req.query;
    const filter = isVisible !== undefined ? { isVisible: isVisible === 'true' } : {};

    const sections = await prisma.homepageSection.findMany({
      where: filter,
      orderBy: { position: 'asc' },
    });
    res.json({ success: true, data: sections });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch homepage sections' });
  }
};

export const createHomepageSection = async (req: Request, res: Response) => {
  try {
    const section = await prisma.homepageSection.create({ data: req.body });
    res.status(201).json({ success: true, data: section });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create section' });
  }
};

export const updateHomepageSection = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const section = await prisma.homepageSection.update({ where: { id }, data: req.body });
    res.json({ success: true, data: section });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update section' });
  }
};

export const deleteHomepageSection = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.homepageSection.delete({ where: { id } });
    res.json({ success: true, message: 'Section deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete section' });
  }
};

// ---------------------------------------------------------
// Quick Links
// ---------------------------------------------------------
export const getQuickLinks = async (req: Request, res: Response) => {
  try {
    const { isVisible } = req.query;
    const filter = isVisible !== undefined ? { isVisible: isVisible === 'true' } : {};

    const links = await prisma.quickLink.findMany({
      where: filter,
      orderBy: { position: 'asc' },
    });
    res.json({ success: true, data: links });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch quick links' });
  }
};

export const createQuickLink = async (req: Request, res: Response) => {
  try {
    const link = await prisma.quickLink.create({ data: req.body });
    res.status(201).json({ success: true, data: link });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create quick link' });
  }
};

export const updateQuickLink = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const link = await prisma.quickLink.update({ where: { id }, data: req.body });
    res.json({ success: true, data: link });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update quick link' });
  }
};

export const deleteQuickLink = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.quickLink.delete({ where: { id } });
    res.json({ success: true, message: 'Link deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete link' });
  }
};

// ---------------------------------------------------------
// Statistics
// ---------------------------------------------------------
export const getStatistics = async (req: Request, res: Response) => {
  try {
    const stats = await prisma.statistic.findMany({
      orderBy: { position: 'asc' },
    });
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch statistics' });
  }
};

export const createStatistic = async (req: Request, res: Response) => {
  try {
    const stat = await prisma.statistic.create({ data: req.body });
    res.status(201).json({ success: true, data: stat });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create statistic' });
  }
};

export const updateStatistic = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const stat = await prisma.statistic.update({ where: { id }, data: req.body });
    res.json({ success: true, data: stat });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update statistic' });
  }
};

export const deleteStatistic = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.statistic.delete({ where: { id } });
    res.json({ success: true, message: 'Statistic deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete statistic' });
  }
};
