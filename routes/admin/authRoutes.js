const express = require("express");
const { login } = require("../../controllers/admin/authController");

const router = express.Router();

// Public endpoints
router.post("/login", login);

module.exports = router;
