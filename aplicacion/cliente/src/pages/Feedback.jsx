import '../styles/Feedback.css';
import { useState, useEffect } from "react";
import Axios from "axios";
import { EntradaTexto, EntradaTextoArea, EntradaSelect, EntradaRadio } from '../components/CamposFormulario';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export default function Feedback() {
	useEffect(() => {
		document.title = "Feedback";
	}, []);

	const datosInicialesFeedback = {
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
		importeGas: 0,
		resultadoVisita: "",
		oferta: "",
		observacionesVisita: "",
	};

	const [datosFeedback, setDatosFeedback] = useState(datosInicialesFeedback);
	const [errores, setErrores] = useState({});
	const redirigir = useNavigate();

	const opcionesRadio = [
		{ value: "Si", label: "Sí" },
		{ value: "No", label: "No" },
		{ value: "Sin datos", label: "Sin datos" }
	];

	// resetear los datos del cliente en caso de error
	const resetClienteData = () => {
		setDatosFeedback(prevState => ({
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
				const response = await Axios.get(`http://localhost:5174/api/obtenerContacto/${idCliente}`);
				const cliente = response.data;
				if (cliente) {
					setDatosFeedback(prevState => ({
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

		if (datosFeedback.idCliente) {
			obtenerCliente(datosFeedback.idCliente);
		}
	}, [datosFeedback.idCliente]);

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
		resultadoVisita: (valor) => !valor ? "Este campo es obligatorio" : null,
	};

	// manejamos los cambios en los campos del formulario
	const handleChange = (e) => {
		const { name, value } = e.target;
		setDatosFeedback(prevState => ({ ...prevState, [name]: value }));
		validarCampo(name, value);
	};

	// validamos los campos individualmente
	const validarCampo = (campo, valor) => {
		const error = validaciones[campo]?.(valor);
		setErrores(prevState => ({ ...prevState, [campo]: error }));
	};

	// comprobamos las validaciones
	const validar = () => {
		const nuevoError = Object.keys(validaciones).reduce((acc, campo) => {
			const error = validaciones[campo](datosFeedback[campo]);
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

	// crear feedbacks
	const addFeedback = (e) => {
		e.preventDefault();
		if (validar()) {
			Axios.post("http://localhost:5174/api/registrarFeedback", datosFeedback)
				.then(() => {
					setErrores({});

					Swal.fire({
						icon: "success",
						title: "Perfecto",
						text: "Feedback registrado correctamente",
						confirmButtonText: "Vale"
					}).then((result) => {
						if (result.isConfirmed) {
							redirigir(-1);
						}
					});
					setDatosFeedback(datosInicialesFeedback);
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
							title: "Error de Conexión",
							text: "Verifica tu conexión a internet e inténtalo de nuevo",
							confirmButtonText: "Vale"
						});
					}
				});
		}
	};

	return (
		<div className='feedback'>
			<h1>Feedback de la visita</h1>
			<div className='contenedorFeedback'>
				<form onSubmit={addFeedback} className='campos'>
					{errores.serverError && <div className="errorServidor"> {errores.serverError}</div>}

					<EntradaTexto label="ID de Trabajador *" name="idTrabajador" value={datosFeedback.idTrabajador} onChange={handleChange} type="number" placeholder="Ej: 1" error={errores.idTrabajador} />

					<EntradaTexto label="ID del Cliente *" name="idCliente" value={datosFeedback.idCliente} onChange={handleChange} type="number" placeholder="Ej: 1" error={errores.idCliente} />

					<EntradaTexto label="Nombre completo del contacto" name="nombreContacto" value={datosFeedback.nombreContacto} onChange={handleChange} type="text" disabled={true} />

					<EntradaTexto label="Dirección del contacto" name="direccionContacto" value={datosFeedback.direccionContacto} onChange={handleChange} type="text" disabled={true} />

					<EntradaTexto label="Localidad del contacto" name="localidadContacto" value={datosFeedback.localidadContacto} onChange={handleChange} type="text" disabled={true} />

					<EntradaTexto label="Provincia del contacto" name="provinciaContacto" value={datosFeedback.provinciaContacto} onChange={handleChange} type="text" disabled={true} />

					<EntradaTexto label="Teléfono de contacto" name="telefonoContacto" value={datosFeedback.telefonoContacto} onChange={handleChange} type="tel" disabled={true} />

					<EntradaTexto label="Correo del contacto" name="correoContacto" value={datosFeedback.correoContacto} onChange={handleChange} type="email" error={errores.correoContacto} disabled={true} />

					<EntradaTexto label="Fecha de la visita *" name="fechaVisita" value={datosFeedback.fechaVisita} onChange={handleChange} type="date" error={errores.fechaVisita} />

					<EntradaTexto label="Hora de la visita *" name="horaVisita" value={datosFeedback.horaVisita} onChange={handleChange} type="time" error={errores.horaVisita} />

					<EntradaTexto label="Número de personas en la vivienda" name="numeroPersonas" value={datosFeedback.numeroPersonas} onChange={handleChange} type="number" placeholder="Ej: 4" error={errores.numeroPersonas} />

					<EntradaTexto label="Número de decisores *" name="numeroDecisores" value={datosFeedback.numeroDecisores} onChange={handleChange} type="number" placeholder="Ej: 2" error={errores.numeroDecisores} />

					<EntradaRadio label="¿Tiene bombona?" name="tieneBombona" options={opcionesRadio} value={datosFeedback.tieneBombona} onChange={handleChange} error={errores.tieneBombona} />

					<EntradaRadio label="¿Tiene gas?" name="tieneGas" options={opcionesRadio} value={datosFeedback.tieneGas} onChange={handleChange} error={errores.tieneGas} />

					<EntradaRadio label="¿Tiene termo eléctrico?" name="tieneTermoElectrico" options={opcionesRadio} value={datosFeedback.tieneTermoElectrico} onChange={handleChange} error={errores.tieneTermoElectrico} />

					<EntradaRadio label="¿Tiene placas térmicas?" name="tienePlacasTermicas" options={opcionesRadio} value={datosFeedback.tienePlacasTermicas} onChange={handleChange} error={errores.tienePlacasTermicas} />

					<EntradaTexto label="Importe de recibo de luz (€)" name="importeLuz" value={datosFeedback.importeLuz} onChange={handleChange} type="number" placeholder="Ej: 45,50" error={errores.importeLuz} />

					<EntradaTexto label="Importe de recibo de gas (€)" name="importeGas" value={datosFeedback.importeGas} onChange={handleChange} type="number" placeholder="Ej: 30,00" error={errores.importeGas} />

					<EntradaSelect label="Resultado de la visita *" name="resultadoVisita" value={datosFeedback.resultadoVisita} onChange={handleChange} error={errores.resultadoVisita} options={[
						{ value: "Visitado_pdte_contestación", label: "Visitado pendiente de contestación" },
						{ value: "Visitado_no_hacen_nada", label: "Visitado pero no hacen nada" },
						{ value: "Recitar", label: "Volver a citar" },
						{ value: "No_visita", label: "No ha habido visita" },
						{ value: "Firmada_no_financiable", label: "Firmada y no financiable" },
						{ value: "Venta", label: "Venta" }
					]} />

					<EntradaTextoArea label="Oferta propuesta" name="oferta" value={datosFeedback.oferta} onChange={handleChange} type="text" placeholder="Ej: Oferta limitada" error={errores.oferta} />

					<EntradaTextoArea label="Observaciones" name="observacionesVisita" value={datosFeedback.observacionesVisita} onChange={handleChange} type="text" placeholder="Comenta alguna observación" error={errores.observacionesVisita} />

					<button type="submit">Registrar Feedback</button>
				</form>
			</div>
		</div>
	)
} 