import React from "react";
import {
  ShoppingBag,
  Users,
  ArrowLeft,
  LayoutGrid,
  LogOut,
  Package,
  BarChart3,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    window.dispatchEvent(new Event("authChange"));
    navigate("/login");
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", path: "/admin-panel", icon: <BarChart3 size={20} /> },
    { id: "products", label: "Products", path: "/admin-panel/products", icon: <ShoppingBag size={20} /> },
    { id: "orders", label: "Orders", path: "/admin-panel/orders", icon: <Package size={20} /> },
    { id: "users", label: "Users", path: "/admin-panel/users", icon: <Users size={20} /> },
  ];

  return (
    <div className="h-screen w-64 bg-[#1A1A1A] text-slate-300 flex flex-col shadow-2xl border-r border-white/5 fixed left-0 top-0">
      {/* Brand Header */}
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#E0655F] rounded-lg">
            <LayoutGrid size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-serif font-bold text-white tracking-tight">
              AuraMart
            </h2>
            <p className="text-[10px] text-[#E0655F] font-bold uppercase tracking-wider">
              Admin Panel
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive =
            item.path === "/admin-panel"
              ? location.pathname === "/admin-panel" || location.pathname === "/admin-panel/"
              : location.pathname.startsWith(item.path);

          return (
            <Link
              key={item.id}
              to={item.path}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl transition-all duration-300 ${
                isActive
                  ? "bg-[#E0655F] text-white shadow-lg shadow-[#E0655F]/20"
                  : "hover:bg-white/5 hover:text-white"
              }`}
            >
              {item.icon}
              <span className="font-semibold tracking-wide text-sm">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-white/5 bg-black/20 space-y-1">
        <Link
          to="/"
          className="flex items-center gap-3 px-5 py-3 rounded-xl hover:text-white transition-colors text-xs font-bold uppercase tracking-wider text-slate-500"
        >
          <ArrowLeft size={16} />
          Back to Store
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-5 py-3 rounded-xl hover:text-red-400 transition-colors text-xs font-bold uppercase tracking-wider text-slate-500 cursor-pointer w-full"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;