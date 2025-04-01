import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Axios from "../axiosConfig";

export const useIdTrabajador = () => {
    const [idTrabajador, setIdTrabajador] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const recuperarIdTrabajador = async () => {
            try {
                const response = await Axios.get('/verificarSesion', { withCredentials: true });
                setIdTrabajador(response.data.id);
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Error de sesión",
                    text: "No se pudo recuperar la sesión del trabajador. Inicia sesión de nuevo",
                    confirmButtonText: "Entendido"
                }).then(() => navigate('/'));
            } finally {
                setIsLoading(false);
            }
        };
        recuperarIdTrabajador();
    }, [navigate]);
    return { idTrabajador, isLoading };
};