import React from "react";

export default function Card({ fromIcon, toIcon, label, onClick }) {
  return (
    <div
      onClick={onClick}
      className="
        group cursor-pointer rounded-xl border border-gray-200
        bg-white px-6 py-4 transition-all duration-200
        hover:bg-[#fde6e7] hover:border-[#832126]/30
        flex flex-col items-center
      "
    >
      {/* Icons row */}
      <div className="flex items-center justify-center gap-4 mb-3">
        
        {/* From icon */}
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-200 group-hover:bg-white transition">
          {fromIcon}
        </div>

        {/* Arrow */}
        <svg
          className="w-5 h-5 text-gray-500 group-hover:text-[#832126] transition"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 5l7 7-7 7"
          />
        </svg>

        {/* To icon */}
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-200 group-hover:bg-white transition">
          {toIcon}
        </div>
      </div>

      {/* Label */}
      <p className="text-center text-sm font-medium text-gray-800 group-hover:text-[#832126] transition">
        {label}
      </p>
    </div>
  );
}
