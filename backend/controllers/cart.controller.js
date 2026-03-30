import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// @desc    Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { productId, color, size, quantity } = req.body;
    const userId = req.user._id;

    // 1. Check if product exists
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // 2. Verify if the specific variant and size exist in the product model
    const variant = product.variants.find((v) => v.color === color);
    if (!variant) return res.status(400).json({ message: "Color variant not found" });

    const sizeInfo = variant.sizes.find((s) => s.size === size);
    if (!sizeInfo) return res.status(400).json({ message: "Size not available" });

    // 3. Check stock availability
    if (sizeInfo.stock < quantity) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    // 4. Find user's cart or create a new one
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // 5. Check if item already exists in cart (same product, color, AND size)
    const existingItemIndex = cart.items.findIndex(
      (item) =>
        item.productId.toString() === productId &&
        item.color === color &&
        item.size === size
    );

    if (existingItemIndex > -1) {
      // Update quantity if it exists
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        productId,
        color,
        size,
        quantity,
        price: product.price, // Snapshots current price
      });
    }

    await cart.save();
    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user cart
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate(
      "items.productId",
      "name images brand"
    );
    
    if (!cart || cart.items.length === 0) {
      return res.status(200).json({ 
        items: [], 
        billDetails: { totalPrice: 0, discount: 0, shipping: 0, grandTotal: 0 } 
      });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params; // This is the _id of the item in the items array
    const cart = await Cart.findOne({ userId: req.user._id });

    if (cart) {
      cart.items = cart.items.filter((item) => item._id.toString() !== itemId);
      await cart.save();
    }

    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update item quantity
export const updateQuantity = async (req, res) => {
  try {
    const { itemId, change } = req.body; // change will be 1 or -1
    const cart = await Cart.findOne({ userId: req.user._id });

    const itemIndex = cart.items.findIndex((item) => item._id.toString() === itemId);
    if (itemIndex > -1) {
      const newQuantity = cart.items[itemIndex].quantity + change;

      if (newQuantity <= 0) {
        // Remove item if quantity becomes 0 or less
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = newQuantity;
      }
      
      await cart.save();
      // Re-populate to keep the frontend happy
      const updatedCart = await Cart.findById(cart._id).populate("items.productId", "name images brand");
      return res.status(200).json({ success: true, cart: updatedCart });
    }
    res.status(404).json({ message: "Item not found" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Clear entire cart
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.status(200).json({ success: true, cart: { items: [] } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};