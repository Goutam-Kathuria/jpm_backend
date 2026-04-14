const Category = require("../../models/Category");
const { isValidObjectId } = require("../../utils/category");

// Helper function to get file from request
const getUploadedFile = (req, fieldName = "image") => {
  if (req.file) {
    return req.file;
  }
  if (req.files && Array.isArray(req.files[fieldName])) {
    return req.files[fieldName][0];
  }
  if (Array.isArray(req.files) && req.files.length > 0) {
    return req.files[0];
  }
  return null;
};

// Helper function to get file URL
const getUploadedFileUrl = (file) => {
  if (!file) {
    return "";
  }
  
  // For local disk storage
  if (file.path) {
    const path = require("path");
    const normalizedPath = file.path.split(path.sep);
    const assetsIndex = normalizedPath.lastIndexOf("assets");
    if (assetsIndex !== -1) {
      return `/${normalizedPath.slice(assetsIndex).join("/")}`;
    }
  }
  
  if (file.filename && file.fieldname) {
    return `/assets/${file.fieldname}/${file.filename}`;
  }
  
  return "";
};

// Format category response
const formatCategory = (category) => ({
  _id: category._id,
  name: category.name,
  image: category.image,
  tags: category.tags,
  createdAt: category.createdAt,
  updatedAt: category.updatedAt,
});

// Get all categories
exports.getCategory = async (req, res) => {
  try {
    const categories = await Category.find();

    res.json({
      categories: categories.map(formatCategory),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Add new category
exports.addCategory = async (req, res) => {
  try {
    const {name, tags} = req.body;
    const uploadedFile = getUploadedFile(req);

    if (!name) {
      return res.status(400).json({ message: "Category name is required." });
    }

    const category = await Category.create({
      name,
      image: getUploadedFileUrl(uploadedFile),
      tags,
    });

    res.status(201).json({
      message: "Category created successfully.",
      category: formatCategory(category),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Edit category
exports.editCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, tags} = req.body;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid category id." });
    }

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    // Update name if provided
    if (name !== undefined) {     
      category.name = name;
    }

    // Update tags if provided
    if (tags !== undefined) {
      category.tags = Array.isArray(tags) ? tags : [];
    }

    // Update image if file is uploaded
    const uploadedFile = getUploadedFile(req);
    if (uploadedFile) {
      category.image = getUploadedFileUrl(uploadedFile);
    }

    await category.save();

    res.json({
      message: "Category updated successfully.",
      category: formatCategory(category),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
