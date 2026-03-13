import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import {
  DndContext,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

export default function Rearrange() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { fileUrl, fileId } = state || {};

  const [numPages, setNumPages] = useState(null);
  const [pages, setPages] = useState([]);

  if (!fileUrl) {
    navigate("/");
    return null;
  }

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPages(
      Array.from({ length: numPages }, (_, i) => ({
        id: i + 1,
        pageNumber: i + 1,
      }))
    );
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    setPages((items) => {
      const oldIndex = items.findIndex(i => i.id === active.id);
      const newIndex = items.findIndex(i => i.id === over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
  };

  const handleContinue = () => {
    const order = pages.map(p => p.pageNumber);

    navigate("/loading", {
      state: {
        fileId,
        order,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <h1 className="text-2xl font-semibold text-center text-gray-900">
        Rearrange Pages
      </h1>

      <p className="mt-2 text-sm text-gray-500 text-center">
        Drag and drop pages to change their order
      </p>

      <Document
        file={fileUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        className="mt-8"
      >
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={pages.map(p => p.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {pages.map((page) => (
                <SortablePage key={page.id} id={page.id}>
                  <Page
                    pageNumber={page.pageNumber}
                    width={160}
                  />
                  <p className="mt-1 text-xs text-center text-gray-600">
                    Page {page.pageNumber}
                  </p>
                </SortablePage>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </Document>

      <button
        onClick={handleContinue}
        className="
          mt-8 w-full max-w-md mx-auto block
          py-3 rounded-xl font-medium
          text-white bg-[#832126]
          hover:bg-[#d23837]
          transition
        "
      >
        Continue
      </button>
    </div>
  );
}

function SortablePage({ id, children }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="
        bg-white rounded-xl p-2 shadow
        cursor-grab active:cursor-grabbing
      "
    >
      {children}
    </div>
  );
}
