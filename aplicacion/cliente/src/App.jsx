import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import routes from "./routesConfig";
import PrivateRoute from "./components/PrivateRoute";
import Header from "./components/Header";
import 'bootstrap/dist/css/bootstrap.min.css';

const Inicio = lazy(() => import("./pages/Inicio"));

function App() {
  return (
    <BrowserRouter>
      <Header />

      <Suspense fallback={<div className="text-center mt-5">Cargando...</div>}>
        <Routes>
          <Route path="/" element={<Inicio />} />
          {routes.map(({ path, element, roles }) => (
            <Route key={path} element={<PrivateRoute allowedRoles={roles} />}>
              <Route path={path} element={element} />
            </Route>
          ))}
          <Route path="*" element={<h2 className="text-center mt-5">Página no encontrada</h2>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
