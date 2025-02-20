import '../styles/Feedback.css';
import { useState, useEffect, useCallback } from "react";
import Axios from "../axiosConfig";
import { EntradaTexto, EntradaTextoArea, EntradaSelect, EntradaRadio } from '../components/CamposFormulario';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

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

const validaciones = {
	idTrabajador: (valor) => (Number(valor) <= 0 ? "Este campo es obligatorio y debe ser mayor a 0" : null),
	idCliente: (valor) => (Number(valor) <= 0 ? "Este campo es obligatorio y debe ser mayor a 0" : null),
	fechaVisita: (valor) => (!valor ? "Este campo es obligatorio" : null),
	horaVisita: (valor) => (!valor ? "Este campo es obligatorio" : null),
	numeroPersonas: (valor) => (Number(valor) < 0 ? "El número de personas debe ser un número positivo" : null),
	numeroDecisores: (valor) => (Number(valor) <= 0 ? "Este campo es obligatorio y debe ser mayor a 0" : null),
	importeLuz: (valor) => (Number(valor) < 0 ? "El importe debe ser un número positivo" : null),
	importeGas: (valor) => (Number(valor) < 0 ? "El importe debe ser un número positivo" : null),
	resultadoVisita: (valor) => (!valor ? "Este campo es obligatorio" : null),
};

export default function Feedback() {
	useEffect(() => {
		document.title = "Feedback";
	}, []);

	const [datosFeedback, setDatosFeedback] = useState(datosInicialesFeedback);
	const [errores, setErrores] = useState({});
	const redirigir = useNavigate();

	const opcionesRadio = [
		{ value: "Si", label: "Sí" },
		{ value: "No", label: "No" },
		{ value: "Sin datos", label: "Sin datos" }
	];

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

	const obtenerCliente = useCallback(async (idCliente) => {
		if (!idCliente) return;
		try {
			const { data } = await Axios.get(`/obtenerContacto/${idCliente}`);
			if (data) {
				setDatosFeedback(prevState => ({
					...prevState,
					nombreContacto: data.nombre || "",
					direccionContacto: data.direccion || "",
					localidadContacto: data.localidad || "",
					provinciaContacto: data.provincia || "",
					telefonoContacto: data.telefono || "",
					correoContacto: data.correo || ""
				}));
				setErrores(prevState => ({ ...prevState, idCliente: null }));
			}
		} catch {
			resetClienteData();
		}
	}, []);

	useEffect(() => {
		obtenerCliente(datosFeedback.idCliente);
	}, [datosFeedback.idCliente, obtenerCliente]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setDatosFeedback(prevState => ({ ...prevState, [name]: value }));
		validarCampo(name, value);
	};

	const validarCampo = (campo, valor) => {
		const error = validaciones[campo]?.(valor);
		setErrores(prevState => ({ ...prevState, [campo]: error }));
	};

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

	const addFeedback = async (e) => {
		e.preventDefault();
		if (!validar()) return;

		try {
			await Axios.post("/registrarFeedback", datosFeedback);
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
		}
		catch (error) {
			let mensajeError = "Hubo un problema con la solicitud. Inténtalo de nuevo";

			if (error.response) {
				mensajeError = error.response?.data?.error || mensajeError;
			} else if (error.message && error.message.includes("Network Error")) {
				mensajeError = "Verifica tu conexión a internet e inténtalo de nuevo";
			}

			Swal.fire({
				icon: "error",
				title: "Error",
				text: mensajeError,
				confirmButtonText: "Vale"
			});

			setErrores(prevState => ({
				...prevState,
				serverError: mensajeError
			}));
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