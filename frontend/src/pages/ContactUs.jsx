import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import SectionTitle from '../components/common/SectionTitle';

const ContactUs = () => {
  return (
    <div className="bg-[#FFF7F3] min-h-screen font-sans text-[#1A1A1A]">
      
      {/* Premium Gradient Hero Section */}
      <section className="py-20 md:py-32 text-center relative overflow-hidden bg-linear-to-b from-white to-transparent">
        {/* Decorative Background Elements (Brand Circles) */}
        <div className="absolute top-0 left-0 w-80 h-80 border border-[#D4CDCA] rounded-full opacity-20 -translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 right-0 w-96 h-96 border border-[#E0655F] rounded-full opacity-5 translate-x-1/4 translate-y-1/4" />
        
        <div className="relative z-10 px-4">
          <SectionTitle 
            title="Get In Touch With Us" 
            subtitle="Contact" 
          />
          <p className="max-w-xl mx-auto text-slate-600 mt-8 leading-relaxed text-base md:text-lg">
            Have questions about your <span className="text-[#E0655F] font-bold">AuraMart</span> order? 
            Whether it's styling advice or tracking a package, our team is here to help you stay in style.
          </p>
        </div>
      </section>

      {/* Main Content: Form & Sidebar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Contact Form (Span 8) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">Email Address</label>
              <input 
                type="email" 
                placeholder="hello@example.com" 
                className="w-full p-4 rounded-2xl bg-white border border-[#D4CDCA]/40 focus:border-[#E0655F] focus:ring-1 focus:ring-[#E0655F] outline-none transition-all shadow-sm" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">Phone Number</label>
              <input 
                type="text" 
                placeholder="+91 00000 00000" 
                className="w-full p-4 rounded-2xl bg-white border border-[#D4CDCA]/40 focus:border-[#E0655F] focus:ring-1 focus:ring-[#E0655F] outline-none transition-all shadow-sm" 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">Full Name</label>
            <input 
              type="text" 
              placeholder="Your Name" 
              className="w-full p-4 rounded-2xl bg-white border border-[#D4CDCA]/40 focus:border-[#E0655F] focus:ring-1 focus:ring-[#E0655F] outline-none transition-all shadow-sm" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">Message</label>
            <textarea 
              placeholder="How can we help your style journey?" 
              rows="6" 
              className="w-full p-5 rounded-3xl bg-white border border-[#D4CDCA]/40 focus:border-[#E0655F] focus:ring-1 focus:ring-[#E0655F] outline-none transition-all shadow-sm resize-none"
            ></textarea>
          </div>

          <button className="group bg-[#1A1A1A] text-white px-12 py-4 rounded-full font-bold flex items-center gap-3 hover:bg-[#E0655F] transition-all duration-300 shadow-lg active:scale-95 uppercase text-sm tracking-widest">
            Send Message <Send size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Sidebar Card (Newsletter Style) */}
        <div className="lg:col-span-4 bg-[#E0655F] text-white p-10 rounded-[3.5rem] flex flex-col justify-center relative overflow-hidden shadow-2xl">
           {/* Decorative SVG Pattern */}
           <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0 20 Q 25 40 50 20 T 100 20 V 100 H 0 Z" fill="none" stroke="white" strokeWidth="0.4" />
            </svg>
          </div>
          
          <div className="relative z-10">
            <h3 className="text-3xl font-serif font-bold mb-3">AuraMart Club</h3>
            <p className="italic font-sans font-light text-sm opacity-90 mb-10 leading-relaxed">
              Join our community for exclusive early access to creative fashion drops and styling tips.
            </p>
            
            <div className="space-y-4">
                <input 
                    type="email" 
                    placeholder="Your Email" 
                    className="w-full px-6 py-4 rounded-full text-[#1A1A1A] bg-white outline-none text-sm placeholder:text-slate-400 border-none shadow-inner" 
                />
                <button className="w-full bg-[#1A1A1A] py-4 rounded-full font-bold hover:bg-white hover:text-[#E0655F] border-2 border-transparent hover:border-white transition-all duration-300 uppercase tracking-widest text-xs shadow-md">
                    Subscribe
                </button>
            </div>
          </div>
        </div>
      </section>

      {/* Info Cards Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="mb-12">
            <SectionTitle title="Ways To Connect" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Quick Call */}
            <div className="bg-white p-10 rounded-[2.5rem] text-[#1A1A1A] text-center border border-[#D4CDCA]/20 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group">
                <div className="w-16 h-16 bg-[#FFF7F3] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-[#E0655F] transition-colors duration-300">
                    <Phone size={28} className="text-[#E0655F] group-hover:text-white" />
                </div>
                <h4 className="font-bold text-xl mb-2 italic font-serif">Quick Call</h4>
                <p className="text-sm text-slate-500 font-medium tracking-wide">(+91) 98765 43210</p>
            </div>

            {/* Support Email */}
            <div className="bg-[#1A1A1A] p-10 rounded-[2.5rem] text-white text-center shadow-2xl hover:scale-105 transition-transform duration-500 relative z-10">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Mail size={28} className="text-[#E0655F]" />
                </div>
                <h4 className="font-bold text-xl mb-2 italic font-serif text-[#E0655F]">Support Email</h4>
                <p className="text-sm opacity-80 font-medium tracking-wide">hello@auramart.com</p>
            </div>

            {/* Main Studio */}
            <div className="bg-white p-10 rounded-[2.5rem] text-[#1A1A1A] text-center border border-[#D4CDCA]/20 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group">
                <div className="w-16 h-16 bg-[#FFF7F3] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-[#E0655F] transition-colors duration-300">
                    <MapPin size={28} className="text-[#E0655F] group-hover:text-white" />
                </div>
                <h4 className="font-bold text-xl mb-2 italic font-serif">Main Studio</h4>
                <p className="text-sm text-slate-500 font-medium tracking-wide">Surat, Gujarat, India</p>
            </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="relative w-full h-112.5 bg-white rounded-[3.5rem] p-4 shadow-xl border border-[#D4CDCA]/30 overflow-hidden">
           <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d119066.41709471133!2d72.73989467771236!3d21.15934583130761!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04e59411d1563%3A0xfe4558290938b042!2sSurat%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1711200000000!5m2!1sen!2sin" 
            width="100%" 
            height="100%" 
            style={{ border: 0, borderRadius: '2.5rem' }} 
            allowFullScreen="" 
            loading="lazy"
            className="grayscale contrast-110 hover:grayscale-0 transition-all duration-1000"
           ></iframe>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;