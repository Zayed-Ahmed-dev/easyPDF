const fs = require("fs");
const path = require("path");
const { PDFDocument } = require("pdf-lib");

let lastPreviewFolder = null;


// =====================================
// Generate preview PDFs
// =====================================
const generatePagePreviews = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "PDF file is required" });
    }

    fs.mkdirSync("previews", { recursive: true });
    fs.mkdirSync("output", { recursive: true });

    const inputPath = req.file.path;
    const pdfBytes = fs.readFileSync(inputPath);

    const pdfDoc = await PDFDocument.load(pdfBytes);
    const totalPages = pdfDoc.getPageCount();

    const folderName = `preview-${Date.now()}`;
    const previewDir = path.join("previews", folderName);

    lastPreviewFolder = previewDir;

    fs.mkdirSync(previewDir, { recursive: true });

    const previewUrls = [];

    for (let i = 0; i < totalPages; i++) {
      const newPdf = await PDFDocument.create();

      const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);

      newPdf.addPage(copiedPage);

      const newPdfBytes = await newPdf.save();

      const previewPath = path.join(previewDir, `page-${i}.pdf`);

      fs.writeFileSync(previewPath, newPdfBytes);

      previewUrls.push(`/previews/${folderName}/page-${i}.pdf`);
    }

    res.json({
      totalPages,
      previews: previewUrls,
    });

  } catch (error) {
    console.error("Preview generation failed:", error);
    res.status(500).json({ msg: "preview generation failed" });
  }
};



// =====================================
// Rearrange final PDF
// =====================================
const rearrangePDF   = async (req, res) => {
  try {
    const { order } = req.body;

    if (!order || !req.file) {
      return res.status(400).json({
        msg: "Pdf file and page order are required",
      });
    }

    const pageOrder = JSON.parse(order).map((num) => num - 1);

    const inputPath = req.file.path;

    const pdfBytes = fs.readFileSync(inputPath);

    const pdfDoc = await PDFDocument.load(pdfBytes);

    const newPdf = await PDFDocument.create();

    const pages = await newPdf.copyPages(pdfDoc, pageOrder);

    pages.forEach((page) => newPdf.addPage(page));

    const outputPath = path.join(
      "output",
      `rearranged-${Date.now()}.pdf`
    );

    const finalPdf = await newPdf.save();

    fs.writeFileSync(outputPath, finalPdf);

    fs.unlinkSync(inputPath);

    res.download(outputPath, () => {

      // delete output file
      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
      }

      // delete preview folder
      if (lastPreviewFolder && fs.existsSync(lastPreviewFolder)) {
        fs.rmSync(lastPreviewFolder, {
          recursive: true,
          force: true,
        });

        lastPreviewFolder = null;
      }

    });

  } catch (error) {
    console.error("Rearrangement failed:", error);
    res.status(500).json({ msg: "Rearrangement Failed" });
  }
};


module.exports = {
  generatePagePreviews,
  rearrangePDF,
};