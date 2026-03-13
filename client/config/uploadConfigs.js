// src/config/uploadConfigs.js

export const uploadConfigs = {
  pdfToWord: {
    title: "PDF to Word Converter",
    accept: "application/pdf",
    multiple: false,  
    formKey: "pdf",
    apiEndpoint: "/api/convert/pdf-to-doc",
    inputLabel: "PDF Preview",
    outputLabel: "Download Word File",
    outputFileName: "converted.docx",
    validateFile: (file) => file.type === "application/pdf",
  },

  imageToPdf: {
    title: "Image to PDF Converter",
    accept: "image/*",
    multiple: true,
    formKey: "images",
    apiEndpoint: "/api/jpg/jpg-to-pdf",
    inputLabel: "Image Preview",
    outputLabel: "Download PDF File",
    outputFileName: "converted.pdf",
    validateFile: (file) => file.type.startsWith("image/"),
  },

  rearrangePdf: {
    title: "Rearrage your PDF",
    accept: "application/pdf",
    multiple: false,
    formKey: "pdf",
    apiEndpoint: "/api/arrange/rearrange",
    inputLabel: "PDF preview",
    outputLabel: "Download PDF file",
    outputFileName: "rearranged.pdf",
    validateFile: (file) => file.type === "application/pdf", 
  },
  mergePdf: {
    title: "Merge your PDF",
    accept: "application/pdf",
    multiple: true,
    formKey: "pdfs",
    apiEndpoint: "/api/pdf/merge",  
    inputLabel: "PDF preview",
    outputLabel: "Download PDF file",
    outputFileName: "merged.pdf",
    validateFile: (file) => file.type === "application/pdf"
  },
   securityPdf: {
    title: "Secure your PDF",
    accept: "application/pdf",
    multiple: false,
    formKey: "file",
    apiEndpoint: "/api/file/encrypt",  
    inputLabel: "PDF preview",
    outputLabel: "Download PDF file",
    outputFileName: "encrypted",
    validateFile: (file) => file.type === "application/pdf"
  },
   redactPdf: {
    title: "redact your PDF",
    accept: "application/pdf",
    multiple: false,
    formKey: "file",
    apiEndpoint: "/api/file/redact",  
    inputLabel: "PDF preview",
    outputLabel: "Download PDF file",
    outputFileName: "encrypted",
    validateFile: (file) => file.type === "application/pdf"
  },
};
