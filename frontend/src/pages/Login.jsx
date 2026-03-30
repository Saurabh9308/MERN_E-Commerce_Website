import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Eye, EyeOff, ArrowRight, Smartphone } from "lucide-react";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import SectionTitle from "../components/common/SectionTitle";
import axios from "axios";
import { toast } from "react-toastify";

const modelImage = "/reza-delkhosh-1h4SHm3SZ0c-unsplash.jpg";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  // 1. Updated state for inputs
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // 2. Function to update state as user types
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://auramart-backend-glf6.onrender.com/api/users/login",
        formData,
        { withCredentials: true } // Crucial for cookies
      );

      if (response.data.success) {
        const { user } = response.data;

        // We store user info (name, email, role) for UI display,
        // but NOT the token (it's in an HttpOnly cookie now).
        localStorage.setItem("userInfo", JSON.stringify(user));

        // Trigger navbar update
        window.dispatchEvent(new Event("authChange"));

        toast.success(response.data.message || "Login Successful!");

        // Route based on role
        if (user.role === "admin") {
          navigate("/admin-panel");
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Login failed.";
      toast.error(msg);
    }
  };
  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { staggerChildren: 0.1, duration: 0.5, ease: "easeOut" },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
  };
  return (
    <div className="min-h-screen bg-[#FCFBFA] flex items-center justify-center p-4 sm:p-6 md:p-10">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-4xl md:rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(224,101,95,0.12)] w-full max-w-5xl flex overflow-hidden border border-[#D4CDCA]/20"
      >
        {/* --- FORM SECTION --- */}
        <div className="w-full md:w-1/2 p-8 lg:p-16 flex flex-col justify-center">
          {/* Reusing your SectionTitle Component */}
          <motion.div variants={itemVariants} className="mb-10">
            <SectionTitle subtitle="Welcome Back" title="Sign In to AuraMart" />
            <p className="text-center text-slate-400 text-sm font-medium mt-4">
              New to our collection?{" "}
              <Link
                to="/register"
                className="text-[#E0655F] font-bold hover:underline underline-offset-4"
              >
                Join Now
              </Link>
            </p>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            variants={itemVariants}
            className="space-y-6"
          >
            {/* Email Input */}
            <div className="group relative">
              <input
                type="email"
                name="email" // Added
                value={formData.email} // Added
                onChange={handleChange} // Added
                required // Good practice
                placeholder="Email Address"
                className="w-full bg-[#FCFBFA] border-b border-[#D4CDCA]/60 py-4 px-2 outline-none focus:border-[#E0655F] transition-all text-sm group-hover:bg-[#FFF7F3]/30"
              />
              <Mail
                className="absolute right-2 top-4 text-[#D4CDCA] group-focus-within:text-[#E0655F] transition-colors"
                size={18}
              />
            </div>

            {/* Password Input */}
            <div className="group relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password" // Added
                value={formData.password} // Added
                onChange={handleChange} // Added
                required // Good practice
                placeholder="Password"
                className="w-full bg-[#FCFBFA] border-b border-[#D4CDCA]/60 py-4 px-2 outline-none focus:border-[#E0655F] transition-all text-sm group-hover:bg-[#FFF7F3]/30"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-4 text-[#D4CDCA] hover:text-[#1A1A1A]"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="flex justify-end text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-[#E0655F] cursor-pointer transition-colors">
              Forgot Password?
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit" // Ensure this is 'submit'
              whileHover={{ scale: 1.01, backgroundColor: "#E0655F" }}
              whileTap={{ scale: 0.99 }}
              className="w-full bg-[#1A1A1A] text-white py-4.5 rounded-xl font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all shadow-lg active:shadow-sm cursor-pointer"
            >
              Sign In <ArrowRight size={16} />
            </motion.button>
          </motion.form>

          {/* Social Logins */}
          <motion.div
            variants={itemVariants}
            className="pt-8 flex flex-col gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-linear-to-r from-transparent to-[#D4CDCA]/40"></div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300">
                Auth Method
              </span>
              <div className="h-px flex-1 bg-linear-to-l from-transparent to-[#D4CDCA]/40"></div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button className="flex-1 py-3.5 border border-[#D4CDCA]/40 rounded-xl hover:bg-[#FCFBFA] hover:border-[#E0655F]/30 transition-all flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A] cursor-pointer">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </button>
              <button className="flex-1 py-3.5 border border-[#D4CDCA]/40 rounded-xl hover:bg-[#FCFBFA] hover:border-[#E0655F]/30 transition-all flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A] cursor-pointer">
                <Smartphone size={14} className="text-[#E0655F]" />
                Mobile
              </button>
            </div>
          </motion.div>
        </div>

        {/* --- IMAGE SECTION (Hidden on Mobile) --- */}
        <div className="hidden md:block w-1/2 relative overflow-hidden group">
          <motion.img
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.8, ease: "easeOut" }}
            src={modelImage}
            className="absolute inset-0 w-full h-full object-cover grayscale-10% group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-tr from-[#1A1A1A]/80 via-transparent to-[#1A1A1A]/20" />

          <div className="absolute bottom-12 left-12 z-20 space-y-4">
            <div className="w-12 h-1 bg-[#E0655F] rounded-full" />
            <h2 className="text-white font-serif text-5xl leading-[1.1]">
              Timeless <br />
              <span className="italic font-light text-[#E0655F]">
                Confidence.
              </span>
            </h2>
          </div>

          <div className="absolute top-10 right-10 w-16 h-16 bg-white/5 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/10 group-hover:rotate-12 transition-transform duration-500">
            <span className="text-white font-serif text-2xl font-bold">A</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
