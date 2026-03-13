import { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import { api } from "../services/api";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import pdfWorker from "pdfjs-dist/build/pdf.worker.min?url";
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

export default function RedactPdf() {
  const location = useLocation();
  const navigate = useNavigate();

  const [file] = useState(location.state?.file || null);

  const [numPages, setNumPages] = useState(null);
  const [redactions, setRedactions] = useState([]);
  const [currentBox, setCurrentBox] = useState(null);

  const containerRef = useRef(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleMouseDown = (e) => {
    const rect = containerRef.current.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCurrentBox({
      startX: x,
      startY: y,
      x,
      y,
      width: 0,
      height: 0,
    });
  };

  const handleMouseMove = (e) => {
    if (!currentBox) return;

    const rect = containerRef.current.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newX = Math.min(x, currentBox.startX);
    const newY = Math.min(y, currentBox.startY);

    const width = Math.abs(x - currentBox.startX);
    const height = Math.abs(y - currentBox.startY);

    setCurrentBox({
      ...currentBox,
      x: newX,
      y: newY,
      width,
      height,
    });
  };

  const handleMouseUp = () => {
    if (!currentBox) return;

    const finalBox = {
      page: 0,
      x: currentBox.x,
      y: currentBox.y,
      width: currentBox.width,
      height: currentBox.height,
    };

    setRedactions((prev) => [...prev, finalBox]);
    setCurrentBox(null);
  };

  const removeLastRedaction = () => {
    setRedactions((prev) => prev.slice(0, -1));
  };

  const handleSubmit = async () => {
    if (!file) return alert("Upload PDF first");

    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("redactions", JSON.stringify(redactions));

    try {
      const res = await api.post(
        "/api/redact/redact",
        formData,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(res.data);

      const a = document.createElement("a");
      a.href = url;
      a.download = "redacted.pdf";
      a.click();
    } catch (err) {
      console.error(err);
      alert("Redaction failed");
    }
  };

  if (!file) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">No PDF provided.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-10">
      <h1 className="text-3xl font-bold mb-6">PDF Redaction Tool</h1>

      <p className="text-gray-500 mb-6 text-sm">
        File: {file.name}
      </p>

      <div className="w-full max-w-3xl">
        {/* Toolbar */}

        <div className="bg-white shadow-md rounded-xl p-4 mb-4 flex gap-3 justify-between">
          <button
            onClick={removeLastRedaction}
            disabled={redactions.length === 0}
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md text-sm disabled:opacity-50"
          >
            Remove Last Redaction
          </button>

          <button
            onClick={handleSubmit}
            className="bg-red-600 text-white px-5 py-2 rounded-md hover:bg-red-700 transition"
          >
            Apply Redaction
          </button>
        </div>

        {/* Convert another file */}

        <div className="text-center mb-4">
          <button
            onClick={() => navigate("/")}
            className="text-blue-600 hover:underline text-sm"
          >
            Convert another file
          </button>
        </div>

        {/* PDF Preview */}

        <div className="bg-white shadow-xl rounded-xl p-6 flex justify-center">
          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            style={{ position: "relative", cursor: "crosshair" }}
          >
            <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
              <Page pageNumber={1} width={650} />
            </Document>

            {/* Existing redactions */}

            {redactions.map((box, index) => (
              <div
                key={index}
                style={{
                  position: "absolute",
                  left: box.x,
                  top: box.y,
                  width: box.width,
                  height: box.height,
                  backgroundColor: "black",
                  opacity: 0.85,
                }}
              />
            ))}

            {/* Drag preview */}

            {currentBox && (
              <div
                style={{
                  position: "absolute",
                  left: currentBox.x,
                  top: currentBox.y,
                  width: currentBox.width,
                  height: currentBox.height,
                  backgroundColor: "black",
                  opacity: 0.4,
                  border: "2px dashed red",
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}