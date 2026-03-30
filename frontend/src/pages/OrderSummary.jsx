import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Package,
  Truck,
  MapPin,
  CreditCard,
  Loader2,
  ArrowLeft,
  ShoppingBag,
} from "lucide-react";
import axios from "axios";

const OrderSummary = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const api = axios.create({
    baseURL: "https://auramart-backend-glf6.onrender.com/api",
    withCredentials: true,
  });

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await api.get(`/orders/${id}`);
        setOrder(response.data.order);
      } catch (error) {
        console.error("Error fetching order:", error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF7F3] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#E0655F]" size={40} />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#FFF7F3] flex items-center justify-center">
        <p className="text-slate-500">Order not found</p>
      </div>
    );
  }

  const statusTimeline = ["Pending", "Processing", "Shipped", "Delivered"];
  const currentStatusIndex = statusTimeline.indexOf(order.orderStatus);

  return (
    <div className="bg-[#FFF7F3] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Success Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-6">
            <CheckCircle size={40} className="text-emerald-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#1A1A1A] mb-3">
            Order Confirmed!
          </h1>
          <p className="text-slate-500 max-w-md mx-auto">
            Thank you for your purchase. Your order has been placed
            successfully.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-[#D4CDCA]/30">
            <Package size={16} className="text-[#E0655F]" />
            <span className="text-sm font-bold text-[#1A1A1A]">
              Order ID: #{order._id.slice(-8).toUpperCase()}
            </span>
          </div>
        </div>

        {/* Order Status Timeline */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#D4CDCA]/30 p-6 md:p-8 mb-8">
          <h2 className="text-lg font-serif font-bold text-[#1A1A1A] mb-6">
            Order Status
          </h2>
          <div className="flex items-center justify-between">
            {statusTimeline.map((status, index) => (
              <div key={status} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      index <= currentStatusIndex
                        ? "bg-[#E0655F] text-white shadow-lg shadow-[#E0655F]/20"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {index <= currentStatusIndex ? "✓" : index + 1}
                  </div>
                  <span
                    className={`text-xs mt-2 font-semibold ${
                      index <= currentStatusIndex
                        ? "text-[#E0655F]"
                        : "text-slate-400"
                    }`}
                  >
                    {status}
                  </span>
                </div>
                {index < statusTimeline.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 ${
                      index < currentStatusIndex
                        ? "bg-[#E0655F]"
                        : "bg-slate-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Shipping Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#D4CDCA]/30 p-6">
            <div className="flex items-center gap-3 mb-4">
              <MapPin size={18} className="text-[#E0655F]" />
              <h3 className="font-bold text-[#1A1A1A]">Shipping Address</h3>
            </div>
            <div className="text-sm text-slate-600 space-y-1">
              <p className="font-semibold text-[#1A1A1A]">
                {order.shippingAddress.fullName}
              </p>
              <p>{order.shippingAddress.address}</p>
              <p>
                {order.shippingAddress.city},{" "}
                {order.shippingAddress.postalCode}
              </p>
              <p>{order.shippingAddress.country}</p>
              <p className="text-[#E0655F] font-semibold mt-2">
                📞 {order.shippingAddress.phone}
              </p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#D4CDCA]/30 p-6">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard size={18} className="text-[#E0655F]" />
              <h3 className="font-bold text-[#1A1A1A]">Payment Details</h3>
            </div>
            <div className="text-sm text-slate-600 space-y-2">
              <div className="flex justify-between">
                <span>Method</span>
                <span className="font-semibold text-[#1A1A1A]">
                  {order.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Status</span>
                <span
                  className={`font-semibold ${
                    order.isPaid ? "text-emerald-500" : "text-amber-500"
                  }`}
                >
                  {order.isPaid ? "Paid" : "Pending"}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#D4CDCA]/30">
                <span>Items Price</span>
                <span className="font-semibold">
                  ₹{order.itemsPrice.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-semibold">
                  {order.shippingPrice === 0
                    ? "Free"
                    : `₹${order.shippingPrice}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span className="font-semibold">₹{order.taxPrice}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-[#1A1A1A] pt-2 border-t border-[#D4CDCA]/30">
                <span>Total</span>
                <span className="text-[#E0655F]">
                  ₹{order.totalPrice.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#D4CDCA]/30 p-6 md:p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Truck size={18} className="text-[#E0655F]" />
            <h3 className="font-bold text-[#1A1A1A]">
              Order Items ({order.orderItems.length})
            </h3>
          </div>
          <div className="space-y-4">
            {order.orderItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-[#FFF7F3] rounded-xl"
              >
                <img
                  src={item.image || "/placeholder.png"}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg border border-[#D4CDCA]/30"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#1A1A1A] truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-slate-400">
                    {item.color} / {item.size} × {item.quantity}
                  </p>
                </div>
                <p className="font-bold text-[#1A1A1A]">
                  ₹{(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/my-orders"
            className="inline-flex items-center justify-center gap-2 bg-[#1A1A1A] text-white px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#E0655F] transition-all shadow-lg"
          >
            <ShoppingBag size={16} /> View My Orders
          </Link>
          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 border-2 border-[#1A1A1A] text-[#1A1A1A] px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#1A1A1A] hover:text-white transition-all"
          >
            <ArrowLeft size={16} /> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
