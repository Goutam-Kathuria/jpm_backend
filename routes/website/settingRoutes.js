const express = require("express");
const { getWebsiteSettings } = require("../../controllers/website/settingController");

const router = express.Router();

router.get("/", getWebsiteSettings);

module.exports = router;
