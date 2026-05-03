const express = require("express");
const { trackPageView } = require("../../controllers/website/analyticsController");

const router = express.Router();

router.post("/track", trackPageView);

module.exports = router;
