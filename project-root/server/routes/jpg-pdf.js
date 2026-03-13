const express = require('express');
const multer = require('multer');
const { JpgToPdf } = require('../controller/jpg-pdf');

const router = express.Router();

const upload = multer({dest: 'uploads/'});

router.post('/jpg-to-pdf', upload.array('images'),JpgToPdf);

module.exports = router