const mongoose = require("mongoose");

const websiteContentSchema = new mongoose.Schema(
  {
    modelKey: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 64,
      required: true,
      unique: true,
      match: /^[a-z0-9_]+$/,
    },
    visible: {
      type: Boolean,
      default: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
    minimize: false,
  },
);

module.exports = mongoose.model("WebsiteContent", websiteContentSchema);
