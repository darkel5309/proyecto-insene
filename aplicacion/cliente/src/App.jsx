import "./App.css";
import Logo from "./images/logo.png";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthProvider";
import Inicio from "./pages/Inicio";
import routes from "./routesConfig";
import PrivateRoute from "./components/PrivateRoute";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const { cerrarSesion, authData } = useContext(AuthContext);

  const esAdministrador = authData?.tipoTrabajador === 'Administrador';

  return (
    <BrowserRouter>
      <div className="cabecera d-flex align-items-center">
        <div className="columna home">
          {esAdministrador && (
            <Link to="/administradores" className="btn btn-warning btn-sm me-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 3.293l6 6V15a1 1 0 0 1-1 1h-4v-4H7v4H3a1 1 0 0 1-1-1v-5.707l6-6zM7.5 1.5l-7 7 1.415 1.414L8 3.914l6.085 6.086L15.5 8.5l-7-7z" />
              </svg>
            </Link>
          )}
        </div>

        <div className="columna logo">
          <img src={Logo} alt="Insene" />
        </div>

        <div className="columna sesion ms-auto">
          {authData && (
            <button className="btn btn-warning btn-sm cerrar-sesion" onClick={cerrarSesion}>
              Cerrar Sesión
            </button>
          )}
        </div>
      </div>

      <Routes>
        <Route path="/" element={<Inicio />} />
        {routes.map(({ path, element, roles }) => (
          <Route key={path} element={<PrivateRoute allowedRoles={roles} />}>
            <Route path={path} element={element} />
          </Route>
        ))}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
