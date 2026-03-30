import express from "express";
import {
  getDashboardStats,
  getAllUsers,
  deleteUser,
} from "../controllers/admin.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

// All admin routes require authentication + admin role
router.use(authenticateUser, authorizeRoles("admin"));

router.get("/stats", getDashboardStats);
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);

export default router;
