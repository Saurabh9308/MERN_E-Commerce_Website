// components/Navbar.jsx
import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  User,
  Search,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Fetch cart count
  useEffect(() => {
    const fetchCartCount = async () => {
      if (isAuthenticated) {
        try {
          const response = await axios.get(
            "https://auramart-backend-glf6.onrender.com/api/cart",
            { withCredentials: true }
          );
          const items = response.data.items || [];
          const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
          setCartCount(totalItems);
        } catch (error) {
          if (error.response?.status !== 401) {
            console.error("Error fetching cart:", error);
          }
        }
      } else {
        setCartCount(0);
      }
    };

    fetchCartCount();
  }, [isAuthenticated]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Contact Us", path: "/contact" },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-[#D4CDCA]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <div className="h-9 w-9 bg-[#E0655F] rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <span className="text-2xl font-serif font-bold tracking-tight text-[#1A1A1A]">
              Aura<span className="text-[#E0655F]">Mart</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-8 ml-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-sm font-bold uppercase tracking-widest text-[#1A1A1A]/70 hover:text-[#E0655F] transition-colors"
              >
                {link.name}
              </Link>
            ))}

            {user?.role === "admin" && (
              <Link
                to="/admin-panel"
                className="flex items-center gap-1 text-sm font-bold uppercase tracking-widest text-[#E0655F] hover:text-[#1A1A1A] transition-colors"
              >
                <LayoutDashboard size={14} /> Admin Panel
              </Link>
            )}
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 mx-12">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search collections..."
                className="w-full bg-[#FFF7F3] border border-[#D4CDCA]/50 rounded-full py-2.5 px-5 pl-11 focus:ring-2 focus:ring-[#E0655F]/20 outline-none text-sm"
              />
              <Search className="absolute left-4 top-3 text-[#1A1A1A]/40 h-4 w-4" />
            </div>
          </div>

          {/* Desktop Icons */}
          <div className="flex items-center gap-5 text-[#1A1A1A]">
            {isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] uppercase tracking-tighter text-slate-400 font-bold leading-none">
                    {user?.role === "admin" ? "Administrator" : "Welcome"}
                  </span>
                  <span className="text-sm font-bold text-[#E0655F]">
                    {user?.name?.split(" ")[0] || "User"}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="hover:text-red-500 transition-colors p-1 cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="hover:text-[#E0655F] transition-colors p-1 group"
              >
                <User className="h-5 w-5 group-hover:scale-110 transition-transform" />
              </Link>
            )}

            <Link to="/cart">
              <button className="relative hover:text-[#E0655F] transition-colors p-1 group cursor-pointer">
                <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#E0655F] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                    {cartCount}
                  </span>
                )}
              </button>
            </Link>

            <button
              className="lg:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-[#E0655F]" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden transition-all duration-500 ease-in-out bg-white border-b border-[#D4CDCA]/50 overflow-hidden ${
          isMenuOpen ? "max-h-125 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pt-4 pb-8 space-y-4">
          {isAuthenticated && (
            <div className="pb-4 border-b border-[#D4CDCA]/30">
              <p className="text-[10px] text-[#E0655F] uppercase tracking-widest font-black">
                {user?.role === "admin" ? "Admin Dashboard" : "Your Profile"}
              </p>
              <p className="text-xl font-serif font-bold text-[#1A1A1A]">
                {user?.name}
              </p>
            </div>
          )}

          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="block text-lg font-serif font-medium text-[#1A1A1A] hover:text-[#E0655F]"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          {user?.role === "admin" && (
            <Link
              to="/admin-panel"
              className="block text-lg font-serif font-medium text-[#E0655F]"
              onClick={() => setIsMenuOpen(false)}
            >
              Admin Panel
            </Link>
          )}

          {isAuthenticated ? (
            <button
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 text-lg font-serif font-medium text-red-500 pt-4 border-t border-[#D4CDCA]/30 cursor-pointer"
            >
              <LogOut size={20} /> Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="block text-lg font-serif font-medium text-[#E0655F] pt-4 border-t border-[#D4CDCA]/30"
              onClick={() => setIsMenuOpen(false)}
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;