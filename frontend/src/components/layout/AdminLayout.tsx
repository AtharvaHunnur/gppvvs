import React from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, BookOpen, Bell, Calendar, 
  Image as ImageIcon, FileText, Download, Award, Shield,
  Settings, LogOut, Menu
} from 'lucide-react';

// Basic Auth Check (In a real app, use Context)
const isAuthenticated = () => {
  return !!localStorage.getItem('accessToken');
};

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

    const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Menu, label: 'Menus', path: '/admin/menus' },
    { icon: FileText, label: 'Pages', path: '/admin/pages' },
    { icon: BookOpen, label: 'Departments', path: '/admin/departments' },
    { icon: Users, label: 'Faculty', path: '/admin/faculty' },
    { icon: Bell, label: 'Notices', path: '/admin/notices' },
    { icon: Calendar, label: 'Events', path: '/admin/events' },
    { icon: ImageIcon, label: 'Gallery', path: '/admin/gallery' },
    { icon: Award, label: 'NAAC', path: '/admin/naac' },
    { icon: Shield, label: 'Committees', path: '/admin/committees' },
    { icon: Download, label: 'Downloads', path: '/admin/downloads' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

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
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-3 rounded-lg transition ${
                    isActive ? 'bg-secondary text-primary-900 font-medium shadow-md' : 'text-primary-100 hover:bg-primary-800 hover:text-white'
                  }`}
                  title={!isSidebarOpen ? item.label : ''}
                >
                  <item.icon size={20} className="flex-shrink-0" />
                  {isSidebarOpen && <span className="ml-3 truncate">{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-primary-800">
          <button 
            onClick={handleLogout}
            className={`flex items-center w-full px-3 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition`}
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
            {menuItems.find(i => i.path === location.pathname)?.label || 'Admin Panel'}
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
