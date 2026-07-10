import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

export const getEvents = async (req: Request, res: Response) => {
  try {
    const { upcoming, page = '1', limit = '10' } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const filter: any = {};
    if (upcoming === 'true') {
      filter.date = { gte: new Date() };
    } else if (upcoming === 'false') {
      filter.date = { lt: new Date() };
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where: filter,
        orderBy: { date: upcoming === 'true' ? 'asc' : 'desc' },
        skip,
        take
      }),
      prisma.event.count({ where: filter })
    ]);

    res.json({
      success: true,
      data: events,
      pagination: {
        page: Number(page),
        limit: take,
        total,
        totalPages: Math.ceil(total / take)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch events' });
  }
};

export const getEventById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch event' });
  }
};

export const createEvent = async (req: Request, res: Response) => {
  try {
    // Schema uses 'venue' not 'location', and 'coverImage' not 'imageUrl'
    const { title, description, date, venue, location, coverImage, endDate } = req.body;
    const event = await prisma.event.create({
      data: {
        title,
        description: description || '',
        date: new Date(date),
        endDate: endDate ? new Date(endDate) : undefined,
        venue: venue || location || '',
        coverImage
      }
    });
    res.status(201).json({ success: true, data: event });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ success: false, message: 'Failed to create event' });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data: any = { ...req.body };
    if (data.date) data.date = new Date(data.date);
    if (data.endDate) data.endDate = new Date(data.endDate);
    // Map 'location' to 'venue' if needed
    if (data.location && !data.venue) {
      data.venue = data.location;
      delete data.location;
    }
    
    const event = await prisma.event.update({ where: { id }, data });
    res.json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update event' });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.event.delete({ where: { id } });
    res.json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete event' });
  }
};
