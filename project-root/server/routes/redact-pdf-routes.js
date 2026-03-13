const express = require("express");
const multer = require("multer");
const { redactPdf } = require("../controller/readact-pdf");

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/redact", upload.single("pdf"), redactPdf);

module.exports = router;