import { useEffect, useState } from "react";
import Axios from "../axiosConfig";
import { erroresSweetAlert2 } from "../utils/erroresSweetAlert2";

export function useDatosCliente(id_cliente) {
    const [cliente, setCliente] = useState({});

    useEffect(() => {
        const obtenerCliente = async () => {
            try {
                const { data } = await Axios.get(`/clientes/${id_cliente}`);
                setCliente(data);
            } catch (error) {
                erroresSweetAlert2(error);
            }
        };

        obtenerCliente();
    }, [id_cliente]);

    return cliente;
}
