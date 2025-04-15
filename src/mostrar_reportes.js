import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ref, get } from "firebase/database";
import { db } from "./firebase";
import { useEffect, useState } from "react";
import "./css/mostrar_reportes.css";
const ReportList = () => {
    const [reports, setReports] = useState({});
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
    return (_jsxs("div", { className: "report-list-container", children: [_jsx("h1", { className: "report-list-title", children: "Reportes Guardados" }), _jsx("div", { className: "report-items-container", children: Object.entries(reports).map(([id, report]) => (_jsxs("div", { className: "report-card", children: [_jsxs("h2", { className: "report-id", children: ["Fecha: ", id] }), _jsxs("p", { className: "report-date", children: ["Fecha: ", report.date] }), _jsx("div", { className: "report-content", dangerouslySetInnerHTML: { __html: report.content } })] }, id))) })] }));
};
export default ReportList;
