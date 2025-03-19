import { useEffect, useCallback } from "react";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form as BootstrapForm, Button } from 'react-bootstrap';
import Axios from "../axiosConfig";

const opcionesRadio = [
	{ value: "Si", label: "Sí" },
	{ value: "No", label: "No" },
	{ value: "Sin_datos", label: "Sin datos" }
];

const initialValues = {
	idTrabajador: '',
	idCliente: '',
	nombre: '',
	telefono: '',
	correo: '',
	direccion: '',
	localidad: '',
	provincia: '',
	fecha: '',
	hora: '',
	numeroPersonas: '',
	numeroDecisores: '',
	tieneBombona: "Sin_datos",
	tieneGas: "Sin_datos",
	tieneTermo: "Sin_datos",
	tienePlacas: "Sin_datos",
	importeLuz: '',
	importeGas: '',
	resultado: '',
	oferta: '',
	observaciones: '',
};

const validationSchema = Yup.object({
	idTrabajador: Yup.number().required('Este campo es obligatorio'),
	idCliente: Yup.number().required('Este campo es obligatorio'),
	fecha: Yup.string().required('Este campo es obligatorio'),
	hora: Yup.string().required('Este campo es obligatorio'),
	numeroPersonas: Yup.number().min(1, 'Debe ser al menos 1').required('Este campo es obligatorio'),
	numeroDecisores: Yup.number().min(1, 'Debe ser al menos 1').required('Este campo es obligatorio'),
	importeLuz: Yup.number().min(0, 'Debe ser mayor o igual a 0'),
	importeGas: Yup.number().min(0, 'Debe ser mayor o igual a 0'),
	resultado: Yup.string().required('Este campo es obligatorio'),
});

export default function FormularioFeedback() {
	useEffect(() => {
		document.title = "Formulario de Feedback";
	}, []);

	const navigate = useNavigate();

	const obtenerCliente = useCallback(async (idCliente, setFieldValue) => {
		if (!idCliente) return;

		try {
			const { data } = await Axios.get(`/recuperarCliente/${idCliente}`);
			if (data) {
				setFieldValue("nombre", data.nombre || "");
				setFieldValue("telefono", data.telefono || "");
				setFieldValue("correo", data.correo || "");
				setFieldValue("direccion", data.direccion || "");
				setFieldValue("localidad", data.localidad || "");
				setFieldValue("provincia", data.provincia || "");
			}
		} catch (error) {
			setFieldValue("nombre", "");
			setFieldValue("telefono", "");
			setFieldValue("correo", "");
			setFieldValue("direccion", "");
			setFieldValue("localidad", "");
			setFieldValue("provincia", "");
		}
	}, []);

	const onSubmit = async (values, { setSubmitting, resetForm }) => {
		try {
			const response = await Axios.post("/registrarFeedback", values);
			Swal.fire({
				icon: "success",
				title: `El código del feedback es: ${response.data.idVisita}`,
				text: "Feedback registrado correctamente",
				confirmButtonText: "Vale"
			}).then(() => navigate(-1));
			resetForm();
		} catch (error) {
			let mensajeError = "Hubo un problema con la solicitud. Inténtalo de nuevo";
			if (error.response) {
				mensajeError = error.response?.data?.error || mensajeError;
			} else if (error.message.includes("Network Error")) {
				mensajeError = "Error de conexión. Verifica tu internet";
			}
			Swal.fire({
				icon: "error",
				title: "Error",
				text: mensajeError,
				confirmButtonText: "Vale"
			});
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<Container fluid="md" className="feedback">
			<h1 className="text-center mb-4">Feedback de la Visita</h1>
			<Formik
				initialValues={initialValues}
				validationSchema={validationSchema}
				onSubmit={onSubmit}
			>
				{({ isSubmitting, setFieldValue, values }) => (
					<Form as={BootstrapForm} className="p-4 border rounded shadow-sm bg-light">
						<Row className="mb-3">
							<Col xs={12} md={6}>
								<BootstrapForm.Group>
									<BootstrapForm.Label>ID de Trabajador *</BootstrapForm.Label>
									<Field name="idTrabajador" type="number" className="form-control" />
									<ErrorMessage name="idTrabajador" component="div" className="text-danger" />
								</BootstrapForm.Group>
							</Col>
							<Col xs={12} md={6}>
								<BootstrapForm.Group>
									<BootstrapForm.Label>ID del Cliente *</BootstrapForm.Label>
									<Field
										name="idCliente"
										type="number"
										className="form-control"
										onChange={(e) => {
											const idCliente = e.target.value;
											setFieldValue("idCliente", idCliente);
											obtenerCliente(idCliente, setFieldValue);
										}}
									/>
									<ErrorMessage name="idCliente" component="div" className="text-danger" />
								</BootstrapForm.Group>
							</Col>
						</Row>

						<Row className="mb-3">
							<Col xs={12} md={6}>
								<BootstrapForm.Group>
									<BootstrapForm.Label>Nombre del Cliente</BootstrapForm.Label>
									<Field name="nombre" type="text" className="form-control" disabled value={values.nombre} />
								</BootstrapForm.Group>
							</Col>
							<Col xs={12} md={6}>
								<BootstrapForm.Group>
									<BootstrapForm.Label>Teléfono</BootstrapForm.Label>
									<Field name="telefono" type="tel" className="form-control" disabled value={values.telefono} />
								</BootstrapForm.Group>
							</Col>
						</Row>

						<Row className="mb-3">
							<Col xs={12} md={6}>
								<BootstrapForm.Group>
									<BootstrapForm.Label>Correo</BootstrapForm.Label>
									<Field name="correo" type="email" className="form-control" disabled value={values.correo} />
								</BootstrapForm.Group>
							</Col>
							<Col xs={12} md={6}>
								<BootstrapForm.Group>
									<BootstrapForm.Label>Dirección</BootstrapForm.Label>
									<Field name="direccion" type="text" className="form-control" disabled value={values.direccion} />
								</BootstrapForm.Group>
							</Col>
						</Row>

						<Row className="mb-3">
							<Col xs={12} md={6}>
								<BootstrapForm.Group>
									<BootstrapForm.Label>Localidad</BootstrapForm.Label>
									<Field name="localidad" type="text" className="form-control" disabled value={values.localidad} />
								</BootstrapForm.Group>
							</Col>
							<Col xs={12} md={6}>
								<BootstrapForm.Group>
									<BootstrapForm.Label>Provincia</BootstrapForm.Label>
									<Field name="provincia" type="text" className="form-control" disabled value={values.provincia} />
								</BootstrapForm.Group>
							</Col>
						</Row>

						<Row className="mb-3">
							<Col xs={12} md={6}>
								<BootstrapForm.Group>
									<BootstrapForm.Label>Fecha *</BootstrapForm.Label>
									<Field name="fecha" type="date" className="form-control" />
									<ErrorMessage name="fecha" component="div" className="text-danger" />
								</BootstrapForm.Group>
							</Col>
							<Col xs={12} md={6}>
								<BootstrapForm.Group>
									<BootstrapForm.Label>Hora *</BootstrapForm.Label>
									<Field name="hora" type="time" className="form-control" />
									<ErrorMessage name="hora" component="div" className="text-danger" />
								</BootstrapForm.Group>
							</Col>
						</Row>

						<Row className="mb-3">
							<Col xs={12} md={6}>
								<BootstrapForm.Group>
									<BootstrapForm.Label>Número de Personas</BootstrapForm.Label>
									<Field name="numeroPersonas" type="number" className="form-control" />
									<ErrorMessage name="numeroPersonas" component="div" className="text-danger" />
								</BootstrapForm.Group>
							</Col>
							<Col xs={12} md={6}>
								<BootstrapForm.Group>
									<BootstrapForm.Label>Número de Decisores *</BootstrapForm.Label>
									<Field name="numeroDecisores" type="number" className="form-control" />
									<ErrorMessage name="numeroDecisores" component="div" className="text-danger" />
								</BootstrapForm.Group>
							</Col>
						</Row>

						<Row className="mb-3">
							<Col xs={12} md={6}>
								<BootstrapForm.Group>
									<BootstrapForm.Label>Importe Luz</BootstrapForm.Label>
									<Field name="importeLuz" type="number" className="form-control" />
									<ErrorMessage name="importeLuz" component="div" className="text-danger" />
								</BootstrapForm.Group>
							</Col>
							<Col xs={12} md={6}>
								<BootstrapForm.Group>
									<BootstrapForm.Label>Importe Gas</BootstrapForm.Label>
									<Field name="importeGas" type="number" className="form-control" />
									<ErrorMessage name="importeGas" component="div" className="text-danger" />
								</BootstrapForm.Group>
							</Col>
						</Row>

						<Row className="mb-3">
							<Col xs={12} md={6}>
								<BootstrapForm.Group>
									<BootstrapForm.Label>Resultado *</BootstrapForm.Label>
									<Field as="select" name="resultado" className="form-control">
										<option value="">Seleccione una opción</option>
										<option value="Visitado_pdte_contestación">Visitado pendiente de contestación</option>
										<option value="Visitado_no_hacen_nada">Visitado pero no hacen nada</option>
										<option value="Recitar">Volver a citar</option>
										<option value="No_visita">No ha habido visita</option>
										<option value="Firmada_no_financiable">Firmada y no financiable</option>
										<option value="Venta">Venta</option>
									</Field>
									<ErrorMessage name="resultado" component="div" className="text-danger" />
								</BootstrapForm.Group>
							</Col>
							<Col xs={12} md={6}>
								<BootstrapForm.Group>
									<BootstrapForm.Label>Oferta *</BootstrapForm.Label>
									<Field name="oferta" type="text" className="form-control" />
									<ErrorMessage name="oferta" component="div" className="text-danger" />
								</BootstrapForm.Group>
							</Col>
						</Row>

						<Row className="mb-3">
							<Col xs={12} md={6}>
								<BootstrapForm.Group>
									<BootstrapForm.Label>¿Tiene bombona?</BootstrapForm.Label>
									<Field as="select" name="tieneBombona" className="form-control">
										{opcionesRadio.map(opcion => (
											<option key={opcion.value} value={opcion.value}>{opcion.label}</option>
										))}
									</Field>
									<ErrorMessage name="tieneBombona" component="div" className="text-danger" />
								</BootstrapForm.Group>
							</Col>
							<Col xs={12} md={6}>
								<BootstrapForm.Group>
									<BootstrapForm.Label>¿Tiene gas?</BootstrapForm.Label>
									<Field as="select" name="tieneGas" className="form-control">
										{opcionesRadio.map(opcion => (
											<option key={opcion.value} value={opcion.value}>{opcion.label}</option>
										))}
									</Field>
									<ErrorMessage name="tieneGas" component="div" className="text-danger" />
								</BootstrapForm.Group>
							</Col>
						</Row>

						<Row className="mb-3">
							<Col xs={12} md={6}>
								<BootstrapForm.Group>
									<BootstrapForm.Label>¿Tiene termo?</BootstrapForm.Label>
									<Field as="select" name="tieneTermo" className="form-control">
										{opcionesRadio.map(opcion => (
											<option key={opcion.value} value={opcion.value}>{opcion.label}</option>
										))}
									</Field>
									<ErrorMessage name="tieneTermo" component="div" className="text-danger" />
								</BootstrapForm.Group>
							</Col>
							<Col xs={12} md={6}>
								<BootstrapForm.Group>
									<BootstrapForm.Label>¿Tiene placas solares?</BootstrapForm.Label>
									<Field as="select" name="tienePlacas" className="form-control">
										{opcionesRadio.map(opcion => (
											<option key={opcion.value} value={opcion.value}>{opcion.label}</option>
										))}
									</Field>
									<ErrorMessage name="tienePlacas" component="div" className="text-danger" />
								</BootstrapForm.Group>
							</Col>
						</Row>

						<Row className="mb-3">
							<Col xs={12}>
								<BootstrapForm.Group>
									<BootstrapForm.Label>Observaciones</BootstrapForm.Label>
									<Field name="observaciones" as="textarea" className="form-control" rows="3" />
								</BootstrapForm.Group>
							</Col>
						</Row>

						<Button type="submit" variant="primary" disabled={isSubmitting}>Enviar</Button>
					</Form>
				)}
			</Formik>
		</Container>
	);
}