const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
  {
    image: {
      type: String,
      trim: true,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.models.Gallery || mongoose.model("Gallery", gallerySchema);
