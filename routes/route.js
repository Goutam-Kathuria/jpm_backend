const express = require("express");
const adminAuthRoutes = require("./admin/authRoutes");
const adminCategoryRoutes = require("./admin/categoryRoutes");
const adminGalleryRoutes = require("./admin/galleryRoutes");
const adminProductRoutes = require("./admin/productRoutes");
const adminReviewRoutes = require("./admin/reviewRoutes");
const adminSettingRoutes = require("./admin/settingRoutes");
const websiteCategoryRoutes = require("./website/categoryRoutes");
const websiteGalleryRoutes = require("./website/galleryRoutes");
const websiteProductRoutes = require("./website/productRoutes");
const websiteReviewRoutes = require("./website/reviewRoutes");

const router = express.Router();

router.use("/admin/auth", adminAuthRoutes);
router.use("/admin/categories", adminCategoryRoutes);
router.use("/admin/gallery", adminGalleryRoutes);
router.use("/admin/products", adminProductRoutes);
router.use("/admin/reviews", adminReviewRoutes);
router.use("/admin/settings", adminSettingRoutes);
router.use("/website/categories", websiteCategoryRoutes);
router.use("/website/gallery", websiteGalleryRoutes);
router.use("/website/products", websiteProductRoutes);
router.use("/website/reviews", websiteReviewRoutes);

module.exports = router;
