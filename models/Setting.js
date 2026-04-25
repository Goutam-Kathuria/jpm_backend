const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
    password: {
      type: String,
      trim: true,
      default: "",
    },
    displayName: {
      type: String,
      trim: true,
      default: "Admin",
    },
    enquiryEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
    enquiryPhone: {
      type: String,
      trim: true,
      default: "",
    },
    address: {
      type: String,
      trim: true,
      default: "",
    },
    facebookUrl: {
      type: String,
      trim: true,
      default: "",
    },
    instagramUrl: {
      type: String,
      trim: true,
      default: "",
    },
    twitterUrl: {
      type: String,
      trim: true,
      default: "",
    },
    linkedinUrl: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.models.Setting || mongoose.model("Setting", settingSchema);
