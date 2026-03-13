import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Loading() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Safety check: if user refreshes or directly opens /loading
    if (!state) {
      navigate("/");
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        const increment = Math.floor(Math.random() * 5) + 4; // 4–8
        const next = prev + increment;

        if (next >= 100) {
          clearInterval(interval);
          navigate("/result", { state });
          return 100; // clamp at 100
        }

        return next;
      });
    }, 180);

    return () => clearInterval(interval);
  }, [navigate, state]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f4f6] px-4">
      <div className="w-full max-w-md text-center">

        <h1 className="text-2xl font-semibold text-gray-900">
          Preparing your file
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Please wait while we process your document
        </p>

        {/* Progress Bar */}
        <div className="mt-8 w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#832126] transition-all duration-200"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        <p className="mt-3 text-xs text-gray-500">
          {Math.min(progress, 100)}% completed
        </p>

        {/* Loading dots */}
        <div className="mt-6 flex justify-center gap-2">
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300" />
        </div>

      </div>
    </div>
  );
}
