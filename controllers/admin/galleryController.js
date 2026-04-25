const Gallery = require("../../models/Gallery");
const { isValidObjectId } = require("../../utils/category");

const UPLOAD_BASE_PATH = "/assets/uploads";

exports.getGallery = async (req, res) => {
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

exports.addGallery = async (req, res) => {
  try {
    if (!req.files?.image?.[0]?.filename) {
      return res.status(400).json({ message: "Gallery image is required." });
    }

    const galleryItem = await Gallery.create({
      image: `${UPLOAD_BASE_PATH}/${req.files.image[0].filename}`,
    });

    return res.status(201).json({
      message: "Gallery image created successfully.",
      gallery: galleryItem,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.editGallery = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid gallery id." });
    }

    const galleryItem = await Gallery.findById(id);
    if (!galleryItem) {
      return res.status(404).json({ message: "Gallery image not found." });
    }

    if (req.files?.image?.[0]?.filename) {
      galleryItem.image = `${UPLOAD_BASE_PATH}/${req.files.image[0].filename}`;
    }

    await galleryItem.save();

    return res.status(200).json({
      message: "Gallery image updated successfully.",
      gallery: galleryItem,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.deleteGallery = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid gallery id." });
    }

    const galleryItem = await Gallery.findByIdAndDelete(id);
    if (!galleryItem) {
      return res.status(404).json({ message: "Gallery image not found." });
    }

    return res.status(200).json({
      message: "Gallery image deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
