import '../styles/Visita.css';
import { useState, useEffect } from 'react';
import Axios from "../axiosConfig";
import { EntradaTexto, EntradaRadio } from '../components/CamposFormulario';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const datosInicialesVisita = {
    idTrabajador: 0,
    idContacto: 0,
    nombre: "",
    telefono: "",
    correo: "",
    direccion: "",
    localidad: "",
    provincia: "",
    fecha: "",
    hora: "",
    numeroPersonas: 0,
    numeroDecisores: 0,
    tieneBombona: "Sin_datos",
    tieneGas: "Sin_datos",
    tieneTermo: "Sin_datos",
    tienePlacas: "Sin_datos",
    importeLuz: 0,
    importeGas: 0
};

const opcionesRadio = [
    { value: "Si", label: "Sí" },
    { value: "No", label: "No" },
    { value: "Sin_datos", label: "Sin datos" }
];

const validaciones = {
    idTrabajador: (valor) => (!valor || isNaN(valor)) ? "Este campo es obligatorio" : null,
    idContacto: (valor) => (!valor || isNaN(valor)) ? "Este campo es obligatorio" : null,
    fecha: (valor) => !valor ? "Este campo es obligatorio" : null,
    hora: (valor) => !valor ? "Este campo es obligatorio" : null,
    numeroPersonas: (valor) => (isNaN(valor) || valor < 0) ? "El número de personas debe ser mayor a 0" : null,
    numeroDecisores: (valor) => (!valor || isNaN(valor) || valor < 0) ? "Este campo es obligatorio y debe ser mayor a 0" : null,
    importeLuz: (valor) => (isNaN(valor) || valor < 0) ? "El importe debe ser mayor a 0" : null,
    importeGas: (valor) => (isNaN(valor) || valor < 0) ? "El importe debe ser mayor a 0" : null,
};

export default function Visita() {
    useEffect(() => {
        document.title = "Formulario de visita";
    }, []);

    const [datosVisita, setDatosVisita] = useState(datosInicialesVisita);
    const [errores, setErrores] = useState({});
    const redirigir = useNavigate();

    const resetearDatosContacto = () => {
        setDatosVisita(prevState => ({
            ...prevState,
            nombre: "",
            telefono: "",
            correo: "",
            direccion: "",
            localidad: "",
            provincia: ""
        }));
    };

    // obtener datos del contacto
    useEffect(() => {
        const obtenerCliente = async (idContacto) => {
            try {
                const response = await Axios.get(`obtenerContacto/${idContacto}`);
                const cliente = response.data;
                if (cliente) {
                    setDatosVisita(prevState => ({
                        ...prevState,
                        nombre: cliente.nombre || "",
                        direccion: cliente.direccion || "",
                        localidad: cliente.localidad || "",
                        provincia: cliente.provincia || "",
                        telefono: cliente.telefono || "",
                        correo: cliente.correo || ""
                    }));
                    setErrores(prevState => ({ ...prevState, idContacto: null }));
                }
            } catch {
                resetearDatosContacto();
            }
        };

        if (datosVisita.idContacto) {
            obtenerCliente(datosVisita.idContacto);
        }
    }, [datosVisita.idContacto]);

    // validamos los campos
    const validarCampo = (campo, valor) => {
        const error = validaciones[campo]?.(valor);
        setErrores(prevState => ({ ...prevState, [campo]: error }));
    };

    // manejamos los cambios
    const handleChange = (e) => {
        const { name, value } = e.target;
        setDatosVisita(prevState => ({
            ...prevState,
            [name]: value
        }));
        validarCampo(name, value);
    };

    // comprobamos las validaciones
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

    // registrar visitas
    const registrarVisita = async (e) => {
        e.preventDefault();
        if (validar()) {
            try {
                const response = await Axios.post("/registrarVisita", datosVisita);
                setErrores({});

                Swal.fire({
                    icon: "success",
                    title: `Visita nº ${response.data.idVisita} registrada`,
                    text: "Visita registrada correctamente",
                    confirmButtonText: "Vale"
                }).then((result) => {
                    if (result.isConfirmed) {
                        redirigir(-1);
                    }
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

                } else if (error.message && error.message.includes("Network Error")) {
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
                <form onSubmit={registrarVisita} className="campos">
                    {errores.serverError && <div className="errorServidor">{errores.serverError}</div>}

                    <EntradaTexto label="ID de Trabajador *" name="idTrabajador" value={datosVisita.idTrabajador} onChange={handleChange} type="number" placeholder="Ej: 1" error={errores.idTrabajador} />
                    <EntradaTexto label="ID del Contacto *" name="idContacto" value={datosVisita.idCliente} onChange={handleChange} type="number" placeholder="Ej: 1" error={errores.idContacto} />
                    <EntradaTexto label="Nombre completo del contacto" name="nombre" value={datosVisita.nombre} onChange={handleChange} type="text" disabled={true} />
                    <EntradaTexto label="Dirección del contacto" name="direccion" value={datosVisita.direccion} onChange={handleChange} type="text" disabled={true} />
                    <EntradaTexto label="Localidad del contacto" name="localidad" value={datosVisita.localidad} onChange={handleChange} type="text" disabled={true} />
                    <EntradaTexto label="Provincia del contacto" name="provincia" value={datosVisita.provincia} onChange={handleChange} type="text" disabled={true} />
                    <EntradaTexto label="Teléfono del contacto" name="telefono" value={datosVisita.telefono} onChange={handleChange} type="tel" disabled={true} />
                    <EntradaTexto label="Correo del contacto" name="correo" value={datosVisita.correo} onChange={handleChange} type="email" error={errores.correo} disabled={true} />
                    <EntradaTexto label="Fecha de la visita *" name="fecha" value={datosVisita.fecha} onChange={handleChange} type="date" placeholder="Ej: 17/01/2025" error={errores.fecha} />
                    <EntradaTexto label="Hora de la visita *" name="hora" value={datosVisita.hora} onChange={handleChange} type="time" placeholder="Ej: 10:22" error={errores.hora} />
                    <EntradaTexto label="Número de personas en la vivienda" name="numeroPersonas" value={datosVisita.numeroPersonas} onChange={handleChange} type="number" placeholder="Ej: 4" error={errores.numeroPersonas} />
                    <EntradaTexto label="Número de decisores *" name="numeroDecisores" value={datosVisita.numeroDecisores} onChange={handleChange} type="number" placeholder="Ej: 2" error={errores.numeroDecisores} />
                    <EntradaRadio label="¿Tiene bombona?" name="tieneBombona" options={opcionesRadio} value={datosVisita.tieneBombona} onChange={handleChange} error={errores.tieneBombona} />
                    <EntradaRadio label="¿Tiene gas?" name="tieneGas" options={opcionesRadio} value={datosVisita.tieneGas} onChange={handleChange} error={errores.tieneGas} />
                    <EntradaRadio label="¿Tiene termo eléctrico?" name="tieneTermo" options={opcionesRadio} value={datosVisita.tieneTermo} onChange={handleChange} error={errores.tieneTermo} />
                    <EntradaRadio label="¿Tiene placas térmicas?" name="tienePlacas" options={opcionesRadio} value={datosVisita.tienePlacas} onChange={handleChange} error={errores.tienePlacas} />
                    <EntradaTexto label="Importe de recibo de luz (€)" name="importeLuz" value={datosVisita.importeLuz} onChange={handleChange} type="number" placeholder="Ej: 45,50" error={errores.importeLuz} />
                    <EntradaTexto label="Importe de recibo de gas (€)" name="importeGas" value={datosVisita.importeGas} onChange={handleChange} type="number" placeholder="Ej: 30,00" error={errores.importeGas} />

                    <button>Registrar Visita</button>
                </form>
            </div>
        </div>
    );
}