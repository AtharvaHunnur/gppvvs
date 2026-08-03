import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { config } from './config';
import { errorHandler } from './middleware/errorHandler';

// Import routers
import authRoutes from './routes/auth.routes';
import pagesRoutes from './routes/pages.routes';
import departmentsRoutes from './routes/departments.routes';
import facultyRoutes from './routes/faculty.routes';
import coursesRoutes from './routes/courses.routes';
import noticesRoutes from './routes/notices.routes';
import homepageRoutes from './routes/homepage.routes';
import eventsRoutes from './routes/events.routes';
import galleryRoutes from './routes/gallery.routes';
import downloadsRoutes from './routes/downloads.routes';
import inquiriesRoutes from './routes/inquiries.routes';
import naacRoutes from './routes/naac.routes';
import committeesRoutes from './routes/committees.routes';
import testimonialsRoutes from './routes/testimonials.routes';
import settingsRoutes from './routes/settings.routes';
import uploadRoutes from './routes/upload.routes';
import menusRoutes from './routes/menus.routes';
import pageDocumentsRoutes from './routes/pageDocuments.routes';

const app = express();

// Security Middleware
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: config.frontendUrl, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later.'
});
app.use('/api', limiter);

// Static files (uploads)
app.use('/uploads', express.static(path.join(process.cwd(), config.uploadDir)));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/pages', pagesRoutes);
app.use('/api/departments', departmentsRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/notices', noticesRoutes);
app.use('/api/homepage', homepageRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/downloads', downloadsRoutes);
app.use('/api/inquiries', inquiriesRoutes);
app.use('/api/naac', naacRoutes);
app.use('/api/committees', committeesRoutes);
app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/menus', menusRoutes);
app.use('/api/page-documents', pageDocumentsRoutes);





// Health Check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Global Error Handler
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
