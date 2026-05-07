const WebsiteContent = require("../../models/WebsiteContent");

const UPLOAD_BASE_PATH = "/assets/uploads";

function normalizeModelKey(raw) {
  const key = String(raw ?? "")
    .trim()
    .toLowerCase();

  if (!/^[a-z0-9_]{1,64}$/.test(key)) {
    return null;
  }

  return key;
}

function parseVisible(value, fallback = true) {
  if (typeof value === "boolean") {
    return value;
  }

  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  const normalized = String(value).trim().toLowerCase();

  if (["false", "0", "off", "no"].includes(normalized)) {
    return false;
  }

  if (["true", "1", "on", "yes"].includes(normalized)) {
    return true;
  }

  return fallback;
}

function parseDataPayload(value) {
  if (value === undefined || value === null || value === "") {
    return {};
  }

  const parsed = typeof value === "string" ? JSON.parse(value) : value;

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return {};
  }

  return parsed;
}

function serializeContent(doc) {
  return {
    modelKey: doc.modelKey,
    visible: doc.visible,
    data: doc.data && typeof doc.data === "object" ? doc.data : {},
    updatedAt: doc.updatedAt,
    createdAt: doc.createdAt,
  };
}

function flattenUploadedFiles(files) {
  if (Array.isArray(files)) {
    return files;
  }

  if (!files || typeof files !== "object") {
    return [];
  }

  return Object.entries(files).flatMap(([fieldname, entries]) => {
    if (!Array.isArray(entries)) {
      return [];
    }

    return entries.map((file) => ({
      ...file,
      fieldname: file.fieldname || fieldname,
    }));
  });
}

function setNestedValue(target, path, value) {
  const segments = String(path ?? "")
    .split(".")
    .filter(Boolean);

  if (!segments.length || !target || typeof target !== "object") {
    return;
  }

  let cursor = target;

  for (let index = 0; index < segments.length; index += 1) {
    const segment = segments[index];
    const isLast = index === segments.length - 1;

    if (isLast) {
      cursor[segment] = value;
      return;
    }

    const nextSegment = segments[index + 1];
    const shouldCreateArray = /^\d+$/.test(nextSegment);

    if (!cursor[segment] || typeof cursor[segment] !== "object") {
      cursor[segment] = shouldCreateArray ? [] : {};
    }

    cursor = cursor[segment];
  }
}

function applyUploadedFiles(modelKey, data, files) {
  const uploadedFiles = flattenUploadedFiles(files);

  for (const file of uploadedFiles) {
    if (!file?.filename) {
      continue;
    }

    const assetPath = `${UPLOAD_BASE_PATH}/${file.filename}`;
    const fieldname = String(file.fieldname ?? "").trim();

    if (!fieldname) {
      continue;
    }

    if (fieldname === "image") {
      if (modelKey === "hero") {
        setNestedValue(data, "backgroundImageUrl", assetPath);
      } else if (modelKey === "our_story") {
        setNestedValue(data, "imageUrl", assetPath);
      } else {
        setNestedValue(data, "image", assetPath);
      }
      continue;
    }

    setNestedValue(data, fieldname, assetPath);
  }
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
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
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
      content: serializeContent(doc),
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

exports.upsertWebsiteContent = async (req, res) => {
  const modelKey = normalizeModelKey(req.params.modelKey);

  if (!modelKey) {
    return res.status(400).json({ message: "Invalid model key." });
  }

  const payload = req.body ?? {};
  let data = {};

  try {
    data = parseDataPayload(payload.data);
  } catch (error) {
    return res.status(400).json({
      message: "Invalid data payload.",
      error: error.message,
    });
  }

  const visible = parseVisible(payload.visible, true);

  applyUploadedFiles(modelKey, data, req.files);

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
      content: serializeContent(doc),
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

exports.deleteWebsiteContentByKey = async (req, res) => {
  const modelKey = normalizeModelKey(req.params.modelKey);

  if (!modelKey) {
    return res.status(400).json({ message: "Invalid model key." });
  }

  try {
    const deleted = await WebsiteContent.findOneAndDelete({ modelKey }).lean();

    if (!deleted) {
      return res.status(404).json({ message: "Content not found." });
    }

    return res.status(200).json({
      message: "Website content deleted.",
      modelKey,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
