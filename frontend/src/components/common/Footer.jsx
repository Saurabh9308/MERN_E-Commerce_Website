import React from "react";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    shop: [
      { name: "New Arrivals", path: "/new" },
      { name: "Best Sellers", path: "/best-sellers" },
      { name: "Women Collection", path: "/women" },
      { name: "Men Collection", path: "/men" },
    ],
    support: [
      { name: "Order Tracking", path: "/track" },
      { name: "Returns & Exchanges", path: "/returns" },
      { name: "Shipping Policy", path: "/shipping" },
      { name: "Size Guide", path: "/size-guide" },
    ],
  };

  return (
    <footer className="bg-[#FFF7F3] pt-16 pb-8 border-t border-[#D4CDCA]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 mb-16">
          
          {/* Column 1: Brand Identity */}
          <div className="lg:col-span-4 space-y-6">
            <h2 className="text-2xl font-serif font-bold text-[#1A1A1A]">
              AURA<span className="text-[#E0655F]">MART</span>
            </h2>
            <p className="text-slate-600 leading-relaxed max-w-sm text-sm md:text-base">
              Elevating your everyday style with curated collections that blend 
              modern trends with timeless elegance.
            </p>
            <div className="flex items-center gap-3">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, index) => (
                <a 
                  key={index} 
                  href="#" 
                  className="p-2.5 bg-white rounded-full text-[#1A1A1A] hover:bg-[#E0655F] hover:text-white transition-all duration-300 shadow-sm border border-slate-100"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Shop Links */}
          <div className="lg:col-span-2">
            <h3 className="text-[#1A1A1A] font-bold uppercase tracking-widest text-xs mb-6 border-b border-[#E0655F]/20 pb-2 inline-block">
              Shop
            </h3>
            <ul className="space-y-4">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-slate-500 hover:text-[#E0655F] transition-colors text-sm flex items-center group">
                    <span className="w-0 group-hover:w-4 transition-all duration-300 overflow-hidden text-[#E0655F]">
                      <ArrowRight size={12} />
                    </span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Support Links */}
          <div className="lg:col-span-2">
            <h3 className="text-[#1A1A1A] font-bold uppercase tracking-widest text-xs mb-6 border-b border-[#E0655F]/20 pb-2 inline-block">
              Support
            </h3>
            <ul className="space-y-4">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-slate-500 hover:text-[#E0655F] transition-colors text-sm flex items-center group">
                    <span className="w-0 group-hover:w-4 transition-all duration-300 overflow-hidden text-[#E0655F]">
                      <ArrowRight size={12} />
                    </span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div className="lg:col-span-4 space-y-6">
            <h3 className="text-[#1A1A1A] font-bold uppercase tracking-widest text-xs mb-6 border-b border-[#E0655F]/20 pb-2 inline-block">
              Get In Touch
            </h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3 text-slate-600">
                <MapPin size={18} className="text-[#E0655F] shrink-0 mt-0.5" />
                <p>123 Fashion Avenue, Design District, NY 10001</p>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <Phone size={18} className="text-[#E0655F] shrink-0" />
                <p>+1 (555) 000-1234</p>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <Mail size={18} className="text-[#E0655F] shrink-0" />
                <p>support@creativefashion.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 border-t border-[#D4CDCA]/50 flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] sm:text-xs text-slate-500 font-medium uppercase tracking-wider">
          <p>© {currentYear} Creative Fashion. Designed for Excellence.</p>
          
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-[#E0655F] transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-[#E0655F] transition-colors">Terms of Service</Link>
          </div>

          <div className="flex gap-3 opacity-70">
             {["VISA", "MASTER", "AMEX", "PAYPAL"].map((card) => (
               <span key={card} className="border border-slate-300 px-2 py-0.5 rounded text-[9px]">
                 {card}
               </span>
             ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;