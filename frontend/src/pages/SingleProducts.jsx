import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ShoppingBag,
  Heart,
  RotateCcw,
  ShieldCheck,
  Star,
  Loader2,
  Info,
} from "lucide-react";
import { toast } from "react-toastify"; // Import toast

const SingleProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [error, setError] = useState("");

  const [mainImage, setMainImage] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  const api = axios.create({
    baseURL: "http://localhost:8080/api",
    withCredentials: true,
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/products/${id}`);
        const data = res.data.product || res.data.data;
        setProduct(data);
        setMainImage(data.images[0]);
        if (data.variants.length > 0) setSelectedColor(data.variants[0].color);
      } catch (err) {
        console.error("Error fetching product:", err);
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    setError("");
    if (!selectedSize) {
      setError("Please select a size before adding to cart");
      toast.warn("Please select a size first!"); // Warning toast
      return;
    }

    setAddingToCart(true);
    try {
      const payload = {
        productId: product._id,
        color: selectedColor,
        size: selectedSize,
        quantity: 1,
      };

      const response = await api.post("/cart/add", payload);

      if (response.data.success) {
        toast.success(`${product.name} added to cart!`, {
          position: "top-right",
          autoClose: 2000,
        });
      }
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Please login to add items to cart!");
        // Optional: redirect after a short delay
        setTimeout(() => {
          navigate("/login");
        }, 2000);
        return;
      }
      if (err.response?.status === 400) {
        toast.error(err.response.data.message || "Cannot add item to cart");
      } else {
        console.error("Cart Error:", err);
        toast.error("Failed to add item to cart");
      }
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-[#E0655F]" size={40} />
      </div>
    );

  if (!product)
    return (
      <div className="text-center py-20 text-slate-500 font-medium">
        Product not found.
      </div>
    );

  const currentVariant = product.variants.find(
    (v) => v.color === selectedColor
  );

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* LEFT: IMAGE GALLERY */}
          <div className="flex-1 flex flex-col-reverse md:flex-row gap-4">
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto custom-scrollbar">
              {product.images.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setMainImage(img)}
                  className={`w-20 h-24 shrink-0 cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                    mainImage === img
                      ? "border-[#E0655F] scale-95"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img}
                    className="w-full h-full object-cover"
                    alt="thumbnail"
                  />
                </div>
              ))}
            </div>
            <div className="flex-1 aspect-3/4 rounded-2xl overflow-hidden bg-gray-50 border border-slate-100">
              <img
                src={mainImage}
                className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                alt={product.name}
              />
            </div>
          </div>

          {/* RIGHT: PRODUCT INFO */}
          <div className="flex-1 space-y-8">
            <div className="space-y-3">
              <span className="text-[#E0655F] font-black uppercase tracking-[0.2em] text-xs px-3 py-1 bg-[#FFF7F3] rounded-full inline-block">
                {product.brand}
              </span>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#1A1A1A] leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-3">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill={
                        i < Math.floor(product.ratings?.average || 0)
                          ? "currentColor"
                          : "none"
                      }
                    />
                  ))}
                </div>
                <span className="text-sm text-slate-400 font-semibold border-l pl-3 border-slate-200">
                  {product.ratings?.count || 0} Reviews
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold text-[#1A1A1A]">
                ₹{product.price.toLocaleString()}
              </span>
              {product.mrp > product.price && (
                <div className="flex items-center gap-2">
                  <span className="text-xl text-slate-400 line-through decoration-red-400/50">
                    ₹{product.mrp.toLocaleString()}
                  </span>
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-sm font-bold">
                    {product.discountPercentage}% OFF
                  </span>
                </div>
              )}
            </div>

            {/* PRODUCT DESCRIPTION SECTION */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[#1A1A1A] font-bold uppercase tracking-widest text-xs">
                <Info size={14} /> Description
              </div>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base whitespace-pre-line">
                {product.description ||
                  "No description available for this product."}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 py-6 border-y border-slate-100">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-black">
                  Fabric
                </p>
                <p className="text-sm font-semibold text-slate-800">
                  {product.fabric || "Premium Blend"}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-black">
                  Style
                </p>
                <p className="text-sm font-semibold text-slate-800">
                  {product.subCategory}
                </p>
              </div>
            </div>

            {/* VARIANT SELECTION */}
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest mb-4">
                  Color:{" "}
                  <span className="text-[#E0655F] ml-1">{selectedColor}</span>
                </h4>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((v) => (
                    <button
                      key={v.color}
                      onClick={() => {
                        setSelectedColor(v.color);
                        setSelectedSize("");
                        setError("");
                      }}
                      className={`px-5 py-2.5 rounded-full text-xs font-bold border-2 transition-all duration-300 ${
                        selectedColor === v.color
                          ? "bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-lg"
                          : "bg-white border-slate-100 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      {v.color}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-4">
                  <h4 className="text-xs font-black uppercase tracking-widest">
                    Select Size
                  </h4>
                  <button className="text-[10px] underline uppercase font-black text-slate-400 hover:text-[#E0655F] transition-colors">
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {currentVariant?.sizes.map((s) => (
                    <button
                      key={s.size}
                      disabled={s.stock === 0}
                      onClick={() => {
                        setSelectedSize(s.size);
                        setError("");
                      }}
                      className={`w-14 h-12 rounded-xl flex flex-col items-center justify-center text-xs font-bold border-2 transition-all duration-200 cursor-pointer 
                        ${
                          s.stock === 0
                            ? "bg-slate-50 text-slate-300 border-slate-50 cursor-not-allowed"
                            : selectedSize === s.size
                            ? "bg-[#E0655F] text-white border-[#E0655F] shadow-md scale-105"
                            : "bg-white border-slate-100 hover:border-slate-900"
                        }`}
                    >
                      <span>{s.size}</span>
                    </button>
                  ))}
                </div>
                {error && (
                  <p className="text-xs text-red-500 mt-4 font-bold animate-pulse">
                    ● {error}
                  </p>
                )}
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              {/* Add to Cart: Occupies 80% of the width on desktop */}
              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="flex-4 bg-[#1A1A1A] text-white py-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-[#E0655F] disabled:bg-slate-300 transition-all duration-300 shadow-xl active:scale-95 cursor-pointer"
              >
                {addingToCart ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <ShoppingBag size={18} /> Add to Cart
                  </>
                )}
              </button>

              {/* Wishlist: Occupies roughly 20% or fixed width */}
              <button className="flex-1 sm:max-w-20 px-6 py-5 border-2 border-slate-100 rounded-2xl hover:border-red-400 hover:text-red-400 transition-all duration-300 flex items-center justify-center cursor-pointer group">
                <Heart
                  size={22}
                  className="group-hover:fill-red-400 transition-all duration-300 text-slate-400 group-hover:text-red-400"
                />
              </button>
            </div>

            {/* TRUST BADGES */}
            <div className="grid grid-cols-2 gap-4 pt-10 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 rounded-lg">
                  <ShieldCheck size={18} className="text-slate-400" />
                </div>
                <p className="text-[10px] font-black uppercase text-slate-500">
                  100% Genuine
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 rounded-lg">
                  <RotateCcw size={18} className="text-slate-400" />
                </div>
                <p className="text-[10px] font-black uppercase text-slate-500">
                  Easy Returns
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
