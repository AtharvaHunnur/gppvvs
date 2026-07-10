import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { InquiryStatus } from '@prisma/client';

// Public endpoint to submit an inquiry
export const createInquiry = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    const inquiry = await prisma.inquiry.create({ 
      data: { name, email, phone, subject, message }
    });
    res.status(201).json({ success: true, data: inquiry, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Create inquiry error:', error);
    res.status(500).json({ success: false, message: 'Failed to send message' });
  }
};

// Admin endpoint to view inquiries
export const getInquiries = async (req: Request, res: Response) => {
  try {
    const inquiries = await prisma.inquiry.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: inquiries });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch inquiries' });
  }
};

// Admin endpoint to mark inquiry status
// Schema enum: NEW | READ | RESPONDED (not PENDING/RESOLVED)
export const updateInquiryStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const inquiry = await prisma.inquiry.update({ 
      where: { id }, 
      data: { status: status as InquiryStatus } 
    });
    res.json({ success: true, data: inquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update status' });
  }
};

// Admin endpoint to delete inquiry
export const deleteInquiry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.inquiry.delete({ where: { id } });
    res.json({ success: true, message: 'Inquiry deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete inquiry' });
  }
};
