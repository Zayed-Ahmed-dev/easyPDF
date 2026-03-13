const express = require('express');
const multer = require('multer');
const { encryptFile, decryptFile } = require('../controller/pdf-security');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/encrypt', upload.single('file'), encryptFile);
router.post('/decrypt', upload.single('file'), decryptFile);

module.exports = router;
