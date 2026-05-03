const mongoose = require("mongoose");

const analyticsDailySchema = new mongoose.Schema(
  {
    dayKey: {
      type: String,
      required: true,
      unique: true,
      match: /^\d{4}-\d{2}-\d{2}$/,
      index: true,
    },
    pageViews: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

module.exports =
  mongoose.models.AnalyticsDaily ||
  mongoose.model("AnalyticsDaily", analyticsDailySchema);
