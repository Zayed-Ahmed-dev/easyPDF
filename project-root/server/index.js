require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs-extra');

// Import routes
const JpgToPdfRoutes = require('./routes/jpg-pdf');
const pdfMergeRoutes = require('./routes/pdf-merge');
const FileEncryptionRoutes = require('./routes/pdf-security');
const convertRoutes = require('./routes/pdf-word');
const rearrangeRoutes = require('./routes/rearrange-pdf');
const redactRoutes = require("./routes/redact-pdf-routes"); 
// const pdfCompresserRoutes = require('./routes/pdf-compress');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static output folder (for previews)
app.use('/output', express.static('output'));

// Ensure necessary folders exist
fs.ensureDirSync('uploads');
fs.ensureDirSync('output');

// Database connection (uncomment if using DB)
// connectDB();

// Routes
app.use('/api/jpg', JpgToPdfRoutes);             // JPG → PDF
app.use('/api/file', FileEncryptionRoutes);      // Encrypt/Decrypt
app.use('/api/pdf', pdfMergeRoutes);            // Merge PDFs
app.use('/api/convert', convertRoutes);          // Convert PDF to Doc
app.use('/api/arrange', rearrangeRoutes);        // Rearrange the PDF
app.use('/api/redact', redactRoutes);
app.use('/previews', express.static('previews'));
// app.use('/api/pdfCompress', pdfCompresserRoutes);   //Compress the PDF
  
// Test route
app.get('/', (req, res) => {
  res.send('Server is running');
});

//test route
// Assuming you have your Express app defined as 'app'
const { execFile } = require("child_process");

// Temporary test endpoint
app.get("/test-pdf2docx", (req, res) => {
  execFile(
    "python3",
    ["-c", "import pdf2docx; print('pdf2docx works')"],
    (err, stdout, stderr) => {
      if (err) {
        console.error("Error:", err);
        return res.status(500).send({
          success: false,
          message: "Python or pdf2docx not working",
          error: stderr || err.message,
        });
      }

      console.log("PDF2DOCX test stdout:", stdout);
      res.send({
        success: true,
        message: stdout.trim(),
      });
    }
  );
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
