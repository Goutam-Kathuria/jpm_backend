const express = require("express");
const {
  getGallery,
  addGallery,
  editGallery,
  deleteGallery,
} = require("../../controllers/admin/galleryController");
const verifyAdminToken = require("../../middleware/auth");
const uploadFiles = require("../../middleware/multer");

const router = express.Router();

router.get("/", verifyAdminToken, getGallery);
router.get("/get-gallery", verifyAdminToken, getGallery);
router.post("/", verifyAdminToken, uploadFiles, addGallery);
router.post("/add-gallery", verifyAdminToken, uploadFiles, addGallery);
router.put("/:id", verifyAdminToken, uploadFiles, editGallery);
router.post("/edit-gallery/:id", verifyAdminToken, uploadFiles, editGallery);
router.delete("/:id", verifyAdminToken, deleteGallery);
router.delete("/delete-gallery/:id", verifyAdminToken, deleteGallery);

module.exports = router;
