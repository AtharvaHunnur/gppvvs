import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

export const getMenus = async (req: Request, res: Response) => {
  try {
    // Fetch top-level menus with children
    const menus = await prisma.menu.findMany({
      where: { parentId: null, isVisible: true },
      orderBy: { position: 'asc' },
      include: {
        children: {
          where: { isVisible: true },
          orderBy: { position: 'asc' },
          include: {
            children: {
              where: { isVisible: true },
              orderBy: { position: 'asc' }
            }
          }
        }
      }
    });
    res.json({ success: true, data: menus });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch menus' });
  }
};

export const getAllMenus = async (req: Request, res: Response) => {
  try {
    const menus = await prisma.menu.findMany({
      orderBy: { position: 'asc' },
      include: {
        children: { 
          orderBy: { position: 'asc' },
          include: {
            children: {
              orderBy: { position: 'asc' }
            }
          }
        },
        parent: { select: { id: true, label: true } }
      }
    });
    res.json({ success: true, data: menus });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch menus' });
  }
};

export const createMenu = async (req: Request, res: Response) => {
  try {
    const { label, href, parentId, position, isVisible } = req.body;
    const menu = await prisma.menu.create({
      data: {
        label,
        href: href || '#',
        parentId: parentId || null,
        position: position ? Number(position) : 0,
        isVisible: isVisible !== undefined ? isVisible : true
      }
    });
    res.status(201).json({ success: true, data: menu });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create menu' });
  }
};

export const updateMenu = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data: any = { ...req.body };
    if (data.position !== undefined) data.position = Number(data.position);
    const menu = await prisma.menu.update({ where: { id }, data });
    res.json({ success: true, data: menu });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update menu' });
  }
};

export const deleteMenu = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.menu.delete({ where: { id } });
    res.json({ success: true, message: 'Menu deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete menu' });
  }
};
