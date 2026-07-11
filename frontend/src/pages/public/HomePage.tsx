import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { apiClient } from '../../api/client';
import { Bell, Calendar, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import AnnouncementTicker from '../../components/AnnouncementTicker';
import { getImageUrl } from '../../utils/url';

const HomePage = () => {
  const [notices, setNotices] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [noticesRes, eventsRes] = await Promise.all([
          apiClient.get('/notices?limit=4'),
          apiClient.get('/events?limit=3')
        ]);
        setNotices(noticesRes.data.data || []);
        setEvents(eventsRes.data.data || []);
      } catch (error) {
        console.error('Error fetching data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <Helmet>
        <title>GPPVVS College | Moulding the Rural Youth for the Modern World</title>
      </Helmet>
      
      <section className="relative bg-primary-900 text-white py-32 md:py-48 text-center overflow-hidden border-b-8 border-secondary">
        {/* Subtle patterned background or gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary to-primary-800 opacity-95"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        
        <div className="container-custom relative z-10">
          <div className="inline-block mb-6 px-5 py-2 rounded-full border border-secondary/50 bg-secondary/10 text-secondary font-bold tracking-[0.2em] uppercase text-xs md:text-sm shadow-sm backdrop-blur-sm">
            Est. 1972 • 50+ Years of Excellence
          </div>
          <h1 className="text-5xl md:text-7xl font-black font-heading mb-6 leading-tight drop-shadow-2xl tracking-tight">
            Moulding the Rural Youth <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-50 via-secondary to-yellow-500">
              for the Modern World
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-primary-50 max-w-4xl mx-auto mb-12 font-medium tracking-wide drop-shadow-md leading-relaxed">
            A premium institutional platform for G.P. Porwal Arts, Commerce & V.V. Salimath Science College.
          </p>
          <Link to="/departments" className="bg-gradient-to-r from-secondary to-yellow-500 text-primary-900 px-10 py-5 rounded-full font-black text-lg hover:shadow-[0_0_40px_rgba(212,160,23,0.5)] hover:scale-105 transition-all duration-300 shadow-xl inline-flex items-center uppercase tracking-widest">
            Explore Programs <ChevronRight size={24} className="ml-3" />
          </Link>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="bg-white py-10 md:py-14 border border-surface-200 shadow-2xl relative z-20 -mt-16 mx-4 md:mx-auto max-w-6xl rounded-3xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 px-4 md:px-12 text-center divide-x divide-surface-200">
          <div>
            <div className="text-4xl md:text-5xl font-black text-primary mb-2 tracking-tight">50+</div>
            <div className="text-xs md:text-sm font-bold text-text-secondary uppercase tracking-widest">Years Legacy</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-black text-primary mb-2 tracking-tight">'B'</div>
            <div className="text-xs md:text-sm font-bold text-text-secondary uppercase tracking-widest">NAAC Grade</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-black text-primary mb-2 tracking-tight">4</div>
            <div className="text-xs md:text-sm font-bold text-text-secondary uppercase tracking-widest">UG Programs</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-black text-primary mb-2 tracking-tight">10k+</div>
            <div className="text-xs md:text-sm font-bold text-text-secondary uppercase tracking-widest">Alumni</div>
          </div>
        </div>
      </section>

      <div className="mt-12">
        <AnnouncementTicker />
      </div>

      {/* Information Cards (About, Quick Links, Circulars) */}
      <section className="py-16 mt-8">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-surface-200 flex flex-col items-start hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-full bg-primary-50 text-primary flex items-center justify-center mb-6">
                <i className="fas fa-university text-xl"></i>
              </div>
              <h3 className="text-xl font-bold text-primary mb-4 font-heading border-b-2 border-secondary pb-2 inline-block">About GPPVVS</h3>
              <p className="text-text-secondary leading-relaxed mb-6 flex-grow">
                Sri Padmaraj Vidya Vardhaka Samstha, Sarangamath, Sindagi, is a prestigious institution established with the blessings of His Holiness, late Shri Channaveer Swamiji of Sarangamath in 1969.
              </p>
              <Link to="/about" className="bg-primary hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-bold transition-colors">Read More</Link>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg border border-surface-200 flex flex-col items-start hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-full bg-secondary/10 text-secondary flex items-center justify-center mb-6">
                <i className="fas fa-link text-xl"></i>
              </div>
              <h3 className="text-xl font-bold text-primary mb-4 font-heading border-b-2 border-secondary pb-2 inline-block">Quick Links</h3>
              <ul className="space-y-3 w-full text-text-secondary font-medium">
                <li><a href="http://library.nextshala.com/opac.html" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors flex items-center"><ChevronRight size={16} className="text-secondary mr-2" /> Web OPAC</a></li>
                <li><a href="https://rcub.ac.in/" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors flex items-center"><ChevronRight size={16} className="text-secondary mr-2" /> RCU Belagavi</a></li>
                <li><a href="https://librarian515.wixsite.com/gppvvslibrary" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors flex items-center"><ChevronRight size={16} className="text-secondary mr-2" /> Digital Library</a></li>
                <li><a href="https://nlist.inflibnet.ac.in/" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors flex items-center"><ChevronRight size={16} className="text-secondary mr-2" /> N-List</a></li>
                <li><a href="https://ssp.postmatric.karnataka.gov.in/" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors flex items-center"><ChevronRight size={16} className="text-secondary mr-2" /> SSP Portal</a></li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg border border-surface-200 flex flex-col items-start hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-full bg-primary-50 text-primary flex items-center justify-center mb-6">
                <i className="fas fa-file-alt text-xl"></i>
              </div>
              <h3 className="text-xl font-bold text-primary mb-4 font-heading border-b-2 border-secondary pb-2 inline-block">Circulars</h3>
              <ul className="space-y-3 w-full text-text-secondary font-medium mb-6 flex-grow">
                <li><a href="https://rcub.ac.in/English%20website/examsec.html" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors flex items-center"><ChevronRight size={16} className="text-secondary mr-2" /> Exam Notifications</a></li>
                <li><a href="https://rcub.ac.in/English%20website/index.html" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors flex items-center"><ChevronRight size={16} className="text-secondary mr-2" /> Academic Circulars</a></li>
                <li><a href="https://rcub.ac.in/English%20website/admisn-notification.html" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors flex items-center"><ChevronRight size={16} className="text-secondary mr-2" /> Admission Notifications</a></li>
                <li><a href="https://rcub.ac.in/English%20website/nepsyllabus.html" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors flex items-center"><ChevronRight size={16} className="text-secondary mr-2" /> NEP Syllabus</a></li>
              </ul>
              <a href="https://rcub.ac.in/English%20website/index.html" target="_blank" rel="noreferrer" className="bg-primary hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-bold transition-colors">Visit Website</a>
            </div>
          </div>
        </div>
      </section>

      {/* Notices and Events Section */}
      <section className="py-20 bg-surface-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Notice Board */}
            <div className="bg-white rounded-3xl shadow-sm border border-surface-200 overflow-hidden flex flex-col h-full hover:shadow-xl transition-all duration-300">
              <div className="px-8 py-6 bg-primary border-b border-primary-100 flex items-center justify-between text-white">
                <div className="flex items-center font-bold text-lg uppercase tracking-wider">
                  <Bell size={24} className="mr-3" /> Notice Board
                </div>
                <Link to="/notices" className="text-sm font-semibold hover:text-secondary flex items-center transition-colors">
                  View All <ChevronRight size={16} className="ml-1" />
                </Link>
              </div>
              <div className="divide-y divide-surface-200 flex-grow flex flex-col">
                {loading ? (
                  <div className="p-8 text-center text-text-secondary my-auto">Loading notices...</div>
                ) : notices.length > 0 ? (
                  notices.map((notice) => (
                    <Link to="/notices" key={notice.id} className="p-6 hover:bg-surface-50 transition-colors flex gap-4 group block">
                      <div className="flex-shrink-0 text-center border border-surface-200 bg-surface-50 text-text-secondary rounded-lg p-2 w-16 group-hover:border-primary group-hover:bg-primary-50 group-hover:text-primary transition-colors">
                        <div className="text-xl font-black leading-none">{format(new Date(notice.createdAt), 'dd')}</div>
                        <div className="text-[10px] font-bold uppercase mt-1">{format(new Date(notice.createdAt), 'MMM')}</div>
                      </div>
                      <div>
                        <span className="inline-block px-2 py-0.5 bg-surface-200 text-text-secondary text-[10px] font-bold rounded mb-1">
                          {notice.category}
                        </span>
                        <h4 className="text-base font-bold text-text group-hover:text-primary transition-colors line-clamp-2">
                          {notice.title}
                        </h4>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="p-8 text-center text-text-secondary my-auto">No recent notices found.</div>
                )}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-3xl shadow-sm border border-surface-200 overflow-hidden flex flex-col h-full hover:shadow-xl transition-all duration-300">
              <div className="px-8 py-6 bg-secondary border-b border-secondary-200 flex items-center justify-between text-primary-900">
                <div className="flex items-center font-bold text-lg uppercase tracking-wider">
                  <Calendar size={24} className="mr-3 text-primary" /> Upcoming Events
                </div>
                <Link to="/events" className="text-sm font-semibold hover:text-primary flex items-center transition-colors">
                  View All <ChevronRight size={16} className="ml-1" />
                </Link>
              </div>
              <div className="flex-grow p-6 flex flex-col justify-center space-y-6">
                {loading ? (
                  <div className="text-center text-text-secondary">Loading events...</div>
                ) : events.length > 0 ? (
                  events.map((event) => (
                    <Link to="/events" key={event.id} className="flex gap-5 group items-center">
                       <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden border border-surface-200 shadow-sm relative">
                         {event.coverImage ? (
                           <img src={getImageUrl(event.coverImage)} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                         ) : (
                           <div className="w-full h-full bg-surface-100 flex flex-col items-center justify-center text-text-secondary">
                             <div className="text-2xl font-black text-primary leading-none">{format(new Date(event.date), 'dd')}</div>
                             <div className="text-[10px] font-bold uppercase mt-1">{format(new Date(event.date), 'MMM yyyy')}</div>
                           </div>
                         )}
                       </div>
                       <div className="flex flex-col justify-center flex-grow">
                         <div className="text-xs text-secondary font-bold uppercase mb-1 flex items-center">
                           <Calendar size={12} className="mr-1 text-primary" /> {format(new Date(event.date), 'MMMM dd, yyyy')}
                         </div>
                         <h4 className="text-lg font-bold text-text group-hover:text-primary transition-colors line-clamp-2 mb-1">
                           {event.title}
                         </h4>
                         {event.venue && <p className="text-sm text-text-secondary line-clamp-1">{event.venue}</p>}
                       </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-center text-text-secondary">No upcoming events scheduled.</div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="py-24 bg-surface-50 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="container-custom relative z-10">
          <div className="text-center mb-20">
            <span className="text-secondary font-bold tracking-widest uppercase text-sm mb-3 block">Our Programs</span>
            <h2 className="text-4xl md:text-5xl font-black text-primary font-heading mb-6">Academic Excellence</h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-secondary to-yellow-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {['Arts (B.A.)', 'Commerce (B.Com)', 'Science (B.Sc)', 'Computer Applications (BCA)'].map((program, i) => (
              <Link to="/departments" key={i} className="bg-white p-10 rounded-[2rem] border border-surface-200 shadow-lg hover:shadow-2xl transition-all duration-500 group hover:-translate-y-3 flex flex-col items-center text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-secondary to-yellow-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                <div className="w-24 h-24 rounded-3xl bg-primary-50 flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white text-primary transition-colors duration-500 rotate-3 group-hover:rotate-0">
                  <span className="font-black text-3xl font-heading">{program.split(' ')[0][0]}</span>
                </div>
                <h3 className="text-2xl font-bold text-text mb-4 font-heading group-hover:text-primary transition-colors">{program}</h3>
                <p className="text-text-secondary text-sm leading-relaxed mb-8 flex-grow">Experience our comprehensive curriculum designed with modern pedagogical approaches to prepare you for the future.</p>
                <span className="mt-auto text-primary font-bold text-sm flex items-center group-hover:text-secondary transition-colors uppercase tracking-widest">
                  Learn More <ChevronRight size={18} className="ml-2 group-hover:translate-x-2 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Logos Strip */}
      <section className="py-12 bg-white border-t border-surface-200">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0">
            <a href="https://rcub.ac.in/" target="_blank" rel="noreferrer" className="flex flex-col items-center">
              <span className="font-bold text-sm text-primary mb-2">RCU</span>
            </a>
            <a href="https://uucms.karnataka.gov.in/" target="_blank" rel="noreferrer" className="flex flex-col items-center">
              <span className="font-bold text-sm text-primary mb-2">UUCMS</span>
            </a>
            <a href="#" target="_blank" rel="noreferrer" className="flex flex-col items-center">
              <span className="font-bold text-sm text-primary mb-2">NEP</span>
            </a>
            <a href="https://ssp.postmatric.karnataka.gov.in/" target="_blank" rel="noreferrer" className="flex flex-col items-center">
              <span className="font-bold text-sm text-primary mb-2">SSP</span>
            </a>
            <a href="http://naac.gov.in/index.php/en/" target="_blank" rel="noreferrer" className="flex flex-col items-center">
              <span className="font-bold text-sm text-primary mb-2">NAAC</span>
            </a>
            <a href="https://hed.karnataka.gov.in/english" target="_blank" rel="noreferrer" className="flex flex-col items-center">
              <span className="font-bold text-sm text-primary mb-2">KSHEC</span>
            </a>
            <a href="https://nad.gov.in/" target="_blank" rel="noreferrer" className="flex flex-col items-center">
              <span className="font-bold text-sm text-primary mb-2">NAD</span>
            </a>
            <a href="https://www.digilocker.gov.in/" target="_blank" rel="noreferrer" className="flex flex-col items-center">
              <span className="font-bold text-sm text-primary mb-2">DigiLocker</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
