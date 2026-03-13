import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaCloudUploadAlt } from "react-icons/fa";
import { api } from "../services/api";

export default function SecurityUpload() {
  const { type } = useParams(); // "encrypt" or "decrypt"
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file || !password) {
      alert("File and password required");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("password", password);

      // Use Axios instance
      const response = await api.post(`/api/file/${type}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob", // important for file downloads
      });

      const blob = response.data;
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
      alert("Operation failed: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg text-center">
        <h1 className="text-3xl font-bold">
          {type === "encrypt" ? "Encrypt File" : "Decrypt File"}
        </h1>

        {/* File Upload */}
        <label className="mt-8 block border-2 border-dashed border-gray-300 rounded-xl p-8 cursor-pointer">
          <div className="flex flex-col items-center gap-3">
            <FaCloudUploadAlt className="text-4xl text-gray-400" />
            <span>{file ? file.name : "Click to upload file"}</span>
          </div>
          <input
            type="file"
            className="hidden"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </label>

        {/* Password */}
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-6 w-full border rounded-lg p-3"
        />

        <button
          onClick={handleUpload}
          disabled={loading}
          className="mt-6 w-full bg-[#832126] text-white py-3 rounded-xl hover:bg-[#d23837]"
        >
          {loading
            ? "Processing..."
            : type === "encrypt"
            ? "Encrypt File"
            : "Decrypt File"}
        </button>
      </div>
    </div>
  );
}
