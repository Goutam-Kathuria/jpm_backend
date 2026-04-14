const express = require("express");
const {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  getWebsiteCategoryPreview,
  updateCategory,
} = require("../../controllers/admin/categoryController");
const { verifyAdminToken } = require("../../middleware/auth");
const { uploadSingleImage } = require("../../middleware/multer");

const router = express.Router();


// router.get("/", verifyAdminToken, getAllCategories);
// router.get("/website-view", verifyAdminToken, getWebsiteCategoryPreview);
// router.get("/:id", verifyAdminToken, getCategoryById);
// router.post("/", verifyAdminToken, uploadSingleImage, createCategory);
// router.put("/:id", verifyAdminToken, uploadSingleImage, updateCategory);
// router.delete("/:id", verifyAdminToken, deleteCategory);

module.exports = router;
