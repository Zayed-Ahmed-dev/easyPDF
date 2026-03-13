import { useNavigate } from "react-router-dom";
import { FaLock, FaUnlock, FaShieldAlt, FaFileAlt } from "react-icons/fa";

export default function PdfSecurity() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-2xl w-full">

        {/* Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <FaShieldAlt className="text-4xl text-[#832126]" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900">
            File Encryption & Decryption
          </h1>

          <p className="text-gray-600 mt-2 text-sm">
            Secure any file with password-based encryption or unlock an
            encrypted file using the correct password.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-6 mb-10">

          <button
            onClick={() => navigate("/security/encrypt")}
            className="flex-1 flex flex-col items-center gap-2 bg-green-600 text-white py-5 rounded-xl hover:bg-green-700 transition"
          >
            <FaLock className="text-2xl" />
            <span className="font-semibold">Encrypt File</span>
            <span className="text-xs opacity-90">
              Protect a file with a password
            </span>
          </button>

          <button
            onClick={() => navigate("/security/decrypt")}
            className="flex-1 flex flex-col items-center gap-2 bg-blue-600 text-white py-5 rounded-xl hover:bg-blue-700 transition"
          >
            <FaUnlock className="text-2xl" />
            <span className="font-semibold">Decrypt File</span>
            <span className="text-xs opacity-90">
              Unlock a previously encrypted file
            </span>
          </button>

        </div>

        {/* Instructions */}
        <div className="bg-gray-100 rounded-xl p-6 text-sm text-gray-700">

          <h2 className="font-semibold text-gray-900 mb-3">
            How it works
          </h2>

          <ul className="space-y-2 list-disc list-inside">

            <li>
              Your file is encrypted using <strong>AES-256 encryption</strong>,
              one of the most secure encryption standards used worldwide.
            </li>

            <li>
              The password you provide is converted into a secure encryption
              key, which is required to unlock the file later.
            </li>

            <li>
              During encryption, a random initialization vector (IV) is added
              to strengthen security.
            </li>

            <li>
              Without the correct password, the encrypted file cannot be
              decrypted.
            </li>

          </ul>

          <div className="mt-4 flex items-start gap-2">
            <FaFileAlt className="text-gray-500 mt-1" />
            <p>
              This tool works with <strong>any file type</strong> — PDFs, images,
              documents, videos, or archives — because it encrypts the raw file
              data rather than the file format itself.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}