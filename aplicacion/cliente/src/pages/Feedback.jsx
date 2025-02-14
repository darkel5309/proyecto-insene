import '../styles/Feedback.css';
import { useState, useEffect } from "react";
import Axios from "axios";
import { EntradaTexto, EntradaTextoArea, EntradaSelect } from '../components/CamposFormulario';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export default function Feedback() {
	useEffect(() => {
		document.title = "Feedback";
	}, []);

	const datosInicialesFeedback = {
		idTrabajador: 0,
		idVivienda: 0,
		fechaVisita: "",
		horaVisita: "",
		resultadoVisita: "",
		tipoVisita: "",
		oferta: "",
		observacionesVisita: ""
	};

	const [datosFeedback, setDatosFeedback] = useState(datosInicialesFeedback);
	const [errores, setErrores] = useState({});
	const redirigir = useNavigate();

	const validaciones = {
		idTrabajador: (valor) => (!valor || isNaN(valor) || valor <= 0) ? "Este campo es obligatorio y debe ser mayor a 0" : null,
		idVivienda: (valor) => (!valor || isNaN(valor) || valor <= 0) ? "Este campo es obligatorio y debe ser mayor a 0" : null,
		fechaVisita: (valor) => !valor ? "Este campo es obligatorio" : null,
		horaVisita: (valor) => !valor ? "Este campo es obligatorio" : null,
		resultadoVisita: (valor) => !valor ? "Este campo es obligatorio" : null,
		tipoVisita: (valor) => !valor ? "Este campo es obligatorio	" : null
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
		setDatosFeedback(prevState => ({
			...prevState,
			[name]: value
		}));
		validarCampo(name, value);
	};

	// comprobamos las validaciones
	const validar = () => {
		const nuevoError = {};
		Object.keys(validaciones).forEach(campo => {
			const error = validaciones[campo](datosFeedback[campo]);
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

					<EntradaTexto label="ID Trabajador *" name="idTrabajador" value={datosFeedback.idTrabajador} onChange={handleChange} type="number" placeholder="Ej: 1" error={errores.idTrabajador} />

					<EntradaTexto label="Código de la vivienda *" name="idVivienda" value={datosFeedback.idVivienda} onChange={handleChange} type="number" placeholder="Ej: 1" error={errores.idVivienda} />

					<EntradaTexto label="Fecha de la visita *" name="fechaVisita" value={datosFeedback.fechaVisita} onChange={handleChange} type="date" error={errores.fechaVisita} />

					<EntradaTexto label="Hora de la visita *" name="horaVisita" value={datosFeedback.horaVisita} onChange={handleChange} type="time" error={errores.horaVisita} />

					<EntradaSelect label="Resultado de la visita *" name="resultadoVisita" value={datosFeedback.resultadoVisita} onChange={handleChange} error={errores.resultadoVisita} options={[
						{ value: "Visitado_pdte_contestación", label: "Visitado pendiente de contestación" },
						{ value: "Visitado_no_hacen_nada", label: "Visitado pero no hacen nada" },
						{ value: "Recitar", label: "Volver a citar" },
						{ value: "No_visita", label: "No ha habido visita" },
						{ value: "Firmada_no_financiable", label: "Firmada y no financiable" },
						{ value: "Venta", label: "Venta" }
					]} />

					<EntradaSelect label="Tipo de la visita *" name="tipoVisita" value={datosFeedback.tipoVisita} onChange={handleChange} error={errores.tipoVisita} options={[
						{ value: "Corta", label: "Visita de 1 hora (Corta)" },
						{ value: "Media", label: "Visita de 2 horas (Media)" },
						{ value: "Larga", label: "Visita de 3 horas (Larga)" }
					]} />

					<EntradaTextoArea label="Oferta propuesta" name="oferta" value={datosFeedback.oferta} onChange={handleChange} type="text" placeholder="Ej: Oferta limitada" error={errores.oferta} />

					<EntradaTextoArea label="Observaciones" name="observacionesVisita" value={datosFeedback.observacionesVisita} onChange={handleChange} type="text" placeholder="Comenta alguna observación" error={errores.observacionesVisita} />

					<button type="submit">Registrar Feedback</button>
				</form>
			</div>
		</div>
	)
} 