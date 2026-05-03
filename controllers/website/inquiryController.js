const Inquiry = require("../../models/Inquiry");

function normalizeString(value, max) {
  const s = String(value ?? "").trim();
  if (s.length > max) return s.slice(0, max);
  return s;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

exports.submitInquiry = async (req, res) => {
  try {
    const body = req.body ?? {};
    const sourceRaw = normalizeString(body.source, 32).toLowerCase() || "contact_page";
    const source = sourceRaw === "custom_design" ? "custom_design" : "contact_page";

    const name = normalizeString(body.name, 160);
    const email = normalizeString(body.email, 254).toLowerCase();
    const phone = normalizeString(body.phone, 32);
    const message = normalizeString(body.message, 12000);
    const meta =
      body.meta && typeof body.meta === "object" && !Array.isArray(body.meta) ? body.meta : {};

    if (name.length < 2) {
      return res.status(400).json({ message: "Name must be at least 2 characters." });
    }

    if (source === "contact_page") {
      if (!email) {
        return res.status(400).json({ message: "Email is required." });
      }
      if (!isValidEmail(email)) {
        return res.status(400).json({ message: "Please provide a valid email address." });
      }
      const digits = phone.replace(/\D/g, "");
      if (digits.length < 10 || digits.length > 15) {
        return res.status(400).json({ message: "Please provide a valid phone number." });
      }
      if (message.length < 10) {
        return res.status(400).json({ message: "Message must be at least 10 characters." });
      }
    } else {
      const digits = phone.replace(/\D/g, "");
      if (digits.length < 10 || digits.length > 15) {
        return res.status(400).json({ message: "Please provide a valid phone number." });
      }
      if (message.length < 8) {
        return res.status(400).json({ message: "Configuration summary is too short." });
      }
    }

    const doc = await Inquiry.create({
      name,
      email,
      phone,
      message,
      source,
      meta,
    });

    return res.status(201).json({
      message: "Thank you — your enquiry was received.",
      inquiry: {
        id: doc._id,
        createdAt: doc.createdAt,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
