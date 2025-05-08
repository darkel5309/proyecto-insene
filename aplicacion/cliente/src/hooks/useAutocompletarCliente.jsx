import { useCallback } from "react";
import Axios from "../axiosConfig";

export const useAutocompletarCliente = () => {
  const campos = ["nombre", "telefono", "correo", "direccion", "localidad", "provincia"];

  const obtenerCliente = useCallback(async (id, setFieldValue) => {
    if (!id?.toString().trim()) return;

    try {
      const { data } = await Axios.get(`/clientes/${id}`);
      campos.forEach(campo => setFieldValue(campo, data?.[campo] ?? ""));
    } catch {
      campos.forEach(campo => setFieldValue(campo, ""));
    }
  }, []);

  return { obtenerCliente };
};
