const fs = require('fs-extra');
const path = require('path');
const { PDFDocument } = require('pdf-lib');

// Helper to safely delete files
const clearFile = (filePath) => {
  fs.unlink(filePath).catch(() => {});
};

const mergePDFs = async (req, res) => {
  try {
    if (!req.files || req.files.length < 2) {
      return res.status(400).json({
        msg: 'Please upload at least two PDF files',
      });
    }

    const mergedPDF = await PDFDocument.create();

    for (const file of req.files) {
      const pdfBytes = await fs.readFile(file.path);
      const pdf = await PDFDocument.load(pdfBytes);
      const copiedPages = await mergedPDF.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPDF.addPage(page));
    }

    const mergedPdfBytes = await mergedPDF.save();
    const outputFileName = `${Date.now()}-merged.pdf`;
    const outputPath = path.join(__dirname, '../output', outputFileName);

    await fs.writeFile(outputPath, mergedPdfBytes);

    req.files.forEach((f) => clearFile(f.path));

    res.download(outputPath, 'merged.pdf', () => clearFile(outputPath));
  } catch (error) {
    console.error('Error merging PDFs:', error);
    res.status(500).json({ msg: 'Failed to merge PDF' });
  }
};

module.exports = mergePDFs;
