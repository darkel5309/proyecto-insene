import React from 'react';
import "../styles/Inicio.css";
import Axios from "axios";
import { useNavigate } from 'react-router-dom';
import { EntradaTexto } from '../components/CamposFormulario';
import { useState } from "react";
import Swal from 'sweetalert2';

export default function Inicio() {
    const redirigir = useNavigate();

    // creamos las constantes para obtener los valores de los campos del login
    const datosInicialesSesion = {
        idTrabajador: 0,
        contrasena: ""
    }

    // creamos las constantes para obtener los valores de los campos del formulario
    const [datosSesion, setDatosSesion] = useState(datosInicialesSesion);

    // creamos las constantes para los errores
    const [errores, setErrores] = useState({});

    // validaciones de los campos
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

    // validamos los campos
    const validar = () => {
        const nuevoError = {};
        Object.keys(validaciones).forEach(campo => {
            const error = validaciones[campo](datosSesion[campo]);
            if (error) nuevoError[campo] = error;
        });
        setErrores(nuevoError);

        if (Object.keys(nuevoError).length > 0) {
            // mostramos una alerta de error
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Error al iniciar sesión",
                confirmButtonText: "Vale"
            });
        }

        // si no hay errores devolvemos true
        return Object.keys(nuevoError).length === 0;
    };

    // metodo para iniciar sesion
    const iniciarSesion = (e) => {
        e.preventDefault();
        if (validar()) {
            Axios.post("http://localhost:5174/api/iniciarSesion", datosSesion)
                .then((response) => {
                    setErrores({});

                    // vaciamos los campos del formulario despues de que se inserten
                    setDatosSesion(datosInicialesSesion);

                    // recibimos del servidor la respuesta del tipo de trabajador
                    const tipoTrabajador = response.data.tipoTrabajador;

                    // redirecciones
                    if (tipoTrabajador === 'Captador') {
                        redirigir('/captadores');
                    } else if (tipoTrabajador === 'Comercial') {
                        redirigir('/comerciales');
                    }
                })
                .catch((error) => {
                    if (error.response) {
                        const mensajeError = error.response?.data?.error || "Hubo un problema con la solicitud. Inténtalo de nuevo";
                        setErrores(prevState => ({
                            ...prevState,
                            serverError: mensajeError
                        }));

                        // mostramos una alerta de error
                        Swal.fire({
                            icon: "warning",
                            title: "Error",
                            text: "Este usuario no tiene acceso",
                            confirmButtonText: "Vale"
                        });
                    }

                    else if (error.message && error.message.includes("Network Error")) {
                        // mostramos una alerta de conexion
                        Swal.fire({
                            icon: "question",
                            title: "Error de Conexión",
                            text: "Verifica tu conexión a internet o inténtalo de nuevo",
                            confirmButtonText: "Vale"
                        });
                    }
                });
        }
    }

    // este es el html visible en la web
    return (
        <div className='inicioSesion'>
            <h1>Inicio de Sesión</h1>
            <div className='contenedorSesion'>
                <form onSubmit={iniciarSesion} className='campos'>
                    {errores.serverError && <div className="errorServidor"> {errores.serverError}</div>}

                    <EntradaTexto label="Código de Trabajador" name="idTrabajador" value={datosSesion.idTrabajador} onChange={handleChange} type="text" error={errores.idTrabajador} />

                    <EntradaTexto label="Contraseña" name="contrasena" value={datosSesion.contrasena} onChange={handleChange} type="password" placeholder="Introduce tu contraseña" error={errores.contrasena} />

                    <button type="submit">Iniciar Sesión</button>
                </form>
            </div>
        </div>
    );
}