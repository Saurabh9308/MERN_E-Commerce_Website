import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RotateCcw,
  Check,
} from "lucide-react";
import ProductCard from "../components/product/ProductCard";
import SectionTitle from "../components/common/SectionTitle";
const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const [category, setCategory] = useState("All");
  const [showFeatured, setShowFeatured] = useState(false);
  const [sortType, setSortType] = useState("relevant");

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Using your specific backend port 8080
        const res = await axios.get("http://localhost:8080/api/products/");
        const data = res.data.products || res.data.data || [];
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let temp = [...products];
    if (category !== "All")
      temp = temp.filter(
        (p) => p.category?.toLowerCase() === category.toLowerCase()
      );
    if (showFeatured) temp = temp.filter((p) => p.isFeatured === true);

    if (sortType === "low-high") temp.sort((a, b) => a.price - b.price);
    else if (sortType === "high-low") temp.sort((a, b) => b.price - a.price);

    setFilteredProducts(temp);
    setCurrentPage(1);
  }, [category, showFeatured, sortType, products]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4 bg-[#FCFBFA]">
        <Loader2 className="animate-spin text-[#E0655F]" size={40} />
        <p className="text-[#1A1A1A] font-bold uppercase tracking-[0.3em] text-[10px]">
          Loading AuraMart
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#FCFBFA] min-h-screen font-sans text-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* --- MOBILE STICKY TOOLBAR --- */}
        <div className="flex md:hidden sticky top-0 z-40 bg-[#FCFBFA]/80 backdrop-blur-md items-center justify-between mb-6 py-4 border-b border-gray-100">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[#1A1A1A] text-white rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg active:scale-95 transition-all"
          >
            <SlidersHorizontal size={14} /> Filters & Sort
          </button>
          <div className="text-right">
            <span className="block text-[10px] font-black text-[#E0655F] uppercase tracking-widest">
              {filteredProducts.length}
            </span>
            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">
              Items Found
            </span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-12">
          {/* --- DESKTOP SIDEBAR --- */}
          <aside className="hidden md:block w-64 shrink-0">
            <div className="sticky top-24 space-y-12">
              {/* Categories */}
              <section>
                <h3 className="text-[11px] font-black mb-6 uppercase tracking-[0.2em] text-[#1A1A1A] flex items-center gap-2">
                  <span className="w-4 h-px bg-[#E0655F]"></span> Categories
                </h3>
                <div className="flex flex-col gap-5">
                  {["All", "Men", "Women", "Kids"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`text-left text-sm transition-all duration-300 relative group w-fit cursor-pointer ${
                        category === cat
                          ? "text-[#E0655F] font-bold"
                          : "text-gray-400 hover:text-black"
                      }`}
                    >
                      {cat}
                      <span
                        className={`absolute -bottom-1 left-0 h-0.5 bg-[#E0655F] transition-all duration-300 ${
                          category === cat ? "w-full" : "w-0 group-hover:w-full"
                        }`}
                      ></span>
                    </button>
                  ))}
                </div>
              </section>

              {/* Refined Promotions */}
              <section className="pt-8 border-t border-gray-100">
                <h3 className="text-[11px] font-black mb-6 uppercase tracking-[0.2em] text-[#1A1A1A] flex items-center gap-2">
                  <span className="w-4 h-px bg-[#E0655F]"></span> Collections
                </h3>
                <label className="flex items-center justify-between cursor-pointer group p-3 rounded-2xl border border-gray-100 bg-white hover:border-[#E0655F]/30 transition-all">
                  <span className="text-xs font-bold text-gray-600 group-hover:text-black uppercase tracking-wider">
                    Featured Only
                  </span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={showFeatured}
                      onChange={(e) => setShowFeatured(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-[#E0655F] after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                  </div>
                </label>
              </section>

              <button
                onClick={() => {
                  setCategory("All");
                  setShowFeatured(false);
                  setSortType("relevant");
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-gray-200 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-[#E0655F] hover:border-[#E0655F] transition-all cursor-pointer"
              >
                <RotateCcw size={12} /> Reset Filters
              </button>
            </div>
          </aside>

          {/* --- MAIN CONTENT --- */}
          <main className="flex-1">
            {/* Desktop Top Toolbar */}
            <div className="hidden md:flex justify-between items-end mb-12 pb-6 border-b border-gray-100">
              <div>
                <SectionTitle
                  title="Explore Our Collection"
                />
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">
                  Showing{" "}
                  {filteredProducts.length > 0 ? indexOfFirstProduct + 1 : 0} –{" "}
                  {Math.min(indexOfLastProduct, filteredProducts.length)} of{" "}
                  {filteredProducts.length} pieces
                </p>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex flex-col items-end">
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#E0655F] mb-1">
                    Sort Results
                  </span>
                  <select
                    value={sortType}
                    onChange={(e) => setSortType(e.target.value)}
                    className="text-[11px] font-bold uppercase tracking-widest bg-white border border-gray-100 rounded-full px-4 py-2 focus:ring-1 focus:ring-[#E0655F] outline-none cursor-pointer text-gray-900"
                  >
                    <option value="relevant">Default Sorting</option>
                    <option value="low-high">Price: Low to High</option>
                    <option value="high-low">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-12 sm:gap-x-8 sm:gap-y-20">
                  {currentProducts.map((product) => (
                    <div
                      key={product._id}
                      className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>

                {/* Refined Pagination */}
                {totalPages > 1 && (
                  <div className="mt-24 flex justify-center items-center gap-4">
                    <button
                      onClick={() => {
                        setCurrentPage((prev) => Math.max(prev - 1, 1));
                        window.scrollTo(0, 0);
                      }}
                      disabled={currentPage === 1}
                      className="w-12 h-12 rounded-full flex items-center justify-center border border-gray-100 disabled:opacity-20 hover:border-[#E0655F] transition-colors"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <div className="flex items-center gap-2">
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setCurrentPage(i + 1);
                            window.scrollTo(0, 0);
                          }}
                          className={`w-10 h-10 rounded-full text-[10px] font-black transition-all ${
                            currentPage === i + 1
                              ? "bg-[#1A1A1A] text-white scale-110 shadow-lg"
                              : "text-gray-400 hover:text-black hover:bg-gray-50"
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => {
                        setCurrentPage((prev) =>
                          Math.min(prev + 1, totalPages)
                        );
                        window.scrollTo(0, 0);
                      }}
                      disabled={currentPage === totalPages}
                      className="w-12 h-12 rounded-full flex items-center justify-center border border-gray-100 disabled:opacity-20 hover:border-[#E0655F] transition-colors"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-gray-200">
                <Loader2 className="mx-auto mb-4 text-gray-200" size={48} />
                <p className="text-gray-400 font-serif italic text-lg px-6">
                  We couldn't find any pieces matching your current selection.
                </p>
                <button
                  onClick={() => {
                    setCategory("All");
                    setShowFeatured(false);
                  }}
                  className="mt-6 text-[#E0655F] font-bold text-[10px] uppercase tracking-widest hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* --- REFINED MOBILE DRAWER (Action Sheet Style) --- */}
      <div
        className={`fixed inset-0 z-100 md:hidden transition-all duration-500 ${
          isMobileFilterOpen ? "visible" : "invisible"
        }`}
      >
        <div
          className={`absolute inset-0 bg-[#1A1A1A]/60 backdrop-blur-sm transition-opacity duration-500 ${
            isMobileFilterOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsMobileFilterOpen(false)}
        />

        <div
          className={`absolute bottom-0 left-0 w-full bg-white rounded-t-[3rem] p-8 shadow-2xl transition-transform duration-500 ease-out ${
            isMobileFilterOpen ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-8" />

          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-serif font-bold">Refine Selection</h2>
            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="p-2 bg-gray-100 rounded-full"
            >
              <X size={18} />
            </button>
          </div>

          <div className="space-y-10 max-h-[60vh] overflow-y-auto pb-10">
            {/* Sort Section */}
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-[#E0655F] mb-6">
                Sort By
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { label: "Default Sorting", val: "relevant" },
                  { label: "Price: Low to High", val: "low-high" },
                  { label: "Price: High to Low", val: "high-low" },
                ].map((s) => (
                  <button
                    key={s.val}
                    onClick={() => setSortType(s.val)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border text-sm font-bold transition-all ${
                      sortType === s.val
                        ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                        : "bg-gray-50 text-gray-500 border-transparent"
                    }`}
                  >
                    {s.label}
                    {sortType === s.val && <Check size={16} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Section */}
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-[#E0655F] mb-6">
                Categories
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {["All", "Men", "Women", "Kids"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`p-4 rounded-2xl text-xs font-bold border transition-all ${
                      category === cat
                        ? "bg-[#E0655F] text-white border-[#E0655F] shadow-md shadow-[#E0655F]/20"
                        : "bg-gray-50 border-transparent text-gray-500"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* NEW: Featured Box in Mobile */}
            <div className="pt-6 border-t border-gray-100">
              <label className="flex items-center justify-between p-5 bg-[#FFF7F3] rounded-3xl border border-[#E0655F]/20">
                <div>
                  <span className="block text-sm font-bold text-[#1A1A1A]">
                    Exclusive Drops
                  </span>
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                    Show Featured Items
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={showFeatured}
                    onChange={(e) => setShowFeatured(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-[#E0655F] after:content-[''] after:absolute after:top-0.75 after:left-0.75 after:bg-white after:rounded-full after:h-4.5 after:w-4.5 after:transition-all"></div>
                </div>
              </label>
            </div>
          </div>

          <button
            onClick={() => setIsMobileFilterOpen(false)}
            className="w-full bg-[#1A1A1A] text-white py-5 rounded-full font-bold uppercase text-[10px] tracking-[0.2em] shadow-xl active:scale-95"
          >
            Show {filteredProducts.length} Results
          </button>
        </div>
      </div>
    </div>
  );
};

export default Products;
