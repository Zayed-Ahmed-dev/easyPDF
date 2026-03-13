import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCloudUploadAlt } from "react-icons/fa";

export default function SecurityUpload() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file || !password) {
      alert("File and password required");
      return;
    }

    // Optional: Only allow PDFs
    if (file.type !== "application/pdf") {
      alert("Only PDF files are allowed");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("pdf", file);      // backend expects "pdf"
      formData.append("password", password); // if backend uses password

      // Update this URL to your Render backend
      const backendURL = "https://easypdf-0q39.onrender.com/api/convert/pdf-to-doc";

      const response = await fetch(backendURL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const blob = await response.blob();
      const outputURL = window.URL.createObjectURL(blob);
      const inputURL = window.URL.createObjectURL(file);

      navigate("/result", {
        state: {
          inputUrl: inputURL,
          outputUrl: outputURL,
        },
      });

    } catch (err) {
      console.error(err);
      alert("Operation failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg text-center">
        <h1 className="text-3xl font-bold">PDF Converter</h1>

        {/* File Upload */}
        <label className="mt-8 block border-2 border-dashed border-gray-300 rounded-xl p-8 cursor-pointer">
          <div className="flex flex-col items-center gap-3">
            <FaCloudUploadAlt className="text-4xl text-gray-400" />
            <span>{file ? file.name : "Click to upload PDF"}</span>
          </div>
          <input
            type="file"
            className="hidden"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </label>

        {/* Password (optional if backend uses it) */}
        <input
          type="password"
          placeholder="Enter password (optional)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-6 w-full border rounded-lg p-3"
        />

        <button
          onClick={handleUpload}
          disabled={loading}
          className="mt-6 w-full bg-[#832126] text-white py-3 rounded-xl hover:bg-[#d23837]"
        >
          {loading ? "Processing..." : "Convert PDF to DOCX"}
        </button>
      </div>
    </div>
  );
}