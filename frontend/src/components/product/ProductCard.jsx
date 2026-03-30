import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Heart, Loader2 } from "lucide-react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify"; // Recommended for feedback

const ProductCard = ({ product }) => {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isAdding, setIsAdding] = useState(false); // Loading state for button
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const images = product.images || [];
  const hasMultipleImages = images.length > 1;

  // --- AUTO-PLAY WITH SMOOTH CROSS-FADE ---
  useEffect(() => {
    let interval;
    if (hasMultipleImages) {
      interval = setInterval(() => {
        // Start transition
        setIsTransitioning(true);

        // Change image after a delay to allow fade-out
        setTimeout(() => {
          setCurrentImgIndex((prev) =>
            prev === images.length - 1 ? 0 : prev + 1
          );

          // End transition after image change
          setTimeout(() => {
            setIsTransitioning(false);
          }, 100);
        }, 800); // Wait 800ms for fade-out
      }, 6000); // 6 seconds total per image (800ms transition + 5200ms display)
    }
    return () => clearInterval(interval);
  }, [hasMultipleImages, images.length]);

  const handleQuickAdd = async (e) => {
    e.preventDefault(); // Prevent navigating to product detail page
    setIsAdding(true);
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      // Optionally navigate to login
      navigate("/login");
      return;
    }
    try {
      // 1. Pick the first available variant and size as "Default"
      const defaultVariant = product.variants[0];
      const defaultSize =
        defaultVariant?.sizes.find((s) => s.stock > 0) ||
        defaultVariant?.sizes[0];

      if (!defaultVariant || !defaultSize) {
        toast.error("Product currently unavailable");
        return;
      }

      // 2. API Call
      const response = await axios.post(
        "http://localhost:8080/api/cart/add",
        {
          productId: product._id,
          color: defaultVariant.color,
          size: defaultSize.size,
          quantity: 1,
        },
        { withCredentials: true } // Crucial for your auth middleware
      );

      if (response.data.success) {
        toast.success(`${product.name} added to cart!`);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Please login to add items to cart!");
        // Optionally redirect to login
        // navigate("/login");
      } else if (error.response?.status === 400) {
        toast.error(error.response.data.message || "Product unavailable");
      } else {
        toast.error("Failed to add item to cart");
      }
    } finally {
      setIsAdding(false);
    }
  };

  const discount = Math.round(
    ((product.mrp - product.price) / product.mrp) * 100
  );

  return (
    <div className="group relative bg-white flex flex-col h-full">
      {/* Image Wrapper */}
      <div className="relative aspect-3/4 overflow-hidden bg-[#F5F5F5] rounded-xl sm:rounded-2xl">
        {/* Badges & Heart */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-30">
          {discount > 0 && (
            <span className="bg-[#E0655F] text-white text-[7px] sm:text-[9px] font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md uppercase tracking-tighter shadow-sm">
              {discount}% OFF
            </span>
          )}
        </div>

        <div className="absolute top-1.5 right-1.5 sm:top-3 sm:right-3 z-30">
          <button className="p-1.5 sm:p-2 bg-white/90 backdrop-blur-md rounded-full shadow-sm hover:bg-[#E0655F] hover:text-white transition-all cursor-pointer">
            <Heart size={14} className="sm:w-4" />
          </button>
        </div>

        {/* --- SMOOTH IMAGE TRANSITION WITH LONGER DURATION --- */}
        <Link
          to={`/product/${product._id}`}
          className="relative block w-full h-full"
        >
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`${product.name} ${index}`}
              className={`absolute inset-0 w-full h-full object-cover object-top transition-all duration-1500 ease-in-out ${
                currentImgIndex === index
                  ? "opacity-100 z-10 scale-100"
                  : "opacity-0 z-0 scale-105"
              } ${
                !isTransitioning && currentImgIndex === index
                  ? "group-hover:scale-105"
                  : ""
              }`}
              style={{
                transition:
                  "opacity 1500ms cubic-bezier(0.4, 0, 0.2, 1), transform 3000ms cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            />
          ))}

          {/* Progress Dashes with Animated Indicator */}
          {hasMultipleImages && (
            <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-1.5 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              {images.map((_, i) => (
                <div
                  key={i}
                  className={`h-0.5 rounded-full transition-all duration-1000 ${
                    currentImgIndex === i ? "w-6 bg-white" : "w-1.5 bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}
        </Link>

        {/* Quick Add Button */}
        <div className="absolute inset-x-0 bottom-0 p-2 sm:p-3 translate-y-0 md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-500 ease-out z-40">
          <button
            onClick={handleQuickAdd}
            disabled={isAdding}
            className="w-full bg-white/90 backdrop-blur-md md:bg-[#1A1A1A] text-[#1A1A1A] md:text-white py-2 sm:py-3.5 rounded-lg font-bold text-[8px] sm:text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#E0655F] hover:text-white transition-all shadow-lg cursor-pointer border border-gray-100 md:border-none disabled:opacity-70"
          >
            {isAdding ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <ShoppingCart size={12} className="sm:w-3.5" />
            )}
            {isAdding ? "Adding..." : "Quick Add"}
          </button>
        </div>
      </div>

      {/* --- DETAILS SECTION --- */}
      <div className="mt-3 sm:mt-5 space-y-1 px-0.5">
        <span className="text-[#E0655F] text-[7px] sm:text-[9px] font-black uppercase tracking-[0.15em] block mb-0.5">
          {product.brand}
        </span>
        <h3 className="text-[#1A1A1A] font-serif text-xs sm:text-base leading-tight line-clamp-1 group-hover:text-[#E0655F] transition-colors duration-300">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 pt-0.5">
          <span className="text-sm sm:text-lg font-bold text-[#1A1A1A]">
            ₹{product.price.toLocaleString()}
          </span>
          {product.mrp > product.price && (
            <span className="text-[9px] sm:text-xs text-slate-400 line-through">
              ₹{product.mrp.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
