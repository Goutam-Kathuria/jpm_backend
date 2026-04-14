const express = require("express");
const adminAuthRoutes = require("./admin/authRoutes");
const adminCategoryRoutes = require("./admin/categoryRoutes");
const websiteCategoryRoutes = require("./website/categoryRoutes");

const router = express.Router();

router.use("/admin/auth", adminAuthRoutes);
router.use("/admin/categories", adminCategoryRoutes);
router.use("/website/categories", websiteCategoryRoutes);

module.exports = router;
