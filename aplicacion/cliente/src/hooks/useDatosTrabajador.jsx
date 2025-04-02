import { useEffect, useState } from "react";
import Axios from "../axiosConfig";
import { erroresSweetAlert2 } from "../utils/erroresSweetAlert2";

export function useDatosTrabajador(id_trabajador) {
    const [trabajador, setTrabajador] = useState({});

    useEffect(() => {
        const obtenerTrabajador = async () => {
            try {
                const { data } = await Axios.get(`/trabajadores/${id_trabajador}`);
                setTrabajador(data);
            } catch (error) {
                erroresSweetAlert2(error);
            }
        };

        obtenerTrabajador();
    }, [id_trabajador]);

    return trabajador;
}
