import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { NoticeCategory } from '@prisma/client';

export const getNotices = async (req: Request, res: Response) => {
  try {
    const { category, isPinned, page = '1', limit = '10' } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const filter: any = {};
    if (category) filter.category = category as NoticeCategory;
    if (isPinned !== undefined) filter.isPinned = isPinned === 'true';

    const [notices, total] = await Promise.all([
      prisma.notice.findMany({
        where: filter,
        orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
        skip,
        take
      }),
      prisma.notice.count({ where: filter })
    ]);

    res.json({
      success: true,
      data: notices,
      pagination: {
        page: Number(page),
        limit: take,
        total,
        totalPages: Math.ceil(total / take)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch notices' });
  }
};

export const getNoticeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const notice = await prisma.notice.findUnique({ where: { id } });
    if (!notice) return res.status(404).json({ success: false, message: 'Notice not found' });
    res.json({ success: true, data: notice });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch notice' });
  }
};

export const createNotice = async (req: Request, res: Response) => {
  try {
    // Schema requires 'content' (Text), not 'description'
    const { title, category, isPinned, content, description, attachmentUrl } = req.body;
    const notice = await prisma.notice.create({
      data: {
        title,
        content: content || description || '', // accept either field from frontend
        category: category || 'GENERAL',
        isPinned: isPinned || false,
        attachmentUrl
      }
    });
    res.status(201).json({ success: true, data: notice });
  } catch (error) {
    console.error('Create notice error:', error);
    res.status(500).json({ success: false, message: 'Failed to create notice' });
  }
};

export const updateNotice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, category, isPinned, content, description, attachmentUrl } = req.body;
    const data: any = {};
    if (title !== undefined) data.title = title;
    if (content !== undefined) data.content = content;
    if (description !== undefined) data.content = description; // map description -> content
    if (category !== undefined) data.category = category;
    if (isPinned !== undefined) data.isPinned = isPinned;
    if (attachmentUrl !== undefined) data.attachmentUrl = attachmentUrl;
    
    const notice = await prisma.notice.update({ where: { id }, data });
    res.json({ success: true, data: notice });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update notice' });
  }
};

export const deleteNotice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.notice.delete({ where: { id } });
    res.json({ success: true, message: 'Notice deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete notice' });
  }
};
