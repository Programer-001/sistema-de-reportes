import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./navbar";
import ReportEditor from "./hacer_reporte";
import ReportList from "./mostrar_reportes";
import ReportManager from "./modificar_reportes";
import "./styles.css";
const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow bg-gray-50">
          <Routes>
            <Route path="/crear" element={<ReportEditor />} />
            <Route path="/ver" element={<ReportList />} />
            <Route path="/modificar" element={<ReportManager />} />
            <Route path="/" element={<ReportEditor />} />{" "}
            {/* Ruta por defecto */}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
