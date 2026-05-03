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

exports.listWebsiteContent = async (_req, res) => {
  try {
    const items = await WebsiteContent.find({})
      .sort({ modelKey: 1 })
      .select("modelKey visible updatedAt createdAt")
      .lean();

    return res.status(200).json({
      message: "Website content list fetched.",
      contents: items,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getWebsiteContentByKey = async (req, res) => {
  const modelKey = normalizeModelKey(req.params.modelKey);

  if (!modelKey) {
    return res.status(400).json({ message: "Invalid model key." });
  }

  try {
    const doc = await WebsiteContent.findOne({ modelKey }).lean();

    if (!doc) {
      return res.status(404).json({ message: "Content not found." });
    }

    return res.status(200).json({
      message: "Website content fetched.",
      content: {
        modelKey: doc.modelKey,
        visible: doc.visible,
        data: doc.data && typeof doc.data === "object" ? doc.data : {},
        updatedAt: doc.updatedAt,
        createdAt: doc.createdAt,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.upsertWebsiteContent = async (req, res) => {
  const modelKey = normalizeModelKey(req.params.modelKey);

  if (!modelKey) {
    return res.status(400).json({ message: "Invalid model key." });
  }

  const payload = req.body ?? {};
  const visible =
    typeof payload.visible === "boolean" ? payload.visible : payload.visible !== "false";

  const dataRaw = payload.data;
  const data =
    dataRaw && typeof dataRaw === "object" && !Array.isArray(dataRaw)
      ? dataRaw
      : {};

  try {
    const doc = await WebsiteContent.findOneAndUpdate(
      { modelKey },
      { visible, data },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
        runValidators: true,
      },
    ).lean();

    return res.status(200).json({
      message: "Website content saved.",
      content: {
        modelKey: doc.modelKey,
        visible: doc.visible,
        data: doc.data && typeof doc.data === "object" ? doc.data : {},
        updatedAt: doc.updatedAt,
        createdAt: doc.createdAt,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
