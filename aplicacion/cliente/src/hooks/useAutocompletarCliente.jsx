import { useCallback } from "react";
import Axios from "../axiosConfig";

export const useAutocompletarCliente = () => {
  const obtenerCliente = useCallback(async (id, setFieldValue) => {
    if (!id) return;

    const campos = ["nombre", "telefono", "correo", "direccion", "localidad", "provincia"];

    try {
      const { data } = await Axios.get(`/clientes/${id}`);
      campos.forEach(campo => setFieldValue(campo, data[campo] || ""));
    } catch {
      campos.forEach(campo => setFieldValue(campo, ""));
    }
  }, []);

  return { obtenerCliente };
};
