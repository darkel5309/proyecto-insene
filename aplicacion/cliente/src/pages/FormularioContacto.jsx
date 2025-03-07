import '../styles/Contacto.css';
import { useState, useEffect } from "react";
import Axios from "../axiosConfig";
import { EntradaTexto, EntradaTextoArea, EntradaSelect } from '../components/CamposFormulario';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const datosInicialesCliente = {
    idTrabajador: 0,
    nombre: "",
    telefono: "",
    correo: "",
    modoCaptacion: "",
    observaciones: "",
    direccion: "",
    localidad: "",
    provincia: "",
};

const validaciones = {
    idTrabajador: (valor) => (!valor || isNaN(valor)) ? "Este campo es obligatorio" : null,
    nombre: (valor) => !valor ? "Este campo es obligatorio" : null,
    telefono: (valor) => (!valor || !/^\d{9}$/.test(valor)) ? "Este campo es obligatorio y debe tener 9 digitos" : null,
    correo: (valor) => (!valor || !/\S+@\S+\.\S+/.test(valor)) ? "El correo no es válido" : null,
    modoCaptacion: (valor) => !valor ? "Este campo es obligatorio" : null,
    direccion: (valor) => !valor ? "Este campo es obligatorio" : null,
    localidad: (valor) => !valor ? "Este campo es obligatorio" : null,
    provincia: (valor) => !valor ? "Este campo es obligatorio" : null,
};

export default function FormularioCliente() {
    useEffect(() => {
        document.title = "Formulario de contactos";
    }, []);

    const [datosCliente, setDatosCliente] = useState(datosInicialesCliente);
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
        setDatosCliente(prevState => ({
            ...prevState,
            [name]: value
        }));
        validarCampo(name, value);
    };

    // comprobamos validaciones
    const validar = () => {
        const nuevoError = {};
        Object.keys(validaciones).forEach(campo => {
            const error = validaciones[campo](datosCliente[campo]);
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

    // registrar clientes
    const registrarCliente = (e) => {
        e.preventDefault();
        if (validar()) {
            Axios.post("/registrarCliente", datosCliente)
                .then((response) => {
                    setErrores({});

                    Swal.fire({
                        icon: "success",
                        title: `Cliente nº ${response.data.idCliente} registrado`,
                        text: "Datos registrados correctamente",
                        confirmButtonText: "Vale"
                    }).then((result) => {
                        if (result.isConfirmed) {
                            redirigir(-1);
                        }
                    });
                    setDatosCliente(datosInicialesCliente);
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
        <div className="contacto">
            <h1>Formulario de Contactos</h1>

            <div className="contenedorContacto">
                <form onSubmit={registrarCliente} className='campos'>
                    {errores.serverError && <div className="errorServidor">{errores.serverError}</div>}

                    <EntradaTexto label="ID de Trabajador *" name="idTrabajador" value={datosCliente.idTrabajador} onChange={handleChange} type="number" placeholder="Ej: 1" error={errores.idTrabajador} />
                    <EntradaTexto label="Nombre completo del cliente *" name="nombre" value={datosCliente.nombre} onChange={handleChange} type="text" placeholder="Ej: Gabriel Martín Ruiz" error={errores.nombre} />
                    <EntradaTexto label="Dirección del cliente *" name="direccion" value={datosCliente.direccion} onChange={handleChange} type="text" placeholder="Ej: Calle del Sol, 42" error={errores.direccion} />
                    <EntradaTexto label="Localidad del cliente *" name="localidad" value={datosCliente.localidad} onChange={handleChange} type="text" placeholder="Ej: Mairena de Alcor" error={errores.localidad} />
                    <EntradaTexto label="Provincia del cliente *" name="provincia" value={datosCliente.provincia} onChange={handleChange} type="text" placeholder="Ej: Sevilla" error={errores.provincia} />
                    <EntradaTexto label="Teléfono de cliente *" name="telefono" value={datosCliente.telefono} onChange={handleChange} type="tel" placeholder="Ej: 666555444" error={errores.telefono} />
                    <EntradaTexto label="Correo del cliente *" name="correo" value={datosCliente.correo} onChange={handleChange} type="email" placeholder="Ej: ejemplo@gmail.com" error={errores.correo} />
                    <EntradaSelect label="Modo de captación *" name="modoCaptacion" value={datosCliente.modoCaptacion} onChange={handleChange} error={errores.modoCaptacion} options={[
                        { value: "Captador", label: "Captador" },
                        { value: "Telemarketing", label: "Telemarketing" },
                        { value: "Referido", label: "Referido" },
                        { value: "Propia", label: "Captación propia" }
                    ]} />
                    <EntradaTextoArea label="Observaciones del cliente" name="observaciones" value={datosCliente.observaciones} onChange={handleChange} type="text" placeholder="Comenta alguna observación" />

                    <button type="submit">Registrar Datos</button>
                </form>
            </div>
        </div>
    );
}