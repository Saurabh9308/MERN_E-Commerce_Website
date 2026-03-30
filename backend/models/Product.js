import mongoose from "mongoose";

const sizeSchema = new mongoose.Schema(
  {
    size: {
      type: String,
      required: true,
      enum: ["XS", "S", "M", "L", "XL", "XXL"],
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const variantSchema = new mongoose.Schema(
  {
    color: {
      type: String,
      required: true,
      trim: true,
    },
    sizes: {
      type: [sizeSchema],
      required: true,
    },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    brand: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    mrp: {
      type: Number,
      required: true,
      min: 0,
    },

    discountPercentage: {
      type: Number,
      default: function () {
        return Math.round(((this.mrp - this.price) / this.mrp) * 100);
      },
    },

    description: {
      type: String,
      required: true,
      maxlength: 1000,
    },

    category: {
      type: String,
      required: true,
      enum: ["Men", "Women", "Kids"],
    },

    subCategory: {
      type: String,
      required: true,
      trim: true,
    },

    fabric: {
      type: String,
      trim: true,
    },

    images: {
      type: [String],
      validate: [(arr) => arr.length > 0, "At least one image required"],
    },

    variants: {
      type: [variantSchema],
      required: true,
    },

    tags: {
      type: [String],
      index: true, // useful for search/filter
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    totalStock: {
      type: Number,
      default: 0,
    },

    ratings: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);


// 🔥 Middleware to calculate total stock automatically
// 🔥 Middleware to calculate total stock automatically
productSchema.pre("save", async function () {
  let total = 0;

  // Check if variants exists and is an array to prevent crashes
  if (Array.isArray(this.variants)) {
    this.variants.forEach((variant) => {
      if (variant.sizes && Array.isArray(variant.sizes)) {
        variant.sizes.forEach((sizeObj) => {
          total += sizeObj.stock || 0;
        });
      }
    });
  }

  this.totalStock = total;
  // No next() needed when using an async function!
});

export default mongoose.model("Product", productSchema);