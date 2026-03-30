import React from 'react';
import SectionTitle from '../common/SectionTitle';
import { MoveUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const imageMap = {
  women: "/woman.jpg", 
  men: "/man.avif", 
  kids: "/childFashion.jpg",
};

const CategorySection = () => {
  const categories = [
    {
      id: 1,
      name: "Women's Collection",
      tagline: "Floral Elegance",
      image: imageMap.women,
      // Only spans 2 columns on large screens (Desktop)
      gridClass: "lg:col-span-2 lg:row-span-2 h-[450px] lg:h-full",
      path: "/products/women"
    },
    {
      id: 2,
      name: "Men's Atelier",
      tagline: "Linen Essentials",
      image: imageMap.men,
      gridClass: "col-span-1 h-[450px] lg:h-full",
      path: "/products/men"
    },
    {
      id: 3,
      name: "Children's Edition",
      tagline: "Playful Comfort",
      image: imageMap.kids,
      gridClass: "col-span-1 h-[450px] lg:h-full",
      path: "/products/children"
    }
  ];

  return (
    <section className="py-16 lg:pb-16 pt-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <SectionTitle 
          title="Explore Fashion" 
          subtitle="Curated Styles" 
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mt-12 lg:h-187.5">
          {categories.map((cat) => (
            <Link 
              key={cat.id} 
              to={cat.path}
              className={`group relative overflow-hidden rounded-3xl bg-[#FFF7F3] border border-[#D4CDCA]/30 shadow-sm hover:shadow-xl transition-all duration-700 ease-in-out ${cat.gridClass}`}
            >
              {/* Image Container */}
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover object-center transition-transform duration-1000 ease-in-out group-hover:scale-110"
                />
              </div>

              {/* Sophisticated Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-[#1A1A1A]/90 via-[#1A1A1A]/20 to-transparent group-hover:via-[#1A1A1A]/40 transition-all duration-500" />

              {/* Text & Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8 z-10">
                {/* Decorative Indicator */}
                <div className="flex items-center gap-1.5 mb-3 opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-500">
                  <div className="w-1 h-1 rounded-full bg-[#E0655F]" />
                  <div className="w-8 h-px bg-[#E0655F]" />
                </div>

                <p className="text-[10px] font-bold text-[#E0655F] uppercase tracking-[0.3em] mb-1.5">
                  {cat.tagline}
                </p>

                <h3 className="text-2xl lg:text-4xl font-serif font-bold text-white leading-tight">
                  {cat.name}
                </h3>

                <div className="flex items-center gap-2 mt-4 text-white/80 text-sm font-medium opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                  <span>Shop Now</span>
                  <MoveUpRight size={16} className="text-[#E0655F]" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;