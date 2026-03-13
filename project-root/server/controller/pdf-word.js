const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { execFile } = require("child_process");

// Use system Python (Render does not have your local venv)
const pythonBinary = "python3";

// Use /tmp directories for uploads and outputs on Render
const uploadDir = "/tmp/uploads";
const outputDir = "/tmp/output";

// Ensure directories exist
fs.mkdirSync(uploadDir, { recursive: true });
fs.mkdirSync(outputDir, { recursive: true });

// Path to your Python script
const pythonScript = path.join(__dirname, "../python/pdf_to_doc.py");

// Multer setup for PDF uploads
const upload = multer({
  dest: uploadDir,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed"));
    }
    cb(null, true);
  },
}).single("pdf");

// Handler
exports.pdfToDoc = (req, res) => {
  upload(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    if (!req.file) return res.status(400).json({ error: "No PDF uploaded" });

    const inputPath = req.file.path;
    const outputPath = path.join(outputDir, `${Date.now()}.docx`);

    execFile(
      pythonBinary,
      [pythonScript, inputPath, outputPath],
      { timeout: 120000 }, // 2 minutes
      (error, stdout, stderr) => {
        // Log everything for debugging
        console.log("STDOUT:", stdout);
        console.log("STDERR:", stderr);
        if (error) console.error("ExecFile error:", error);

        if (error) {
          cleanup(inputPath);
          cleanup(outputPath);
          return res.status(500).json({
            error: "Conversion failed",
            details: stderr || error.message,
          });
        }

        // Send converted DOCX to client
        res.download(outputPath, "converted.docx", (downloadErr) => {
          // Cleanup both input and output
          cleanup(inputPath);
          cleanup(outputPath);
          if (downloadErr) console.error("Download error:", downloadErr);
        });
      }
    );
  });
};

// Helper to delete files safely
function cleanup(filePath) {
  fs.unlink(filePath, () => {});
}