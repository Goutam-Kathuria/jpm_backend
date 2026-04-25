const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "..", "assets", "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

const upload = multer({ storage });
const uploadFiles = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "profilePic", maxCount: 1 },
  { name: "gallery", maxCount: 10 },
  { name: "MultipleImage", maxCount: 10 },
  { name: "bannerImage", maxCount: 2 },
  { name: "csv", maxCount: 1 },
]);

module.exports = uploadFiles;
module.exports.upload = upload;
module.exports.uploadDir = uploadDir;
