import React from "react";
import { ArrowRight, Truck, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

// Note: Ensure this path is accessible to your development server
const modelImage = "/reza-delkhosh-1h4SHm3SZ0c-unsplash.jpg";

const Hero = () => {
  return (
    <section
      className="relative w-full bg-[#FFF7F3] min-h-[calc(100vh-64px)] flex items-center overflow-hidden"
      aria-label="Hero section"
    >
      {/* Decorative Background Elements */}
      <div
        className="absolute top-0 left-0 w-64 h-64 border border-[#D4CDCA] rounded-full opacity-10 -translate-x-1/2 -translate-y-1/2"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-10 right-20 w-96 h-96 border border-[#D4CDCA] rounded-full opacity-10 translate-x-1/2"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-12">
          {/* LEFT COLUMN: Content & Stats (Span 7) */}
          <div className="lg:col-span-7 space-y-12 text-center lg:text-left order-2 lg:order-1">
            {/* Main Text Content */}
            <div className="space-y-6">
              <span className="inline-block px-4 py-1.5 text-xs font-bold tracking-[0.2em] text-[#E0655F] uppercase bg-white/90 backdrop-blur-sm rounded-full shadow-sm">
                New Collection
              </span>
              <h1 className="text-5xl md:text-6xl xl:text-8xl font-serif text-[#1A1A1A] leading-[1.1]">
                Explore Your{" "}
                <span className="block">
                  True{" "}
                  <span className="font-sans font-extrabold italic text-[#E0655F]">
                    Creative
                  </span>
                </span>{" "}
                Fashion
              </h1>
              <p className="text-slate-600 max-w-md mx-auto lg:mx-0 leading-relaxed text-lg">
                Refresh your style with on-trend pieces from our exclusive
                clothing and accessories collection.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 pt-4">
                <Link
                  to="/products"
                  className="group bg-[#1A1A1A] text-white px-10 py-4 rounded-full font-semibold flex items-center gap-3 hover:bg-[#E0655F] transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Shop Now{" "}
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1.5 transition-transform"
                  />
                </Link>
              </div>
            </div>

            {/* Stats Row - Now positioned under the CTA on the left */}
            <div className="flex flex-row items-center justify-center lg:justify-start gap-10 border-t border-[#D4CDCA] pt-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-2xl shadow-sm">
                  <Truck size={20} className="text-[#E0655F]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1A1A1A]">650K+</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                    Delivered
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-2xl shadow-sm">
                  <MapPin size={20} className="text-[#E0655F]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1A1A1A]">100+</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                    Cities
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: The Image (Span 5) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end order-1 lg:order-2">
            <div className="relative w-full max-w-md aspect-4/5">
              {/* Main Image with Arch */}
              <div className="absolute inset-0 bg-white rounded-t-[200px] rounded-b-3xl shadow-2xl overflow-hidden z-10">
                <img
                  src={modelImage}
                  alt="Fashion Model"
                  className="w-full h-full object-cover pt-6 hover:scale-105 transition-transform duration-700"
                />
              </div>
              {/* Decorative Border Frame */}
              <div className="absolute inset-0 border-2 border-[#E0655F] rounded-t-[200px] rounded-b-3xl translate-x-4 translate-y-4 z-0 opacity-20" />
            </div>
          </div>
        </div>
      </div>

      {/* FAR RIGHT: Minimalist Creative Text */}
      <div className="hidden lg:flex absolute right-6 xl:right-10 top-0 bottom-0 flex-col items-center justify-center gap-12 pointer-events-none z-0">
        {/* Elegant Vertical Divider */}
        <div className="w-px h-32 bg-linear-to-b from-transparent via-[#D4CDCA] to-transparent" />

        {/* Vertical Text with Color Accents */}
        <div className="relative">
          <h2 className="text-7xl xl:text-8xl font-black uppercase tracking-tighter select-none whitespace-nowrap [writing-mode:vertical-rl] opacity-[0.04] text-[#1A1A1A]">
            Creative <span className="text-[#E0655F]">Fashion</span>
          </h2>

          {/* Subtle Decorative Tag */}
          <span className="absolute -right-4 top-1/2 -translate-y-1/2 [writing-mode:vertical-rl] text-[10px] font-bold tracking-[0.4em] text-[#E0655F]/40 uppercase">
            Edition 2026
          </span>
        </div>

        {/* Bottom Divider */}
        <div className="w-px h-32 bg-linear-to-t from-transparent via-[#D4CDCA] to-transparent" />
      </div>
    </section>
  );
};

export default Hero;
