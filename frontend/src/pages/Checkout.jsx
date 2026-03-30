import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  CreditCard,
  Truck,
  CheckCircle,
  Loader2,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";
import SectionTitle from "../components/common/SectionTitle";
import axios from "axios";
import { toast } from "react-toastify";

const Checkout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [cart, setCart] = useState({ items: [] });

  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "India",
    phone: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("Cash On Delivery");

  const api = axios.create({
    baseURL: "http://localhost:8080/api",
    withCredentials: true,
  });

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await api.get("/cart");
        if (!response.data.items || response.data.items.length === 0) {
          toast.info("Your cart is empty");
          navigate("/cart");
          return;
        }
        setCart(response.data);
      } catch (error) {
        if (error.response?.status === 401) {
          toast.error("Please login to checkout");
          navigate("/login");
        } else {
          toast.error("Failed to load cart");
          navigate("/cart");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const calculateTotals = () => {
    const items = cart.items || [];
    const itemsPrice = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const taxPrice = Math.round(itemsPrice * 0.05 * 100) / 100;
    const shippingPrice = itemsPrice > 500 ? 0 : 49;
    const totalPrice =
      Math.round((itemsPrice + taxPrice + shippingPrice) * 100) / 100;
    return { itemsPrice, taxPrice, shippingPrice, totalPrice };
  };

  const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
    calculateTotals();

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    // Validate
    const { fullName, address, city, postalCode, country, phone } =
      shippingAddress;
    if (!fullName || !address || !city || !postalCode || !country || !phone) {
      toast.error("Please fill in all shipping details");
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.post("/orders", {
        shippingAddress,
        paymentMethod,
      });

      if (response.data.success) {
        toast.success("Order placed successfully!");
        navigate(`/order-summary/${response.data.order._id}`);
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to place order";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF7F3] flex items-center justify-center">
        <div className="text-center">
          <Loader2
            className="animate-spin text-[#E0655F] mx-auto mb-4"
            size={40}
          />
          <p className="text-slate-600">Preparing checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFF7F3] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate("/cart")}
          className="flex items-center gap-2 text-slate-500 hover:text-[#E0655F] mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft size={18} /> Back to Cart
        </button>

        <div className="text-center mb-10">
          <SectionTitle title="Checkout" subtitle="Complete Your Order" />
        </div>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Shipping & Payment */}
            <div className="lg:col-span-2 space-y-8">
              {/* Shipping Address */}
              <div className="bg-white rounded-2xl shadow-sm border border-[#D4CDCA]/30 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-[#FFF7F3] rounded-lg">
                    <MapPin size={20} className="text-[#E0655F]" />
                  </div>
                  <h2 className="text-xl font-serif font-bold text-[#1A1A1A]">
                    Shipping Address
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={shippingAddress.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-[#FCFBFA] border border-[#D4CDCA]/60 rounded-xl py-3.5 px-4 outline-none focus:border-[#E0655F] focus:ring-2 focus:ring-[#E0655F]/10 transition-all text-sm"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={shippingAddress.address}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-[#FCFBFA] border border-[#D4CDCA]/60 rounded-xl py-3.5 px-4 outline-none focus:border-[#E0655F] focus:ring-2 focus:ring-[#E0655F]/10 transition-all text-sm"
                      placeholder="123 Main Street, Apt 4"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={shippingAddress.city}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-[#FCFBFA] border border-[#D4CDCA]/60 rounded-xl py-3.5 px-4 outline-none focus:border-[#E0655F] focus:ring-2 focus:ring-[#E0655F]/10 transition-all text-sm"
                      placeholder="Mumbai"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={shippingAddress.postalCode}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-[#FCFBFA] border border-[#D4CDCA]/60 rounded-xl py-3.5 px-4 outline-none focus:border-[#E0655F] focus:ring-2 focus:ring-[#E0655F]/10 transition-all text-sm"
                      placeholder="400001"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={shippingAddress.country}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-[#FCFBFA] border border-[#D4CDCA]/60 rounded-xl py-3.5 px-4 outline-none focus:border-[#E0655F] focus:ring-2 focus:ring-[#E0655F]/10 transition-all text-sm"
                      placeholder="India"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingAddress.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-[#FCFBFA] border border-[#D4CDCA]/60 rounded-xl py-3.5 px-4 outline-none focus:border-[#E0655F] focus:ring-2 focus:ring-[#E0655F]/10 transition-all text-sm"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl shadow-sm border border-[#D4CDCA]/30 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-[#FFF7F3] rounded-lg">
                    <CreditCard size={20} className="text-[#E0655F]" />
                  </div>
                  <h2 className="text-xl font-serif font-bold text-[#1A1A1A]">
                    Payment Method
                  </h2>
                </div>

                <div className="space-y-3">
                  {[
                    { value: "Cash On Delivery", label: "Cash On Delivery", icon: <Truck size={18} /> },
                    { value: "UPI", label: "UPI Payment", icon: <CreditCard size={18} /> },
                  ].map((method) => (
                    <label
                      key={method.value}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        paymentMethod === method.value
                          ? "border-[#E0655F] bg-[#FFF7F3]"
                          : "border-[#D4CDCA]/30 hover:border-[#D4CDCA]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.value}
                        checked={paymentMethod === method.value}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="accent-[#E0655F]"
                      />
                      <div className="text-[#E0655F]">{method.icon}</div>
                      <span className="font-semibold text-sm text-[#1A1A1A]">
                        {method.label}
                      </span>
                      {paymentMethod === method.value && (
                        <CheckCircle
                          size={18}
                          className="ml-auto text-[#E0655F]"
                        />
                      )}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-[#D4CDCA]/30 p-6 sticky top-24">
                <h2 className="text-xl font-serif font-bold text-[#1A1A1A] mb-6 pb-4 border-b border-[#D4CDCA]/30">
                  Order Summary
                </h2>

                {/* Cart Items Preview */}
                <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
                  {cart.items.map((item) => (
                    <div key={item._id} className="flex gap-3">
                      <img
                        src={
                          item.productId?.images?.[0] || "/placeholder.png"
                        }
                        alt={item.productId?.name}
                        className="w-14 h-14 object-cover rounded-lg border border-[#D4CDCA]/30"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#1A1A1A] truncate">
                          {item.productId?.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          {item.color} / {item.size} × {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-bold text-[#1A1A1A]">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 border-t border-[#D4CDCA]/30 pt-4">
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-semibold">
                      ₹{itemsPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Shipping</span>
                    <span className="font-semibold">
                      {shippingPrice === 0
                        ? "Free"
                        : `₹${shippingPrice}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Tax (5%)</span>
                    <span className="font-semibold">₹{taxPrice}</span>
                  </div>
                  <div className="flex justify-between text-xl font-serif font-bold text-[#1A1A1A] pt-3 border-t border-[#D4CDCA]/30">
                    <span>Total</span>
                    <span className="text-[#E0655F]">
                      ₹{totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-6 bg-[#1A1A1A] text-white text-sm font-bold uppercase tracking-widest py-4 rounded-xl hover:bg-[#E0655F] transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <ShieldCheck size={18} />
                  )}
                  {submitting ? "Placing Order..." : "Place Order"}
                </button>

                <p className="text-xs text-center text-slate-400 mt-3">
                  By placing your order, you agree to our Terms & Conditions
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
