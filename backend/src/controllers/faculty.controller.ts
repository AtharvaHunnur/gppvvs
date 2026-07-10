import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

export const getFaculty = async (req: Request, res: Response) => {
  try {
    const { departmentId, search } = req.query;

    const filter: any = {};
    if (departmentId) filter.departmentId = departmentId;
    if (search) {
      filter.OR = [
        { name: { contains: String(search), mode: 'insensitive' } },
        { designation: { contains: String(search), mode: 'insensitive' } },
        { specialization: { contains: String(search), mode: 'insensitive' } },
      ];
    }

    const faculty = await prisma.faculty.findMany({
      where: filter,
      orderBy: [{ position: 'asc' }, { name: 'asc' }],
      include: {
        department: {
          select: { name: true, program: true }
        }
      }
    });

    res.json({ success: true, data: faculty });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch faculty' });
  }
};

export const getFacultyById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const faculty = await prisma.faculty.findUnique({ 
      where: { id },
      include: { department: true }
    });
    if (!faculty) return res.status(404).json({ success: false, message: 'Faculty not found' });
    res.json({ success: true, data: faculty });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch faculty profile' });
  }
};

export const createFaculty = async (req: Request, res: Response) => {
  try {
    const faculty = await prisma.faculty.create({ data: req.body });
    res.status(201).json({ success: true, data: faculty });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create faculty' });
  }
};

export const updateFaculty = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const faculty = await prisma.faculty.update({ where: { id }, data: req.body });
    res.json({ success: true, data: faculty });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update faculty' });
  }
};

export const deleteFaculty = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.faculty.delete({ where: { id } });
    res.json({ success: true, message: 'Faculty deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete faculty' });
  }
};
