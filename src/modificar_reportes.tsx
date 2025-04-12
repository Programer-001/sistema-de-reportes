import { useState, useEffect } from "react";
import { ref, get, update, remove } from "firebase/database";
import { db } from "./firebase";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./css/modificar_reportes.css";

interface Report {
  date: string;
  content: string;
  lastModified: string;
}

const ReportManager = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [reports, setReports] = useState<Record<string, Report>>({});
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [editorContent, setEditorContent] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      const reportsRef = ref(db, "reportes");
      const snapshot = await get(reportsRef);
      if (snapshot.exists()) {
        setReports(snapshot.val());
      }
    };

    fetchReports();
  }, []);

  useEffect(() => {
    if (selectedReportId && reports[selectedReportId]) {
      setEditorContent(reports[selectedReportId].content);
    } else {
      setEditorContent("");
    }
  }, [selectedReportId, reports]);

  const filteredReports = Object.entries(reports).filter(([id]) =>
    id.includes(searchTerm)
  );

  const handleSave = async () => {
    if (!selectedReportId) return;

    try {
      const reportRef = ref(db, `reportes/${selectedReportId}`);
      await update(reportRef, {
        content: editorContent,
        lastModified: new Date().toISOString(),
      });

      setReports((prev) => ({
        ...prev,
        [selectedReportId]: {
          ...prev[selectedReportId],
          content: editorContent,
          lastModified: new Date().toISOString(),
        },
      }));

      alert("✅ Reporte actualizado correctamente");
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("❌ Error al actualizar el reporte");
    }
  };

  const handleDelete = async () => {
    if (!selectedReportId) return;

    const confirmDelete = window.confirm(
      "¿Estás seguro de eliminar este reporte? Esta acción no se puede deshacer."
    );
    if (!confirmDelete) return;

    try {
      const reportRef = ref(db, `reportes/${selectedReportId}`);
      await remove(reportRef);

      const { [selectedReportId]: _, ...remainingReports } = reports;
      setReports(remainingReports);
      setSelectedReportId(null);
      setEditorContent("");

      alert("🗑️ Reporte eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("❌ Error al eliminar el reporte");
    }
  };

  const handleSavePDF = async () => {
    if (!selectedReportId) return;

    try {
      const pdf = new jsPDF();
      let yPosition = 20;
      const margin = 15;
      const maxWidth = 180;
      const lineHeight = 7;
      const paragraphSpacing = 2;

      pdf.setFont("helvetica");
      pdf.setFontSize(12);
      pdf.setTextColor(40, 40, 40);

      pdf.setFontSize(16);
      pdf.text(`Reporte ${selectedReportId}`, margin, yPosition);
      yPosition += 10;

      pdf.setFontSize(10);
      pdf.text(
        `Generado el: ${new Date().toLocaleString()}`,
        margin,
        yPosition
      );
      yPosition += 15;

      const htmlToFormattedText = (html: string) => {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = html;

        tempDiv.querySelectorAll("li").forEach((li) => {
          li.innerHTML = `• ${li.textContent}`;
        });

        return (
          tempDiv.textContent
            ?.replace(/\n\s*\n/g, "\n")
            .replace(/(•)/g, "\n$1")
            .trim() || ""
        );
      };

      const content = htmlToFormattedText(editorContent);
      const paragraphs = content.split("\n");

      pdf.setFontSize(12);

      for (const paragraph of paragraphs) {
        if (!paragraph.trim()) {
          yPosition += paragraphSpacing;
          continue;
        }

        if (paragraph.startsWith("•")) {
          const bulletText = paragraph.substring(1).trim();
          const lines = pdf.splitTextToSize(bulletText, maxWidth - 10);

          pdf.text("• ", margin, yPosition);
          pdf.text(lines, margin + 5, yPosition);
          yPosition += lines.length * lineHeight;
        } else {
          const lines = pdf.splitTextToSize(paragraph, maxWidth);
          pdf.text(lines, margin, yPosition);
          yPosition += lines.length * lineHeight;
        }

        yPosition += paragraphSpacing;

        if (yPosition > 280) {
          pdf.addPage();
          yPosition = margin;
        }
      }

      pdf.save(`Reporte_${selectedReportId}.pdf`);
      alert("✅ PDF generado con formato optimizado");
    } catch (error) {
      console.error("Error al generar PDF:", error);
      alert("❌ Error al generar el PDF");
    }
  };

  return (
    <div className="report-manager-container">
      {/* Columna izquierda - Buscador y lista */}
      <div className="reports-list-column">
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar por ID..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="reports-list">
          {filteredReports.map(([id, report]) => (
            <div key={id} onClick={() => setSelectedReportId(id)} className="">
              <div className="report-item">ID: {id}</div>
              <div className="">
                Ultima modificación:
                {new Date(report.lastModified).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Columna derecha - Editor */}
      <div className="editor-column">
        {selectedReportId ? (
          <>
            <div className="editor-header">
              <h2 className="">Editando Reporte: {selectedReportId}</h2>
              <div className="button-group">
                <button
                  onClick={handleSave}
                  className="action-button save-button"
                >
                  Guardar Cambios
                </button>
                <button
                  onClick={handleSavePDF}
                  className="action-button pdf-button"
                >
                  Guardar PDF
                </button>
                <button
                  onClick={handleDelete}
                  className="action-button delete-button"
                >
                  Eliminar Reporte
                </button>
              </div>
            </div>

            <div className="editor-container ">
              <ReactQuill
                theme="snow"
                value={editorContent}
                onChange={setEditorContent}
                modules={{
                  toolbar: [
                    ["bold", "italic", "underline"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["clean"],
                  ],
                }}
                style={{ height: "100%" }}
              />
            </div>
          </>
        ) : (
          <div className="empty-state">
            Selecciona un reporte de la lista para editar
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportManager;
