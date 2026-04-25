const Setting = require("../../models/Setting");
const { isValidObjectId } = require("../../utils/category");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeText = (value) => {
  if (value === undefined || value === null) {
    return "";
  }

  return String(value).trim();
};

const isValidEmail = (value) => {
  if (!value) {
    return false;
  }

  return EMAIL_REGEX.test(value);
};

const serializeSetting = (setting) => {
  if (!setting) {
    return null;
  }

  return {
    _id: setting._id,
    email: setting.email ?? "",
    displayName: setting.displayName ?? "Admin",
    enquiryEmail: setting.enquiryEmail ?? "",
    enquiryPhone: setting.enquiryPhone ?? "",
    address: setting.address ?? "",
    facebookUrl: setting.facebookUrl ?? "",
    instagramUrl: setting.instagramUrl ?? "",
    twitterUrl: setting.twitterUrl ?? "",
    linkedinUrl: setting.linkedinUrl ?? "",
    hasPassword: Boolean(setting.password),
    createdAt: setting.createdAt,
    updatedAt: setting.updatedAt,
  };
};

const assignSettingFields = (setting, payload, options = {}) => {
  const {
    requirePassword = false,
    requireAdminEmail = false,
    requireEnquiryEmail = false,
  } = options;

  if (payload.email !== undefined) {
    setting.email = normalizeText(payload.email).toLowerCase();
  }

  if (requireAdminEmail && !setting.email) {
    return "Admin email is required.";
  }

  if (setting.email && !isValidEmail(setting.email)) {
    return "Please provide a valid admin email.";
  }

  if (payload.password !== undefined) {
    const password = normalizeText(payload.password);

    if (password) {
      setting.password = password;
    } else if (requirePassword && !setting.password) {
      return "Admin password is required.";
    }
  } else if (requirePassword && !setting.password) {
    return "Admin password is required.";
  }

  if (payload.displayName !== undefined) {
    setting.displayName = normalizeText(payload.displayName) || "Admin";
  } else if (!setting.displayName) {
    setting.displayName = "Admin";
  }

  if (payload.enquiryEmail !== undefined) {
    setting.enquiryEmail = normalizeText(payload.enquiryEmail).toLowerCase();
  }

  if (requireEnquiryEmail && !setting.enquiryEmail) {
    return "Enquiry email is required.";
  }

  if (setting.enquiryEmail && !isValidEmail(setting.enquiryEmail)) {
    return "Please provide a valid enquiry email.";
  }

  if (payload.enquiryPhone !== undefined) {
    setting.enquiryPhone = normalizeText(payload.enquiryPhone);
  }

  if (payload.address !== undefined) {
    setting.address = normalizeText(payload.address);
  }

  if (payload.facebookUrl !== undefined) {
    setting.facebookUrl = normalizeText(payload.facebookUrl);
  }

  if (payload.instagramUrl !== undefined) {
    setting.instagramUrl = normalizeText(payload.instagramUrl);
  }

  if (payload.twitterUrl !== undefined) {
    setting.twitterUrl = normalizeText(payload.twitterUrl);
  }

  if (payload.linkedinUrl !== undefined) {
    setting.linkedinUrl = normalizeText(payload.linkedinUrl);
  }

  return null;
};

exports.getSetting = async (req, res) => {
  try {
    const setting = await Setting.findOne().sort({ createdAt: 1 });

    return res.status(200).json({
      message: setting
        ? "Settings fetched successfully."
        : "Settings have not been configured yet.",
      setting: serializeSetting(setting),
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getSettingById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid setting id." });
    }

    const setting = await Setting.findById(id);
    if (!setting) {
      return res.status(404).json({ message: "Setting not found." });
    }

    return res.status(200).json({
      message: "Setting fetched successfully.",
      setting: serializeSetting(setting),
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.addSetting = async (req, res) => {
  try {
    const existingSetting = await Setting.findOne().select("_id");

    if (existingSetting) {
      return res.status(409).json({
        message: "Settings already exist. Update the current settings instead.",
      });
    }

    const setting = new Setting();
    const validationMessage = assignSettingFields(setting, req.body, {
      requirePassword: true,
      requireAdminEmail: true,
      requireEnquiryEmail: true,
    });

    if (validationMessage) {
      return res.status(400).json({ message: validationMessage });
    }

    await setting.save();

    return res.status(201).json({
      message: "Settings created successfully.",
      setting: serializeSetting(setting),
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.editSetting = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid setting id." });
    }

    const setting = await Setting.findById(id);
    if (!setting) {
      return res.status(404).json({ message: "Setting not found." });
    }

    const validationMessage = assignSettingFields(setting, req.body, {
      requirePassword: !setting.password,
      requireAdminEmail: true,
      requireEnquiryEmail: true,
    });
    if (validationMessage) {
      return res.status(400).json({ message: validationMessage });
    }

    await setting.save();

    return res.status(200).json({
      message: "Settings updated successfully.",
      setting: serializeSetting(setting),
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.deleteSetting = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid setting id." });
    }

    const setting = await Setting.findByIdAndDelete(id);
    if (!setting) {
      return res.status(404).json({ message: "Setting not found." });
    }

    return res.status(200).json({
      message: "Settings deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
