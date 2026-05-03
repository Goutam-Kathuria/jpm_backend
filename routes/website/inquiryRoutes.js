const express = require("express");
const { submitInquiry } = require("../../controllers/website/inquiryController");

const router = express.Router();

router.post("/", submitInquiry);

module.exports = router;
