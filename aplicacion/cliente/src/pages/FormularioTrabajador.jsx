import "../styles/Trabajador.css";
import { useState, useEffect } from "react";
import Axios from "../axiosConfig";
import { EntradaTexto, EntradaSelect } from '../components/CamposFormulario';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const datosInicialesTrabajador = {
    nombre: "",
    contrasena: "",
    telefono: "",
    rol: "",
    equipo: "",
    subequipo: "",
};

const validaciones = {
    nombre: (valor) => !valor ? "Este campo es obligatorio" : null,
    contrasena: (valor) => !valor ? "Este campo es obligatorio" : null,
    telefono: (valor) => (!valor || !/^\d{9}$/.test(valor)) ? "Este campo es obligatorio y debe tener 9 digitos" : null,
    rol: (valor) => !valor ? "Este campo es obligatorio" : null,
    equipo: (valor) => !valor ? "Este campo es obligatorio" : null,
    subequipo: (valor) => !valor ? "Este campo es obligatorio" : null,
};

export default function FormularioTrabajador() {
    useEffect(() => {
        document.title = "Formulario de trabajador";
    }, []);

    const [datosTrabajador, setDatosTrabajador] = useState(datosInicialesTrabajador);
    const [errores, setErrores] = useState({});
    const redirigir = useNavigate();

    // validamos los campos
    const validarCampo = (campo, valor) => {
        const error = validaciones[campo]?.(valor);
        setErrores(prevState => ({
            ...prevState,
            [campo]: error
        }));
    };

    // manejamos los cambios
    const handleChange = (e) => {
        const { name, value } = e.target;
        setDatosTrabajador(prevState => ({
            ...prevState,
            [name]: value
        }));
        validarCampo(name, value);
    };

    // comprobamos las validaciones
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
                title: "Error",
                text: "Revisa los campos del formulario",
                confirmButtonText: "Vale"
            });
        }
        return Object.keys(nuevoError).length === 0;
    };

    // registrar trabajadores
    const registrarTrabajador = (e) => {
        e.preventDefault();
        if (validar()) {
            Axios.post("/registrarTrabajador", datosTrabajador)
                .then((response) => {
                    setErrores({});

                    Swal.fire({
                        icon: "success",
                        title: `El ID de trabajador de ${response.data.nombreTrabajador} es:  ${response.data.idTrabajador}`,
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

                    } else if (error.message && error.message.includes("Network Error")) {
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
                <form onSubmit={registrarTrabajador} className="campos">
                    {errores.serverError && <div className="errorServidor">{errores.serverError}</div>}

                    <EntradaTexto label="Nombre completo del trabajador *" name="nombre" value={datosTrabajador.nombre} onChange={handleChange} type="text" placeholder="Ej: Carlos Martínez Gómez" error={errores.nombre} />
                    <EntradaTexto label="Contraseña para el trabajador *" name="contrasena" value={datosTrabajador.contrasena} onChange={handleChange} type="text" placeholder="Ej: 3jjh48721&nsk" error={errores.contrasena} />
                    <EntradaTexto label="Teléfono del trabajador *" name="telefono" value={datosTrabajador.telefono} onChange={handleChange} type="tel" placeholder="Ej: 666555444" error={errores.telefono} />
                    <EntradaTexto label="Equipo *" name="equipo" value={datosTrabajador.equipo} onChange={handleChange} type="text" placeholder="Ej: " error={errores.equipo} />
                    <EntradaTexto label="Subequipo *" name="subequipo" value={datosTrabajador.subequipo} onChange={handleChange} type="text" placeholder="Ej: " error={errores.subequipo} />
                    <EntradaSelect label="Rol del trabajador *" name="rol" value={datosTrabajador.rol} onChange={handleChange} error={errores.rol} options={[
                        { value: "Administrador", label: "Administrador" },
                        { value: "Captador", label: "Captador" },
                        { value: "Comercial", label: "Comercial" },
                        { value: "Coordinador", label: "Coordinador" },
                        { value: "Instalador", label: "Instalador" },
                        { value: "Recursos_Humanos", label: "Recursos Humanos" },
                        { value: "Tramitador", label: "Tramitador" },
                    ]} />

                    <button type="submit">Registrar Trabajador</button>
                </form>
            </div>
        </div>
    );
}