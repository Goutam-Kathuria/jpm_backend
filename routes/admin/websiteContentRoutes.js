const express = require("express");
const {
  listWebsiteContent,
  getWebsiteContentByKey,
  upsertWebsiteContent,
  deleteWebsiteContentByKey,
} = require("../../controllers/admin/websiteContentController");
const verifyAdminToken = require("../../middleware/auth");
const { upload } = require("../../middleware/multer");

const router = express.Router();

router.get("/", verifyAdminToken, listWebsiteContent);
router.get("/:modelKey", verifyAdminToken, getWebsiteContentByKey);
router.put("/:modelKey", verifyAdminToken, upload.any(), upsertWebsiteContent);
router.delete("/:modelKey", verifyAdminToken, deleteWebsiteContentByKey);

module.exports = router;
