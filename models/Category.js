const mongoose = require("mongoose");
const { generateUniqueSlug } = require("../utils/slug");

const categorySchema = new mongoose.Schema(
  {
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
    description: {
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

categorySchema.pre("validate", async function (next) {
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

    if (!this.metaDescription && this.description) {
      this.metaDescription = this.description.slice(0, 160);
    }

  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.models.Category || mongoose.model("Category", categorySchema);
