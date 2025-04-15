import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import "./css/navbar.css";
const Navbar = () => {
    return (_jsx("nav", { className: "", children: _jsx("div", { className: "", children: _jsx("div", { className: "", children: _jsxs("div", { className: "", children: [_jsx("div", { className: "", children: _jsx("span", { className: "", children: "Sistema de Reportes" }) }), _jsxs("div", { className: "", children: [_jsx(Link, { to: "/crear", className: "", children: "Hacer Reporte" }), _jsx(Link, { to: "/ver", className: "", children: "Ver Reportes" }), _jsx(Link, { to: "/modificar", className: "", children: "Buscar y modificar" })] })] }) }) }) }));
};
export default Navbar;
