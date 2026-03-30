import React, { useState, useEffect } from "react";
import {
  Package,
  Loader2,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  RefreshCw,
  Eye,
  ChevronDown,
  Search,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const statusConfig = {
  Pending: { color: "text-amber-600 bg-amber-50 border-amber-200", icon: <Clock size={14} /> },
  Processing: { color: "text-blue-600 bg-blue-50 border-blue-200", icon: <RefreshCw size={14} /> },
  Shipped: { color: "text-purple-600 bg-purple-50 border-purple-200", icon: <Truck size={14} /> },
  Delivered: { color: "text-emerald-600 bg-emerald-50 border-emerald-200", icon: <CheckCircle size={14} /> },
  Cancelled: { color: "text-red-600 bg-red-50 border-red-200", icon: <XCircle size={14} /> },
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [expandedOrder, setExpandedOrder] = useState(null);

  const api = axios.create({
    baseURL: "http://localhost:8080/api",
    withCredentials: true,
  });

  const fetchOrders = async () => {
    try {
      const response = await api.get("/orders/admin/all");
      setOrders(response.data.orders);
    } catch (error) {
      toast.error("Failed to fetch orders");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await api.put(`/orders/${orderId}/status`, {
        status: newStatus,
      });
      if (response.data.success) {
        toast.success(`Order status updated to ${newStatus}`);
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId
              ? { ...order, orderStatus: newStatus }
              : order
          )
        );
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "All" || order.orderStatus === filterStatus;

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-[#E0655F]" size={32} />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <span className="inline-block px-4 py-1 text-[10px] font-black tracking-[0.3em] text-[#E0655F] uppercase bg-white rounded-full shadow-sm mb-4">
          Order Management
        </span>
        <h1 className="text-3xl md:text-4xl font-serif text-[#1A1A1A]">
          All Orders
        </h1>
        <p className="text-slate-500 mt-2">{orders.length} total orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search by order ID, customer name, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-[#D4CDCA]/50 rounded-xl focus:ring-2 focus:ring-[#E0655F]/20 focus:border-[#E0655F] outline-none text-sm"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  filterStatus === status
                    ? "bg-[#1A1A1A] text-white shadow-lg"
                    : "bg-white text-slate-500 border border-[#D4CDCA]/50 hover:border-[#E0655F]"
                }`}
              >
                {status}
              </button>
            )
          )}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-[#D4CDCA]/30">
            <Package className="w-16 h-16 mx-auto text-slate-300 mb-4" />
            <p className="text-xl font-serif text-slate-500">
              No orders found
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const statusStyle =
              statusConfig[order.orderStatus] || statusConfig.Pending;
            const isExpanded = expandedOrder === order._id;

            return (
              <div
                key={order._id}
                className="bg-white rounded-2xl shadow-sm border border-[#D4CDCA]/30 overflow-hidden transition-all hover:shadow-md"
              >
                {/* Order Row */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-5 gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="p-2.5 bg-[#FFF7F3] rounded-xl">
                      <Package size={20} className="text-[#E0655F]" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#1A1A1A]">
                        #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-xs text-slate-400">
                        {order.user?.name} • {order.user?.email}
                      </p>
                      <p className="text-xs text-slate-400">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-wrap">
                    {/* Status Badge */}
                    <div
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${statusStyle.color}`}
                    >
                      {statusStyle.icon}
                      {order.orderStatus}
                    </div>

                    {/* Total */}
                    <p className="text-lg font-bold text-[#E0655F] min-w-[100px] text-right">
                      ₹{order.totalPrice.toLocaleString()}
                    </p>

                    {/* Status Update Dropdown */}
                    <div className="relative">
                      <select
                        value={order.orderStatus}
                        onChange={(e) =>
                          handleStatusUpdate(order._id, e.target.value)
                        }
                        className="appearance-none bg-[#1A1A1A] text-white text-xs font-bold px-4 py-2 pr-8 rounded-lg cursor-pointer outline-none"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                      <ChevronDown
                        size={14}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-white pointer-events-none"
                      />
                    </div>

                    {/* Expand Toggle */}
                    <button
                      onClick={() =>
                        setExpandedOrder(isExpanded ? null : order._id)
                      }
                      className="p-2 hover:bg-[#FFF7F3] rounded-lg transition-colors cursor-pointer"
                    >
                      <Eye
                        size={18}
                        className={
                          isExpanded ? "text-[#E0655F]" : "text-slate-400"
                        }
                      />
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-[#D4CDCA]/30 p-5 bg-[#FFF7F3]/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Items */}
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
                          Order Items
                        </h4>
                        <div className="space-y-3">
                          {order.orderItems.map((item, i) => (
                            <div key={i} className="flex gap-3 items-center">
                              <img
                                src={item.image || "/placeholder.png"}
                                alt={item.name}
                                className="w-10 h-10 object-cover rounded-lg border"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold truncate">
                                  {item.name}
                                </p>
                                <p className="text-xs text-slate-400">
                                  {item.color}/{item.size} × {item.quantity}
                                </p>
                              </div>
                              <p className="text-sm font-bold">
                                ₹{(item.price * item.quantity).toLocaleString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Shipping */}
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
                          Shipping Address
                        </h4>
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
                          <p className="text-[#E0655F] font-semibold">
                            📞 {order.shippingAddress.phone}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
