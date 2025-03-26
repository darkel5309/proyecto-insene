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

  return (
    <BrowserRouter>
      <div className="insene">
        <div className="logo">
          <img src={Logo} alt="Insene" />
        </div>

        {authData && (
          <div className="d-flex justify-content-end">
            <button className="btn btn-danger btn-sm cerrar-sesion" onClick={cerrarSesion}>
              Cerrar Sesión
            </button>
          </div>
        )}
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
