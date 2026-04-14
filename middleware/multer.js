const fs = require("fs");
const path = require("path");
const multer = require("multer");

const ROOT_FOLDER = "fivliaMarket";
const uploadsRoot = path.join(__dirname, "..", "uploads");

const ensureDirectory = (directoryPath) => {
  fs.mkdirSync(directoryPath, { recursive: true });
};

const normalizeFilename = (originalName, fallbackName) => {
  const extension = path.extname(originalName).toLowerCase();
  const baseName =
    path
      .basename(originalName, extension)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || fallbackName;

  return `${Date.now()}-${baseName}${extension}`;
};

const fileFilter = (req, file, cb) => {
  const allowedExtensions = [".jpeg", ".jpg", ".png", ".svg", ".gif", ".webp", ".avif", ".pdf"];
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/svg+xml",
    "image/gif",
    "image/webp",
    "image/avif",
    "application/pdf",
  ];

  const extension = path.extname(file.originalname).toLowerCase();
  const isAllowedExtension = allowedExtensions.includes(extension);
  const isAllowedMimeType = allowedMimeTypes.includes(file.mimetype);

  if (isAllowedExtension && isAllowedMimeType) {
    cb(null, true);
    return;
  }

  cb(new Error("Invalid file type."));
};

let storage;

try {
  const multerS3 = require("multer-s3");
  const s3 = require("../config/aws");

  storage = multerS3({
    s3,
    bucket: process.env.AWS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const name = normalizeFilename(file.originalname, file.fieldname);
      cb(null, `${ROOT_FOLDER}/${file.fieldname}/${name}`);
    },
  });
} catch (error) {
  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const destination = path.join(uploadsRoot, file.fieldname);
      ensureDirectory(destination);
      cb(null, destination);
    },
    filename: (req, file, cb) => {
      cb(null, normalizeFilename(file.originalname, file.fieldname));
    },
  });
}

const upload = multer({ storage, fileFilter });

module.exports = {
  upload,
  uploadFields: upload.fields([
    { name: "image", maxCount: 1 },
    { name: "MultipleImage", maxCount: 10 },
  ]),
  uploadSingleImage: upload.single("image"),
  uploadsRoot,
};
