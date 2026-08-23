import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// Public Layouts
import PublicLayout from './components/layout/PublicLayout';
import AdminLayout from './components/layout/AdminLayout';

// Loading Spinner Component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-surface-50">
    <div className="flex flex-col items-center">
      <div className="w-12 h-12 border-4 border-surface-200 border-t-primary rounded-full animate-spin shadow-sm"></div>
      <p className="mt-4 text-sm font-semibold text-text-secondary tracking-widest uppercase animate-pulse">Loading...</p>
    </div>
  </div>
);

// Public Pages (Lazy Loaded)
const HomePage = lazy(() => import('./pages/public/HomePage'));
const AboutPage = lazy(() => import('./pages/public/AboutPage'));
const DepartmentsPage = lazy(() => import('./pages/public/DepartmentsPage'));
const DepartmentDetailPage = lazy(() => import('./pages/public/DepartmentDetailPage'));
const NaacPage = lazy(() => import('./pages/public/NaacPage'));
const NoticesPage = lazy(() => import('./pages/public/NoticesPage'));
const EventsPage = lazy(() => import('./pages/public/EventsPage'));
const FacultyPage = lazy(() => import('./pages/public/FacultyPage'));
const GalleryPage = lazy(() => import('./pages/public/GalleryPage'));
const AdmissionsPage = lazy(() => import('./pages/public/AdmissionsPage'));
const DownloadsPage = lazy(() => import('./pages/public/DownloadsPage'));
const ContactPage = lazy(() => import('./pages/public/ContactPage'));
const CommitteesPage = lazy(() => import('./pages/public/CommitteesPage'));
const InfrastructurePage = lazy(() => import('./pages/public/InfrastructurePage'));
const LibraryPage = lazy(() => import('./pages/public/LibraryPage'));
const StudentCornerPage = lazy(() => import('./pages/public/StudentCornerPage'));
const PageViewerPage = lazy(() => import('./pages/public/PageViewerPage'));

// Admin Pages (Lazy Loaded)
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'));
const DashboardPage = lazy(() => import('./pages/admin/DashboardPage'));
const AboutAdminPage = lazy(() => import('./pages/admin/AboutAdminPage'));
const InfrastructureAdminPage = lazy(() => import('./pages/admin/InfrastructureAdminPage'));
const StudentCornerAdminPage = lazy(() => import('./pages/admin/StudentCornerAdminPage'));
const AdmissionsAdminPage = lazy(() => import('./pages/admin/AdmissionsAdminPage'));
const DepartmentsAdminPage = lazy(() => import('./pages/admin/DepartmentsAdminPage'));
const NoticesAdminPage = lazy(() => import('./pages/admin/NoticesAdminPage'));
const EventsAdminPage = lazy(() => import('./pages/admin/EventsAdminPage'));
const FacultyAdminPage = lazy(() => import('./pages/admin/FacultyAdminPage'));
const GalleryAdminPage = lazy(() => import('./pages/admin/GalleryAdminPage'));
const DownloadsAdminPage = lazy(() => import('./pages/admin/DownloadsAdminPage'));
const InquiriesAdminPage = lazy(() => import('./pages/admin/InquiriesAdminPage'));
const NaacAdminPage = lazy(() => import('./pages/admin/NaacAdminPage'));
const CommitteesAdminPage = lazy(() => import('./pages/admin/CommitteesAdminPage'));
const TestimonialsAdminPage = lazy(() => import('./pages/admin/TestimonialsAdminPage'));
const HomepageAdminPage = lazy(() => import('./pages/admin/HomepageAdminPage'));
const SettingsAdminPage = lazy(() => import('./pages/admin/SettingsAdminPage'));
const HeroSlidesAdminPage = lazy(() => import('./pages/admin/HeroSlidesAdminPage'));

const App = () => {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/departments" element={<DepartmentsPage />} />
              <Route path="/departments/:slug" element={<DepartmentDetailPage />} />
              <Route path="/naac" element={<NaacPage />} />
              <Route path="/notices" element={<NoticesPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/faculty" element={<FacultyPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/admissions" element={<AdmissionsPage />} />
              <Route path="/student-corner" element={<StudentCornerPage />} />
              <Route path="/downloads" element={<DownloadsPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/committees" element={<CommitteesPage />} />
              <Route path="/infrastructure" element={<InfrastructurePage />} />
              <Route path="/page/library" element={<LibraryPage />} />
              <Route path="/page/:slug" element={<PageViewerPage />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<DashboardPage />} />
              <Route path="/admin/about" element={<AboutAdminPage />} />
              <Route path="/admin/infrastructure" element={<InfrastructureAdminPage />} />
              <Route path="/admin/student-corner" element={<StudentCornerAdminPage />} />
              <Route path="/admin/admissions" element={<AdmissionsAdminPage />} />
              <Route path="/admin/departments" element={<DepartmentsAdminPage />} />
              <Route path="/admin/notices" element={<NoticesAdminPage />} />
              <Route path="/admin/events" element={<EventsAdminPage />} />
              <Route path="/admin/faculty" element={<FacultyAdminPage />} />
              <Route path="/admin/gallery" element={<GalleryAdminPage />} />
              <Route path="/admin/downloads" element={<DownloadsAdminPage />} />
              <Route path="/admin/inquiries" element={<InquiriesAdminPage />} />
              <Route path="/admin/naac" element={<NaacAdminPage />} />
              <Route path="/admin/committees" element={<CommitteesAdminPage />} />
              <Route path="/admin/testimonials" element={<TestimonialsAdminPage />} />
              <Route path="/admin/homepage" element={<HomepageAdminPage />} />
              <Route path="/admin/hero-slides" element={<HeroSlidesAdminPage />} />
              <Route path="/admin/settings" element={<SettingsAdminPage />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </HelmetProvider>
  );
};

export default App;
