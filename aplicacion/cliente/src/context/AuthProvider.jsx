import { createContext, useState, useEffect } from "react";
import Axios from "../axiosConfig";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authData, setAuthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const verificarSesion = async () => {
    setLoading(true);
    try {
      const response = await Axios.get("/verificarSesion");
      setAuthData(response.data);
      setError(null);
    } catch (error) {
      setAuthData(null);
      setError("No se ha podido verificar la sesión.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verificarSesion();
  }, []);

  const iniciarSesion = async (data) => {
    setAuthData(data);
    setError(null);
  };

  const cerrarSesion = async () => {
    try {
      await Axios.post("/cerrarSesion");
      setAuthData(null);
      setError(null);
    } catch (error) {
      setError("Error al cerrar sesión.");
    }
  };

  return (
    <AuthContext.Provider value={{ authData, iniciarSesion, cerrarSesion, loading, error, verificarSesion }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
export default AuthProvider;
