import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
// import productsData from '../data/products.json';
import ProductCard from "./ProductCard";
import SectionTitle from "../common/SectionTitle";

const ProductGrid = () => {
  // 1. Initialize state for the active category
  const [activeCategory, setActiveCategory] = useState("women");
  const [productsData, setProductsData] = useState([]);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/products/");

        // Fix: Access the products array inside response.data
        // Based on your controller, it is either response.data.products or response.data.data
        if (response.data.success) {
          setProductsData(response.data.products);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchProducts();
  }, []);
  const filteredData = productsData.filter(
    (item) => item.category?.toLowerCase() === activeCategory.toLowerCase()
  );

  const categories = ["women", "men", "kids"];

  return (
    <section className="py-24 pt-12 bg-[#FCFBFA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle subtitle="Spring Summer 2026" title="Most Loved Styles" />

        {/* --- CATEGORY TABS --- */}
        <div className="flex justify-center gap-8 mt-8 border-b border-gray-100">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`cursor-pointer pb-4 text-sm font-bold uppercase tracking-widest transition-all duration-300 relative ${
                activeCategory === cat
                  ? "text-[#E0655F]"
                  : "text-gray-400 hover:text-[#1A1A1A]"
              }`}
            >
              {cat}
              {/* Animated Bottom Line */}
              <div
                className={`absolute bottom-0 left-0 h-0.5 bg-[#E0655F] transition-all duration-300 ${
                  activeCategory === cat ? "w-full" : "w-0"
                }`}
              />
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16 mt-12">
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <ProductCard key={item.id || index} product={item} />
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-gray-400">
              No products found in this category.
            </div>
          )}
        </div>

        {/* EXPLORE FASHION BUTTON SECTION */}
        <div className="mt-20 flex justify-center">
          <Link
            to={`/products?category=${activeCategory}`}
            className="group relative inline-flex items-center gap-4 px-12 py-4 bg-transparent border border-[#1A1A1A] rounded-full overflow-hidden transition-all duration-500 hover:border-[#E0655F] cursor-pointer"
          >
            <div className="absolute inset-0 w-0 bg-[#E0655F] transition-all duration-500 ease-out group-hover:w-full" />
            <span className="relative z-10 text-xs font-bold uppercase tracking-[0.3em] text-[#1A1A1A] group-hover:text-white transition-colors duration-500">
              Explore {activeCategory}
            </span>
            <ArrowRight
              size={18}
              className="relative z-10 text-[#1A1A1A] group-hover:text-white group-hover:translate-x-2 transition-all duration-500"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
