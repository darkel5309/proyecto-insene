import { useState, useEffect } from 'react';
import '../styles/Visita.css';
import Axios from "axios";
import { EntradaTexto, EntradaRadio } from '../components/CamposFormulario';
import Swal from 'sweetalert2';

export default function Visita() {
    useEffect(() => {
        document.title = "Visita";
    }, []);

    const datosInicialesVisita = {
        idTrabajador: 0,
        idCliente: 0,
        nombreContacto: "",
        telefonoContacto: "",
        correoContacto: "",
        observacionesContacto: "",
        direccionContacto: "",
        localidadContacto: "",
        provinciaContacto: "",
        fechaVisita: "",
        horaVisita: "",
        numeroPersonas: 0,
        numeroDecisores: 0,
        tieneBombona: "Sin datos",
        tieneGas: "Sin datos",
        tieneTermoElectrico: "Sin datos",
        tienePlacasTermicas: "Sin datos",
        importeLuz: 0,
        importeGas: 0
    };

    const [datosVisita, setDatosVisita] = useState(datosInicialesVisita);

    const [errores, setErrores] = useState({});

    const opcionesRadio = [
        { value: "Si", label: "Sí" },
        { value: "No", label: "No" },
        { value: "Sin datos", label: "Sin datos" }
    ];

    // resetear los datos del cliente en caso de error
    const resetClienteData = () => {
        setDatosVisita(prevState => ({
            ...prevState,
            nombreContacto: "",
            telefonoContacto: "",
            correoContacto: "",
            direccionContacto: "",
            localidadContacto: "",
            provinciaContacto: ""
        }));
    };

    // obtenemos los datos del cliente de forma asincronica
    useEffect(() => {
        const obtenerCliente = async (idCliente) => {
            try {
                const response = await Axios.get(`http://localhost:3001/api/obtenerContacto/${idCliente}`);
                const cliente = response.data;
                if (cliente) {
                    setDatosVisita(prevState => ({
                        ...prevState,
                        nombreContacto: cliente.nombre || "",
                        direccionContacto: cliente.direccion || "",
                        localidadContacto: cliente.localidad || "",
                        provinciaContacto: cliente.provincia || "",
                        telefonoContacto: cliente.telefono || "",
                        correoContacto: cliente.correo || ""
                    }));
                    setErrores(prevState => ({ ...prevState, idCliente: null }));
                }
            } catch {
                resetClienteData();
            }
        };

        if (datosVisita.idCliente) {
            obtenerCliente(datosVisita.idCliente);
        }
    }, [datosVisita.idCliente]);

    // validaciones de los campos
    const validaciones = {
        idTrabajador: (valor) => (!valor || isNaN(valor) || valor <= 0) ? "Este campo es obligatorio y debe ser mayor a 0" : null,
        idCliente: (valor) => (!valor || isNaN(valor) || valor <= 0) ? "Este campo es obligatorio y debe ser mayor a 0" : null,
        fechaVisita: (valor) => !valor ? "Este campo es obligatorio" : null,
        horaVisita: (valor) => !valor ? "Este campo es obligatorio" : null,
        numeroPersonas: (valor) => (isNaN(valor) || valor < 0) ? "El número de personas debe ser un número positivo" : null,
        numeroDecisores: (valor) => (!valor || isNaN(valor) || valor < 0) ? "Este campo es obligatorio y debe ser mayor a 0" : null,
        importeLuz: (valor) => (isNaN(valor) || valor < 0) ? "El importe debe ser un número positivo" : null,
        importeGas: (valor) => (isNaN(valor) || valor < 0) ? "El importe debe ser un número positivo" : null,
    };

    // manejamos los cambios en los campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setDatosVisita(prevState => ({ ...prevState, [name]: value }));
        validarCampo(name, value);
    };

    // validamos los campos individualmente
    const validarCampo = (campo, valor) => {
        const error = validaciones[campo]?.(valor);
        setErrores(prevState => ({ ...prevState, [campo]: error }));
    };

    // validamos todos los campos antes de enviar el formulario
    const validar = () => {
        const nuevoError = Object.keys(validaciones).reduce((acc, campo) => {
            const error = validaciones[campo](datosVisita[campo]);
            if (error) acc[campo] = error;
            return acc;
        }, {});
        setErrores(nuevoError);

        if (Object.keys(nuevoError).length > 0) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Revisa los campos del formulario",
                confirmButtonText: "Vale"
            });
            return false;
        }
        return true;
    };

    // metodo para registrar visitas
    const addVisita = async (e) => {
        e.preventDefault();
        if (validar()) {
            try {
                const response = await Axios.post("http://localhost:3001/api/registrarVisita", datosVisita);
                setErrores({});

                Swal.fire({
                    icon: "success",
                    title: `El código de visita es: ${response.data.idVivienda}`,
                    text: "Visita registrada correctamente",
                    confirmButtonText: "Vale"
                });
                setDatosVisita(datosInicialesVisita);

            } catch (error) {
                if (error.response) {
                    const mensajeError = error.response?.data?.error || "Hubo un problema al registrar la visita. Inténtalo de nuevo.";

                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Revisa los campos del formulario",
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
            };
        }
    };

    return (
        <div className="visita">
            <h1>Formulario de Visitas</h1>
            <div className="contenedorVisita">
                <form onSubmit={addVisita} className="campos">
                    {errores.serverError && <div className="errorServidor">{errores.serverError}</div>}

                    <EntradaTexto label="Código de Trabajador *" name="idTrabajador" value={datosVisita.idTrabajador} onChange={handleChange} type="number" placeholder="Ej: 1" error={errores.idTrabajador} />

                    <EntradaTexto label="Código del contacto *" name="idCliente" value={datosVisita.idCliente} onChange={handleChange} type="number" placeholder="Ej: 1" error={errores.idCliente} />

                    <EntradaTexto label="Nombre completo del contacto" name="nombreContacto" value={datosVisita.nombreContacto} onChange={handleChange} type="text" disabled={true} />

                    <EntradaTexto label="Dirección del contacto" name="direccionContacto" value={datosVisita.direccionContacto} onChange={handleChange} type="text" disabled={true} />

                    <EntradaTexto label="Localidad del contacto" name="localidadContacto" value={datosVisita.localidadContacto} onChange={handleChange} type="text" disabled={true} />

                    <EntradaTexto label="Provincia del contacto" name="provinciaContacto" value={datosVisita.provinciaContacto} onChange={handleChange} type="text" disabled={true} />

                    <EntradaTexto label="Teléfono de contacto" name="telefonoContacto" value={datosVisita.telefonoContacto} onChange={handleChange} type="tel" disabled={true} />

                    <EntradaTexto label="Correo del contacto" name="correoContacto" value={datosVisita.correoContacto} onChange={handleChange} type="email" error={errores.correoContacto} disabled={true} />

                    <EntradaTexto label="Fecha de la visita *" name="fechaVisita" value={datosVisita.fechaVisita} onChange={handleChange} type="date" placeholder="Ej: 17/01/2025" error={errores.fechaVisita} />

                    <EntradaTexto label="Hora de la visita *" name="horaVisita" value={datosVisita.horaVisita} onChange={handleChange} type="time" placeholder="Ej: 10:22" error={errores.horaVisita} />

                    <EntradaTexto label="Número de personas en la vivienda" name="numeroPersonas" value={datosVisita.numeroPersonas} onChange={handleChange} type="number" placeholder="Ej: 4" error={errores.numeroPersonas} />

                    <EntradaTexto label="Número de decisores *" name="numeroDecisores" value={datosVisita.numeroDecisores} onChange={handleChange} type="number" placeholder="Ej: 2" error={errores.numeroDecisores} />

                    <EntradaRadio label="¿Tiene bombona?" name="tieneBombona" options={opcionesRadio} value={datosVisita.tieneBombona} onChange={handleChange} error={errores.tieneBombona} />

                    <EntradaRadio label="¿Tiene gas?" name="tieneGas" options={opcionesRadio} value={datosVisita.tieneGas} onChange={handleChange} error={errores.tieneGas} />

                    <EntradaRadio label="¿Tiene termo eléctrico?" name="tieneTermoElectrico" options={opcionesRadio} value={datosVisita.tieneTermoElectrico} onChange={handleChange} error={errores.tieneTermoElectrico} />

                    <EntradaRadio label="¿Tiene placas térmicas?" name="tienePlacasTermicas" options={opcionesRadio} value={datosVisita.tienePlacasTermicas} onChange={handleChange} error={errores.tienePlacasTermicas} />

                    <EntradaTexto label="Importe de recibo de luz" name="importeLuz" value={datosVisita.importeLuz} onChange={handleChange} type="number" step="0.01" placeholder="Ej: 45,50" error={errores.importeLuz} />

                    <EntradaTexto label="Importe de recibo de gas" name="importeGas" value={datosVisita.importeGas} onChange={handleChange} type="number" step="0.01" placeholder="Ej: 30,00" error={errores.importeGas} />

                    <button>Registrar Visita</button>
                </form>
            </div>
        </div>
    );
}
