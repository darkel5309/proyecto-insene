import '../styles/Formularios.css';
import { useEffect, useCallback, useMemo } from "react";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form as BootstrapForm, Button } from 'react-bootstrap';
import Axios from "../axiosConfig";

export default function FormularioCliente() {
    useEffect(() => {
        document.title = "Formulario de contactos";
    }, []);

    const redirigir = useNavigate();

    const initialValues = { idTrabajador: '', nombre: '', telefono: '', correo: '', modoCaptacion: '', observaciones: '', direccion: '', localidad: '', provincia: '', };

    const validationSchema = useMemo(() => Yup.object({
        idTrabajador: Yup.number().integer().required('Este campo es obligatorio'),
        nombre: Yup.string().required('Este campo es obligatorio'),
        telefono: Yup.string().matches(/^\d{9}$/, 'El teléfono debe tener 9 dígitos').required('Este campo es obligatorio'),
        correo: Yup.string().email('El correo no es válido').required('Este campo es obligatorio'),
        modoCaptacion: Yup.string().required('Este campo es obligatorio'),
        direccion: Yup.string().required('Este campo es obligatorio'),
        localidad: Yup.string().required('Este campo es obligatorio'),
        provincia: Yup.string().required('Este campo es obligatorio'),
    }), []);

    const onSubmit = useCallback(async (values, { setSubmitting, resetForm }) => {
        try {
            const response = await Axios.post("/registrarCliente", values);

            Swal.fire({
                icon: "success",
                title: `Cliente nº ${response.data.idCliente} registrado`,
                text: "Datos registrados correctamente",
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
        <Container fluid="md" className="contacto">
            <h1 className="text-center mb-4">Formulario de Contactos</h1>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit} >
                {({ errors, touched, isSubmitting }) => (
                    <Form as={BootstrapForm} className="p-4 border rounded shadow-sm bg-light">
                        <Row className="mb-3">
                            <Col xs={12} md={6}>
                                <BootstrapForm.Group>
                                    <BootstrapForm.Label>ID de Trabajador *</BootstrapForm.Label>
                                    <Field name="idTrabajador" type="number" className={`form-control ${errors.idTrabajador && touched.idTrabajador ? "is-invalid" : ""}`}  placeholder="Ej: 5" />
                                    <ErrorMessage name="idTrabajador" component="div" className="text-danger" />
                                </BootstrapForm.Group>
                            </Col>
                            <Col xs={12} md={6}>
                                <BootstrapForm.Group>
                                    <BootstrapForm.Label>Nombre completo del cliente *</BootstrapForm.Label>
                                    <Field name="nombre" type="text" className={`form-control ${errors.nombre && touched.nombre ? "is-invalid" : ""}`} placeholder="Ej: Gabriel Ruíz Fernández" />
                                    <ErrorMessage name="nombre" component="div" className="text-danger" />
                                </BootstrapForm.Group>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col xs={12} md={6}>
                                <BootstrapForm.Group>
                                    <BootstrapForm.Label>Dirección *</BootstrapForm.Label>
                                    <Field name="direccion" type="text" className={`form-control ${errors.direccion && touched.direccion ? "is-invalid" : ""}`} placeholder="Calle Sevilla, 44" />
                                    <ErrorMessage name="direccion" component="div" className="text-danger" />
                                </BootstrapForm.Group>
                            </Col>
                            <Col xs={12} md={6}>
                                <BootstrapForm.Group>
                                    <BootstrapForm.Label>Localidad *</BootstrapForm.Label>
                                    <Field name="localidad" type="text" className={`form-control ${errors.localidad && touched.localidad ? "is-invalid" : ""}`} placeholder="Ej: Mairena del Alcor" />
                                    <ErrorMessage name="localidad" component="div" className="text-danger" />
                                </BootstrapForm.Group>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col xs={12} md={6}>
                                <BootstrapForm.Group>
                                    <BootstrapForm.Label>Provincia *</BootstrapForm.Label>
                                    <Field name="provincia" type="text" className={`form-control ${errors.provincia && touched.provincia ? "is-invalid" : ""}`} placeholder="Ej: Sevilla" />
                                    <ErrorMessage name="provincia" component="div" className="text-danger" />
                                </BootstrapForm.Group>
                            </Col>
                            <Col xs={12} md={6}>
                                <BootstrapForm.Group>
                                    <BootstrapForm.Label>Teléfono *</BootstrapForm.Label>
                                    <Field name="telefono" type="tel" className={`form-control ${errors.telefono && touched.telefono ? "is-invalid" : ""}`} placeholder="Ej: 600000000" />
                                    <ErrorMessage name="telefono" component="div" className="text-danger" />
                                </BootstrapForm.Group>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col xs={12} md={6}>
                                <BootstrapForm.Group>
                                    <BootstrapForm.Label>Correo *</BootstrapForm.Label>
                                    <Field name="correo" type="email" className={`form-control ${errors.correo && touched.correo ? "is-invalid" : ""}`} placeholder="Ej: gabriel@gmail.com" />
                                    <ErrorMessage name="correo" component="div" className="text-danger" />
                                </BootstrapForm.Group>
                            </Col>
                            <Col xs={12} md={6}>
                                <BootstrapForm.Group>
                                    <BootstrapForm.Label>Modo de captación *</BootstrapForm.Label>
                                    <Field as="select" name="modoCaptacion" className={`form-control ${errors.modoCaptacion && touched.modoCaptacion ? "is-invalid" : ""}`} >
                                        <option value="">Selecciona una opción </option>
                                        <option value="Captador">Captador</option>
                                        <option value="Telemarketing">Telemarketing</option>
                                        <option value="Referido">Referido</option>
                                        <option value="Propia">Captación propia</option>
                                    </Field>
                                    <ErrorMessage name="modoCaptacion" component="div" className="text-danger" />
                                </BootstrapForm.Group>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col>
                                <BootstrapForm.Group>
                                    <BootstrapForm.Label>Observaciones</BootstrapForm.Label>
                                    <Field name="observaciones" as="textarea" className={`form-control ${errors.observaciones && touched.observaciones ? "is-invalid" : ""}`} placeholder="Comenta alguna observación" />
                                </BootstrapForm.Group>
                            </Col>
                        </Row>

                        <div className="d-flex justify-content-center">
                            <Button type="submit" className="mt-3" disabled={isSubmitting}>
                                {isSubmitting ? "Enviando..." : "Registrar Datos"}
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Container>
    );
}
