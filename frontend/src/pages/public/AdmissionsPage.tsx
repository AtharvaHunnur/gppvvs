import React from 'react';
import { Helmet } from 'react-helmet-async';
import { FileText, CheckCircle2, Calendar, HelpCircle, Download } from 'lucide-react';
import { motion } from 'framer-motion';

const AdmissionsPage = () => {
  return (
    <div className="bg-surface-50 min-h-screen pb-20">
      <Helmet>
        <title>Admissions | GPPVVS College</title>
      </Helmet>

      {/* Page Header */}
      <div className="bg-primary-900 text-white py-20 border-b-[8px] border-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900 to-primary-800"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-700/50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="container-custom text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-black font-heading mb-4 drop-shadow-lg">
            Admissions Open 2024-25
          </h1>
          <div className="w-24 h-1.5 bg-gradient-to-r from-secondary to-yellow-500 mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto font-medium mb-8">
            Take the first step towards a bright future. Join our diverse academic community.
          </p>
          <div className="flex justify-center space-x-4">
            <a href="#apply" className="bg-gradient-to-r from-secondary to-yellow-500 text-primary-900 px-8 py-3 rounded-full font-black hover:scale-105 transition-all duration-300 shadow-xl uppercase tracking-wider">
              Apply Now
            </a>
            <a href="#prospectus" className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-3 rounded-full font-bold hover:bg-white/20 transition-all duration-300 flex items-center shadow-lg">
              <Download size={18} className="mr-2" /> Prospectus
            </a>
          </div>
        </div>
      </div>

      <div className="container-custom mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            
            <section id="process">
              <h2 className="text-3xl font-bold text-primary font-heading mb-6 flex items-center border-b pb-4">
                <FileText className="mr-3 text-secondary" size={32} />
                Admission Process
              </h2>
              <div className="space-y-6">
                {[
                  { title: "UUCMS Registration", desc: "All admissions to undergraduate courses strictly follow the Unified University & College Management System (UUCMS) guidelines set by the Govt. of Karnataka." },
                  { title: "Document Verification", desc: "Original documents must be produced at the college office during the admission process for verification." },
                  { title: "Fee Payment", desc: "Fees can be paid online via the UUCMS portal or via demand draft at the college counter." },
                  { title: "Confirmation", desc: "Admission is confirmed only after the approval of Rani Channamma University, Belagavi." }
                ].map((step, i) => (
                  <div key={i} className="flex bg-white p-6 rounded-2xl shadow-sm border border-surface-200">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center text-primary font-bold text-xl mr-6">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-text mb-2">{step.title}</h3>
                      <p className="text-text-secondary">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section id="eligibility">
              <h2 className="text-3xl font-bold text-primary font-heading mb-6 flex items-center border-b pb-4">
                <CheckCircle2 className="mr-3 text-secondary" size={32} />
                Eligibility Criteria
              </h2>
              <div className="bg-white rounded-2xl shadow-sm border border-surface-200 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-primary-50">
                    <tr>
                      <th className="p-4 font-bold text-primary">Program</th>
                      <th className="p-4 font-bold text-primary">Eligibility</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-200">
                    <tr>
                      <td className="p-4 font-bold">B.A. & B.Com</td>
                      <td className="p-4 text-text-secondary">Pass in PUC II (10+2) in any stream from a recognized board.</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-bold">B.Sc.</td>
                      <td className="p-4 text-text-secondary">Pass in PUC II (10+2) with Science subjects from a recognized board.</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-bold">B.C.A.</td>
                      <td className="p-4 text-text-secondary">Pass in PUC II (10+2) in any stream with Mathematics/Computer Science as an optional subject.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            
            {/* Quick Links */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-surface-200 border-t-4 border-t-primary">
              <h3 className="font-bold text-xl mb-4 font-heading">Important Links</h3>
              <ul className="space-y-4">
                <li>
                  <a href="https://uucms.karnataka.gov.in" target="_blank" rel="noreferrer" className="flex items-center text-primary hover:text-secondary font-medium transition">
                    <ChevronRight size={18} className="mr-2" /> UUCMS Portal Login
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center text-primary hover:text-secondary font-medium transition">
                    <ChevronRight size={18} className="mr-2" /> SSP Scholarship Portal
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center text-primary hover:text-secondary font-medium transition">
                    <ChevronRight size={18} className="mr-2" /> Hostel Application
                  </a>
                </li>
              </ul>
            </div>

            {/* Important Dates */}
            <div className="bg-primary-50 p-8 rounded-2xl border border-primary-100">
              <h3 className="font-bold text-xl mb-4 font-heading text-primary flex items-center">
                <Calendar className="mr-2" size={24} /> Important Dates
              </h3>
              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-primary-200 before:to-transparent">
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-white bg-secondary shadow flex-shrink-0 z-10"></div>
                  <div className="w-[calc(100%-2rem)] bg-white p-3 rounded shadow-sm border border-surface-200">
                    <div className="text-primary font-bold text-sm">June 01, 2026</div>
                    <div className="text-text-secondary text-xs">UUCMS Portal Opens</div>
                  </div>
                </div>
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-white bg-primary shadow flex-shrink-0 z-10"></div>
                  <div className="w-[calc(100%-2rem)] bg-white p-3 rounded shadow-sm border border-surface-200">
                    <div className="text-primary font-bold text-sm">June 30, 2026</div>
                    <div className="text-text-secondary text-xs">Last date without penalty</div>
                  </div>
                </div>
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-white bg-surface-300 shadow flex-shrink-0 z-10"></div>
                  <div className="w-[calc(100%-2rem)] bg-white p-3 rounded shadow-sm border border-surface-200 opacity-60">
                    <div className="text-primary font-bold text-sm">July 15, 2026</div>
                    <div className="text-text-secondary text-xs">Classes Commence</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Helpdesk */}
            <div className="bg-primary text-white p-8 rounded-2xl shadow-lg relative overflow-hidden">
              <HelpCircle className="absolute -bottom-4 -right-4 w-32 h-32 text-white opacity-10" />
              <h3 className="font-bold text-xl mb-2 font-heading relative z-10">Need Help?</h3>
              <p className="text-primary-100 text-sm mb-4 relative z-10">Our admission counselors are here to help you.</p>
              <div className="space-y-2 relative z-10">
                <div className="font-bold">📞 08488-221244</div>
                <div className="font-bold">✉️ admissions@gppvvs.ac.in</div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

// Helper icon component
const ChevronRight = ({ size, className }: { size: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m9 18 6-6-6-6"/>
  </svg>
);

export default AdmissionsPage;
