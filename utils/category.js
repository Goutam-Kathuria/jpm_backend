const mongoose = require("mongoose");

// Validate MongoDB ObjectId
const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

module.exports = {
  isValidObjectId,
};
