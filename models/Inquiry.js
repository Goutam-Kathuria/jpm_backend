const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: 160,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 254,
      default: "",
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 32,
      default: "",
    },
    message: {
      type: String,
      trim: true,
      maxlength: 12000,
      required: true,
    },
    source: {
      type: String,
      trim: true,
      lowercase: true,
      // enum: ALLOWED_SOURCES,
      default: "contact_page",
    },
    meta: {
      type: mongoose.Schema.Types.Mixed,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  },
);

inquirySchema.index({ createdAt: -1 });
inquirySchema.index({ source: 1, createdAt: -1 });

module.exports = mongoose.models.Inquiry || mongoose.model("Inquiry", inquirySchema);
