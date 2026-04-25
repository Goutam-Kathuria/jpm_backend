const express = require("express");
const {
  getSetting,
  getSettingById,
  addSetting,
  editSetting,
  deleteSetting,
} = require("../../controllers/admin/settingController");
const verifyAdminToken = require("../../middleware/auth");

const router = express.Router();

router.get("/", verifyAdminToken, getSetting);
router.get("/:id", verifyAdminToken, getSettingById);
router.post("/", verifyAdminToken, addSetting);
router.put("/:id", verifyAdminToken, editSetting);
router.delete("/:id", verifyAdminToken, deleteSetting);

module.exports = router;
