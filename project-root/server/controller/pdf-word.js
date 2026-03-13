const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { execFile } = require("child_process");

const uploadDir = path.join(__dirname, "../uploads");
const outputDir = path.join(__dirname, "../output");

const pythonScript = path.join(
  __dirname,
  "../python/pdf_to_doc.py"
);

const pythonBinary = path.resolve(
  __dirname,
  "../../venv/bin/python"
);

const upload = multer({
  dest: uploadDir,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed"));
    }
    cb(null, true);
  },
}).single("pdf");

exports.pdfToDoc = (req, res) => {
  upload(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    if (!req.file)
      return res.status(400).json({ error: "No PDF uploaded" });

    const inputPath = req.file.path;
    const outputPath = path.join(outputDir, `${Date.now()}.docx`);

    execFile(
      pythonBinary,
      [pythonScript, inputPath, outputPath],
      { timeout: 120000 },
      (error, stdout, stderr) => {
        console.log("STDOUT:", stdout);
        console.log("STDERR:", stderr);

        if (error) {
          cleanup(inputPath);
          return res.status(500).json({
            error: "Conversion failed",
            details: stderr,
          });
        }

        res.download(outputPath, "converted.docx", () => {
          cleanup(inputPath);
          cleanup(outputPath);
        });
      }
    );
  });
};

function cleanup(filePath) {
  fs.unlink(filePath, () => {});
}
