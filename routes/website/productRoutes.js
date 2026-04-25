const express = require("express");
const {
  getWebsiteProducts,
  getWebsiteProductBySlug,
} = require("../../controllers/website/productController");

const router = express.Router();

router.get("/", getWebsiteProducts);
router.get("/:slug", getWebsiteProductBySlug);

module.exports = router;
