import { useCallback } from "react";
import Axios from "../axiosConfig";

export const useAutocompletarCliente = () => {
  const obtenerCliente = useCallback(async (idCliente, setFieldValue) => {
    if (!idCliente) return;

    const campos = ["nombre", "telefono", "correo", "direccion", "localidad", "provincia"];

    try {
      const { data } = await Axios.get(`/recuperarCliente/${idCliente}`);
      campos.forEach(campo => setFieldValue(campo, data[campo] || ""));
    } catch (error) {
      campos.forEach(campo => setFieldValue(campo, ""));
    }
  }, []);

  return { obtenerCliente };
};
