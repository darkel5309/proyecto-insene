import { useEffect, useState } from "react";
import Axios from "../axiosConfig";
import { erroresSweetAlert2 } from "../utils/erroresSweetAlert2";

export function useDatosTrabajador(id) {
  const [trabajador, setTrabajador] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!id) {
      setTrabajador(null);
      setCargando(false);
      return;
    }

    let isMounted = true;
    const controller = new AbortController();

    const obtenerTrabajador = async () => {
      setCargando(true);
      try {
        const { data } = await Axios.get(`/trabajadores/${id}`, { signal: controller.signal });
        if (isMounted) setTrabajador(data);
      } catch (error) {
        if (isMounted) {
          setTrabajador(null);
          if (error.name !== "AbortError") erroresSweetAlert2(error);
        }
      } finally {
        if (isMounted) setCargando(false);
      }
    };

    obtenerTrabajador();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [id]);

  return { trabajador, cargando };
}
