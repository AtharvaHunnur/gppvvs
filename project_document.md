# GPPVVS Project Documentation

## 1. Project Overview
This project is a full-stack web application built for an educational institution (presumably GPPVVS). It features a comprehensive public-facing website and a secure administrative dashboard for managing content such as notices, events, academic departments, faculty profiles, and NAAC (National Assessment and Accreditation Council) documents.

## 2. Technology Stack

### Backend
*   **Runtime Environment:** Node.js
*   **Framework:** Express.js
*   **Language:** TypeScript
*   **Database:** PostgreSQL
*   **ORM (Object-Relational Mapping):** Prisma
*   **Authentication & Security:** 
    *   JSON Web Tokens (JWT) for session management
    *   `bcryptjs` for password hashing
    *   `helmet` for HTTP header security
    *   `cors` for Cross-Origin Resource Sharing
    *   `express-rate-limit` for rate limiting API requests
*   **Data Validation:** Zod
*   **File Uploads:** Multer
*   **Logging:** Morgan

### Frontend
*   **Framework:** React 18
*   **Build Tool:** Vite
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS (with PostCSS), `clsx`, `tailwind-merge`
*   **Routing:** React Router v6 (`react-router-dom`)
*   **UI Components:** Radix UI primitives (`@radix-ui/react-*`), Framer Motion (animations), Lucide React (icons)
*   **Data Fetching:** Axios
*   **SEO/Meta Tags:** React Helmet Async (`react-helmet-async`)

---

## 3. Project Structure

The repository is structured as a monorepo with two main directories:

*   **`/backend`**: Contains the Express.js server, Prisma database schema, API routes, controllers, and middleware.
*   **`/frontend`**: Contains the React application, organized into components, pages (public and admin), and API integration utilities.

---

## 4. Database Schema (Models)

The PostgreSQL database is managed via Prisma and includes the following key models:

*   **Users & Auth:** `User` (Roles: SUPER_ADMIN, ADMIN, EDITOR)
*   **Content Management:** `Page`, `Menu`, `Setting`, `HomepageSection`, `QuickLink`
*   **Academics:** `Department`, `Faculty`, `Course`
*   **Communications:** `Notice`, `Event`, `Testimonial`, `Inquiry`
*   **Media & Resources:** `Media`, `GalleryAlbum`, `GalleryImage`, `Download`
*   **Accreditation:** `NaacCriterion`, `NaacDocument`
*   **Institution:** `Committee`, `Statistic`

---

## 5. API Endpoints (Backend Routes)

The Express backend exposes RESTful APIs under the `/api` prefix:

*   `/api/auth` - Authentication (login, registration, token verification)
*   `/api/pages` - Dynamic page content management
*   `/api/departments` - Academic departments and related data
*   `/api/faculty` - Faculty member profiles
*   `/api/courses` - Course structures and syllabus links
*   `/api/notices` - Pinned and general announcements
*   `/api/events` - Upcoming and past events
*   `/api/gallery` - Image gallery albums and photos
*   `/api/downloads` - Downloadable forms, circulars, and syllabi
*   `/api/inquiries` - Contact form submissions
*   `/api/naac` - NAAC criteria and documentation handling
*   `/api/committees` - Institutional committees and members
*   `/api/testimonials` - Reviews/testimonials
*   `/api/settings` - Global application settings
*   `/api/homepage` - Dynamic homepage section configuration
*   `/api/menus` - Dynamic navigation menus
*   `/api/upload` - General file and image upload handling

---

## 6. Frontend Application

The frontend is divided into two distinct layouts: Public and Admin.

### Public Pages (Accessible to all users)
*   `/` - Home Page
*   `/about` - About the Institution
*   `/departments` & `/departments/:slug` - Department listings and details
*   `/naac` - NAAC compliance and documents
*   `/notices` - Public notices board
*   `/events` - Events calendar/listing
*   `/faculty` - Faculty directory
*   `/gallery` - Photo galleries
*   `/admissions` - Admission information
*   `/downloads` - Public downloads section
*   `/contact` - Contact form and details
*   `/committees` - List of active committees
*   `/page/:slug` - Dynamic custom pages

### Admin Pages (Requires Authentication)
*   `/admin/login` - Administrator login portal
*   `/admin` - Dashboard overview
*   `/admin/pages` - Manage dynamic pages
*   `/admin/departments` - Manage departments
*   `/admin/notices` - Publish/edit notices
*   `/admin/events` - Schedule/edit events
*   `/admin/faculty` - Manage faculty profiles
*   `/admin/gallery` - Manage albums and uploads
*   `/admin/downloads` - Upload/manage documents
*   `/admin/inquiries` - View contact submissions
*   `/admin/naac` - Manage NAAC criteria and docs
*   `/admin/committees` - Manage committees
*   `/admin/testimonials` - Manage testimonials
*   `/admin/homepage` - Configure homepage layout
*   `/admin/settings` - Edit global settings
*   `/admin/menus` - Configure navigation menus

---

## 7. Scripts & Commands

### Backend (`/backend/package.json`)
*   `npm run dev`: Starts the development server using `tsx`.
*   `npm run build`: Compiles TypeScript to JavaScript.
*   `npm run db:generate`: Generates Prisma client.
*   `npm run db:migrate`: Applies database migrations.
*   `npm run db:push`: Pushes schema state to the database without migrations.
*   `npm run db:seed`: Seeds the database with initial data.
*   `npm run db:studio`: Opens Prisma Studio for database management.

### Frontend (`/frontend/package.json`)
*   `npm run dev`: Starts the Vite development server.
*   `npm run build`: Compiles TypeScript and builds for production.
*   `npm run lint`: Runs ESLint for code formatting/errors.
*   `npm run preview`: Previews the production build locally.
