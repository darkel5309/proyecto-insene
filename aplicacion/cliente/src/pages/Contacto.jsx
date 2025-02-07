import '../styles/Contacto.css';
import { useState, useEffect } from "react";
import Axios from "axios";
import { EntradaTexto, EntradaTextoArea } from '../components/CamposFormulario';
import Swal from 'sweetalert2';

export default function Formulario() {
    useEffect(() => {
        document.title = "Contacto";
    }, []);

    // creamos las constantes para obtener los valores de los campos del formulario
    const datosInicialesContacto = {
        idTrabajador: 0,
        nombreContacto: "",
        telefonoContacto: "",
        correoContacto: "",
        observacionesContacto: "",
        direccionContacto: "",
        localidadContacto: "",
        provinciaContacto: "",
    };

    // creamos las constantes para obtener los valores de los campos del formulario
    const [datosContacto, setDatosContacto] = useState(datosInicialesContacto);

    // creamos las constantes para los errores
    const [errores, setErrores] = useState({});

    // validaciones de los campos
    const validaciones = {
        idTrabajador: (valor) => (!valor || isNaN(valor) || valor <= 0) ? "Este campo es obligatorio y debe ser mayor a 0" : null,
        nombreContacto: (valor) => !valor ? "Este campo es obligatorio" : null,
        telefonoContacto: (valor) => (!valor || !/^\d{9}$/.test(valor)) ? "Este campo es obligatorio y debe tener 9 digitos" : null,
        correoContacto: (valor) => (!valor || !/\S+@\S+\.\S+/.test(valor)) ? "El correo no es válido" : null,
        direccionContacto: (valor) => !valor ? "Este campo es obligatorio" : null,
        localidadContacto: (valor) => !valor ? "Este campo es obligatorio" : null,
        provinciaContacto: (valor) => !valor ? "Este campo es obligatorio" : null,
    };

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
        setDatosContacto(prevState => ({
            ...prevState,
            [name]: value
        }));
        validarCampo(name, value);
    };

    // validamos los campos
    const validar = () => {
        const nuevoError = {};
        Object.keys(validaciones).forEach(campo => {
            const error = validaciones[campo](datosContacto[campo]);
            if (error) nuevoError[campo] = error;
        });
        setErrores(nuevoError);

        if (Object.keys(nuevoError).length > 0) {
            // mostramos una alerta de error
            Swal.fire({
                icon: "error",
                title: "¡ERROR!",
                text: "Revisa los campos del formulario",
                confirmButtonText: "Vale"
            });
        }

        // si no hay errores devolvemos true
        return Object.keys(nuevoError).length === 0;
    };

    // metodo para crear clientes
    const addContacto = (e) => {
        e.preventDefault();
        if (validar()) {
            // llamamos al metodo crear y al cuerpo de la solicitud
            Axios.post("http://localhost:3001/api/registrarCliente", datosContacto)
                .then((response) => {
                    setErrores({});

                    // mostramos una alerta de todo correcto
                    Swal.fire({
                        icon: "success",
                        title: `El código del cliente es: ${response.data.idCliente}`,
                        text: "Datos registrados correctamente",
                        confirmButtonText: "Vale"
                    });

                    // vaciamos los campos del formulario despues de que se inserten
                    setDatosContacto(datosInicialesContacto);
                })
                .catch((error) => {
                    if (error.response) {
                        const mensajeError = error.response?.data?.error || "Hubo un problema con la solicitud. Inténtalo de nuevo";

                        // mostramos una alerta de error
                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: "Revisa los datos del formulario",
                            confirmButtonText: "Vale"
                        });

                        setErrores(prevState => ({
                            ...prevState,
                            serverError: mensajeError
                        }));
                    }

                    else if (error.message && error.message.includes("Network Error")) {
                        // mostramos una alerta de conexion
                        Swal.fire({
                            icon: "question",
                            title: "Error de conexión",
                            text: "Verifica tu conexión a internet e inténtalo de nuevo",
                            confirmButtonText: "Vale"
                        });
                    }
                });
        }
    };

    // este es el html visible en la web
    return (
        <div className="contacto">
            <h1>Formulario de Contactos</h1>

            <div className="contenedorContacto">
                <form onSubmit={addContacto} className='campos'>
                    {errores.serverError && <div className="errorServidor">{errores.serverError}</div>}

                    <EntradaTexto label="Código de Trabajador *" name="idTrabajador" value={datosContacto.idTrabajador} onChange={handleChange} type="number" placeholder="Ej: 1" error={errores.idTrabajador} />

                    <EntradaTexto label="Nombre completo del contacto *" name="nombreContacto" value={datosContacto.nombreContacto} onChange={handleChange} type="text" placeholder="Ej: Gabriel Martín Ruiz" error={errores.nombreContacto} />

                    <EntradaTexto label="Dirección del contacto *" name="direccionContacto" value={datosContacto.direccionContacto} onChange={handleChange} type="text" placeholder="Ej: Calle del Sol, 42" error={errores.direccionContacto} />

                    <EntradaTexto label="Localidad del contacto *" name="localidadContacto" value={datosContacto.localidadContacto} onChange={handleChange} type="text" placeholder="Ej: Mairena de Alcor" error={errores.localidadContacto} />

                    <EntradaTexto label="Provincia del contacto *" name="provinciaContacto" value={datosContacto.provinciaContacto} onChange={handleChange} type="text" placeholder="Ej: Sevilla" error={errores.provinciaContacto} />

                    <EntradaTexto label="Teléfono de contacto *" name="telefonoContacto" value={datosContacto.telefonoContacto} onChange={handleChange} type="tel" placeholder="Ej: 666555444" error={errores.telefonoContacto} />

                    <EntradaTexto label="Correo del contacto *" name="correoContacto" value={datosContacto.correoContacto} onChange={handleChange} type="email" placeholder="Ej: ejemplo@gmail.com" error={errores.correoContacto} />

                    <EntradaTextoArea label="Observaciones del contacto" name="observacionesContacto" value={datosContacto.observacionesContacto} onChange={handleChange} type="text" placeholder="Comenta alguna observación" />

                    <button type="submit">Registrar Datos</button>
                </form>
            </div>
        </div>
    );
}