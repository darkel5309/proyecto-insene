import { Navigate, useOutlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import LoadingSpinner from './LoadingSpinner';

const PrivateRoute = ({ allowedRoles }) => {
  const { authData, loading } = useContext(AuthContext);
  const outlet = useOutlet();

  if (loading) {
    return <LoadingSpinner message="Cargando..." />;
  }

  const noAutenticado = !authData;
  const noAutorizado = allowedRoles?.length && !allowedRoles.includes(authData?.tipoTrabajador);

  if (noAutenticado || noAutorizado) {
    return <Navigate to="/" replace />;
  }

  return outlet;
};

export default PrivateRoute;
