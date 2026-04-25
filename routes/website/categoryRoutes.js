const express = require("express");
const {
  getWebsiteCategories,
  getWebsiteCategoryBySlug,
} = require("../../controllers/website/categoryController");

const router = express.Router();

router.get("/", getWebsiteCategories);
router.get("/:slug", getWebsiteCategoryBySlug);

module.exports = router;
