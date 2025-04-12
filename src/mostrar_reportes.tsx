import { ref, get } from "firebase/database";
import { db } from "./firebase";
import { useEffect, useState } from "react";
import "./css/mostrar_reportes.css";

interface Report {
  date: string;
  content: string;
  lastModified: string;
}

const ReportList = () => {
  const [reports, setReports] = useState<Record<string, Report>>({});

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

  return (
    <div className="report-list-container">
      <h1 className="report-list-title">Reportes Guardados</h1>
      <div className="report-items-container">
        {Object.entries(reports).map(([id, report]) => (
          <div key={id} className="report-card">
            <h2 className="report-id">Fecha: {id}</h2>
            <p className="report-date">Fecha: {report.date}</p>
            <div
              className="report-content"
              dangerouslySetInnerHTML={{ __html: report.content }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportList;
