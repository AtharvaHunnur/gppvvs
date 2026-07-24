import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/page-documents/:section/:entityId
export const getDocuments = async (req: Request, res: Response) => {
  try {
    const { section, entityId } = req.params;
    const documents = await prisma.pageDocument.findMany({
      where: { section, entityId },
      orderBy: { position: 'asc' },
    });
    res.json({ success: true, data: documents });
  } catch (error) {
    console.error('Failed to fetch page documents:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch documents' });
  }
};

// POST /api/page-documents
export const createDocument = async (req: Request, res: Response) => {
  try {
    const { title, description, fileUrl, section, entityId, position } = req.body;

    if (!title || !fileUrl || !section || !entityId) {
      return res.status(400).json({
        success: false,
        message: 'Title, fileUrl, section, and entityId are required',
      });
    }

    const document = await prisma.pageDocument.create({
      data: {
        title,
        description: description || null,
        fileUrl,
        section,
        entityId,
        position: position ? Number(position) : 0,
      },
    });

    res.status(201).json({ success: true, data: document });
  } catch (error) {
    console.error('Failed to create page document:', error);
    res.status(500).json({ success: false, message: 'Failed to create document' });
  }
};

// PUT /api/page-documents/:id
export const updateDocument = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, fileUrl, position } = req.body;

    const document = await prisma.pageDocument.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(fileUrl !== undefined && { fileUrl }),
        ...(position !== undefined && { position: Number(position) }),
      },
    });

    res.json({ success: true, data: document });
  } catch (error) {
    console.error('Failed to update page document:', error);
    res.status(500).json({ success: false, message: 'Failed to update document' });
  }
};

// DELETE /api/page-documents/:id
export const deleteDocument = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.pageDocument.delete({ where: { id } });
    res.json({ success: true, message: 'Document deleted' });
  } catch (error) {
    console.error('Failed to delete page document:', error);
    res.status(500).json({ success: false, message: 'Failed to delete document' });
  }
};
