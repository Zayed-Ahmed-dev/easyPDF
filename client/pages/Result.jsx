import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Result() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [overlayActive, setOverlayActive] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile devices
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  // Redirect if no state
  useEffect(() => {
    if (!state) {
      navigate("/");
    }
  }, [navigate, state]);

  if (!state) return null;

  let { inputUrl, outputUrl } = state;

  // Normalize inputUrl to array for multiple files
  const inputFiles = Array.isArray(inputUrl) ? inputUrl : [inputUrl];

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-4 md:p-10 font-sans">

      <div className="w-full max-w-4xl">

        {/* Input Preview Card */}
        <div
          className="relative bg-gray-100 rounded-[2rem] shadow-2xl overflow-hidden border border-gray-300 flex flex-col transition-all duration-300 mx-auto
                     h-[400px] md:h-[500px] group"
        >

          {/* Preview Area */}
          <div className="flex-1 px-4 sm:px-6 py-4 relative">

            {/* Multiple Iframes for multiple input files */}
            {inputFiles.map((url, index) => (
              <iframe
                key={index}
                src={url}
                className={`w-full h-full rounded-xl transition-all duration-300 mb-4
                  ${
                    isMobile
                      ? overlayActive
                        ? "opacity-40"
                        : "opacity-100"
                      : "group-hover:opacity-40 group-hover:invert group-hover:grayscale"
                  }`}
                title={`Input Preview ${index + 1}`}
              />
            ))}

            {/* Overlay */}
            {(isMobile ? overlayActive : true) && (
              <div
                onClick={() => isMobile && setOverlayActive(false)}
                className={`absolute inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center
                            transition-all duration-300 cursor-pointer
                            ${!isMobile ? "opacity-0 group-hover:opacity-100" : ""}`}
              >
                <div
                  className="flex gap-4"
                  onClick={(e) => e.stopPropagation()}
                >
                   {/* Download Button */}
                  <a
                    href={outputUrl}
                    download
                    className="px-6 py-3 rounded-full bg-[#832126] text-white font-medium hover:bg-[#a3292f] shadow-lg transition-all"
                  >
                    Download File
                  </a>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Navigation Footer */}
        <div className="mt-6 md:mt-8 flex flex-col items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="text-gray-500 hover:text-gray-800 transition-colors font-medium cursor-pointer underline underline-offset-4"
          >
            Convert another file
          </button>
        </div>

      </div>
    </div>
  );
}