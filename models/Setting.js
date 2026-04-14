const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
  {
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    displayName: {
      type: String,
      trim: true,
      default: "Admin",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("setting", settingSchema);
