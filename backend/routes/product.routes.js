import express from "express";
import { 
  createProduct, 
  getAllProducts, 
  getProductById, 
  deleteProduct 
} from "../controllers/product.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

// --- PUBLIC ROUTES ---
// Anyone can view products or a specific product
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// --- ADMIN ROUTES ---
// Only authenticated admins can create or delete products
router.post(
  "/create", 
  authenticateUser, 
  authorizeRoles("admin"), 
  createProduct
);

router.delete(
  "/:id", 
  authenticateUser, 
  authorizeRoles("admin"), 
  deleteProduct
);

export default router;