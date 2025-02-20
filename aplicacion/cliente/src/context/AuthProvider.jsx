import { createContext, useState, useEffect } from "react";
import Axios from "../axiosConfig";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authData, setAuthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      Axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    const verificarSesion = async () => {
      try {
        const response = await Axios.get("/verificarSesion");
        setAuthData(response.data);
      } catch (error) {
        setAuthData(null);
        setError("No se ha podido verificar la sesión.");
      } finally {
        setLoading(false);
      }
    };
    verificarSesion();
  }, []);

  const iniciarSesion = (data) => {
    sessionStorage.setItem("token", data.token);
    Axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
    setAuthData(data);
  };

  const cerrarSesion = async () => {
    try {
      await Axios.post("/cerrarSesion");
      sessionStorage.removeItem("token");
      delete Axios.defaults.headers.common["Authorization"];
      setAuthData(null);
    } catch (error) {
      setError("Error al cerrar sesión.");
    }
  };

  return (
    <AuthContext.Provider value={{ authData, iniciarSesion, cerrarSesion, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
export default AuthProvider;
