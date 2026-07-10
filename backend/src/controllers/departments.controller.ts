import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { Program } from '@prisma/client';

export const getDepartments = async (req: Request, res: Response) => {
  try {
    const { program } = req.query;
    const filter = program ? { program: program as Program } : {};
    
    const departments = await prisma.department.findMany({
      where: filter,
      orderBy: { position: 'asc' },
    });
    res.json({ success: true, data: departments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch departments' });
  }
};

export const getDepartmentBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const department = await prisma.department.findUnique({
      where: { slug },
      include: {
        faculty: { orderBy: { position: 'asc' } },
        courses: true
      }
    });
    if (!department) return res.status(404).json({ success: false, message: 'Department not found' });
    res.json({ success: true, data: department });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch department' });
  }
};

export const createDepartment = async (req: Request, res: Response) => {
  try {
    const department = await prisma.department.create({ data: req.body });
    res.status(201).json({ success: true, data: department });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create department' });
  }
};

export const updateDepartment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const department = await prisma.department.update({ where: { id }, data: req.body });
    res.json({ success: true, data: department });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update department' });
  }
};

export const deleteDepartment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.department.delete({ where: { id } });
    res.json({ success: true, message: 'Department deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete department' });
  }
};
