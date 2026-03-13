const express = require('express');
const multer = require('multer');
const mergePDFs = require('../controller/pdf-merge');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Route for merging up to 10 PDF files
router.post('/merge', upload.array('pdfs', 10), mergePDFs);

// ✅ Export router so it can be used in index.js
module.exports = router;
