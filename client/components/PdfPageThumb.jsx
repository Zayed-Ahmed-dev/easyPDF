import React from "react";
import { Page } from "react-pdf";

export default function PdfPageThumb({ pageNumber, file }) {
  return (
    <div className="flex flex-col items-center">
      <Page
        pageNumber={pageNumber}
        file={file} // pass the file or URL
        width={160}
        renderTextLayer={false}
        renderAnnotationLayer={false}
      />
      <p className="mt-2 text-xs text-center text-gray-600 font-medium">
        Page {pageNumber}
      </p>
    </div>
  );
}