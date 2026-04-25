const Product = require("../../models/Product");
const Category = require("../../models/Category");
const { isValidObjectId } = require("../../utils/category");

const UPLOAD_BASE_PATH = "/assets/uploads";

const parseArrayField = (value) => {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    try {
      const parsedValue = JSON.parse(value);
      if (Array.isArray(parsedValue)) {
        return parsedValue.map((item) => String(item).trim()).filter(Boolean);
      }
    } catch (error) {
      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  return [];
};

const parseBoolean = (value) => {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value === "boolean") {
    return value;
  }

  const normalizedValue = String(value).toLowerCase();
  return normalizedValue === "true" || normalizedValue === "1";
};

const parseNumber = (value) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const numberValue = Number(value);
  return Number.isNaN(numberValue) ? undefined : numberValue;
};

const getGalleryImages = (req) => {
  const galleryFiles = [
    ...(req.files?.gallery || []),
    ...(req.files?.MultipleImage || []),
  ];

  return galleryFiles.map((file) => `${UPLOAD_BASE_PATH}/${file.filename}`);
};

exports.getProduct = async (req, res) => {
  try {
    const filter = {};

    if (req.query.categoryId) {
      if (!isValidObjectId(req.query.categoryId)) {
        return res.status(400).json({ message: "Invalid category id." });
      }

      filter.categoryId = req.query.categoryId;
    }

    const products = await Product.find(filter)
      .populate("categoryId", "name slug image")
      .sort({ order: 1, createdAt: -1 });

    return res.status(200).json({
      message: "Products fetched successfully",
      products,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.addProduct = async (req, res) => {
  try {
    const {
      categoryId,
      name,
      slug,
      shortDescription,
      description,
      material,
      frame,
      cushions,
      warranty,
      tags,
      metaTitle,
      metaDescription,
      isActive,
      order,
    } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Product name is required." });
    }

    if (!categoryId || !isValidObjectId(categoryId)) {
      return res.status(400).json({ message: "Valid category id is required." });
    }

    const category = await Category.findById(categoryId).select("_id");
    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    const image = req.files?.image?.[0]?.filename
      ? `${UPLOAD_BASE_PATH}/${req.files.image[0].filename}`
      : "";

    const gallery = getGalleryImages(req);

    const product = await Product.create({
      categoryId,
      name,
      slug,
      image,
      gallery,
      shortDescription,
      description,
      material,
      frame,
      cushions,
      warranty,
      tags: parseArrayField(tags),
      metaTitle,
      metaDescription,
      isActive: parseBoolean(isActive),
      order: parseNumber(order),
    });

    const createdProduct = await Product.findById(product._id).populate(
      "categoryId",
      "name slug image",
    );

    return res.status(201).json({
      message: "Product created successfully.",
      product: createdProduct,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Product slug already exists." });
    }

    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      categoryId,
      name,
      slug,
      shortDescription,
      description,
      material,
      frame,
      cushions,
      warranty,
      tags,
      metaTitle,
      metaDescription,
      isActive,
      order,
    } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid product id." });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    if (categoryId !== undefined) {
      if (!isValidObjectId(categoryId)) {
        return res.status(400).json({ message: "Invalid category id." });
      }

      const category = await Category.findById(categoryId).select("_id");
      if (!category) {
        return res.status(404).json({ message: "Category not found." });
      }

      product.categoryId = categoryId;
    }

    if (name !== undefined) product.name = name;
    if (slug !== undefined) product.slug = slug;
    if (shortDescription !== undefined) product.shortDescription = shortDescription;
    if (description !== undefined) product.description = description;
    if (material !== undefined) product.material = material;
    if (frame !== undefined) product.frame = frame;
    if (cushions !== undefined) product.cushions = cushions;
    if (warranty !== undefined) product.warranty = warranty;
    if (tags !== undefined) product.tags = parseArrayField(tags);
    if (metaTitle !== undefined) product.metaTitle = metaTitle;
    if (metaDescription !== undefined) product.metaDescription = metaDescription;

    const activeValue = parseBoolean(isActive);
    if (activeValue !== undefined) product.isActive = activeValue;

    const orderValue = parseNumber(order);
    if (orderValue !== undefined) product.order = orderValue;

    if (req.files?.image?.[0]?.filename) {
      product.image = `${UPLOAD_BASE_PATH}/${req.files.image[0].filename}`;
    }

    const gallery = getGalleryImages(req);
    if (gallery.length) {
      product.gallery = gallery;
    }

    await product.save();

    const updatedProduct = await Product.findById(product._id).populate(
      "categoryId",
      "name slug image",
    );

    return res.status(200).json({
      message: "Product updated successfully.",
      product: updatedProduct,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Product slug already exists." });
    }

    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid product id." });
    }

    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    return res.status(200).json({
      message: "Product deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
