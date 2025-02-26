import '../styles/Feedback.css';
import { useState, useEffect, useCallback } from "react";
import Axios from "../axiosConfig";
import { EntradaTexto, EntradaTextoArea, EntradaSelect, EntradaRadio } from '../components/CamposFormulario';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const datosInicialesFeedback = {
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
	importeGas: 0,
	resultado: "",
	oferta: "",
	observaciones: "",
};

const opcionesRadio = [
	{ value: "Si", label: "Sí" },
	{ value: "No", label: "No" },
	{ value: "Sin_datos", label: "Sin datos" }
];

const validaciones = {
	idTrabajador: (valor) => (!valor || isNaN(valor)) ? "Este campo es obligatorio" : null,
	idContacto: (valor) => (!valor || isNaN(valor)) ? "Este campo es obligatorio" : null,
	fecha: (valor) => (!valor ? "Este campo es obligatorio" : null),
	hora: (valor) => (!valor ? "Este campo es obligatorio" : null),
	numeroPersonas: (valor) => (Number(valor) < 0 ? "El número de personas debe ser mayor a 0" : null),
	numeroDecisores: (valor) => (Number(valor) <= 0 ? "Este campo es obligatorio y debe ser mayor a 0" : null),
	importeLuz: (valor) => (Number(valor) < 0 ? "El importe debe ser mayor a 0" : null),
	importeGas: (valor) => (Number(valor) < 0 ? "El importe debe ser mayor a 0" : null),
	resultado: (valor) => (!valor ? "Este campo es obligatorio" : null),
};

export default function Feedback() {
	useEffect(() => {
		document.title = "Formulario de feedback";
	}, []);

	const [datosFeedback, setDatosFeedback] = useState(datosInicialesFeedback);
	const [errores, setErrores] = useState({});
	const redirigir = useNavigate();

	const resetearDatosContacto = () => {
		setDatosFeedback(prevState => ({
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
	const obtenerContacto = useCallback(async (idContacto) => {
		if (!idContacto) return;
		try {
			const { data } = await Axios.get(`/obtenerContacto/${idContacto}`);
			if (data) {
				setDatosFeedback(prevState => ({
					...prevState,
					nombre: data.nombre || "",
					direccion: data.direccion || "",
					localidad: data.localidad || "",
					provincia: data.provincia || "",
					telefono: data.telefono || "",
					correo: data.correo || ""
				}));
				setErrores(prevState => ({ ...prevState, idContacto: null }));
			}
		} catch {
			resetearDatosContacto();
		}
	}, []);

	useEffect(() => {
		obtenerContacto(datosFeedback.idContacto);
	}, [datosFeedback.idContacto, obtenerContacto]);

	// validamos los campos
	const validarCampo = (campo, valor) => {
		const error = validaciones[campo]?.(valor);
		setErrores(prevState => ({ ...prevState, [campo]: error }));
	};

	// manejamos los cambios
	const handleChange = (e) => {
		const { name, value } = e.target;
		setDatosFeedback(prevState => ({ ...prevState, [name]: value }));
		validarCampo(name, value);
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

	// registrar feedbacks
	const registrarFeedback = async (e) => {
		e.preventDefault();
		if (!validar()) return;

		try {
			await Axios.post("/registrarFeedback", datosFeedback);
			setErrores({});
			Swal.fire({
				icon: "success",
				title: `El código del feedback es: ${response.data.idVisita}`,
				text: "Feedback registrado correctamente",
				confirmButtonText: "Vale"
			}).then((result) => {
				if (result.isConfirmed) {
					redirigir(-1);
				}
			});
			setDatosFeedback(datosInicialesFeedback);

		} catch (error) {
			const mensajeError = "Hubo un problema con la solicitud. Inténtalo de nuevo";

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
		<div className="feedback">
			<h1>Feedback de la visita</h1>

			<div className="contenedorFeedback">
				<form onSubmit={registrarFeedback} className="campos">
					{errores.serverError && <div className="errorServidor"> {errores.serverError}</div>}

					<EntradaTexto label="ID de Trabajador *" name="idTrabajador" value={datosFeedback.idTrabajador} onChange={handleChange} type="number" placeholder="Ej: 1" error={errores.idTrabajador} />
					<EntradaTexto label="ID del Cliente *" name="idContacto" value={datosFeedback.idContacto} onChange={handleChange} type="number" placeholder="Ej: 1" error={errores.idContacto} />
					<EntradaTexto label="Nombre completo del contacto" name="nombre" value={datosFeedback.nombre} onChange={handleChange} type="text" disabled={true} />
					<EntradaTexto label="Dirección del contacto" name="direccion" value={datosFeedback.direccion} onChange={handleChange} type="text" disabled={true} />
					<EntradaTexto label="Localidad del contacto" name="localidad" value={datosFeedback.localidad} onChange={handleChange} type="text" disabled={true} />
					<EntradaTexto label="Provincia del contacto" name="provincia" value={datosFeedback.provincia} onChange={handleChange} type="text" disabled={true} />
					<EntradaTexto label="Teléfono de contacto" name="telefono" value={datosFeedback.telefono} onChange={handleChange} type="tel" disabled={true} />
					<EntradaTexto label="Correo del contacto" name="correo" value={datosFeedback.correo} onChange={handleChange} type="email" error={errores.correo} disabled={true} />
					<EntradaTexto label="Fecha de la visita *" name="fecha" value={datosFeedback.fecha} onChange={handleChange} type="date" error={errores.fecha} />
					<EntradaTexto label="Hora de la visita *" name="hora" value={datosFeedback.hora} onChange={handleChange} type="time" error={errores.hora} />
					<EntradaTexto label="Número de personas en la vivienda" name="numeroPersonas" value={datosFeedback.numeroPersonas} onChange={handleChange} type="number" placeholder="Ej: 4" error={errores.numeroPersonas} />
					<EntradaTexto label="Número de decisores *" name="numeroDecisores" value={datosFeedback.numeroDecisores} onChange={handleChange} type="number" placeholder="Ej: 2" error={errores.numeroDecisores} />
					<EntradaRadio label="¿Tiene bombona?" name="tieneBombona" options={opcionesRadio} value={datosFeedback.tieneBombona} onChange={handleChange} error={errores.tieneBombona} />
					<EntradaRadio label="¿Tiene gas?" name="tieneGas" options={opcionesRadio} value={datosFeedback.tieneGas} onChange={handleChange} error={errores.tieneGas} />
					<EntradaRadio label="¿Tiene termo eléctrico?" name="tieneTermo" options={opcionesRadio} value={datosFeedback.tieneTermo} onChange={handleChange} error={errores.tieneTermo} />
					<EntradaRadio label="¿Tiene placas térmicas?" name="tienePlacas" options={opcionesRadio} value={datosFeedback.tienePlacas} onChange={handleChange} error={errores.tienePlacas} />
					<EntradaTexto label="Importe de recibo de luz (€)" name="importeLuz" value={datosFeedback.importeLuz} onChange={handleChange} type="number" placeholder="Ej: 45,50" error={errores.importeLuz} />
					<EntradaTexto label="Importe de recibo de gas (€)" name="importeGas" value={datosFeedback.importeGas} onChange={handleChange} type="number" placeholder="Ej: 30,00" error={errores.importeGas} />
					<EntradaSelect label="Resultado de la visita *" name="resultado" value={datosFeedback.resultado} onChange={handleChange} error={errores.resultado} options={[
						{ value: "Visitado_pdte_contestación", label: "Visitado pendiente de contestación" },
						{ value: "Visitado_no_hacen_nada", label: "Visitado pero no hacen nada" },
						{ value: "Recitar", label: "Volver a citar" },
						{ value: "No_visita", label: "No ha habido visita" },
						{ value: "Firmada_no_financiable", label: "Firmada y no financiable" },
						{ value: "Venta", label: "Venta" }
					]} />
					<EntradaTextoArea label="Oferta propuesta" name="oferta" value={datosFeedback.oferta} onChange={handleChange} type="text" placeholder="Ej: Oferta limitada" error={errores.oferta} />
					<EntradaTextoArea label="Observaciones" name="observaciones" value={datosFeedback.observaciones} onChange={handleChange} type="text" placeholder="Comenta alguna observación" error={errores.observaciones} />

					<button type="submit">Registrar Feedback</button>
				</form>
			</div>
		</div>
	)
} 