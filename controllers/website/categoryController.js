const Category = require("../../models/Category");
const Product = require("../../models/Product");

exports.getWebsiteCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({
      order: 1,
      createdAt: -1,
    });

    return res.status(200).json({
      message: "Categories fetched successfully",
      categories,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getWebsiteCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({
      slug: req.params.slug,
      isActive: true,
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    const products = await Product.find({
      categoryId: category._id,
      isActive: true,
    }).sort({ order: 1, createdAt: -1 });

    return res.status(200).json({
      message: "Category fetched successfully",
      category,
      products,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
