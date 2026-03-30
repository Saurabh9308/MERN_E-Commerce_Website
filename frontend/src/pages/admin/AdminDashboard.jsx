import React, { useState, useEffect } from "react";
import {
  DollarSign,
  Users,
  ShoppingBag,
  Package,
  TrendingUp,
  Clock,
  Truck,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import axios from "axios";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const api = axios.create({
    baseURL: "http://localhost:8080/api",
    withCredentials: true,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/admin/stats");
        setStats(response.data.stats);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-[#E0655F]" size={32} />
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Revenue",
      value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`,
      icon: <DollarSign size={22} />,
      gradient: "from-emerald-500 to-teal-600",
      textColor: "text-emerald-500",
    },
    {
      label: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: <Package size={22} />,
      gradient: "from-[#E0655F] to-rose-600",
      textColor: "text-[#E0655F]",
    },
    {
      label: "Total Products",
      value: stats?.totalProducts || 0,
      icon: <ShoppingBag size={22} />,
      gradient: "from-violet-500 to-purple-600",
      textColor: "text-violet-500",
    },
    {
      label: "Total Customers",
      value: stats?.totalUsers || 0,
      icon: <Users size={22} />,
      gradient: "from-blue-500 to-indigo-600",
      textColor: "text-blue-500",
    },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <Clock size={14} className="text-amber-500" />;
      case "Processing":
        return <TrendingUp size={14} className="text-blue-500" />;
      case "Shipped":
        return <Truck size={14} className="text-purple-500" />;
      case "Delivered":
        return <CheckCircle size={14} className="text-emerald-500" />;
      default:
        return <Package size={14} className="text-slate-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "text-amber-600 bg-amber-50";
      case "Processing":
        return "text-blue-600 bg-blue-50";
      case "Shipped":
        return "text-purple-600 bg-purple-50";
      case "Delivered":
        return "text-emerald-600 bg-emerald-50";
      case "Cancelled":
        return "text-red-600 bg-red-50";
      default:
        return "text-slate-600 bg-slate-50";
    }
  };

  return (
    <div>
      <div className="mb-8">
        <span className="inline-block px-4 py-1 text-[10px] font-black tracking-[0.3em] text-[#E0655F] uppercase bg-white rounded-full shadow-sm mb-4">
          Management Portal
        </span>
        <h1 className="text-3xl md:text-4xl font-serif text-[#1A1A1A]">
          Dashboard
        </h1>
        <p className="text-slate-500 mt-2">
          Welcome back! Here's what's happening with your store.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {statCards.map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="bg-white rounded-2xl border border-[#D4CDCA]/30 p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  {card.label}
                </p>
                <p className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mt-2">
                  {card.value}
                </p>
              </div>
              <div
                className={`p-3 rounded-xl bg-gradient-to-br ${card.gradient} text-white shadow-lg`}
              >
                {card.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Orders by Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="bg-white rounded-2xl border border-[#D4CDCA]/30 p-6 shadow-sm"
        >
          <h3 className="text-lg font-serif font-bold text-[#1A1A1A] mb-6">
            Orders by Status
          </h3>
          <div className="space-y-4">
            {(stats?.ordersByStatus || []).map((item) => {
              const percentage =
                stats.totalOrders > 0
                  ? Math.round((item.count / stats.totalOrders) * 100)
                  : 0;
              return (
                <div key={item._id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(item._id)}
                      <span className="text-sm font-semibold text-[#1A1A1A]">
                        {item._id}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-slate-500">
                        {item.count}
                      </span>
                      <span className="text-xs text-slate-400">
                        ({percentage}%)
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        item._id === "Delivered"
                          ? "bg-emerald-500"
                          : item._id === "Pending"
                          ? "bg-amber-500"
                          : item._id === "Processing"
                          ? "bg-blue-500"
                          : item._id === "Shipped"
                          ? "bg-purple-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {(!stats?.ordersByStatus || stats.ordersByStatus.length === 0) && (
              <p className="text-sm text-slate-400 text-center py-8">
                No orders yet
              </p>
            )}
          </div>
        </motion.div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="bg-white rounded-2xl border border-[#D4CDCA]/30 p-6 shadow-sm"
        >
          <h3 className="text-lg font-serif font-bold text-[#1A1A1A] mb-6">
            Recent Orders
          </h3>
          <div className="space-y-4">
            {(stats?.recentOrders || []).slice(0, 6).map((order) => (
              <div
                key={order._id}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-[#FFF7F3] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-[#FFF7F3] rounded-full flex items-center justify-center text-xs font-bold text-[#E0655F]">
                    {order.user?.name?.charAt(0).toUpperCase() || "?"}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1A1A1A]">
                      {order.user?.name || "Unknown"}
                    </p>
                    <p className="text-xs text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-[#1A1A1A]">
                    ₹{order.totalPrice.toLocaleString()}
                  </p>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getStatusColor(
                      order.orderStatus
                    )}`}
                  >
                    {order.orderStatus}
                  </span>
                </div>
              </div>
            ))}
            {(!stats?.recentOrders || stats.recentOrders.length === 0) && (
              <p className="text-sm text-slate-400 text-center py-8">
                No recent orders
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;