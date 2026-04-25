const Gallery = require("../../models/Gallery");

exports.getWebsiteGallery = async (req, res) => {
  try {
    const gallery = await Gallery.find().sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Gallery fetched successfully",
      gallery,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
