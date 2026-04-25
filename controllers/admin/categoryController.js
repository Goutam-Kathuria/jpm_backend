const Category = require("../../models/Category");
const Product = require("../../models/Product");
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

exports.getCategory = async (req, res) => {
  try {
    const categories = await Category.find().sort({ order: 1, createdAt: -1 });

    return res.status(200).json({
      message: "Categories fetched successfully",
      categories,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.addCategory = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      tags,
      metaTitle,
      metaDescription,
      isActive,
      order,
    } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required." });
    }

    const image = req.files?.image?.[0]?.filename
      ? `${UPLOAD_BASE_PATH}/${req.files.image[0].filename}`
      : "";

    const category = await Category.create({
      name,
      slug,
      image,
      description,
      tags: parseArrayField(tags),
      metaTitle,
      metaDescription,
      isActive: parseBoolean(isActive),
      order: parseNumber(order),
    });

    return res.status(201).json({
      message: "Category created successfully.",
      category,
    });
  } catch (error) {
    console.log("Error creating category:", error);
    if (error.code === 11000) {
      return res.status(409).json({ message: "Category slug already exists." });
    }

    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.editCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      slug,
      description,
      tags,
      metaTitle,
      metaDescription,
      isActive,
      order,
    } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid category id." });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    if (name !== undefined) category.name = name;
    if (slug !== undefined) category.slug = slug;
    if (description !== undefined) category.description = description;
    if (tags !== undefined) category.tags = parseArrayField(tags);
    if (metaTitle !== undefined) category.metaTitle = metaTitle;
    if (metaDescription !== undefined) category.metaDescription = metaDescription;

    const activeValue = parseBoolean(isActive);
    if (activeValue !== undefined) category.isActive = activeValue;

    const orderValue = parseNumber(order);
    if (orderValue !== undefined) category.order = orderValue;

    if (req.files?.image?.[0]?.filename) {
      category.image = `${UPLOAD_BASE_PATH}/${req.files.image[0].filename}`;
    }

    await category.save();

    return res.status(200).json({
      message: "Category updated successfully.",
      category,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Category slug already exists." });
    }

    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid category id." });
    }

    const productCount = await Product.countDocuments({ categoryId: id });
    if (productCount > 0) {
      return res.status(409).json({
        message: "Category has products. Move or delete products first.",
      });
    }

    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    return res.status(200).json({
      message: "Category deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
