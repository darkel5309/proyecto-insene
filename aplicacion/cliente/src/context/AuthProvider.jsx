import { createContext, useState, useEffect } from "react";
import Axios from "../axiosConfig";
import PropTypes from 'prop-types';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authData, setAuthData] = useState(null);
  const [loading, setLoading] = useState(true);

  const verificarSesion = async () => {
    setLoading(true);
    try {
      const { data } = await Axios.get("/verificarSesion");
      setAuthData(data);
    } catch {
      setAuthData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verificarSesion();
  }, []);

  const iniciarSesion = async (data) => {
    setAuthData(data);
  };

  const cerrarSesion = async () => {
    try {
      await Axios.post("/cerrarSesion");
    } finally {
      setAuthData(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ authData, iniciarSesion, cerrarSesion, loading, verificarSesion }}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { AuthContext };
export default AuthProvider;
