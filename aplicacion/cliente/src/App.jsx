import "./App.css";
import Logo from "./images/logo.png";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Inicio from "./pages/Inicio";
import routes from "./routesConfig";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <div className="insene">
        <div className="logo">
          <img src={Logo} alt="Insene" />
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
