import { Link } from "react-router-dom";
import "./css/navbar.css";

const Navbar: React.FC = () => {
  return (
    <nav className="">
      <div className="">
        <div className="">
          <div className="">
            {/* Logo o título */}
            <div className="">
              <span className="">Sistema de Reportes</span>
            </div>

            {/* Links de navegación */}
            <div className="">
              <Link to="/crear" className="">
                Hacer Reporte
              </Link>
              <Link to="/ver" className="">
                Ver Reportes
              </Link>
              <Link to="/modificar" className="">
                Buscar y modificar
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
