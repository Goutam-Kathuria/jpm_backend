const path = require("path");
const mongoose = require("mongoose");

const hasOwn = (object, key) => Object.prototype.hasOwnProperty.call(object || {}, key);

const normalizeText = (value) => (typeof value === "string" ? value.trim() : "");

const normalizeOptionalText = (value) => {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
};

const slugifyCategory = (value) =>
  normalizeText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const getBooleanValue = (value, defaultValue = true) => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value !== "string") {
    return defaultValue;
  }

  const normalizedValue = value.trim().toLowerCase();

  if (["true", "1", "yes", "on"].includes(normalizedValue)) {
    return true;
  }

  if (["false", "0", "no", "off"].includes(normalizedValue)) {
    return false;
  }

  return defaultValue;
};

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

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

const getUploadedFileUrl = (file) => {
  if (!file) {
    return "";
  }

  if (file.location) {
    return file.location;
  }

  if (file.path) {
    const normalizedPath = file.path.split(path.sep);
    const uploadsIndex = normalizedPath.lastIndexOf("uploads");

    if (uploadsIndex !== -1) {
      return `/${normalizedPath.slice(uploadsIndex).join("/")}`;
    }
  }

  if (file.filename && file.fieldname) {
    return `/uploads/${file.fieldname}/${file.filename}`;
  }

  return "";
};

const getUploadedFileKey = (file) => {
  if (!file) {
    return "";
  }

  return file.key || file.filename || "";
};

const buildAdminCategoryResponse = (category) => ({
  id: category._id.toString(),
  name: category.name,
  slug: category.slug,
  description: category.description || "",
  image: category.image || "",
  imageKey: category.imageKey || "",
  isActive: Boolean(category.isActive),
  createdAt: category.createdAt,
  updatedAt: category.updatedAt,
});

const buildWebsiteCategoryResponse = (category) => ({
  id: category._id.toString(),
  slug: category.slug,
  name: category.name,
  description: category.description || "",
  image: category.image || "",
});

module.exports = {
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
};
