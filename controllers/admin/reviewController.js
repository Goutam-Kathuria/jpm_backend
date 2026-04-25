const Review = require("../../models/Review");
const { isValidObjectId } = require("../../utils/category");

const UPLOAD_BASE_PATH = "/assets/uploads";
const getProfilePic = (req) => {
  const file = req.files?.profilePic?.[0] || req.files?.image?.[0];
  return file?.filename ? `${UPLOAD_BASE_PATH}/${file.filename}` : "";
};

exports.getReview = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Reviews fetched successfully",
      reviews,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.addReview = async (req, res) => {
  try {
    const { name, description, content, review } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Reviewer name is required." });
    }

    if (!description && !content && !review) {
      return res.status(400).json({ message: "Review description is required." });
    }

    const reviewItem = await Review.create({
      name,
      profilePic: getProfilePic(req),
      description: description || content || review,
    });

    return res.status(201).json({
      message: "Review created successfully.",
      review: reviewItem,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.editReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, content, review } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid review id." });
    }

    const reviewItem = await Review.findById(id);
    if (!reviewItem) {
      return res.status(404).json({ message: "Review not found." });
    }

    if (name !== undefined) reviewItem.name = name;
    if (description !== undefined || content !== undefined || review !== undefined) {
      reviewItem.description = description || content || review;
    }

    const profilePic = getProfilePic(req);
    if (profilePic) {
      reviewItem.profilePic = profilePic;
    }

    await reviewItem.save();

    return res.status(200).json({
      message: "Review updated successfully.",
      review: reviewItem,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid review id." });
    }

    const reviewItem = await Review.findByIdAndDelete(id);
    if (!reviewItem) {
      return res.status(404).json({ message: "Review not found." });
    }

    return res.status(200).json({
      message: "Review deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
