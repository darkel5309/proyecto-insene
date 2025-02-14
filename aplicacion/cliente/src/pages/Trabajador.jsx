import "../styles/Trabajador.css";
import { useState, useEffect } from "react";
import Axios from "axios";
import { EntradaTexto, EntradaSelect } from '../components/CamposFormulario';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export default function Trabajador() {
    useEffect(() => {
        document.title = "Trabajador";
    }, []);

    const redirigir = useNavigate();

    const datosInicialesTrabajador = {
        nombreTrabajador: "",
        contrasenaTrabajador: "",
        telefonoTrabajador: "",
        rolTrabajador: ""
    };

    const [datosTrabajador, setDatosTrabajador] = useState(datosInicialesTrabajador);
    const [errores, setErrores] = useState({});

    const validaciones = {
        nombreTrabajador: (valor) => !valor ? "Este campo es obligatorio" : null,
        contrasenaTrabajador: (valor) => !valor ? "Este campo es obligatorio" : null,
        telefonoTrabajador: (valor) => (!valor || !/^\d{9}$/.test(valor)) ? "Este campo es obligatorio y debe tener 9 digitos" : null,
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
        setDatosTrabajador(prevState => ({
            ...prevState,
            [name]: value
        }));
        validarCampo(name, value);
    };

    // validamos los campos
    const validar = () => {
        const nuevoError = {};
        Object.keys(validaciones).forEach(campo => {
            const error = validaciones[campo](datosTrabajador[campo]);
            if (error) nuevoError[campo] = error;
        });
        setErrores(nuevoError);

        if (Object.keys(nuevoError).length > 0) {
            Swal.fire({
                icon: "error",
                title: "¡ERROR!",
                text: "Revisa los campos del formulario",
                confirmButtonText: "Vale"
            });
        }
        return Object.keys(nuevoError).length === 0;
    };

    // crear trabajadores
    const addTrabajador = (e) => {
        e.preventDefault();
        if (validar()) {
            Axios.post("http://localhost:5174/api/registrarTrabajador", datosTrabajador)
                .then((response) => {
                    setErrores({});

                    Swal.fire({
                        icon: "success",
                        title: `El código del trabajador es:  ${response.data.idTrabajador}`,
                        text: "Datos registrados correctamente",
                        confirmButtonText: "Vale"
                    }).then((result) => {
                        if (result.isConfirmed) {
                            redirigir(-1);
                        }
                    });
                    setDatosTrabajador(datosInicialesTrabajador);
                })
                .catch((error) => {
                    if (error.response) {
                        const mensajeError = error.response?.data?.error || "Hubo un problema con la solicitud. Inténtalo de nuevo";

                        setErrores(prevState => ({
                            ...prevState,
                            serverError: mensajeError
                        }));

                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: "Revisa los datos del formulario",
                            confirmButtonText: "Vale"
                        });
                    }

                    else if (error.message && error.message.includes("Network Error")) {
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

    return (
        <div className="trabajador">
            <h1>Registrar un Trabajador</h1>

            <div className="contenedorTrabajador">
                <form onSubmit={addTrabajador} className='campos'>
                    {errores.serverError && <div className="errorServidor">{errores.serverError}</div>}

                    <EntradaTexto label="Nombre completo del trabajador *" name="nombreTrabajador" value={datosTrabajador.nombreTrabajador} onChange={handleChange} type="text" placeholder="Ej: Carlos Martínez Gómez" error={errores.nombreTrabajador} />

                    <EntradaTexto label="Contraseña del trabajador *" name="contrasenaTrabajador" value={datosTrabajador.contrasenaTrabajador} onChange={handleChange} type="text" placeholder="Ej: 3jjh48721&nsk" error={errores.contrasenaTrabajador} />

                    <EntradaTexto label="Teléfono del trabajador *" name="telefonoTrabajador" value={datosTrabajador.telefonoTrabajador} onChange={handleChange} type="tel" placeholder="Ej: 666555444" error={errores.telefonoTrabajador} />

                    <EntradaSelect label="Rol del trabajador *" name="rolTrabajador" value={datosTrabajador.rolTrabajador} onChange={handleChange} error={errores.rolTrabajador} options={[
                        { value: "Administrador", label: "Administrador" },
                        { value: "Captador", label: "Captador" },
                        { value: "Comercial", label: "Comercial" },
                    ]} />

                    <button type="submit">Registrar Trabajador</button>
                </form>
            </div>
        </div>
    );
}