const mongoose = require("mongoose");
const { generateUniqueSlug } = require("../utils/slug");

const productSchema = new mongoose.Schema(
  {
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
      unique: true,
      index: true,
    },
    image: {
      type: String,
      trim: true,
      default: "",
    },
    gallery: {
      type: [String],
      default: [],
    },
    shortDescription: {
      type: String,
      trim: true,
      default: "",
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    material: {
      type: String,
      trim: true,
      default: "",
    },
    frame: {
      type: String,
      trim: true,
      default: "",
    },
    cushions: {
      type: String,
      trim: true,
      default: "",
    },
    warranty: {
      type: String,
      trim: true,
      default: "",
    },
    tags: {
      type: [String],
      default: [],
    },
    metaTitle: {
      type: String,
      trim: true,
      default: "",
    },
    metaDescription: {
      type: String,
      trim: true,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

productSchema.pre("validate", async function (next) {
  try {
    if (!this.name && !this.slug) {
      return next();
    }

    if (this.isModified("name") || this.isModified("slug")) {
      this.slug = await generateUniqueSlug(
        this.constructor,
        this.slug || this.name,
        this._id,
      );
    }

    if (!this.metaTitle && this.name) {
      this.metaTitle = this.name;
    }

    if (!this.metaDescription) {
      this.metaDescription = (this.shortDescription || this.description || "").slice(0, 160);
    }

    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.models.Product || mongoose.model("Product", productSchema);
