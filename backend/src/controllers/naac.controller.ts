import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { NaacDocType } from '@prisma/client';

export const getCriteria = async (req: Request, res: Response) => {
  try {
    const criteria = await prisma.naacCriterion.findMany({
      orderBy: { number: 'asc' },
      include: {
        documents: {
          where: { isPublished: true },
          orderBy: { createdAt: 'desc' }
        }
      }
    });
    res.json({ success: true, data: criteria });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch NAAC criteria' });
  }
};

export const getCriterionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const criterion = await prisma.naacCriterion.findUnique({
      where: { id },
      include: {
        documents: { orderBy: { createdAt: 'desc' } }
      }
    });
    if (!criterion) return res.status(404).json({ success: false, message: 'Criterion not found' });
    res.json({ success: true, data: criterion });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch criterion' });
  }
};

export const createCriterion = async (req: Request, res: Response) => {
  try {
    const { number, title, description } = req.body;
    const criterion = await prisma.naacCriterion.create({
      data: { number: Number(number), title, description }
    });
    res.status(201).json({ success: true, data: criterion });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create criterion' });
  }
};

export const updateCriterion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data: any = { ...req.body };
    if (data.number) data.number = Number(data.number);
    
    const criterion = await prisma.naacCriterion.update({ where: { id }, data });
    res.json({ success: true, data: criterion });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update criterion' });
  }
};

export const getDocuments = async (req: Request, res: Response) => {
  try {
    const { type } = req.query;
    const filter: any = {};
    if (type) filter.type = type as NaacDocType;

    const documents = await prisma.naacDocument.findMany({
      where: filter,
      orderBy: { createdAt: 'desc' },
      include: { criterion: { select: { number: true, title: true } } }
    });
    res.json({ success: true, data: documents });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch documents' });
  }
};

export const createDocument = async (req: Request, res: Response) => {
  try {
    const { title, fileUrl, type, criterionId } = req.body;
    const document = await prisma.naacDocument.create({
      data: { 
        title, 
        fileUrl, 
        type: type as NaacDocType || 'OTHER',
        criterionId: criterionId || null
      }
    });
    res.status(201).json({ success: true, data: document });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create document' });
  }
};

export const deleteDocument = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.naacDocument.delete({ where: { id } });
    res.json({ success: true, message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete document' });
  }
};
