// will be hanndled by python backend
const express = require("express");
const { pdfToDoc } = require("../controller/pdf-word");
const router = express.Router();

router.post("/pdf-to-doc", pdfToDoc);

module.exports = router;