import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Axios from "../axiosConfig";

export const useIdTrabajador = () => {
  const [idTrabajador, setIdTrabajador] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const recuperarIdTrabajador = async () => {
      try {
        const { data } = await Axios.get('/verificarSesion');
        if (isMounted) {
          setIdTrabajador(data?.id || null);
        }
      } catch {
        if (isMounted) {
          setIdTrabajador(null);
          Swal.fire({
            icon: "error",
            title: "Error de sesión",
            text: "No se pudo recuperar la sesión del trabajador. Inicia sesión de nuevo",
            confirmButtonText: "OK"
          }).then(() => navigate('/'));
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    recuperarIdTrabajador();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  return { idTrabajador, isLoading };
};
