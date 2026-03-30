import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Package,
  Eye,
  ShoppingBag,
  Loader2,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";
import SectionTitle from "../components/common/SectionTitle";
import axios from "axios";
import { toast } from "react-toastify";

const statusConfig = {
  Pending: { color: "text-amber-600 bg-amber-50 border-amber-200", icon: <Clock size={14} /> },
  Processing: { color: "text-blue-600 bg-blue-50 border-blue-200", icon: <RefreshCw size={14} /> },
  Shipped: { color: "text-purple-600 bg-purple-50 border-purple-200", icon: <Truck size={14} /> },
  Delivered: { color: "text-emerald-600 bg-emerald-50 border-emerald-200", icon: <CheckCircle size={14} /> },
  Cancelled: { color: "text-red-600 bg-red-50 border-red-200", icon: <XCircle size={14} /> },
};

const MyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const api = axios.create({
    baseURL: "http://localhost:8080/api",
    withCredentials: true,
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("/orders/my-orders");
        setOrders(response.data.orders);
      } catch (error) {
        if (error.response?.status === 401) {
          toast.error("Please login to view orders");
          navigate("/login");
        } else {
          toast.error("Failed to load orders");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF7F3] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin text-[#E0655F] mx-auto mb-4" size={40} />
          <p className="text-slate-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFF7F3] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="text-center mb-10">
          <SectionTitle title="My Orders" subtitle="Order History" />
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-[#D4CDCA]/30 p-12 text-center">
            <ShoppingBag className="w-20 h-20 mx-auto text-[#E0655F]/30 mb-6" />
            <p className="text-2xl text-[#1A1A1A] font-serif mb-4">
              No orders yet
            </p>
            <p className="text-slate-600 mb-8">
              Looks like you haven't placed any orders yet. Start shopping now!
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-[#1A1A1A] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#E0655F] transition-all"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const statusStyle = statusConfig[order.orderStatus] || statusConfig.Pending;
              return (
                <div
                  key={order._id}
                  className="bg-white rounded-2xl shadow-sm border border-[#D4CDCA]/30 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-[#FFF7F3] border-b border-[#D4CDCA]/30 gap-3">
                    <div className="flex items-center gap-3">
                      <Package size={18} className="text-[#E0655F]" />
                      <span className="text-sm font-bold text-[#1A1A1A]">
                        #{order._id.slice(-8).toUpperCase()}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusStyle.color}`}
                    >
                      {statusStyle.icon}
                      {order.orderStatus}
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="p-5">
                    <div className="flex flex-wrap gap-3 mb-4">
                      {order.orderItems.slice(0, 4).map((item, index) => (
                        <img
                          key={index}
                          src={item.image || "/placeholder.png"}
                          alt={item.name}
                          className="w-14 h-14 object-cover rounded-lg border border-[#D4CDCA]/30"
                        />
                      ))}
                      {order.orderItems.length > 4 && (
                        <div className="w-14 h-14 bg-slate-100 rounded-lg flex items-center justify-center text-xs font-bold text-slate-500">
                          +{order.orderItems.length - 4}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <p className="text-sm text-slate-500">
                          {order.orderItems.length} item
                          {order.orderItems.length > 1 ? "s" : ""}
                        </p>
                        <p className="text-xl font-bold text-[#E0655F]">
                          ₹{order.totalPrice.toLocaleString()}
                        </p>
                      </div>
                      <Link
                        to={`/order-summary/${order._id}`}
                        className="inline-flex items-center gap-2 bg-[#1A1A1A] text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#E0655F] transition-all"
                      >
                        <Eye size={14} /> View Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
