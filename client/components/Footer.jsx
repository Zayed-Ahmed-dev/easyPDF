import React from "react";

export default function Footer() {
  return (
    <footer className="bg-[#d13837] text-white mt-12">
      <div className="max-w-7xl mx-auto px-6 py-6">

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          
          {/* Step 01 */}
          <div>
            <div className="text-3xl font-bold opacity-30 mb-2">01</div>
            <h3 className="text-md font-semibold mb-1">Choose the Service</h3>
            <p className="text-xs text-white/80 leading-snug">
              Pick the PDF tool you need — convert, merge, secure, rearrange, or redact.
            </p>
          </div>

          {/* Step 02 */}
          <div>
            <div className="text-3xl font-bold opacity-30 mb-2">02</div>
            <h3 className="text-md font-semibold mb-1">Upload Document</h3>
            <p className="text-xs text-white/80 leading-snug">
              Upload your file securely. Processing is fast and private.
            </p>
          </div>

          {/* Step 03 */}
          <div>
            <div className="text-3xl font-bold opacity-30 mb-2">03</div>
            <h3 className="text-md font-semibold mb-1">Preview & Download</h3>
            <p className="text-xs text-white/80 leading-snug">
              Review the output and download your document instantly.
            </p>
          </div>

        </div>

      </div>
    </footer>
  );
}
