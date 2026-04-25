const Category = require("../../models/Category");
const Product = require("../../models/Product");
const { isValidObjectId } = require("../../utils/category");

exports.getWebsiteProducts = async (req, res) => {
  try {
    const filter = { isActive: true };

    if (req.query.categoryId) {
      if (!isValidObjectId(req.query.categoryId)) {
        return res.status(400).json({ message: "Invalid category id." });
      }

      filter.categoryId = req.query.categoryId;
    }

    if (req.query.categorySlug) {
      const category = await Category.findOne({
        slug: req.query.categorySlug,
        isActive: true,
      }).select("_id");

      if (!category) {
        return res.status(404).json({ message: "Category not found." });
      }

      filter.categoryId = category._id;
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

exports.getWebsiteProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({
      slug: req.params.slug,
      isActive: true,
    }).populate("categoryId", "name slug image description");

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    const relatedProducts = await Product.find({
      _id: { $ne: product._id },
      categoryId: product.categoryId._id,
      isActive: true,
    })
      .select("name slug image shortDescription")
      .sort({ order: 1, createdAt: -1 })
      .limit(4);

    return res.status(200).json({
      message: "Product fetched successfully",
      product,
      relatedProducts,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
