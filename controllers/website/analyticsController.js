const AnalyticsDaily = require("../../models/AnalyticsDaily");

function utcDayKey(date = new Date()) {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

exports.trackPageView = async (req, res) => {
  try {
    const path =
      typeof req.body?.path === "string" ? String(req.body.path).trim().slice(0, 512) : "";

    const dayKey = utcDayKey();

    await AnalyticsDaily.findOneAndUpdate(
      { dayKey },
      { $inc: { pageViews: 1 } },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    return res.status(200).json({
      message: "Tracked.",
      dayKey,
      path: path || undefined,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
