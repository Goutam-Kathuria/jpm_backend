const Setting = require("../../models/Setting");

const serializeWebsiteSetting = (setting) => ({
  enquiryEmail: setting?.enquiryEmail ?? "",
  enquiryPhone: setting?.enquiryPhone ?? "",
  address: setting?.address ?? "",
  facebookUrl: setting?.facebookUrl ?? "",
  instagramUrl: setting?.instagramUrl ?? "",
  twitterUrl: setting?.twitterUrl ?? "",
  linkedinUrl: setting?.linkedinUrl ?? "",
});

exports.getWebsiteSettings = async (req, res) => {
  try {
    const setting = await Setting.findOne()
      .sort({ createdAt: 1 })
      .select(
        "enquiryEmail enquiryPhone address facebookUrl instagramUrl twitterUrl linkedinUrl",
      )
      .lean();

    return res.status(200).json({
      message: "Website settings fetched successfully",
      setting: serializeWebsiteSetting(setting),
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
