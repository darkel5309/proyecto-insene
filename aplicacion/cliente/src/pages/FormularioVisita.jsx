import '../styles/FormularioVisita.css';
import { useEffect, useCallback, useMemo } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form as BootstrapForm, Button } from 'react-bootstrap';
import Axios from "../axiosConfig";

export default function FormularioVisita() {
    useEffect(() => {
        document.title = "Formulario de Visitas";
    }, []);

    const opcionesRadio = [
        { value: "Si", label: "Sí" },
        { value: "No", label: "No" },
        { value: "Sin_datos", label: "Sin datos" }
    ];

    const initialValues = { idTrabajador: '', idCliente: '', nombre: '', telefono: '', correo: '', direccion: '', localidad: '', provincia: '', fecha: '', hora: '', numeroPersonas: '', numeroDecisores: '', tieneBombona: "Sin_datos", tieneGas: "Sin_datos", tieneTermo: "Sin_datos", tienePlacas: "Sin_datos", importeLuz: '', importeGas: '' };

    const validationSchema = useMemo(() => Yup.object({
        idTrabajador: Yup.number().integer().required('Este campo es obligatorio').min(1, 'El ID no es válido'),
        idCliente: Yup.number().integer().required('Este campo es obligatorio').min(1, 'El ID no es válido'),
        fecha: Yup.string().required('Este campo es obligatorio'),
        hora: Yup.string().required('Este campo es obligatorio'),
        numeroPersonas: Yup.number().min(1, 'Debe ser mayor a 0'),
        numeroDecisores: Yup.number().min(1, 'Debe ser mayor a 0').required('Este campo es obligatorio'),
        importeLuz: Yup.number().min(0, 'Debe ser mayor o igual a 0'),
        importeGas: Yup.number().min(0, 'Debe ser mayor o igual a 0')
    }), []);

    const redirigir = useNavigate();

    const obtenerCliente = useCallback(async (idCliente, setFieldValue) => {
        if (!idCliente) return;

        const campos = ["nombre", "telefono", "correo", "direccion", "localidad", "provincia"];

        try {
            const { data } = await Axios.get(`/recuperarCliente/${idCliente}`);
            campos.forEach(campo => setFieldValue(campo, data[campo] || ""));
        } catch (error) {
            campos.forEach(campo => setFieldValue(campo, ""));
        }
    }, []);

    const onSubmit = useCallback(async (values, { setSubmitting, resetForm }) => {
        if (values.importeLuz === '') values.importeLuz = 0;
        if (values.importeGas === '') values.importeGas = 0;

        try {
            const response = await Axios.post("/registrarVisita", values);

            Swal.fire({
                icon: "success",
                title: `El código del feedback es: ${response.data.idVisita}`,
                text: "Feedback registrado correctamente",
                confirmButtonText: "Vale"
            }).then(() => redirigir(-1));

            resetForm();
        } catch (error) {
            if (error.response) {
                const mensajeError = error.response?.data?.error || "Hubo un problema con la solicitud. Inténtalo de nuevo.";
                Swal.fire({
                    icon: "warning",
                    title: "Error",
                    text: mensajeError,
                    confirmButtonText: "Vale"
                });
            } else if (error.message.includes("Network Error") || error.message.includes("ERR_CONNECTION_REFUSED")) {
                Swal.fire({
                    icon: "question",
                    title: "Error de Conexión",
                    text: "Verifica tu conexión a internet e inténtalo de nuevo",
                    confirmButtonText: "Vale"
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Ocurrió un error inesperado. Inténtalo de nuevo",
                    confirmButtonText: "Vale"
                });
            }
        } finally {
            setSubmitting(false);
        }
    }, []);

    return (
        <Container fluid="md" className="visita">
            <h1 className="text-center mb-4">Formulario de Visitas</h1>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                {({ errors, touched, isSubmitting, setFieldValue, values }) => (
                    <Form as={BootstrapForm} className="p-4 border rounded shadow-sm bg-light">
                        <Row className="mb-3">
                            <Col xs={12} md={6}>
                                <BootstrapForm.Group>
                                    <BootstrapForm.Label>ID de Trabajador *</BootstrapForm.Label>
                                    <Field name="idTrabajador" type="number" className={`form-control ${errors.idTrabajador && touched.idTrabajador ? "is-invalid" : ""}`} placeholder="Ej: 5" />
                                    <ErrorMessage name="idTrabajador" component="div" className="text-danger" />
                                </BootstrapForm.Group>
                            </Col>
                            <Col xs={12} md={6}>
                                <BootstrapForm.Group>
                                    <BootstrapForm.Label>ID del Cliente *</BootstrapForm.Label>
                                    <Field
                                        name="idCliente" type="number" className={`form-control ${errors.idCliente && touched.idCliente ? "is-invalid" : ""}`} placeholder="Ej: 2" onChange={(e) => {
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
                                    <Field name="fecha" type="date" className={`form-control ${errors.fecha && touched.fecha ? "is-invalid" : ""}`} />
                                    <ErrorMessage name="fecha" component="div" className="text-danger" />
                                </BootstrapForm.Group>
                            </Col>
                            <Col xs={12} md={6}>
                                <BootstrapForm.Group>
                                    <BootstrapForm.Label>Hora *</BootstrapForm.Label>
                                    <Field name="hora" type="time" className={`form-control ${errors.hora && touched.hora ? "is-invalid" : ""}`} />
                                    <ErrorMessage name="hora" component="div" className="text-danger" />
                                </BootstrapForm.Group>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col xs={12} md={6}>
                                <BootstrapForm.Group>
                                    <BootstrapForm.Label>Número de personas</BootstrapForm.Label>
                                    <Field name="numeroPersonas" type="number" className={`form-control ${errors.numeroPersonas && touched.numeroPersonas ? "is-invalid" : ""}`} placeholder="Ej: 4 " />
                                    <ErrorMessage name="numeroPersonas" component="div" className="text-danger" />
                                </BootstrapForm.Group>
                            </Col>
                            <Col xs={12} md={6}>
                                <BootstrapForm.Group>
                                    <BootstrapForm.Label>Número de decisores *</BootstrapForm.Label>
                                    <Field name="numeroDecisores" type="number" className={`form-control ${errors.numeroDecisores && touched.numeroDecisores ? "is-invalid" : ""}`} placeholder="Ej: 2"/>
                                    <ErrorMessage name="numeroDecisores" component="div" className="text-danger" />
                                </BootstrapForm.Group>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col xs={12} md={6}>
                                <BootstrapForm.Group>
                                    <BootstrapForm.Label>¿Tiene Bombona?</BootstrapForm.Label>
                                    <Field as="select" name="tieneBombona" className="form-control">
                                        {opcionesRadio.map((opcion) => (
                                            <option key={opcion.value} value={opcion.value}>
                                                {opcion.label}
                                            </option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="tieneBombona" component="div" className="text-danger" />
                                </BootstrapForm.Group>
                            </Col>
                            <Col xs={12} md={6}>
                                <BootstrapForm.Group>
                                    <BootstrapForm.Label>¿Tiene Gas?</BootstrapForm.Label>
                                    <Field as="select" name="tieneGas" className="form-control">
                                        {opcionesRadio.map((opcion) => (
                                            <option key={opcion.value} value={opcion.value}>
                                                {opcion.label}
                                            </option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="tieneGas" component="div" className="text-danger" />
                                </BootstrapForm.Group>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col xs={12} md={6}>
                                <BootstrapForm.Group>
                                    <BootstrapForm.Label>¿Tiene Termo Eléctrico?</BootstrapForm.Label>
                                    <Field as="select" name="tieneTermo" className="form-control">
                                        {opcionesRadio.map((opcion) => (
                                            <option key={opcion.value} value={opcion.value}>
                                                {opcion.label}
                                            </option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="tieneTermo" component="div" className="text-danger" />
                                </BootstrapForm.Group>
                            </Col>
                            <Col xs={12} md={6}>
                                <BootstrapForm.Group>
                                    <BootstrapForm.Label>¿Tiene Placas Térmicas?</BootstrapForm.Label>
                                    <Field as="select" name="tienePlacas" className="form-control">
                                        {opcionesRadio.map((opcion) => (
                                            <option key={opcion.value} value={opcion.value}>
                                                {opcion.label}
                                            </option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="tienePlacas" component="div" className="text-danger" />
                                </BootstrapForm.Group>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col xs={12} md={6}>
                                <BootstrapForm.Group>
                                    <BootstrapForm.Label>Importe Luz (€)</BootstrapForm.Label>
                                    <Field name="importeLuz" type="number" className="form-control" placeholder="Ej: 30,99" />
                                    <ErrorMessage name="importeLuz" component="div" className="text-danger" />
                                </BootstrapForm.Group>
                            </Col>
                            <Col xs={12} md={6}>
                                <BootstrapForm.Group>
                                    <BootstrapForm.Label>Importe Gas (€)</BootstrapForm.Label>
                                    <Field name="importeGas" type="number" className="form-control" placeholder="Ej: 20,99" />
                                    <ErrorMessage name="importeGas" component="div" className="text-danger" />
                                </BootstrapForm.Group>
                            </Col>
                        </Row>

                        <div className="d-flex justify-content-center">
                            <Button type="submit" className="mt-3" disabled={isSubmitting}>
                                {isSubmitting ? "Registrando..." : "Registrar Visita"}
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Container>
    );
}
