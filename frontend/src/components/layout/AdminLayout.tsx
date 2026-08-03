import React from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, BookOpen, Bell, Calendar,
  Image as ImageIcon, FileText, Download, Award, Shield,
  Settings, LogOut, Menu, MessageSquareQuote, Mail, Home, Link as LinkIcon
} from 'lucide-react';

// Basic Auth Check (In a real app, use Context)
const isAuthenticated = () => {
  return !!localStorage.getItem('accessToken');
};

interface MenuGroup {
  label: string;
  items: { icon: any; label: string; path: string }[];
}

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const location = useLocation();

  if (!isAuthenticated() && location.pathname !== '/admin/login') {
    return <Navigate to="/admin/login" />;
  }

  // If it's the login page, don't show the sidebar
  if (location.pathname === '/admin/login') {
    return <Outlet />;
  }

  const menuGroups: MenuGroup[] = [
    {
      label: '',
      items: [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
      ],
    },
    {
      label: 'About',
      items: [
        { icon: FileText, label: 'About Us', path: '/admin/about' },
      ],
    },
    {
      label: 'Academics',
      items: [
        { icon: BookOpen, label: 'Departments', path: '/admin/departments' },
      ],
    },
    {
      label: 'Accreditation',
      items: [
        { icon: Award, label: 'NAAC', path: '/admin/naac' },
      ],
    },
    {
      label: 'Infrastructure',
      items: [
        { icon: Home, label: 'Facilities', path: '/admin/infrastructure' },
      ],
    },
    {
      label: 'Student Corner',
      items: [
        { icon: Users, label: 'Student Corner', path: '/admin/student-corner' },
      ],
    },
    {
      label: 'Admissions',
      items: [
        { icon: FileText, label: 'Admissions', path: '/admin/admissions' },
      ],
    },
    {
      label: 'Content',
      items: [
        { icon: FileText, label: 'All Pages', path: '/admin/pages' },
        { icon: Bell, label: 'Notices', path: '/admin/notices' },
        { icon: Calendar, label: 'Events', path: '/admin/events' },
        { icon: MessageSquareQuote, label: 'Testimonials', path: '/admin/testimonials' },
      ],
    },
    {
      label: 'Media',
      items: [
        { icon: ImageIcon, label: 'Gallery', path: '/admin/gallery' },
        { icon: Download, label: 'All Downloads', path: '/admin/downloads' },
      ],
    },
    {
      label: 'System',
      items: [
        { icon: Home, label: 'Homepage Settings', path: '/admin/homepage' },
        { icon: ImageIcon, label: 'Hero Slider', path: '/admin/hero-slides' },
        { icon: LinkIcon, label: 'Menus', path: '/admin/menus' },
        { icon: Mail, label: 'Inquiries', path: '/admin/inquiries' },
        { icon: Users, label: 'Faculty', path: '/admin/faculty' },
        { icon: Settings, label: 'Settings', path: '/admin/settings' },
      ],
    },
  ];

  // Flatten for header label lookup
  const allItems = menuGroups.flatMap(g => g.items);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/admin/login';
  };

  return (
    <div className="flex h-screen bg-surface-100 font-sans overflow-hidden">

      {/* Sidebar */}
      <aside className={`bg-primary-900 text-white transition-all duration-300 flex flex-col ${isSidebarOpen ? 'w-64' : 'w-20'} flex-shrink-0`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-primary-800">
          {isSidebarOpen && <span className="font-heading font-bold text-lg truncate">GPPVVS Admin</span>}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-primary-800 rounded">
            <Menu size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 scrollbar-thin">
          <nav className="space-y-1 px-2">
            {menuGroups.map((group, gi) => (
              <div key={gi}>
                {/* Section divider label */}
                {group.label && isSidebarOpen && (
                  <div className="px-3 pt-5 pb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary-400">
                      {group.label}
                    </span>
                  </div>
                )}
                {group.label && !isSidebarOpen && gi > 0 && (
                  <div className="mx-3 my-3 border-t border-primary-700" />
                )}

                {group.items.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center px-3 py-2.5 rounded-lg transition ${
                        isActive
                          ? 'bg-secondary text-primary-900 font-medium shadow-md'
                          : 'text-primary-100 hover:bg-primary-800 hover:text-white'
                      }`}
                      title={!isSidebarOpen ? item.label : ''}
                    >
                      <item.icon size={20} className="flex-shrink-0" />
                      {isSidebarOpen && <span className="ml-3 truncate text-sm">{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-primary-800">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition"
          >
            <LogOut size={20} className="flex-shrink-0" />
            {isSidebarOpen && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-surface-200 flex items-center justify-between px-6 flex-shrink-0 shadow-sm">
          <h2 className="font-heading font-semibold text-lg text-primary truncate">
            {allItems.find(i => i.path === location.pathname)?.label || 'Admin Panel'}
          </h2>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-text">Admin User</span>
            <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-surface-50">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default AdminLayout;
