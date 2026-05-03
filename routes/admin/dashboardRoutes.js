const express = require("express");
const { getDashboardSummary } = require("../../controllers/admin/dashboardController");
const verifyAdminToken = require("../../middleware/auth");

const router = express.Router();

router.get("/summary", verifyAdminToken, getDashboardSummary);

module.exports = router;
