import { Navigate, useOutlet } from "react-router-dom";
import { useContext, useMemo } from "react";
import { AuthContext } from "../context/AuthProvider";

const Loader = () => <div className="loader">Cargando...</div>;

const PrivateRoute = ({ allowedRoles }) => {
  const { authData, loading, error } = useContext(AuthContext);
  const outlet = useOutlet();

  return useMemo(() => {
    if (loading) return <Loader />;
    
    if (error || !authData || (allowedRoles && !allowedRoles.includes(authData.tipoTrabajador))) {
      return <Navigate to="/" replace />;
    }
    return outlet;
  }, [loading, error, authData, allowedRoles, outlet]);
};

export default PrivateRoute;