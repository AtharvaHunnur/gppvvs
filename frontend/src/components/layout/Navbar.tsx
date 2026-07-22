import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Mail, Phone, ChevronDown, ChevronRight, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiClient } from '../../api/client';

interface MenuItem {
  id: string;
  label: string;
  href: string;
  position: number;
  isVisible: boolean;
  children?: MenuItem[];
}

// Static top-level links that always show (Home, Gallery, Contact)
const staticLinks = [
  { name: 'Home', path: '/' },
  { name: 'Admission Open for 2026-27', path: '/admissions' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Contact', path: '/contact' },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dynamicMenus, setDynamicMenus] = useState<MenuItem[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpandedMenu, setMobileExpandedMenu] = useState<string | null>(null);
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
    setMobileExpandedMenu(null);
  }, [location.pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Fetch dynamic menus from API
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const res = await apiClient.get('/menus');
        setDynamicMenus(res.data.data || []);
      } catch (error) {
        // Fallback to hardcoded menus if API fails
        setDynamicMenus([
          { id: 'about', label: 'About', href: '#', position: 0, isVisible: true, children: [
            { id: 'a1', label: 'History', href: '/about', position: 0, isVisible: true },
            { id: 'a2', label: 'Vision & Mission', href: '/about', position: 1, isVisible: true },
            { id: 'a3', label: 'Trustees', href: '/page/trustees', position: 2, isVisible: true },
          ]},
          { id: 'acad', label: 'Academics', href: '#', position: 1, isVisible: true, children: [
            { id: 'ac1', label: 'Programmes', href: '/departments', position: 0, isVisible: true },
            { id: 'ac2', label: 'Departments', href: '/departments', position: 1, isVisible: true },
          ]},
          { id: 'naac', label: 'NAAC', href: '#', position: 2, isVisible: true, children: [
            { id: 'n1', label: 'NAAC 4th Cycle', href: '/naac', position: 0, isVisible: true },
          ]},
          { id: 'iqac', label: 'IQAC', href: '#', position: 3, isVisible: true, children: [
            { id: 'iq1', label: 'IQAC Reports', href: '/downloads?category=REPORT', position: 0, isVisible: true },
          ]},
          { id: 'infra', label: 'Infrastructure', href: '#', position: 4, isVisible: true, children: [
            { id: 'i1', label: 'Library', href: '/page/library', position: 0, isVisible: true },
          ]},
          { id: 'sc', label: 'Student Corner', href: '#', position: 5, isVisible: true, children: [
            { id: 's1', label: 'Downloads', href: '/downloads', position: 0, isVisible: true },
            { id: 's2', label: 'Committees & Cells', href: '/committees', position: 1, isVisible: true },
          ]},
          { id: 'exam', label: 'Examination', href: '#', position: 6, isVisible: true, children: [] },
        ]);
      }
    };
    fetchMenus();
  }, []);

  const isExternal = (href: string) => href.startsWith('http') || href.startsWith('/uploads');

  const renderLink = (href: string, children: React.ReactNode, className: string, onClick?: () => void) => {
    if (isExternal(href)) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={className} onClick={onClick}>
          {children}
        </a>
      );
    }
    return (
      <Link to={href} className={className} onClick={onClick}>
        {children}
      </Link>
    );
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-primary-900 text-white text-xs py-2.5 hidden lg:block border-b border-white/10">
        <div className="container-custom flex justify-between items-center">
          <div className="flex space-x-8">
            <span className="flex items-center hover:text-secondary transition-colors cursor-pointer"><Mail className="w-3.5 h-3.5 mr-2 text-secondary" /> principal@gppvvs.ac.in</span>
            <span className="flex items-center hover:text-secondary transition-colors cursor-pointer"><Phone className="w-3.5 h-3.5 mr-2 text-secondary" /> 08488-221244</span>
          </div>
          <div className="flex space-x-6 items-center">
            <span className="bg-secondary text-primary-900 px-3 py-1 rounded-sm font-bold shadow-sm tracking-wide">NAAC 'B++' Grade</span>
            <span className="text-primary-100">Affiliated to Rani Channamma University</span>
            <div className="w-px h-4 bg-white/20"></div>
            <Link to="/admin/login" className="font-bold hover:text-secondary transition-colors uppercase tracking-wider text-[10px]">Staff Login</Link>
          </div>
        </div>
      </div>

      {/* College Brand Header */}
      <div className="bg-white py-5 border-b border-surface-200 hidden lg:block bg-gradient-to-r from-white via-surface-50 to-white">
        <div className="container-custom flex justify-between items-center">
          {/* Left Side: Logos and Title */}
          <div className="flex items-center space-x-3 xl:space-x-5 flex-shrink-0">
            <img src="/images/logo.png" alt="GPPVVS College Logo" className="h-16 xl:h-20 w-auto object-contain mix-blend-multiply" />
            <img src="/images/swamiji2.png" alt="Late His Holiness Shri Channaveer Swamiji" className="h-16 xl:h-20 w-auto object-contain mix-blend-multiply" />
            <div className="border-l-2 border-secondary/30 pl-4 xl:pl-5 ml-1">
              <span className="text-[9px] xl:text-[11px] font-bold tracking-[0.2em] text-secondary uppercase block mb-0.5">S.P.V.V.S's Trust</span>
              <h1 className="font-heading font-black text-xl xl:text-2xl 2xl:text-3xl text-primary leading-tight uppercase tracking-tight drop-shadow-sm truncate max-w-[450px] xl:max-w-[700px] 2xl:max-w-none">
                G.P. Porwal Arts, Commerce & V.V. Salimath Science College
              </h1>
              <p className="text-[9px] xl:text-[11px] text-text-secondary font-semibold mt-1 tracking-wide">
                Sindagi - 586128, Dist: Vijayapura, Karnataka | Affiliated to Rani Channamma University, Belagavi
              </p>
            </div>
          </div>

          {/* Right Side: Swamiji Portraits */}
          <div className="flex items-center space-x-4 xl:space-x-6 flex-shrink-0 ml-4">
            <div className="flex flex-col items-center text-center group">
              <div className="w-14 h-14 xl:w-16 xl:h-16 rounded-full overflow-hidden border-2 border-secondary shadow-sm bg-surface-100 group-hover:scale-105 transition-transform duration-300">
                <img src="/images/swamiji1.png" alt="His Holiness Dr. Prabhu Swamiji" className="w-full h-full object-cover" />
              </div>
              <span className="text-[8px] xl:text-[9px] font-extrabold text-primary mt-1.5 leading-tight max-w-[90px] xl:max-w-[110px] block uppercase tracking-wider">
                Late His Holiness Shri Channaveer Swamiji
              </span>
            </div>
            <div className="flex flex-col items-center text-center group">
              <div className="w-14 h-14 xl:w-16 xl:h-16 rounded-full overflow-hidden border-2 border-secondary shadow-sm bg-surface-100 group-hover:scale-105 transition-transform duration-300">
                <img src="/images/swamiji3.jpg" alt="Swamiji" className="w-full h-full object-cover" />
              </div>
              <span className="text-[8px] xl:text-[9px] font-extrabold text-primary mt-1.5 leading-tight max-w-[90px] xl:max-w-[110px] block uppercase tracking-wider">
                His Holiness Dr. Prabhu Swamiji
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar with Dropdowns */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-lg py-1.5' : 'bg-white/95 backdrop-blur-md py-3 border-b border-surface-200'}`}>
        <div className="container-custom flex justify-between items-center" ref={dropdownRef}>
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img src="/images/logo.png" alt="GPPVVS College Logo" className="w-10 h-10 object-contain" />
            <div>
              <h1 className="font-heading font-bold text-lg leading-tight text-primary">G.P. Porwal College</h1>
              <p className="text-[10px] uppercase tracking-wider text-text-secondary font-semibold">Sindagi, Karnataka</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-0 xl:space-x-0.5">
            {/* Home link */}
            <Link
              to="/"
              className={`px-2 lg:px-2 xl:px-3 py-2 rounded-lg font-bold text-[12px] xl:text-[13px] transition-all duration-200 ${
                location.pathname === '/' ? 'text-primary bg-primary-50 shadow-sm' : 'text-text hover:text-primary hover:bg-surface-50'
              }`}
            >
              Home
            </Link>

            {/* Dynamic dropdown menus */}
            {dynamicMenus.map((menu) => (
              <div key={menu.id} className="relative">
                <button
                  className={`px-2 lg:px-2 xl:px-3 py-2 rounded-lg font-bold text-[12px] xl:text-[13px] whitespace-nowrap transition-all duration-200 flex items-center gap-1 ${
                    openDropdown === menu.id ? 'text-primary bg-primary-50 shadow-sm' : 'text-text hover:text-primary hover:bg-surface-50'
                  }`}
                  onClick={() => setOpenDropdown(openDropdown === menu.id ? null : menu.id)}
                  onMouseEnter={() => setOpenDropdown(menu.id)}
                >
                  {menu.label}
                  {menu.children && menu.children.length > 0 && (
                    <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === menu.id ? 'rotate-180' : ''}`} />
                  )}
                </button>

                {/* Dropdown Panel */}
                <AnimatePresence>
                  {openDropdown === menu.id && menu.children && menu.children.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-xl border border-surface-200 py-2 min-w-[240px] z-50"
                      onMouseLeave={() => setOpenDropdown(null)}
                    >
                      {menu.children.map((child) => (
                        <React.Fragment key={child.id}>
                          {child.children && child.children.length > 0 ? (
                            <div className="relative group/sub">
                              <button className="flex items-center justify-between w-full px-4 py-2.5 text-sm text-text hover:bg-primary-50 hover:text-primary transition-colors font-medium">
                                <span>{child.label}</span>
                                <ChevronRight size={14} className="text-text-secondary group-hover/sub:text-primary" />
                              </button>
                              <div className="absolute top-0 left-full ml-0.5 hidden group-hover/sub:block bg-white rounded-xl shadow-xl border border-surface-200 py-2 min-w-[260px] z-50">
                                {child.children.map((subchild) => (
                                  <React.Fragment key={subchild.id}>
                                    {renderLink(
                                      subchild.href,
                                      <span className="flex items-center justify-between w-full">
                                        <span>{subchild.label}</span>
                                        {isExternal(subchild.href) && <ExternalLink size={12} className="text-text-secondary/50 ml-2 shrink-0" />}
                                      </span>,
                                      'block px-4 py-2.5 text-sm text-text hover:bg-primary-50 hover:text-primary transition-colors font-medium',
                                      () => setOpenDropdown(null)
                                    )}
                                  </React.Fragment>
                                ))}
                              </div>
                            </div>
                          ) : (
                            renderLink(
                              child.href,
                              <span className="flex items-center justify-between w-full">
                                <span>{child.label}</span>
                                {isExternal(child.href) && <ExternalLink size={12} className="text-text-secondary/50 ml-2 shrink-0" />}
                              </span>,
                              'block px-4 py-2.5 text-sm text-text hover:bg-primary-50 hover:text-primary transition-colors font-medium',
                              () => setOpenDropdown(null)
                            )
                          )}
                        </React.Fragment>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}

            {/* Static links */}
            {staticLinks.filter(l => l.path !== '/').map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-2 lg:px-2 xl:px-3 py-2 rounded-lg font-bold text-[12px] xl:text-[13px] whitespace-nowrap transition-all duration-200 ${
                  location.pathname === link.path
                  ? 'text-primary bg-primary-50 shadow-sm'
                  : 'text-text hover:text-primary hover:bg-surface-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-text hover:text-primary p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b shadow-xl fixed top-[60px] left-0 right-0 z-40 overflow-y-auto max-h-[80vh]"
          >
            <div className="px-4 py-4 flex flex-col space-y-1">
              {/* Home */}
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-lg font-medium ${
                  location.pathname === '/' ? 'bg-primary-50 text-primary' : 'text-text hover:bg-surface-50'
                }`}
              >
                Home
              </Link>

              {/* Dynamic menus with expandable sub-items */}
              {dynamicMenus.map((menu) => (
                <div key={menu.id}>
                  <button
                    onClick={() => setMobileExpandedMenu(mobileExpandedMenu === menu.id ? null : menu.id)}
                    className="w-full px-4 py-3 rounded-lg font-medium text-text hover:bg-surface-50 flex items-center justify-between"
                  >
                    <span>{menu.label}</span>
                    {menu.children && menu.children.length > 0 && (
                      <ChevronRight size={16} className={`transition-transform duration-200 ${mobileExpandedMenu === menu.id ? 'rotate-90' : ''}`} />
                    )}
                  </button>

                  <AnimatePresence>
                    {mobileExpandedMenu === menu.id && menu.children && menu.children.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pl-4 pb-2 space-y-0.5">
                          {menu.children.map((child) => (
                            <React.Fragment key={child.id}>
                              {child.children && child.children.length > 0 ? (
                                <div className="space-y-0.5 mt-2 mb-2">
                                  <span className="block px-4 py-1.5 text-sm font-bold text-text-secondary uppercase tracking-wider">
                                    {child.label}
                                  </span>
                                  <div className="pl-4 border-l-2 border-surface-200 ml-4 space-y-0.5">
                                    {child.children.map((subchild) => (
                                      <React.Fragment key={subchild.id}>
                                        {renderLink(
                                          subchild.href,
                                          <span className="flex items-center">
                                            <span className="w-1 h-1 rounded-full bg-primary/30 mr-2 shrink-0"></span>
                                            <span>{subchild.label}</span>
                                            {isExternal(subchild.href) && <ExternalLink size={12} className="text-text-secondary/50 ml-2 shrink-0" />}
                                          </span>,
                                          'block px-4 py-2 text-sm text-text-secondary hover:text-primary hover:bg-primary-50 rounded-lg transition-colors',
                                          () => setIsMobileMenuOpen(false)
                                        )}
                                      </React.Fragment>
                                    ))}
                                  </div>
                                </div>
                              ) : (
                                renderLink(
                                  child.href,
                                  <span className="flex items-center">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary/30 mr-3 shrink-0"></span>
                                    <span>{child.label}</span>
                                    {isExternal(child.href) && <ExternalLink size={12} className="text-text-secondary/50 ml-2 shrink-0" />}
                                  </span>,
                                  'block px-4 py-2.5 text-sm text-text-secondary hover:text-primary hover:bg-primary-50 rounded-lg transition-colors',
                                  () => setIsMobileMenuOpen(false)
                                )
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              {/* Static links */}
              {staticLinks.filter(l => l.path !== '/').map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg font-medium ${
                    location.pathname === link.path ? 'bg-primary-50 text-primary' : 'text-text hover:bg-surface-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
