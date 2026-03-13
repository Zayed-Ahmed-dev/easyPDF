const fs = require("fs-extra");
const path = require("path");
const { PDFDocument, rgb } = require("pdf-lib");

// helper to remove temporary files
const clearFile = (filePath) => {
  fs.unlink(filePath).catch(() => {});
};

exports.redactPdf = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "PDF file required" });
    }

    const { redactions } = req.body;

    if (!redactions) {
      return res.status(400).json({ msg: "Redaction data required" });
    }

    const inputPath = req.file.path;
    const pdfBytes = await fs.readFile(inputPath);

    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();

    const redactionAreas = JSON.parse(redactions);

    /*
    Expected format:

    [
      {
        page: 0,
        x: 100,
        y: 200,
        width: 150,
        height: 30
      }
    ]
    */

    redactionAreas.forEach((area) => {
      const page = pages[area.page];

      const { width: pdfWidth, height: pdfHeight } = page.getSize();

      // This MUST match React-PDF Page width
      const renderedWidth = 650;

      // Scale factor
      const scale = pdfWidth / renderedWidth;

      const x = area.x * scale;
      const width = area.width * scale;
      const height = area.height * scale;

      // Convert browser Y → PDF Y
      const pdfY = pdfHeight - (area.y * scale) - height;

      page.drawRectangle({
        x,
        y: pdfY,
        width,
        height,
        color: rgb(0, 0, 0),
      });
    });

    const redactedPdf = await pdfDoc.save();

    const outputPath = path.join(
      __dirname,
      "../output",
      `${Date.now()}-redacted.pdf`
    );

    await fs.writeFile(outputPath, redactedPdf);

    clearFile(inputPath);

    res.download(outputPath, "redacted.pdf", () => {
      clearFile(outputPath);
    });

  } catch (err) {
    console.error("Redaction error:", err);
    res.status(500).json({ msg: "Failed to redact PDF" });
  }
};