import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

export const getCommittees = async (req: Request, res: Response) => {
  try {
    const committees = await prisma.committee.findMany({
      orderBy: { position: 'asc' }
    });
    res.json({ success: true, data: committees });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch committees' });
  }
};

export const getCommitteeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const committee = await prisma.committee.findUnique({
      where: { id }
    });
    if (!committee) return res.status(404).json({ success: false, message: 'Committee not found' });
    res.json({ success: true, data: committee });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch committee' });
  }
};

export const createCommittee = async (req: Request, res: Response) => {
  try {
    const committee = await prisma.committee.create({
      data: req.body
    });
    res.status(201).json({ success: true, data: committee });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create committee' });
  }
};

export const updateCommittee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const committee = await prisma.committee.update({ 
      where: { id }, 
      data: req.body 
    });
    res.json({ success: true, data: committee });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update committee' });
  }
};

export const deleteCommittee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.committee.delete({ where: { id } });
    res.json({ success: true, message: 'Committee deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete committee' });
  }
};

// Committee Members
export const addCommitteeMember = async (req: Request, res: Response) => {
  try {
    const { committeeId } = req.params;
    const committee = await prisma.committee.findUnique({ where: { id: committeeId } });
    if (!committee) return res.status(404).json({ success: false, message: 'Committee not found' });
    
    const members = (committee.members as any[]) || [];
    const newMember = { ...req.body, id: Date.now().toString() };
    members.push(newMember);
    // Sort members by position (if they have one)
    members.sort((a, b) => (a.position || 0) - (b.position || 0));
    
    await prisma.committee.update({
      where: { id: committeeId },
      data: { members }
    });
    
    res.status(201).json({ success: true, data: newMember });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add committee member' });
  }
};

export const deleteCommitteeMember = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const committees = await prisma.committee.findMany();
    
    for (const committee of committees) {
      const members = (committee.members as any[]) || [];
      const index = members.findIndex(m => m.id === id);
      if (index !== -1) {
        members.splice(index, 1);
        await prisma.committee.update({
          where: { id: committee.id },
          data: { members }
        });
        break;
      }
    }
    
    res.json({ success: true, message: 'Member removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to remove member' });
  }
};
