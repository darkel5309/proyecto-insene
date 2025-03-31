import "./App.css";
import Logo from "./images/logo.png";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthProvider";
import Inicio from "./pages/Inicio";
import routes from "./routesConfig";
import PrivateRoute from "./components/PrivateRoute";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const { cerrarSesion, authData } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <div className="cabecera d-flex">
        <div className="columna izquierda"></div>
        <div className="columna logo">
          <img src={Logo} alt="Insene" />
        </div>
        <div className="columna sesion">
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
