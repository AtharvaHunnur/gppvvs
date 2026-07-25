import { Request, Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

cloudinary.config(true); // Automatically load config from CLOUDINARY_URL

const streamUpload = (buffer: Buffer, folder: string = 'gppvvs_uploads'): Promise<any> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'auto' },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

export const uploadSingle = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file provided' });
    }
    
    // Stream directly to Cloudinary from memory
    const result = await streamUpload(req.file.buffer);
    
    res.status(201).json({
      success: true,
      data: {
        url: result.secure_url,
        filename: req.file.originalname,
        mimetype: req.file.mimetype,
        size: result.bytes
      }
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({ success: false, message: 'File upload failed' });
  }
};

export const uploadMultiple = async (req: Request, res: Response) => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files provided' });
    }
    
    const uploadPromises = req.files.map(file => streamUpload(file.buffer));
    const results = await Promise.all(uploadPromises);
    
    const files = results.map((result, index) => ({
      url: result.secure_url,
      filename: (req.files as Express.Multer.File[])[index].originalname,
      mimetype: (req.files as Express.Multer.File[])[index].mimetype,
      size: result.bytes
    }));
    
    res.status(201).json({ success: true, data: files });
  } catch (error) {
    console.error('Cloudinary multiple upload error:', error);
    res.status(500).json({ success: false, message: 'Files upload failed' });
  }
};
