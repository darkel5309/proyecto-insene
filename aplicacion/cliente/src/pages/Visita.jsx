import { React, useState, useEffect } from 'react';
import '../styles/Visita.css';
import Axios from "axios";
import { EntradaTexto, EntradaTextoArea, EntradaRadio } from '../components/CamposFormulario';
import Swal from 'sweetalert2';


export default function Visita() {
    useEffect(() => {
        document.title = "Visita";
    }, []);

    // creamos las constantes para obtener los valores de los campos del formulario
    const datosInicialesVisita = {
        idTrabajador: 0,
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

    const opcionesRadio = [
        { value: "Si", label: "Sí" },
        { value: "No", label: "No" },
        { value: "Sin datos", label: "Sin datos" }
    ];

    // creamos las constantes para obtener los valores de los campos del formulario
    const [datosVisita, setDatosVisita] = useState(datosInicialesVisita);

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
        fechaVisita: (valor) => !valor ? "Este campo es obligatorio" : null,
        horaVisita: (valor) => !valor ? "Este campo es obligatorio" : null,
        numeroPersonas: (valor) => (isNaN(valor) || valor < 0) ? "El número de personas debe ser un número positivo" : null,
        numeroDecisores: (valor) => (!valor || isNaN(valor) || valor < 0) ? "Este campo es obligatorio y debe ser mayor a 0" : null,
        importeLuz: (valor) => (isNaN(valor) || valor < 0) ? "El importe debe ser un número positivo" : null,
        importeGas: (valor) => (isNaN(valor) || valor < 0) ? "El importe debe ser un número positivo" : null,
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
        setDatosVisita(prevState => ({
            ...prevState,
            [name]: value
        }));
        validarCampo(name, value);
    };

    // validamos los campos
    const validar = () => {
        const nuevoError = {};
        Object.keys(validaciones).forEach(campo => {
            const error = validaciones[campo](datosVisita[campo]);
            if (error) nuevoError[campo] = error;
        });
        setErrores(nuevoError);

        if (Object.keys(nuevoError).length > 0) {
            // mostramos una alerta de error
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Hay algunos campos con errores en el formulario",
                confirmButtonText: "Vale"
            });
        }

        // si no hay errores devolvemos true
        return Object.keys(nuevoError).length === 0;
    };

    // metodo para crear clientes
    const addVisita = (e) => {
        e.preventDefault();
        if (validar()) {
            // llamamos al metodo crear y al cuerpo de la solicitud
            Axios.post("http://localhost:3001/api/registrarVisita", datosVisita)
                .then((response) => {
                    setErrores({});

                    // mostramos una alerta de todo correcto
                    Swal.fire({
                        icon: "success",
                        title: `El código es: ${response.data.idVivienda}`,
                        text: "Datos registrados correctamente",
                        confirmButtonText: "Vale"
                    });

                    // vaciamos los campos del formulario despues de que se inserten
                    setDatosVisita(datosInicialesVisita);
                })
                .catch((error) => {
                    if (error.response) {
                        const mensajeError = error.response?.data?.error || "Hubo un problema con la solicitud. Inténtalo de nuevo";

                        // mostramos una alerta de error
                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: "Hay algunos campos con errores en el formulario",
                            confirmButtonText: "Vale"
                        });

                        setErrores(prevState => ({
                            ...prevState,
                            serverError: mensajeError
                        }));
                        console.error("Error en la solicitud");
                    }

                    else if (error.message && error.message.includes("Network Error")) {
                        // mostramos una alerta de conexion
                        Swal.fire({
                            icon: "question",
                            title: "Error de Conexión",
                            text: "Verifica tu conexión a internet o inténtalo de nuevo",
                            confirmButtonText: "Vale"
                        });
                        console.error("Error de conexión");
                    }
                });
        }
    };




    // este es el html visible en la web
    return (
        <div className="visita">
            <h1>Formulario de Visitas</h1>

            <div className="contenedorVisita">
                <form onSubmit={addVisita} className="campos">
                    {errores.serverError && <div className="errorServidor">{errores.serverError}</div>}

                    <EntradaTexto label="Código de Trabajador *" name="idTrabajador" value={datosVisita.idTrabajador} onChange={handleChange} type="number" placeholder="Ej: 1" error={errores.idTrabajador} />

                    <EntradaTexto label="Nombre completo del contacto *" name="nombreContacto" value={datosVisita.nombreContacto} onChange={handleChange} type="text" placeholder="Ej: Gabriel Martín Ruiz" error={errores.nombreContacto} />

                    <EntradaTexto label="Dirección del contacto *" name="direccionContacto" value={datosVisita.direccionContacto} onChange={handleChange} type="text" placeholder="Ej: Calle del Sol, 42" error={errores.direccionContacto} />

                    <EntradaTexto label="Localidad del contacto *" name="localidadContacto" value={datosVisita.localidadContacto} onChange={handleChange} type="text" placeholder="Ej: Mairena de Alcor" error={errores.localidadContacto} />

                    <EntradaTexto label="Provincia del contacto *" name="provinciaContacto" value={datosVisita.provinciaContacto} onChange={handleChange} type="text" placeholder="Ej: Sevilla" error={errores.provinciaContacto} />

                    <EntradaTexto label="Teléfono de contacto *" name="telefonoContacto" value={datosVisita.telefonoContacto} onChange={handleChange} type="tel" placeholder="Ej: 666555444" error={errores.telefonoContacto} />

                    <EntradaTexto label="Correo del contacto *" name="correoContacto" value={datosVisita.correoContacto} onChange={handleChange} type="email" placeholder="Ej: ejemplo@gmail.com" error={errores.correoContacto} />

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

                    <EntradaTextoArea label="Observaciones del contacto" name="observacionesContacto" value={datosVisita.observacionesContacto} onChange={handleChange} type="text" placeholder="Comenta alguna observación" />

                    <button>Registrar Visita</button>
                </form>
            </div>
        </div>
    )
}
