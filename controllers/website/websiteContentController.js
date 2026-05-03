const WebsiteContent = require("../../models/WebsiteContent");

function normalizeModelKey(raw) {
  const key = String(raw ?? "")
    .trim()
    .toLowerCase();

  if (!/^[a-z0-9_]{1,64}$/.test(key)) {
    return null;
  }

  return key;
}

exports.getPublicWebsiteContent = async (req, res) => {
  const modelKey = normalizeModelKey(req.params.modelKey);

  if (!modelKey) {
    return res.status(400).json({ message: "Invalid model key." });
  }

  try {
    const doc = await WebsiteContent.findOne({ modelKey }).lean();

    if (!doc || doc.visible !== true) {
      return res.status(404).json({
        message: "Content unavailable.",
        content: null,
      });
    }

    return res.status(200).json({
      message: "Website content fetched.",
      content: {
        modelKey: doc.modelKey,
        data: doc.data && typeof doc.data === "object" ? doc.data : {},
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
