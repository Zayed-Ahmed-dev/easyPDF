const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  generatePagePreviews,
  rearrangePDF,
} = require("../controller/rearrange-pdf");

const router = express.Router();

// Storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() + "-" + file.originalname.replace(/\s+/g, "-");
    cb(null, uniqueName);
  },
});

// Multer config
const upload = multer({
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
  fileFilter: function (req, file, cb) {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },
});

// ✅ 1️⃣ Generate page previews
router.post("/preview", upload.single("pdf"), generatePagePreviews);

// ✅ 2️⃣ Rearrange final PDF (your existing route)
router.post("/rearrange", upload.single("pdf"), rearrangePDF);

module.exports = router;