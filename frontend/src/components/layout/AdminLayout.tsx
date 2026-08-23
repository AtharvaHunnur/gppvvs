import React from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, BookOpen, Bell, Calendar,
  Image as ImageIcon, FileText, Download, Award, Shield,
  Settings, LogOut, Menu, MessageSquareQuote, Mail, Home, Link as LinkIcon, X
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const location = useLocation();

  if (!isAuthenticated() && location.pathname !== '/admin/login') {
    return <Navigate to="/admin/login" />;
  }

  // If it's the login page, don't show the sidebar
  if (location.pathname === '/admin/login') {
    return <Outlet />;
  }

  // Close mobile menu on route change
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

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
    <div className="flex h-screen bg-surface-50 font-sans overflow-hidden">

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden transition-opacity backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:static top-0 left-0 bottom-0 z-50 bg-primary-900 text-white transition-transform duration-300 ease-in-out flex flex-col flex-shrink-0 shadow-2xl lg:shadow-none
          ${isSidebarOpen ? 'w-64' : 'w-20'} 
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/10 bg-primary-950">
          {(isSidebarOpen || isMobileMenuOpen) && (
            <span className="font-heading font-bold text-lg truncate">GPPVVS Admin</span>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className="hidden lg:flex p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white"
          >
            <Menu size={20} />
          </button>
          <button 
            onClick={() => setIsMobileMenuOpen(false)} 
            className="lg:hidden p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 scrollbar-thin">
          <nav className="space-y-1 px-3">
            {menuGroups.map((group, gi) => (
              <div key={gi}>
                {/* Section divider label */}
                {group.label && (isSidebarOpen || isMobileMenuOpen) && (
                  <div className="px-3 pt-5 pb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary-300 opacity-80">
                      {group.label}
                    </span>
                  </div>
                )}
                {group.label && !isSidebarOpen && !isMobileMenuOpen && gi > 0 && (
                  <div className="mx-4 my-3 border-t border-white/10" />
                )}

                {group.items.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 mb-1 ${
                        isActive
                          ? 'bg-secondary text-primary-900 font-bold shadow-sm'
                          : 'text-primary-100 hover:bg-white/10 hover:text-white font-medium'
                      }`}
                      title={!isSidebarOpen && !isMobileMenuOpen ? item.label : ''}
                    >
                      <item.icon size={20} className={`flex-shrink-0 ${isActive ? 'text-primary-900' : 'text-primary-300'}`} />
                      {(isSidebarOpen || isMobileMenuOpen) && (
                        <span className="ml-3 truncate text-sm">{item.label}</span>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-white/10 bg-primary-950">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center lg:justify-start w-full px-3 py-3 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-xl transition-all font-bold"
          >
            <LogOut size={20} className="flex-shrink-0" />
            {(isSidebarOpen || isMobileMenuOpen) && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden w-full relative">
        {/* Header */}
        <header className="h-16 bg-white border-b border-surface-200 flex items-center justify-between px-4 lg:px-8 flex-shrink-0 shadow-sm z-10 relative">
          <div className="flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(true)} 
              className="lg:hidden p-2 mr-3 text-text-secondary hover:text-primary hover:bg-surface-100 rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>
            <h2 className="font-heading font-black text-lg text-primary truncate tracking-tight">
              {allItems.find(i => i.path === location.pathname)?.label || 'Admin Panel'}
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-bold text-text hidden sm:block">Admin User</span>
            <div className="w-9 h-9 bg-primary text-white rounded-full flex items-center justify-center font-bold shadow-sm border-2 border-primary-100">
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-surface-50 w-full relative z-0">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

    </div>
  );
};

export default AdminLayout;
