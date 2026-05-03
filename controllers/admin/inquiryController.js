const mongoose = require("mongoose");
const Inquiry = require("../../models/Inquiry");

function serializeInquiry(doc) {
  if (!doc) return null;

  const o = typeof doc.toObject === "function" ? doc.toObject() : doc;

  return {
    id: String(o._id),
    name: o.name ?? "",
    email: o.email ?? "",
    phone: o.phone ?? "",
    message: o.message ?? "",
    source: o.source ?? "contact_page",
    meta:
      o.meta && typeof o.meta === "object" && !Array.isArray(o.meta) ? o.meta : {},
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
  };
}

exports.listInquiries = async (req, res) => {
  try {
    const limitRaw = Number.parseInt(String(req.query.limit ?? "200"), 10);
    const limit = Number.isFinite(limitRaw)
      ? Math.min(Math.max(limitRaw, 1), 500)
      : 200;

    const items = await Inquiry.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return res.status(200).json({
      message: "Inquiries fetched.",
      inquiries: items.map(serializeInquiry),
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.deleteInquiry = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid inquiry id." });
    }

    const deleted = await Inquiry.findByIdAndDelete(id).lean();

    if (!deleted) {
      return res.status(404).json({ message: "Inquiry not found." });
    }

    return res.status(200).json({
      message: "Inquiry deleted.",
      id: String(deleted._id),
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
