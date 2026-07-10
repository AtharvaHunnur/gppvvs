import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// Public Pages
import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import DepartmentsPage from './pages/public/DepartmentsPage';
import DepartmentDetailPage from './pages/public/DepartmentDetailPage';
import NaacPage from './pages/public/NaacPage';
import NoticesPage from './pages/public/NoticesPage';
import EventsPage from './pages/public/EventsPage';
import FacultyPage from './pages/public/FacultyPage';
import GalleryPage from './pages/public/GalleryPage';
import AdmissionsPage from './pages/public/AdmissionsPage';
import DownloadsPage from './pages/public/DownloadsPage';
import ContactPage from './pages/public/ContactPage';
import CommitteesPage from './pages/public/CommitteesPage';
import InfrastructurePage from './pages/public/InfrastructurePage';
import PageViewerPage from './pages/public/PageViewerPage';
import PublicLayout from './components/layout/PublicLayout';

// Admin Pages
import AdminLayout from './components/layout/AdminLayout';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import DepartmentsAdminPage from './pages/admin/DepartmentsAdminPage';
import NoticesAdminPage from './pages/admin/NoticesAdminPage';
import EventsAdminPage from './pages/admin/EventsAdminPage';
import FacultyAdminPage from './pages/admin/FacultyAdminPage';
import GalleryAdminPage from './pages/admin/GalleryAdminPage';
import DownloadsAdminPage from './pages/admin/DownloadsAdminPage';
import InquiriesAdminPage from './pages/admin/InquiriesAdminPage';
import NaacAdminPage from './pages/admin/NaacAdminPage';
import CommitteesAdminPage from './pages/admin/CommitteesAdminPage';
import TestimonialsAdminPage from './pages/admin/TestimonialsAdminPage';
import HomepageAdminPage from './pages/admin/HomepageAdminPage';
import SettingsAdminPage from './pages/admin/SettingsAdminPage';
import PagesAdminPage from './pages/admin/PagesAdminPage';
import MenusAdminPage from './pages/admin/MenusAdminPage';

const App = () => {
  return (
    <HelmetProvider>
      <BrowserRouter>
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
            <Route path="/downloads" element={<DownloadsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/committees" element={<CommitteesPage />} />
            <Route path="/infrastructure" element={<InfrastructurePage />} />
            <Route path="/page/:slug" element={<PageViewerPage />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<DashboardPage />} />
            <Route path="/admin/pages" element={<PagesAdminPage />} />
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
            <Route path="/admin/settings" element={<SettingsAdminPage />} />
            <Route path="/admin/menus" element={<MenusAdminPage />} />
            {/* Other admin routes will go here */}
          </Route>
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
};

export default App;
