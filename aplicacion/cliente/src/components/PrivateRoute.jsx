import { Navigate, useOutlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import LoadingSpinner from './LoadingSpinner';

const PrivateRoute = ({ allowedRoles }) => {
  const { authData, loading } = useContext(AuthContext);
  const outlet = useOutlet();

  if (loading) return <LoadingSpinner message="Cargando..." />;

  if (!authData || (allowedRoles && !allowedRoles.includes(authData.tipoTrabajador))) {
    return <Navigate to="/" replace />;
  }

  return outlet;
};

export default PrivateRoute;