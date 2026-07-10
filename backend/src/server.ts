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
// We will add other routes here as we create them

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
app.use('/api/departments', require('./routes/departments.routes').default);
app.use('/api/faculty', require('./routes/faculty.routes').default);
app.use('/api/courses', require('./routes/courses.routes').default);
app.use('/api/notices', require('./routes/notices.routes').default);
app.use('/api/homepage', require('./routes/homepage.routes').default);
app.use('/api/events', require('./routes/events.routes').default);
app.use('/api/gallery', require('./routes/gallery.routes').default);
app.use('/api/downloads', require('./routes/downloads.routes').default);
app.use('/api/inquiries', require('./routes/inquiries.routes').default);
app.use('/api/naac', require('./routes/naac.routes').default);
app.use('/api/committees', require('./routes/committees.routes').default);
app.use('/api/testimonials', require('./routes/testimonials.routes').default);
app.use('/api/settings', require('./routes/settings.routes').default);
app.use('/api/upload', require('./routes/upload.routes').default);
app.use('/api/menus', require('./routes/menus.routes').default);





// Health Check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Global Error Handler
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
