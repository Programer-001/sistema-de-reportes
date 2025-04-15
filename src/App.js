import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./navbar";
import ReportEditor from "./hacer_reporte";
import ReportList from "./mostrar_reportes";
import ReportManager from "./modificar_reportes";
import "./styles.css";
const App = () => {
    return (_jsx(Router, { children: _jsxs("div", { className: "min-h-screen flex flex-col", children: [_jsx(Navbar, {}), _jsx("div", { className: "flex-grow bg-gray-50", children: _jsxs(Routes, { children: [_jsx(Route, { path: "/crear", element: _jsx(ReportEditor, {}) }), _jsx(Route, { path: "/ver", element: _jsx(ReportList, {}) }), _jsx(Route, { path: "/modificar", element: _jsx(ReportManager, {}) }), _jsx(Route, { path: "/", element: _jsx(ReportEditor, {}) }), " "] }) })] }) }));
};
export default App;
