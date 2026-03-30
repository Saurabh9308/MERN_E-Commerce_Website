import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    // CRITICAL: false for Postman/Localhost, true for HTTPS Production
    secure: process.env.NODE_ENV === "production", 
    sameSite: "strict", 
    maxAge: 30 * 24 * 60 * 60 * 1000, 
  });

  return token;
};

export default generateToken;