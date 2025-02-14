import { Navigate, useOutlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";

const PrivateRoute = ({ allowedRoles }) => {
  const { authData, loading, error } = useContext(AuthContext);
  const outlet = useOutlet();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <Navigate to="/" replace />;
  }

  if (!authData) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(authData.tipoTrabajador)) {
    return <Navigate to="/" replace />;
  }

  return outlet;
};

export default PrivateRoute;