import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, GraduationCap, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary-900 text-white pt-20 pb-8 border-t-[8px] border-secondary relative overflow-hidden">
      {/* Royal Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-900 to-primary-800"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-700/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
      
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Col */}
          <div>
            <Link to="/" className="flex items-center space-x-4 mb-6 group">
              <div className="w-14 h-14 bg-gradient-to-br from-secondary to-yellow-500 rounded-full flex items-center justify-center text-primary-900 border-2 border-white/20 shadow-lg group-hover:scale-105 transition-transform">
                <span className="font-black text-2xl font-heading">G</span>
              </div>
              <div>
                <h2 className="font-heading font-black text-xl uppercase tracking-wider group-hover:text-secondary transition-colors">G.P. Porwal College</h2>
                <p className="text-[10px] text-primary-200 font-bold uppercase tracking-[0.3em] mt-1">Sindagi, Karnataka</p>
              </div>
            </Link>
            <p className="text-primary-50 text-sm leading-relaxed mb-8 font-medium">
              Moulding the rural youth for the modern world. A premier institution under S.P.V.V.S Trust providing quality education since 1972.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-8 h-8 rounded-full bg-primary-800 flex items-center justify-center hover:bg-secondary hover:text-primary-900 transition"><Facebook size={16} /></a>
              <a href="#" className="w-8 h-8 rounded-full bg-primary-800 flex items-center justify-center hover:bg-secondary hover:text-primary-900 transition"><Twitter size={16} /></a>
              <a href="#" className="w-8 h-8 rounded-full bg-primary-800 flex items-center justify-center hover:bg-secondary hover:text-primary-900 transition"><Instagram size={16} /></a>
              <a href="#" className="w-8 h-8 rounded-full bg-primary-800 flex items-center justify-center hover:bg-secondary hover:text-primary-900 transition"><Linkedin size={16} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-black mb-6 font-heading border-b-2 border-white/10 pb-3 text-white uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-4 text-sm text-primary-100 font-medium">
              <li><Link to="/about" className="hover:text-secondary transition flex items-center before:content-['›'] before:mr-2 before:text-secondary">About Institution</Link></li>
              <li><Link to="/departments" className="hover:text-secondary transition flex items-center before:content-['›'] before:mr-2 before:text-secondary">Academic Programs</Link></li>
              <li><Link to="/admissions" className="hover:text-secondary transition flex items-center before:content-['›'] before:mr-2 before:text-secondary">Admissions Open</Link></li>
              <li><Link to="/notices" className="hover:text-secondary transition flex items-center before:content-['›'] before:mr-2 before:text-secondary">Latest Notices</Link></li>
              <li><Link to="/naac" className="hover:text-secondary transition flex items-center before:content-['›'] before:mr-2 before:text-secondary">NAAC Documents</Link></li>
            </ul>
          </div>

          {/* Important Links */}
          <div>
            <h3 className="text-xl font-black mb-6 font-heading border-b-2 border-white/10 pb-3 text-white uppercase tracking-wider">Important Portals</h3>
            <ul className="space-y-4 text-sm text-primary-100 font-medium">
              <li><a href="https://rcub.ac.in" target="_blank" rel="noreferrer" className="hover:text-secondary transition flex items-center before:content-['›'] before:mr-2 before:text-secondary">Rani Channamma University</a></li>
              <li><a href="https://uucms.karnataka.gov.in" target="_blank" rel="noreferrer" className="hover:text-secondary transition flex items-center before:content-['›'] before:mr-2 before:text-secondary">UUCMS Portal</a></li>
              <li><a href="#" className="hover:text-secondary transition flex items-center before:content-['›'] before:mr-2 before:text-secondary">SSP Scholarship</a></li>
              <li><a href="#" className="hover:text-secondary transition flex items-center before:content-['›'] before:mr-2 before:text-secondary">National Academic Depository</a></li>
              <li><Link to="/admin/login" className="hover:text-secondary transition flex items-center before:content-['›'] before:mr-2 before:text-secondary">Staff Login</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-black mb-6 font-heading border-b-2 border-white/10 pb-3 text-white uppercase tracking-wider">Contact Us</h3>
            <ul className="space-y-5 text-sm text-primary-100 font-medium">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 text-secondary flex-shrink-0 mt-0.5" />
                <span>S.P.V.V.S's G.P. Porwal Arts, Commerce and V.V. Salimath Science College, Sindagi - 586128, Dist: Vijayapura, Karnataka</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-secondary flex-shrink-0" />
                <span>08488-221244</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-secondary flex-shrink-0" />
                <span>principal@gppvvs.ac.in</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-primary-800 pt-8 mt-8 text-center text-sm text-primary-200 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} G.P. Porwal College, Sindagi. All rights reserved.</p>
          <div className="mt-4 md:mt-0 space-x-4">
            <Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition">Terms of Use</Link>
            <Link to="/sitemap" className="hover:text-white transition">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
