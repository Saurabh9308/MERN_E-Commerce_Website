import express from "express";
import { addToCart, getCart, removeFromCart, updateQuantity, clearCart } from "../controllers/cart.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Apply auth middleware to all cart routes


router.get("/", authenticateUser, getCart);
router.post("/add",authenticateUser, addToCart);
router.delete("/remove/:itemId", authenticateUser, removeFromCart);
router.patch("/update",authenticateUser, updateQuantity); // For quantity changes
router.delete("/clear",authenticateUser, clearCart);      // For clearing cart

export default router;