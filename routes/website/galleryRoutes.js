const express = require("express");
const { getWebsiteGallery } = require("../../controllers/website/galleryController");

const router = express.Router();

router.get("/", getWebsiteGallery);

module.exports = router;
