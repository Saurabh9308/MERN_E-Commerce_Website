import React, { useState, useEffect } from "react";
import Newsletter from "../components/home/NewsLetter";
import { Link, useNavigate } from "react-router-dom";
import {
  Trash2,
  ShoppingBag,
  CreditCard,
  Truck,
  Headphones,
  Minus,
  Plus,
} from "lucide-react";
import SectionTitle from "../components/common/SectionTitle";
import axios from "axios";
import { toast } from "react-toastify";

const Cart = () => {
  const [cart, setCart] = useState({
    items: [],
    billDetails: { grandTotal: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Helper for API calls with credentials
  const api = axios.create({
    baseURL: "https://auramart-backend-glf6.onrender.com/api",
    withCredentials: true,
  });

  // Check authentication status
  const checkAuth = () => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  };

  const fetchCart = async () => {
    // First check if user is authenticated
    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo) {
      setCart({ items: [], billDetails: { grandTotal: 0 } });
      setLoading(false);
      setIsAuthenticated(false);
      return;
    }

    setIsAuthenticated(true);
    
    try {
      const response = await api.get("/cart");
      setCart(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        // User is not authenticated or token expired
        localStorage.removeItem("userInfo");
        setIsAuthenticated(false);
        setCart({ items: [], billDetails: { grandTotal: 0 } });
        toast.info("Please login to view your cart");
      } else {
        console.error("Error fetching cart:", error);
        toast.error("Failed to load cart");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
    fetchCart();
    
    // Listen for auth changes (login/logout)
    const handleAuthChange = () => {
      checkAuth();
      fetchCart();
    };
    
    window.addEventListener("authChange", handleAuthChange);
    
    return () => {
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const calculateTotals = () => {
    const items = cart.items || [];

    if (items.length === 0) {
      return { totalItems: 0, subTotal: 0, shipping: 0, grandTotal: 0 };
    }

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const subTotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const shipping = subTotal > 50 ? 0.0 : 10.0;
    const grandTotal = subTotal + shipping;

    return { totalItems, subTotal, shipping, grandTotal };
  };

  const { totalItems, subTotal, shipping, grandTotal } = calculateTotals();

  const handleQuantityChange = async (itemId, currentQuantity, change) => {
    // Check authentication before any action
    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo) {
      toast.error("Please login to update cart");
      navigate("/login");
      return;
    }

    if (currentQuantity === 1 && change === -1) {
      handleRemoveItem(itemId);
      return;
    }

    try {
      const response = await api.patch("/cart/update", { itemId, change });
      if (response.data.success) {
        setCart(response.data.cart);
        toast.success("Cart updated successfully");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("userInfo");
        setIsAuthenticated(false);
        toast.error("Session expired. Please login again");
        navigate("/login");
      } else if (error.response?.status === 400) {
        toast.error(error.response.data.message || "Cannot update quantity");
      } else {
        console.error("Error updating quantity:", error);
        toast.error("Failed to update quantity");
      }
    }
  };

  const handleClearCart = async () => {
    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo) {
      toast.error("Please login to clear cart");
      navigate("/login");
      return;
    }

    try {
      const response = await api.delete("/cart/clear");
      if (response.data.success) {
        setCart({ items: [], billDetails: { grandTotal: 0 } });
        toast.success("Cart cleared successfully");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("userInfo");
        setIsAuthenticated(false);
        toast.error("Session expired. Please login again");
        navigate("/login");
      } else {
        console.error("Error clearing cart:", error);
        toast.error("Failed to clear cart");
      }
    }
  };

  const handleRemoveItem = async (itemId) => {
    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo) {
      toast.error("Please login to remove items");
      navigate("/login");
      return;
    }

    try {
      const response = await api.delete(`/cart/remove/${itemId}`);
      if (response.data.success) {
        setCart(response.data.cart);
        toast.success("Item removed from cart");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("userInfo");
        setIsAuthenticated(false);
        toast.error("Session expired. Please login again");
        navigate("/login");
      } else {
        console.error("Error removing item:", error);
        toast.error("Failed to remove item");
      }
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="bg-[#FFF7F3] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E0655F] mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  // Show login required message if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        <div className="bg-[#FFF7F3] min-h-screen">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <div className="text-center mb-10 md:mb-12">
              <SectionTitle title="Your Cart" subtitle={"Shopping Cart"} />
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-[#D4CDCA]/30 max-w-2xl mx-auto">
              <ShoppingBag className="w-20 h-20 mx-auto text-[#E0655F]/30 mb-6" />
              <p className="text-2xl text-[#1A1A1A] font-serif mb-4">
                Please Login to View Cart
              </p>
              <p className="text-slate-600 mb-8">
                You need to be logged in to access your shopping cart and manage your items.
              </p>
              <div className="flex gap-4 justify-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 bg-[#1A1A1A] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#E0655F] transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Login to Continue
                </Link>
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 border-2 border-[#1A1A1A] text-[#1A1A1A] px-8 py-3 rounded-full font-semibold hover:bg-[#1A1A1A] hover:text-white transition-all duration-300"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
        <Newsletter />
      </>
    );
  }

  // Main cart view for authenticated users
  return (
    <>
      <div className="bg-[#FFF7F3] min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Header Section */}
          <div className="text-center mb-10 md:mb-12">
            <SectionTitle title="Your Cart" subtitle={"Shopping Cart"} />
            <p className="text-slate-600 mt-3 max-w-md mx-auto">
              {cart.items.length > 0
                ? `You have ${totalItems} item${
                    totalItems !== 1 ? "s" : ""
                  } in your cart`
                : "Your cart is waiting to be filled"}
            </p>
          </div>

          {/* Main Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Side: Cart Items */}
            <div className="lg:col-span-2">
              {cart.items.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-[#D4CDCA]/30">
                  <ShoppingBag className="w-20 h-20 mx-auto text-[#E0655F]/30 mb-6" />
                  <p className="text-2xl text-[#1A1A1A] font-serif mb-4">
                    Your cart is empty
                  </p>
                  <p className="text-slate-600 mb-8">
                    Looks like you haven't added any items to your cart yet.
                  </p>
                  <Link
                    to="/products"
                    className="inline-flex items-center gap-2 bg-[#1A1A1A] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#E0655F] transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-[#D4CDCA]/30 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px]">
                      <thead className="bg-[#FFF7F3] border-b border-[#D4CDCA]/30">
                        <tr>
                          <th className="py-4 px-6 text-left text-sm font-semibold text-[#1A1A1A]">
                            Product
                          </th>
                          <th className="py-4 px-6 text-left text-sm font-semibold text-[#1A1A1A]">
                            Price
                          </th>
                          <th className="py-4 px-6 text-left text-sm font-semibold text-[#1A1A1A]">
                            Quantity
                          </th>
                          <th className="py-4 px-6 text-left text-sm font-semibold text-[#1A1A1A]">
                            Subtotal
                          </th>
                          <th className="py-4 px-6 text-left text-sm font-semibold text-[#1A1A1A]">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {cart.items.map((item) => (
                          <tr
                            key={item._id}
                            className="border-b border-[#D4CDCA]/20 hover:bg-[#FFF7F3]/50 transition-colors"
                          >
                            <td className="py-6 px-6">
                              <div className="flex items-center gap-4">
                                <img
                                  src={
                                    item.productId?.images?.[0] ||
                                    "/placeholder.png"
                                  }
                                  alt={item.productId?.name}
                                  className="w-20 h-20 object-cover rounded-xl border border-[#D4CDCA]/30"
                                />
                                <div>
                                  <p className="font-semibold text-lg text-[#1A1A1A]">
                                    {item.productId?.name}
                                  </p>
                                  <p className="text-slate-500 text-sm mt-1">
                                    Size: {item.size} | Color: {item.color}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="py-6 px-6 text-lg font-medium text-[#1A1A1A]">
                              ₹{item.price.toFixed(2)}
                            </td>
                            <td className="py-6 px-6">
                              <div className="inline-flex items-center border border-[#D4CDCA]/50 rounded-full bg-white">
                                <button
                                  onClick={() =>
                                    handleQuantityChange(item._id, item.quantity, -1)
                                  }
                                  className="p-2 text-slate-500 hover:text-[#E0655F] hover:bg-[#FFF7F3] rounded-l-full transition-colors cursor-pointer"
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus size={16} />
                                </button>
                                <span className="px-4 py-1.5 font-semibold text-lg w-12 text-center text-[#1A1A1A]">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    handleQuantityChange(item._id, item.quantity, 1)
                                  }
                                  className="p-2 text-slate-500 hover:text-[#E0655F] hover:bg-[#FFF7F3] rounded-r-full transition-colors cursor-pointer"
                                >
                                  <Plus size={16} />
                                </button>
                              </div>
                            </td>
                            <td className="py-6 px-6 text-xl font-semibold text-[#E0655F]">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </td>
                            <td className="py-6 px-6">
                              <button
                                onClick={() => handleRemoveItem(item._id)}
                                className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                                aria-label="Remove item"
                              >
                                <Trash2 size={20} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6 bg-[#FFF7F3] border-t border-[#D4CDCA]/30">
                    <Link
                      to="/products"
                      className="text-[#1A1A1A] font-medium hover:text-[#E0655F] transition-colors flex items-center gap-2"
                    >
                      ← Continue Shopping
                    </Link>
                    <button
                      onClick={handleClearCart}
                      className="text-slate-600 font-medium hover:text-red-500 transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <Trash2 size={18} />
                      Clear Shopping Cart
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Side: Order Summary */}
            {cart.items.length > 0 && (
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-sm border border-[#D4CDCA]/30 p-6 sticky top-8">
                  <h2 className="text-2xl font-serif text-[#1A1A1A] mb-6 pb-4 border-b border-[#D4CDCA]/30">
                    Order Summary
                  </h2>

                  <div className="space-y-4">
                    <div className="flex justify-between text-slate-700">
                      <span>Items ({totalItems})</span>
                      <span className="font-semibold text-[#1A1A1A]">
                        ₹{subTotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-700">
                      <span>Subtotal</span>
                      <span className="font-semibold text-[#1A1A1A]">
                        ₹{subTotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-700">
                      <div className="flex items-center gap-2">
                        <span>Shipping</span>
                      </div>
                      <span className="font-semibold text-[#1A1A1A]">
                        {shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-700">
                      <span>Taxes</span>
                      <span className="font-semibold text-[#1A1A1A]">₹0.00</span>
                    </div>

                    <div className="pt-4 mt-4 border-t-2 border-[#E0655F]/30">
                      <div className="flex justify-between text-2xl font-serif font-bold text-[#1A1A1A]">
                        <span>Total</span>
                        <span className="text-[#E0655F]">
                          ₹{grandTotal.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-2">
                        *Free shipping on orders over ₹500
                      </p>
                    </div>

                    <button 
                      onClick={() => navigate("/checkout")}
                      className="w-full mt-6 bg-[#1A1A1A] text-white text-lg font-semibold py-4 rounded-full hover:bg-[#E0655F] transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group cursor-pointer"
                    >
                      <CreditCard
                        size={20}
                        className="group-hover:scale-105 transition-transform"
                      />
                      Proceed to Checkout
                    </button>

                    <p className="text-xs text-center text-slate-500 mt-4">
                      Secure payment powered by Stripe
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Features Section */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-4 border border-[#D4CDCA]/30 hover:shadow-md transition-shadow">
              <div className="p-3 bg-[#FFF7F3] rounded-xl">
                <Truck className="w-8 h-8 text-[#E0655F]" />
              </div>
              <div>
                <h4 className="font-semibold text-[#1A1A1A] text-lg">
                  Free Shipping
                </h4>
                <p className="text-slate-600 text-sm">
                  Free shipping for orders above ₹50
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-4 border border-[#D4CDCA]/30 hover:shadow-md transition-shadow">
              <div className="p-3 bg-[#FFF7F3] rounded-xl">
                <CreditCard className="w-8 h-8 text-[#E0655F]" />
              </div>
              <div>
                <h4 className="font-semibold text-[#1A1A1A] text-lg">
                  Flexible Payment
                </h4>
                <p className="text-slate-600 text-sm">
                  Multiple secure payment options
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-4 border border-[#D4CDCA]/30 hover:shadow-md transition-shadow">
              <div className="p-3 bg-[#FFF7F3] rounded-xl">
                <Headphones className="w-8 h-8 text-[#E0655F]" />
              </div>
              <div>
                <h4 className="font-semibold text-[#1A1A1A] text-lg">
                  24×7 Support
                </h4>
                <p className="text-slate-600 text-sm">
                  We support online all days
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Newsletter />
    </>
  );
};

export default Cart;