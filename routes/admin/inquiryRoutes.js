const express = require("express");
const { listInquiries, deleteInquiry } = require("../../controllers/admin/inquiryController");
const verifyAdminToken = require("../../middleware/auth");

const router = express.Router();

router.get("/", verifyAdminToken, listInquiries);
router.delete("/:id", verifyAdminToken, deleteInquiry);

module.exports = router;
