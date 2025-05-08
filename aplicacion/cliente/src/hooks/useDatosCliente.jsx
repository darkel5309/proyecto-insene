import { useEffect, useState } from "react";
import Axios from "../axiosConfig";
import { erroresSweetAlert2 } from "../utils/erroresSweetAlert2";

export function useDatosCliente(id_cliente) {
  const [cliente, setCliente] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!id_cliente) {
      setCliente(null);
      setCargando(false);
      return;
    }

    let isMounted = true;
    const controller = new AbortController();

    const obtenerCliente = async () => {
      setCargando(true);
      try {
        const { data } = await Axios.get(`/clientes/${id_cliente}`, { signal: controller.signal });
        if (isMounted) setCliente(data);
      } catch (error) {
        if (isMounted) {
          setCliente(null);
          if (error.name !== "AbortError") erroresSweetAlert2(error);
        }
      } finally {
        if (isMounted) setCargando(false);
      }
    };

    obtenerCliente();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [id_cliente]);

  return { cliente, cargando };
}
