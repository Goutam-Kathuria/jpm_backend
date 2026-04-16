const express = require("express");
const {
  getCategory,
  addCategory,
  editCategory,
} = require("../../controllers/admin/categoryController");
const verifyAdminToken = require("../../middleware/auth");
const uploadSingleImage = require("../../middleware/auth");

const router = express.Router();

router.get("/get-category", verifyAdminToken, getCategory);
router.post("/add-category", verifyAdminToken, uploadSingleImage, addCategory);
router.post("/edit-category/:id", verifyAdminToken, uploadSingleImage, editCategory);

module.exports = router;
