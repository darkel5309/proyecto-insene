import React from "react";
import "./App.css";
import Logo from "./images/logo.png";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Inicio from "./pages/Inicio";
import Captador from "./pages/Captador";
import Contacto from "./pages/Contacto";
import Visita from "./pages/Visita";
import Comercial from "./pages/Comercial";
import Feedback from "./pages/Feedback";
import Trabajador from "./pages/Trabajador";
import PrivateRoute from "./components/PrivateRoute";
import Administrador from "./pages/Administrador";

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

        <Route element={<PrivateRoute allowedRoles={["Administrador"]} />}>
          <Route path="/administradores" element={<Administrador />} />
          <Route path="/administradores/trabajador" element={<Trabajador />} />
        </Route>

        <Route element={<PrivateRoute allowedRoles={["Captador", "Administrador"]} />}>
          <Route path="/captadores" element={<Captador />} />
          <Route path="/captadores/contacto" element={<Contacto />} />
          <Route path="/captadores/visita" element={<Visita />} />
        </Route>

        <Route element={<PrivateRoute allowedRoles={["Comercial", "Administrador"]} />}>
          <Route path="/comerciales" element={<Comercial />} />
          <Route path="/comerciales/contacto" element={<Contacto />} />
          <Route path="/comerciales/feedback" element={<Feedback />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
