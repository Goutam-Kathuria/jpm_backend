const express = require("express");
const {
  getPublicWebsiteContent,
} = require("../../controllers/website/websiteContentController");

const router = express.Router();

router.get("/:modelKey", getPublicWebsiteContent);

module.exports = router;
