const express = require("express");
const {
  getWebsiteReviews,
  addWebsiteReview,
} = require("../../controllers/website/reviewController");
const uploadFiles = require("../../middleware/multer");

const router = express.Router();

router.get("/", getWebsiteReviews);
router.post("/", uploadFiles, addWebsiteReview);

module.exports = router;
