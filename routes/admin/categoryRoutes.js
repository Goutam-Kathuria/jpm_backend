const express = require("express");
const {
  getCategory,
  addCategory,
  editCategory,
} = require("../../controllers/admin/categoryController");
const verifyAdminToken = require("../../middleware/auth");
const uploadFiles = require("../../middleware/multer");

const router = express.Router();

router.get("/", verifyAdminToken, getCategory);
router.get("/get-category", verifyAdminToken, getCategory);
router.post("/", verifyAdminToken, uploadFiles, addCategory);
router.post("/add-category", verifyAdminToken, uploadFiles, addCategory);
router.put("/:id", verifyAdminToken, uploadFiles, editCategory);
router.post("/edit-category/:id", verifyAdminToken, uploadFiles, editCategory);

module.exports = router;
