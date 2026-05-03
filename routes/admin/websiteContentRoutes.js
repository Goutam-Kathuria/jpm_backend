const express = require("express");
const {
  listWebsiteContent,
  getWebsiteContentByKey,
  upsertWebsiteContent,
} = require("../../controllers/admin/websiteContentController");
const verifyAdminToken = require("../../middleware/auth");

const router = express.Router();

router.get("/", verifyAdminToken, listWebsiteContent);
router.get("/:modelKey", verifyAdminToken, getWebsiteContentByKey);
router.put("/:modelKey", verifyAdminToken, upsertWebsiteContent);

module.exports = router;
