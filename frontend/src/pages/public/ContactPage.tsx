import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { apiClient } from '../../api/client';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await apiClient.post('/inquiries', formData);
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface-50 min-h-screen pb-20">
      <Helmet>
        <title>Contact Us | GPPVVS College</title>
      </Helmet>

      {/* Hero */}
      {/* Page Header */}
      <div className="bg-primary-900 text-white py-20 border-b-[8px] border-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900 to-primary-800"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-700/50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="container-custom text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-black font-heading mb-4 drop-shadow-lg">
            Contact Us
          </h1>
          <div className="w-24 h-1.5 bg-gradient-to-r from-secondary to-yellow-500 mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto font-medium">
            Get in touch with us for admissions, queries, or general information. We are here to help.
          </p>
        </div>
      </div>

      <div className="container-custom mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-surface-200">
              <h3 className="font-bold text-2xl mb-6 font-heading text-primary">Get In Touch</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary flex-shrink-0 mr-4">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-text mb-1">Campus Address</h4>
                    <p className="text-text-secondary text-sm">G.P. Porwal Arts, Commerce & V.V. Salimath Science College<br/>Sindagi - 586128, Karnataka</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary flex-shrink-0 mr-4">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-text mb-1">Phone</h4>
                    <p className="text-text-secondary text-sm">Office: 08488-221244<br/>Admissions: +91 9845610183</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary flex-shrink-0 mr-4">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-text mb-1">Email</h4>
                    <p className="text-text-secondary text-sm">info@gppvvs.ac.in<br/>admissions@gppvvs.ac.in</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary flex-shrink-0 mr-4">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-text mb-1">Office Hours</h4>
                    <p className="text-text-secondary text-sm">Mon - Sat: 9:00 AM - 5:00 PM<br/>Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Map Placeholder */}
            <div className="bg-surface-200 h-64 rounded-3xl overflow-hidden relative shadow-sm border border-surface-200">
               <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15274.630043818311!2d76.22384915000001!3d16.91890325!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b9b47e23bdfecb5%3A0x6b9d6a3f9e9a4a7f!2sG.%20P.%20Porwal%20Arts%20Commerce%20%26%20V.%20V.%20Salimath%20Science%20College!5e0!3m2!1sen!2sin!4v1716894382025!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-surface-200">
              <h2 className="text-3xl font-bold font-heading text-text mb-2">Send us a Message</h2>
              <p className="text-text-secondary mb-8">Have a question? Fill out the form below and we will get back to you shortly.</p>

              {success ? (
                <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8 text-center">
                  <CheckCircle2 size={64} className="mx-auto text-green-500 mb-4" />
                  <h3 className="text-2xl font-bold text-green-800 mb-2">Message Sent!</h3>
                  <p className="text-green-700 mb-6">Thank you for reaching out. Our team will contact you soon.</p>
                  <button 
                    onClick={() => setSuccess(false)}
                    className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 text-sm font-medium">
                      {error}
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-text mb-2">Full Name *</label>
                      <input 
                        type="text" required
                        value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full px-5 py-4 rounded-xl border border-surface-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition bg-surface-50"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-text mb-2">Email Address *</label>
                      <input 
                        type="email" required
                        value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                        className="w-full px-5 py-4 rounded-xl border border-surface-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition bg-surface-50"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-text mb-2">Phone Number</label>
                      <input 
                        type="tel" 
                        value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                        className="w-full px-5 py-4 rounded-xl border border-surface-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition bg-surface-50"
                        placeholder="+91 9876543210"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-text mb-2">Subject *</label>
                      <select 
                        required
                        value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})}
                        className="w-full px-5 py-4 rounded-xl border border-surface-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition bg-surface-50 appearance-none"
                      >
                        <option value="" disabled>Select a subject</option>
                        <option value="Admission">Admission Inquiry</option>
                        <option value="Academics">Academics</option>
                        <option value="Hostel">Hostel Facilities</option>
                        <option value="General">General Information</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-text mb-2">Your Message *</label>
                    <textarea 
                      required rows={5}
                      value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}
                      className="w-full px-5 py-4 rounded-xl border border-surface-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition bg-surface-50 resize-none"
                      placeholder="How can we help you?"
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full md:w-auto bg-primary text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-primary-700 transition shadow-lg flex items-center justify-center disabled:opacity-70"
                  >
                    {loading ? 'Sending...' : (
                      <>Send Message <Send size={20} className="ml-2" /></>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
