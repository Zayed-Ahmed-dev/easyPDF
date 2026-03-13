import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  DndContext,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

/* ===============================
   Sortable PDF Page Component
================================ */
function SortablePage({ id, preview }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`relative bg-white rounded-2xl p-3 cursor-grab transition 
      ${isDragging ? "shadow-2xl scale-105" : "shadow-md hover:shadow-xl"}`}
    >
      {/* Page Number Badge */}
      <div className="absolute -top-3 -right-3 bg-[#832126] text-white text-xs px-3 py-1 rounded-full shadow">
        {id}
      </div>

      <iframe
        src={`${BASE_URL}${preview}`}
        title={`Page ${id}`}
        className="w-44 h-60 rounded-lg border border-gray-200"
      />
    </div>
  );
}

/* ===============================
   Main Rearrange Component
================================ */
export default function Rearrange() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const previews = state?.previews;
  const originalFile = state?.originalFile;

  const [pages, setPages] = useState([]);

  useEffect(() => {
    if (!previews || !originalFile) {
      navigate("/");
      return;
    }

    setPages(
      previews.map((preview, index) => ({
        id: index + 1,
        preview,
      }))
    );
  }, [previews, originalFile, navigate]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      setPages((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("pdf", originalFile);
      formData.append(
        "order",
        JSON.stringify(pages.map((p) => p.id))
      );

      const response = await fetch(
        `${BASE_URL}/api/arrange/rearrange`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Rearrange failed");

      const blob = await response.blob();
      const outputURL = window.URL.createObjectURL(blob);

      navigate("/result", {
        state: {
          inputUrl: previews.map((p) => `${BASE_URL}${p}`),
          outputUrl: outputURL,
        },
      });
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  };

  if (!pages.length) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">

      {/* Header Section */}
      <div className="max-w-6xl mx-auto px-6 pt-12 pb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800">
          Rearrange PDF Pages
        </h1>
        <p className="text-gray-500 mt-3 text-sm">
          Drag and drop pages to reorder them before saving.
        </p>

        <div className="mt-4 inline-block bg-[#832126]/10 text-[#832126] px-4 py-2 rounded-full text-sm font-medium">
          {pages.length} Pages
        </div>
      </div>

      {/* Grid Section */}
      <div className="max-w-6xl mx-auto px-6 pb-24">
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={pages.map((p) => p.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 justify-items-center">
              {pages.map((page) => (
                <SortablePage
                  key={page.id}
                  id={page.id}
                  preview={page.preview}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md py-4">
        <div className="max-w-6xl mx-auto px-6 flex justify-end">
          <button
            onClick={handleSave}
            className="bg-[#832126] hover:bg-[#d23837] text-white px-10 py-3 rounded-2xl font-medium tracking-wide transition-all duration-300 shadow-md hover:shadow-xl hover:scale-105"
          >
            Save Rearranged PDF
          </button>
        </div>
      </div>
    </div>
  );
}