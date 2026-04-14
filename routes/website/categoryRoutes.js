const express = require("express");
const { getWebsiteCategories } = require("../../controllers/website/categoryController");

const router = express.Router();

router.get("/", getWebsiteCategories);

module.exports = router;
