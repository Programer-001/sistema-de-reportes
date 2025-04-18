import React, { useState, useRef } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { ref, set, get } from "firebase/database";
import { db } from "./firebase";
import "../estilos.css";
import "./styles.css";

const ReportEditor: React.FC = () => {
  const [date, setDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [content, setContent] = useState<string>("");
  const quillRef = useRef<ReactQuill>(null);

  const modules = {
    toolbar: [
      [{ size: ["small", false, "large", "huge"] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
    ],
  };

  const formats = [
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "link",
    "size",
  ];

  const handleSave = async () => {
    if (!content.trim()) {
      alert("El reporte no puede estar vacío");
      return;
    }

    try {
      // 1. Generar ID en formato ddmmyy (siempre 6 dígitos)
      const dateObj = new Date(date);
      const day = String(dateObj.getDate()).padStart(2, "0");
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const year = String(dateObj.getFullYear()).slice(-2);
      const dateId = `${day}${month}${year}`;
      const formattedDate = `${day}/${month}/${year}`;

      // 2. Verificar si ya existe (solo para mostrar alerta informativa)
      const reportRef = ref(db, `reportes/${dateId}`);
      const snapshot = await get(reportRef);

      if (snapshot.exists()) {
        const confirmOverwrite = confirm(
          `⚠️ Ya existe un reporte para ${formattedDate}. ¿Deseas reemplazarlo?`
        );
        if (!confirmOverwrite) return; // Cancela si el usuario no quiere sobrescribir
      }

      // 3. Guardar/sobrescribir el reporte
      await set(reportRef, {
        date: date, // Guardamos la fecha original en formato YYYY-MM-DD
        content,
        lastModified: new Date().toISOString(), // Fecha/hora de modificación
      });

      alert(`✅ Reporte del ${formattedDate} guardado correctamente`);
      setContent("");
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("❌ Error al guardar el reporte");
    }
  };

  return (
    <div
      className="min-h-screen p-8"
      style={{
        backgroundImage: "linear-gradient(to bottom, #f5f5f5, #e8e8e8)",
        backgroundAttachment: "fixed",
        fontFamily: "'Times New Roman', serif",
      }}
    >
      {/* Contenedor principal del editor (sin el botón) */}
      <div
        className="max-w-4xl mx-auto bg-white p-8 rounded shadow-md relative mb-6"
        style={{
          backgroundColor: "#fffff0",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          border: "1px solid #e0e0e0",
          minHeight: "70vh",
        }}
      >
        {/* Efecto de hoja vieja */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(0,0,0,0.05) 100%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        ></div>

        {/* Contenido del formulario */}
        <div className="relative z-10">
          <div className="mb-6">
            <label
              htmlFor="report-date"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Fecha del Reporte
            </label>
            <input
              type="date"
              id="report-date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contenido del Reporte
            </label>
            <div className="border border-gray-300 rounded">
              <ReactQuill
                ref={quillRef}
                theme="snow"
                value={content}
                onChange={setContent}
                modules={modules}
                formats={formats}
                placeholder="Escribe tu reporte aquí..."
                style={{
                  height: "400px",
                  backgroundColor: "rgba(255, 255, 240, 0.7)",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Botón FUERA del cuadro del editor */}
      <div className="max-w-4xl mx-auto text-right">
        <button
          onClick={handleSave}
          className="px-8 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors shadow-lg"
          style={{
            cursor: "pointer",
            fontWeight: 600,
            letterSpacing: "0.5px",
          }}
        >
          GUARDAR REPORTE
        </button>
      </div>
    </div>
  );
};

export default ReportEditor;
