import React from "react";
import { Truck, RotateCcw, Headphones, CreditCard } from "lucide-react";
import SectionTitle from "../common/SectionTitle";

const Features = () => {
  const features = [
    {
      icon: <Truck size={32} strokeWidth={1.5} />,
      title: "Free Shipping",
      description: "Free Shipping for orders over $130",
    },
    {
      icon: <RotateCcw size={32} strokeWidth={1.5} />,
      title: "Returns",
      description: "Within 30 days for an exchange",
    },
    {
      icon: <Headphones size={32} strokeWidth={1.5} />,
      title: "Online Support",
      description: "24 hours a day, 7 days a week",
    },
    {
      icon: <CreditCard size={32} strokeWidth={1.5} />,
      title: "Flexible Payment",
      description: "Pay with Multiple Credit Cards",
    },
  ];

  return (
    <section className="py-10 pt-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Using your SectionTitle component */}
        <SectionTitle 
          title="Why Shop With Us" 
          subtitle="Our Services" 
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mt-10">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center text-center group transition-transform duration-300 hover:-translate-y-1"
            >
              {/* Icon Container */}
              <div className="mb-5 p-4 rounded-full bg-[#FFF7F3] text-[#E0655F] group-hover:bg-[#E0655F] group-hover:text-white transition-colors duration-300 cursor-pointer">
                {feature.icon}
              </div>

              {/* Text Content */}
              <h3 className="text-lg font-bold text-[#1A1A1A] mb-2 uppercase tracking-tight">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-500 max-w-50 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;