const Review = require("../../models/Review");

const UPLOAD_BASE_PATH = "/assets/uploads";
const getProfilePic = (req) => {
  const file = req.files?.profilePic?.[0] || req.files?.image?.[0];
  return file?.filename ? `${UPLOAD_BASE_PATH}/${file.filename}` : "";
};

exports.getWebsiteReviews = async (req, res) => {
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

exports.addWebsiteReview = async (req, res) => {
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
      message: "Review submitted successfully.",
      review: reviewItem,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
