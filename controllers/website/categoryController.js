const Category = require("../../models/Category");

// Format category response for website
const formatCategory = (category) => ({
  _id: category._id,
  name: category.name,
  image: category.image,
  tags: category.tags,
  createdAt: category.createdAt,
  updatedAt: category.updatedAt,
});

exports.getWebsiteCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });

    res.json({
      categories: categories.map(formatCategory),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
