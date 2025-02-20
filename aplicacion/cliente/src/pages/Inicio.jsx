import "../styles/Inicio.css";
import { useState, useContext } from 'react';
import Axios from "../axiosConfig";
import { EntradaTexto } from '../components/CamposFormulario';
import Swal from 'sweetalert2';
import { AuthContext } from "../context/AuthProvider";
import { useNavigate } from 'react-router-dom';

const datosInicialesSesion = {
    idTrabajador: 0,
    contrasena: ""
}

export default function Inicio() {
    const redirigir = useNavigate();
    const { iniciarSesion: iniciarSesionContext } = useContext(AuthContext);

    const [datosSesion, setDatosSesion] = useState(datosInicialesSesion);
    const [errores, setErrores] = useState({});
    const [cargando, setCargando] = useState(false);

    const validaciones = {
        idTrabajador: (valor) => (!valor || isNaN(valor) || valor <= 0) ? "Este campo es obligatorio y debe ser mayor a 0" : null,
        contrasena: (valor) => !valor ? "Este campo es obligatorio" : null,
    }

    // validamos los campos individualmente
    const validarCampo = (campo, valor) => {
        const error = validaciones[campo]?.(valor);
        setErrores(prevState => ({
            ...prevState,
            [campo]: error
        }));
    };

    // manejamos los cambios en los campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        // actualizamos solo las propiedades que han cambiado
        setDatosSesion(prevState => ({
            ...prevState,
            [name]: value
        }));
        validarCampo(name, value);
    };

    // comprobamos las validaciones
    const validar = () => {
        const nuevoError = {};
        Object.keys(validaciones).forEach(campo => {
            const error = validaciones[campo](datosSesion[campo]);
            if (error) nuevoError[campo] = error;
        });
        setErrores(nuevoError);

        if (Object.keys(nuevoError).length > 0) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Error al iniciar sesión",
                confirmButtonText: "Vale"
            });
        }
        return Object.keys(nuevoError).length === 0;
    };

    // iniciar sesion
    const iniciarSesion = async (e) => {
        e.preventDefault();
        if (!validar() || cargando) return;

        setCargando(true);
        try {
            const response = await Axios.post("/iniciarSesion", datosSesion, { withCredentials: true })

            setErrores({});
            setDatosSesion(datosInicialesSesion);
            iniciarSesionContext(response.data);

            const tipoTrabajador = response.data.tipoTrabajador;

            if (tipoTrabajador === 'Captador') {
                redirigir('/captadores');
            } else if (tipoTrabajador === 'Comercial') {
                redirigir('/comerciales');
            } else if (tipoTrabajador === 'Administrador') {
                redirigir('/administradores');
            }
        } catch (error) {
            if (error.response) {
                const mensajeError = error.response?.data?.error || "Hubo un problema con la solicitud. Inténtalo de nuevo";

                setErrores(prevState => ({
                    ...prevState,
                    serverError: mensajeError
                }));

                Swal.fire({
                    icon: "warning",
                    title: "Error",
                    text: "Este usuario no tiene acceso",
                    confirmButtonText: "Vale"
                });

            } else if (error.message && error.message.includes("Network Error")) {
                Swal.fire({
                    icon: "question",
                    title: "Error de Conexión",
                    text: "Verifica tu conexión a internet o inténtalo de nuevo",
                    confirmButtonText: "Vale"
                });
            }
        } finally {
            setCargando(false);
        }
    }

    return (
        <div className='inicioSesion'>
            <h1>Inicio de Sesión</h1>
            <div className='contenedorSesion'>
                <form onSubmit={iniciarSesion} className='campos'>
                    {errores.serverError && <div className="errorServidor"> {errores.serverError}</div>}

                    <EntradaTexto label="ID de Trabajador" name="idTrabajador" value={datosSesion.idTrabajador} onChange={handleChange} type="number" placeholder="Ej: 4" error={errores.idTrabajador} />

                    <EntradaTexto label="Contraseña" name="contrasena" value={datosSesion.contrasena} onChange={handleChange} type="password" placeholder="Introduce tu contraseña" error={errores.contrasena} />

                    <button type="submit">Iniciar Sesión</button>
                </form>
            </div>
        </div>
    );
}