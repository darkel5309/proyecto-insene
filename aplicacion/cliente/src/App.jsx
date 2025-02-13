import React from "react";
import "./App.css";
import Logo from "./images/logo.png";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Inicio from "./pages/Inicio";
import Captador from "./pages/Captador";
import Contacto from "./pages/Contacto";
import Visita from "./pages/Visita";
import Comercial from "./pages/Comercial";
import Feedback from "./pages/Feedback";
import Trabajador from "./pages/Trabajador";

function App() {
  return (
    <Router>
      <div className="insene">
        <div className="logo">
          <img src={Logo} alt="Insene" />
        </div>
      </div>

      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/trabajador" element={<Trabajador />} />
        <Route path="/captadores" element={<Captador />} />
        <Route path="/captadores/contacto" element={<Contacto />} />
        <Route path="/captadores/visita" element={<Visita />} />
        <Route path="/comerciales" element={<Comercial />} />
        <Route path="/comerciales/contacto" element={<Contacto />} />
        <Route path="/comerciales/feedback" element={<Feedback />} />
      </Routes>
    </Router>
  );
}

export default App;