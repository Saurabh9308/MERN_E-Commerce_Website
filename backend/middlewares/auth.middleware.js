import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authenticateUser = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized - No token provided" });
  }

  try {
    // 2. Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ success: false, message: "Unauthorized - Invalid token" });
    }

    // 3. Find the user and attach to request (excluding password)
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Add user object to the request for the next middleware/controller
    req.user = user;
    
    next();
  } catch (error) {
    console.error("Error in authenticateUser:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};