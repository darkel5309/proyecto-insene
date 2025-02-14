import React, { createContext, useState, useEffect } from "react";
import Axios from "../axiosConfig";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authData, setAuthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // comprobamos si ya hay un JWT almacenado
  useEffect(() => {
    const verificarSesion = async () => {
      try {
        const response = await Axios.get("/verificarSesion");
        setAuthData(response.data);
      } catch (error) {
        setAuthData(null);
        setError("Error verificando la sesión. Inténtalo de nuevo.");
      } finally {
        setLoading(false);
      }
    };
    verificarSesion();
  }, []);

  const iniciarSesion = (data) => {
    setAuthData(data);
  };

  const cerrarSesion = async () => {
    try {
      await Axios.post("/cerrarSesion");
      setAuthData(null);
    } catch (error) {
      setError("Error cerrando la sesión. Inténtalo de nuevo.");
    }
  };

  // encapsulamos el estado y las funciones relacionadas con la autenticacion
  const contextValue = { authData, iniciarSesion, cerrarSesion, loading, error };

  // devolvemos el provider
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
export default AuthProvider;
