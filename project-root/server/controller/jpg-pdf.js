const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs-extra');

exports.JpgToPdf = async (req, res) => {
  try {
    // Validate file upload
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No images uploaded" });
    }

    // Get page size (optional from frontend)
    const { pageSize } = req.body;

    // Available page sizes (in points)
    const PAGE_SIZES = {
      A4: [595.28, 841.89],
      LETTER: [612, 792],
      LEGAL: [612, 1008],
    };

    // Default to A4 if no valid size is provided
    const size = PAGE_SIZES[pageSize?.toUpperCase()] || PAGE_SIZES.A4;

    // Define output path
    const outputPath = path.join(__dirname, `../output/${Date.now()}-converted.pdf`);
    await fs.ensureDir(path.join(__dirname, '../output')); // make sure output dir exists

    // Create PDF document
    const doc = new PDFDocument({ size });
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    // Add images to PDF
    req.files.forEach((file, index) => {
      doc.image(file.path, 0, 0, {
        fit: size,
        align: 'center',
        valign: 'center',
      });

      if (index !== req.files.length - 1) doc.addPage();
    });

    // Finalize PDF file
    doc.end();

    // Wait for file to finish writing before responding
    stream.on("finish", () => {
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${path.basename(outputPath)}"`
      );

      fs.createReadStream(outputPath).pipe(res);

      res.on("finish", async () => {
        await fs.remove(outputPath);
      });
    });


  } catch (err) {
    console.error('Error converting JPG to PDF:', err);
    res.status(500).json({ error: 'Failed to convert to PDF' });
  }
};
