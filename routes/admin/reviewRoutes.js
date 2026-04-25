const express = require("express");
const {
  getReview,
  addReview,
  editReview,
  deleteReview,
} = require("../../controllers/admin/reviewController");
const verifyAdminToken = require("../../middleware/auth");
const uploadFiles = require("../../middleware/multer");

const router = express.Router();

router.get("/", verifyAdminToken, getReview);
router.get("/get-review", verifyAdminToken, getReview);
router.post("/", verifyAdminToken, uploadFiles, addReview);
router.post("/add-review", verifyAdminToken, uploadFiles, addReview);
router.put("/:id", verifyAdminToken, uploadFiles, editReview);
router.post("/edit-review/:id", verifyAdminToken, uploadFiles, editReview);
router.delete("/:id", verifyAdminToken, deleteReview);
router.delete("/delete-review/:id", verifyAdminToken, deleteReview);

module.exports = router;
