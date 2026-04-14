const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
      default: "",
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.models.Category || mongoose.model("Category", categorySchema);
