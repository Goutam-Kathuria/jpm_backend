const express = require("express");
const {
  getProduct,
  addProduct,
  editProduct,
  deleteProduct,
} = require("../../controllers/admin/productController");
const verifyAdminToken = require("../../middleware/auth");
const uploadFiles = require("../../middleware/multer");

const router = express.Router();

router.get("/", verifyAdminToken, getProduct);
router.get("/get-product", verifyAdminToken, getProduct);
router.post("/", verifyAdminToken, uploadFiles, addProduct);
router.post("/add-product", verifyAdminToken, uploadFiles, addProduct);
router.put("/:id", verifyAdminToken, uploadFiles, editProduct);
router.post("/edit-product/:id", verifyAdminToken, uploadFiles, editProduct);
router.delete("/:id", verifyAdminToken, deleteProduct);
router.delete("/delete-product/:id", verifyAdminToken, deleteProduct);

module.exports = router;
