const express = require("express");
const adminAuthRoutes = require("./admin/authRoutes");
const adminCategoryRoutes = require("./admin/categoryRoutes");
const adminGalleryRoutes = require("./admin/galleryRoutes");
const adminProductRoutes = require("./admin/productRoutes");
const adminReviewRoutes = require("./admin/reviewRoutes");
const adminSettingRoutes = require("./admin/settingRoutes");
const adminWebsiteContentRoutes = require("./admin/websiteContentRoutes");
const adminInquiryRoutes = require("./admin/inquiryRoutes");
const adminDashboardRoutes = require("./admin/dashboardRoutes");
const websiteCategoryRoutes = require("./website/categoryRoutes");
const websiteGalleryRoutes = require("./website/galleryRoutes");
const websiteProductRoutes = require("./website/productRoutes");
const websiteReviewRoutes = require("./website/reviewRoutes");
const websiteSettingRoutes = require("./website/settingRoutes");
const websiteContentRoutes = require("./website/websiteContentRoutes");
const websiteAnalyticsRoutes = require("./website/analyticsRoutes");
const websiteInquiryRoutes = require("./website/inquiryRoutes");


const router = express.Router();

router.use("/admin/auth", adminAuthRoutes);
router.use("/admin/categories", adminCategoryRoutes);
router.use("/admin/gallery", adminGalleryRoutes);
router.use("/admin/products", adminProductRoutes);
router.use("/admin/reviews", adminReviewRoutes);
router.use("/admin/settings", adminSettingRoutes);
router.use("/admin/website-content", adminWebsiteContentRoutes);
router.use("/admin/inquiries", adminInquiryRoutes);
router.use("/admin/dashboard", adminDashboardRoutes);
router.use("/website/categories", websiteCategoryRoutes);
router.use("/website/gallery", websiteGalleryRoutes);
router.use("/website/products", websiteProductRoutes);
router.use("/website/reviews", websiteReviewRoutes);
router.use("/website/settings", websiteSettingRoutes);
router.use("/website/content", websiteContentRoutes);
router.use("/website/inquiries", websiteInquiryRoutes);
router.use("/website/analytics", websiteAnalyticsRoutes);

module.exports = router;
