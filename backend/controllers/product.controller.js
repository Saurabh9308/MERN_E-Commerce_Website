import Product from "../models/Product.js";

// --- CREATE PRODUCT ---
export const createProduct = async (req, res) => {

  try {
    const {
      name,
      brand,
      price,
      mrp,
      description,
      category,
      subCategory,
      fabric,
      images,
      variants,
      tags,
      isFeatured,
    } = req.body;

    // ✅ 1. Required field validation
    if (
      !name ||
      !brand ||
      price === undefined ||
      mrp === undefined ||
      !description ||
      !category ||
      !subCategory ||
      !images ||
      !variants
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // ✅ 2. Array validation
    if (!Array.isArray(images) || images.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Images must be a non-empty array",
      });
    }

    if (!Array.isArray(variants) || variants.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Variants must be a non-empty array",
      });
    }

    // ✅ 3. Price validation
    if (price < 0 || mrp < 0) {
      return res.status(400).json({
        success: false,
        message: "Price and MRP must be non-negative",
      });
    }

    if (price > mrp) {
      return res.status(400).json({
        success: false,
        message: "Price cannot be greater than MRP",
      });
    }

    // ✅ 4. Deep validation (variants & sizes)
    for (const variant of variants) {
      if (!variant.color || !Array.isArray(variant.sizes) || variant.sizes.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Each variant must have a color and at least one size",
        });
      }

      for (const sizeObj of variant.sizes) {
        if (!sizeObj.size || sizeObj.stock === undefined) {
          return res.status(400).json({
            success: false,
            message: "Each size must have size and stock",
          });
        }

        if (sizeObj.stock < 0) {
          return res.status(400).json({
            success: false,
            message: "Stock cannot be negative",
          });
        }
      }
    }

    // ✅ 5. Normalize data
    const normalizedTags = tags?.map((tag) => tag.toLowerCase().trim()) || [];

    // ✅ 6. Create product
    const product = await Product.create({
      name: name.trim(),
      brand: brand.trim(),
      price,
      mrp,
      description: description.trim(),
      category,
      subCategory,
      fabric,
      images,
      variants,
      tags: normalizedTags,
      isFeatured: isFeatured || false,
    });

    // ✅ 7. Success response
    return res.status(201).json({
      success: true,
      data: product,
    });

  } catch (error) {
    console.error("DETAILED ERROR:", error); // This will show the line number in your terminal
  return res.status(500).json({
    success: false,
    message: "Server error while creating product",
    error: error.message,
    stack: error.stack, // Add this temporarily to see the line number in Postman
  });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    // Simply find all products and sort by most recent
    const products = await Product.find({}).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching product details",
      error: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting product",
      error: error.message,
    });
  }
};