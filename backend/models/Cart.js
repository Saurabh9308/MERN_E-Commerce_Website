import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  color: {
    type: String, // From variantSchema
    required: true,
  },
  size: {
    type: String, // From sizeSchema (XS, S, M, etc.)
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, "Quantity cannot be less than 1."],
    default: 1,
  },
  price: {
    type: Number, // Snapshot of price at the time of adding to cart
    required: true,
  },
});

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // One cart per user
    },
    items: [cartItemSchema],
    billDetails: {
      totalPrice: { type: Number, default: 0 },
      discount: { type: Number, default: 0 },
      shipping: { type: Number, default: 0 },
      grandTotal: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

// Middleware to calculate totals before saving
// 🔥 Middleware to calculate totals automatically (Simplified Async Version)
cartSchema.pre("save", async function () {
    let total = 0;
  
    if (Array.isArray(this.items)) {
      this.items.forEach((item) => {
        // Calculate total based on snapshot price and quantity
        total += (item.price || 0) * (item.quantity || 0);
      });
    }
  
    this.billDetails.totalPrice = total;
    
    // For now, keeping shipping and discount at 0 for simplicity
    this.billDetails.grandTotal = total; 
    
    // No next() needed for async functions in Mongoose!
  });

export default mongoose.model("Cart", cartSchema);