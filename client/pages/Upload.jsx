import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCloudUploadAlt, FaFileAlt } from "react-icons/fa";
import { api } from "../services/api";

export default function Upload({
  title,
  accept,
  serviceKey,
  apiEndpoint,
  formKey,
  multiple = false,
}) {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(multiple ? Array.from(e.target.files) : [e.target.files[0]]);
    }
  };

  const handleUpload = async () => {
    if (!files.length) return;

    try {
      setLoading(true);

      const formData = new FormData();

      if (multiple) {
        files.forEach((file) => formData.append(formKey, file));
      } else {
        formData.append(formKey, files[0]);
      }

      // Redact flow
      if (serviceKey === "redactPdf") {
        navigate("/redact", {
          state: { file: files[0] },
        });
        return;
      }

      // Rearrange preview flow
      if (serviceKey === "rearrangePdf") {
        const previewFormData = new FormData();
        previewFormData.append("pdf", files[0]);

        const response = await api.post(
          "/api/arrange/preview",
          previewFormData
        );

        const data = response.data;

        navigate("/rearrange", {
          state: {
            previews: data.previews,
            totalPages: data.totalPages,
            originalFile: files[0],
          },
        });

        return;
      }

      // Normal upload flow
      const response = await api.post(apiEndpoint, formData, {
        responseType: "blob",
      });

      const blob = response.data;
      const outputURL = window.URL.createObjectURL(blob);

      const inputURL = multiple
        ? files.map((f) => window.URL.createObjectURL(f))
        : window.URL.createObjectURL(files[0]);

      navigate("/result", {
        state: {
          inputUrl: inputURL,
          outputUrl: outputURL,
        },
      });
    } catch (error) {
      console.error("Upload error:", error);
      alert("Something went wrong while uploading.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white shadow-xl rounded-2xl p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>

        <label className="mt-8 block border-2 border-dashed border-gray-300 rounded-xl p-8 cursor-pointer hover:border-[#832126] transition">
          <div className="flex flex-col items-center gap-3">
            <FaCloudUploadAlt className="text-4xl text-gray-400" />
            <span className="text-gray-600 font-medium">
              {files.length
                ? multiple
                  ? `${files.length} files selected`
                  : "Change File"
                : "Click to upload"}
            </span>
            <span className="text-xs text-gray-400">
              {accept || "Supported format"}
            </span>
          </div>

          <input
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleChange}
            className="hidden"
          />
        </label>

        {files.length > 0 && (
          <div className="mt-6 flex flex-col items-center gap-2 bg-gray-100 rounded-lg p-3">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-center gap-3 w-full"
              >
                <FaFileAlt className="text-[#832126]" />
                <span className="text-sm text-gray-700 truncate max-w-xs">
                  {file.name}
                </span>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!files.length || loading}
          className={`mt-8 w-full py-3 rounded-xl font-medium transition ${
            files.length
              ? "bg-[#832126] hover:bg-[#d23837] text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {loading ? "Uploading..." : "Continue"}
        </button>
      </div>
    </div>
  );
}