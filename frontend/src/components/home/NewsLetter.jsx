import React, { useState } from "react";
import { Send } from "lucide-react";
import SectionTitle from "../common/SectionTitle"; 

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setEmail("");
  };

  return (
    <section className="py-12 pt-0 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Responsive Section Title - Spacing reduced for mobile */}
        <div className="mb-8 md:mb-12">
          <SectionTitle 
            title="Stay In The Loop" 
            subtitle="Newsletter" 
          />
        </div>

        {/* Card: Smaller rounding on mobile for better space utility */}
        <div className="max-w-4xl mx-auto relative overflow-hidden rounded-4xl md:rounded-[3rem] bg-[#E0655F] shadow-xl">
          
          {/* Decorative SVG - Stroke thinned for mobile clarity */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0 20 Q 25 40 50 20 T 100 20 V 100 H 0 Z" fill="none" stroke="white" strokeWidth="0.2" />
            </svg>
          </div>

          <div className="relative z-10 px-5 py-10 md:py-14 flex flex-col items-center text-center">
            {/* Header Content - Dynamic sizing */}
            <div className="mb-6 md:mb-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white leading-tight">
                Join Our Newsletter
                <span className="block italic font-sans font-light text-base sm:text-lg md:text-xl opacity-90 mt-1">
                  To Stay Up To Date
                </span>
              </h2>
            </div>

            {/* Form: Optimized for Mobile Tap Targets */}
            <form 
              onSubmit={handleSubmit}
              className="w-full max-w-md md:max-w-lg"
            >
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-1.5 sm:bg-white sm:rounded-full sm:shadow-md">
                <input
                  type="email"
                  placeholder="Enter Your Email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  // Mobile: White bg with independent rounded corners | Desktop: Transparent bg
                  className="flex-1 w-full px-6 py-3.5 sm:py-2.5 bg-white sm:bg-transparent rounded-full sm:rounded-none text-[#1A1A1A] placeholder-slate-400 focus:outline-none text-base"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 sm:py-3 bg-[#1A1A1A] text-white rounded-full font-bold flex items-center justify-center gap-2 hover:bg-[#E0655F] border-2 border-transparent hover:border-white transition-all duration-300 active:scale-95 text-sm uppercase tracking-wider"
                >
                  Subscribe
                  <Send size={16} />
                </button>
              </div>
            </form>

            {/* Privacy Note: Text wraps better on small screens */}
            <p className="mt-6 text-white/70 text-[10px] sm:text-xs max-w-60 sm:max-w-xs font-medium tracking-wide leading-relaxed">
              Your privacy matters. We safeguard your information for a secure experience.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;