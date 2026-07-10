import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { DownloadCategory } from '@prisma/client';

export const getDownloads = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    const filter: any = {};
    if (category) filter.category = category as DownloadCategory;

    const downloads = await prisma.download.findMany({
      where: filter,
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: downloads });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch downloads' });
  }
};

export const createDownload = async (req: Request, res: Response) => {
  try {
    // Schema uses 'fileUrl' not 'url'
    const { title, category, fileUrl, url, description } = req.body;
    const download = await prisma.download.create({
      data: {
        title,
        category: category || 'OTHER',
        fileUrl: fileUrl || url || '',
        description
      }
    });
    res.status(201).json({ success: true, data: download });
  } catch (error) {
    console.error('Create download error:', error);
    res.status(500).json({ success: false, message: 'Failed to create download' });
  }
};

export const updateDownload = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data: any = { ...req.body };
    // Map 'url' to 'fileUrl' if needed
    if (data.url && !data.fileUrl) {
      data.fileUrl = data.url;
      delete data.url;
    }
    const download = await prisma.download.update({ where: { id }, data });
    res.json({ success: true, data: download });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update download' });
  }
};

export const deleteDownload = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.download.delete({ where: { id } });
    res.json({ success: true, message: 'Download deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete download' });
  }
};
