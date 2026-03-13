import React from "react";

export default function Header() {
  return (
    <header className="w-full border-b border-[#832126]/20 bg-white">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <div className="text-2xl font-semibold tracking-tight text-gray-900">
          <span className="text-[#832126]">Easy</span>PDF
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex gap-6 text-gray-700 text-sm font-medium">
          <a href="#" className="hover:text-[#832126] transition">
            JPG to PDF
          </a>
          <a href="#" className="hover:text-[#832126] transition">
            Merge PDF
          </a>
          <a href="#" className="hover:text-[#832126] transition">
            Encrypt PDF
          </a>
          <a href="#" className="hover:text-[#832126] transition">
            PDF to DOC
          </a>
          <a href="#" className="hover:text-[#832126] transition">
            Rearrange PDF
          </a>
        </nav>

        {/* CTA */}
        <button className="bg-[#832126] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#6f1b20] transition">
          Get Started
        </button>

      </div>
    </header>
  );
}
