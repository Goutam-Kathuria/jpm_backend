const Category = require("../../models/Category");
const {
  buildAdminCategoryResponse,
  buildWebsiteCategoryResponse,
  getBooleanValue,
  getUploadedFile,
  getUploadedFileKey,
  getUploadedFileUrl,
  hasOwn,
  isValidObjectId,
  normalizeOptionalText,
  normalizeText,
  slugifyCategory,
} = require("../../utils/category");

exports.getAllCategories = async (req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 });

  res.json({
    categories: categories.map(buildAdminCategoryResponse),
  });
};

exports.getWebsiteCategoryPreview = async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort({
    createdAt: -1,
  });

  res.json({
    categories: categories.map(buildWebsiteCategoryResponse),
  });
};

exports.getCategoryById = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    res.status(400).json({ message: "Invalid category id." });
    return;
  }

  const category = await Category.findById(id);

  if (!category) {
    res.status(404).json({ message: "Category not found." });
    return;
  }

  res.json({
    category: buildAdminCategoryResponse(category),
  });
};

exports.createCategory = async (req, res) => {
  const uploadedFile = getUploadedFile(req);
  const name = normalizeText(req.body.name);
  const slug = slugifyCategory(req.body.slug || name);

  if (!name) {
    res.status(400).json({ message: "Category name is required." });
    return;
  }

  if (!slug) {
    res.status(400).json({ message: "Category slug is required." });
    return;
  }

  const existingCategory = await Category.findOne({ slug });

  if (existingCategory) {
    res.status(409).json({ message: "Category slug already exists." });
    return;
  }

  const category = await Category.create({
    name,
    slug,
    description: normalizeOptionalText(req.body.description),
    image: uploadedFile ? getUploadedFileUrl(uploadedFile) : normalizeOptionalText(req.body.image),
    imageKey: uploadedFile ? getUploadedFileKey(uploadedFile) : "",
    isActive: getBooleanValue(req.body.isActive, true),
  });

  res.status(201).json({
    message: "Category created successfully.",
    category: buildAdminCategoryResponse(category),
  });
};

exports.updateCategory = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    res.status(400).json({ message: "Invalid category id." });
    return;
  }

  const category = await Category.findById(id);

  if (!category) {
    res.status(404).json({ message: "Category not found." });
    return;
  }

  const uploadedFile = getUploadedFile(req);

  if (hasOwn(req.body, "name")) {
    const name = normalizeText(req.body.name);

    if (!name) {
      res.status(400).json({ message: "Category name cannot be empty." });
      return;
    }

    category.name = name;

    if (!hasOwn(req.body, "slug")) {
      category.slug = slugifyCategory(name);
    }
  }

  if (hasOwn(req.body, "slug")) {
    const slug = slugifyCategory(req.body.slug || category.name);

    if (!slug) {
      res.status(400).json({ message: "Category slug cannot be empty." });
      return;
    }

    category.slug = slug;
  }

  const duplicateCategory = await Category.findOne({
    slug: category.slug,
    _id: { $ne: category._id },
  });

  if (duplicateCategory) {
    res.status(409).json({ message: "Category slug already exists." });
    return;
  }

  if (hasOwn(req.body, "description")) {
    category.description = normalizeOptionalText(req.body.description);
  }

  if (hasOwn(req.body, "image")) {
    category.image = normalizeOptionalText(req.body.image);

    if (!category.image) {
      category.imageKey = "";
    }
  }

  if (hasOwn(req.body, "isActive")) {
    category.isActive = getBooleanValue(req.body.isActive, category.isActive);
  }

  if (uploadedFile) {
    category.image = getUploadedFileUrl(uploadedFile);
    category.imageKey = getUploadedFileKey(uploadedFile);
  }

  await category.save();

  res.json({
    message: "Category updated successfully.",
    category: buildAdminCategoryResponse(category),
  });
};

exports.deleteCategory = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    res.status(400).json({ message: "Invalid category id." });
    return;
  }

  const category = await Category.findByIdAndDelete(id);

  if (!category) {
    res.status(404).json({ message: "Category not found." });
    return;
  }

  res.json({
    message: "Category deleted successfully.",
  });
};
