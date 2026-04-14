const Category = require("../../models/Category");
const { buildWebsiteCategoryResponse } = require("../../utils/category");

exports.getWebsiteCategories = async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort({
    createdAt: -1,
  });

  res.json({
    categories: categories.map(buildWebsiteCategoryResponse),
  });
};
