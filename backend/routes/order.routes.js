import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/order.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

// --- ADMIN ROUTES (must come BEFORE /:id to avoid "admin" being treated as an id) ---
router.get("/admin/all", authenticateUser, authorizeRoles("admin"), getAllOrders);

// --- USER ROUTES ---
router.post("/", authenticateUser, createOrder);
router.get("/my-orders", authenticateUser, getMyOrders);
router.get("/:id", authenticateUser, getOrderById);

// --- ADMIN STATUS UPDATE ---
router.put("/:id/status", authenticateUser, authorizeRoles("admin"), updateOrderStatus);

export default router;
