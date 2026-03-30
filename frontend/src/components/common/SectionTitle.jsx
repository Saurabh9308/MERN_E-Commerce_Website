import React from 'react';

const SectionTitle = ({ title, subtitle }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-2 pb-4">
      {/* Optional Subtitle/Badge style */}
      {subtitle && (
        <span className="inline-block px-4 py-1.5 text-xs font-bold tracking-[0.2em] text-[#E0655F] uppercase bg-white/90 backdrop-blur-sm rounded-full shadow-sm">
          {subtitle}
        </span>
      )}

      {/* Main Title */}
      <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1A1A1A] text-center leading-[1.1]">
        {title}
      </h2>

      {/* The Decorative Divider */}
      <div className="flex items-center gap-3 w-full max-w-50 mt-2">
        {/* Left Line */}
        <div className="h-px flex-1 bg-linear-to-r from-transparent to-[#E0655F]/50" />
        
        {/* Center Ornaments */}
        <div className="flex items-center gap-1">
          <div className="w-1 h-1 rounded-full bg-[#E0655F]/40" />
          <div className="w-2 h-2 rounded-full bg-[#E0655F]" />
          <div className="w-1 h-1 rounded-full bg-[#E0655F]/40" />
        </div>

        {/* Right Line */}
        <div className="h-px flex-1 bg-linear-to-l from-transparent to-[#E0655F]/50" />
      </div>
    </div>
  );
};

export default SectionTitle;