import { useEffect } from "react";
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

    const initialValues = {
        idTrabajador: '',
        nombre: '',
        telefono: '',
        correo: '',
        modoCaptacion: '',
        observaciones: '',
        direccion: '',
        localidad: '',
        provincia: '',
    };

    const validationSchema = Yup.object({
        idTrabajador: Yup.number().integer().required('Este campo es obligatorio'),
        nombre: Yup.string().required('Este campo es obligatorio'),
        telefono: Yup.string().matches(/^\d{9}$/, 'El teléfono debe tener 9 dígitos').required('Este campo es obligatorio'),
        correo: Yup.string().email('El correo no es válido').required('Este campo es obligatorio'),
        modoCaptacion: Yup.string().required('Este campo es obligatorio'),
        direccion: Yup.string().required('Este campo es obligatorio'),
        localidad: Yup.string().required('Este campo es obligatorio'),
        provincia: Yup.string().required('Este campo es obligatorio'),
    });

    const onSubmit = (values, { setSubmitting, resetForm }) => {
        Axios.post("/registrarCliente", values)
            .then((response) => {
                Swal.fire({
                    icon: "success",
                    title: `Cliente nº ${response.data.idCliente} registrado`,
                    text: "Datos registrados correctamente",
                    confirmButtonText: "Vale"
                }).then(() => redirigir(-1));
                resetForm();
            })
            .catch((error) => {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: error.response?.data?.error || "Hubo un problema con la solicitud",
                    confirmButtonText: "Vale"
                });
            })
            .finally(() => setSubmitting(false));
    };

    return (
        <Container fluid="md" className="contacto">
            <h1 className="text-center mb-4">Formulario de Contactos</h1>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                {({ isSubmitting }) => (
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
                                    <BootstrapForm.Label>Nombre completo del cliente *</BootstrapForm.Label>
                                    <Field name="nombre" type="text" className="form-control" />
                                    <ErrorMessage name="nombre" component="div" className="text-danger" />
                                </BootstrapForm.Group>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col xs={12} md={6}>
                                <BootstrapForm.Group>
                                    <BootstrapForm.Label>Dirección *</BootstrapForm.Label>
                                    <Field name="direccion" type="text" className="form-control" />
                                    <ErrorMessage name="direccion" component="div" className="text-danger" />
                                </BootstrapForm.Group>
                            </Col>
                            <Col xs={12} md={6}>
                                <BootstrapForm.Group>
                                    <BootstrapForm.Label>Localidad *</BootstrapForm.Label>
                                    <Field name="localidad" type="text" className="form-control" />
                                    <ErrorMessage name="localidad" component="div" className="text-danger" />
                                </BootstrapForm.Group>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col xs={12} md={6}>
                                <BootstrapForm.Group>
                                    <BootstrapForm.Label>Provincia *</BootstrapForm.Label>
                                    <Field name="provincia" type="text" className="form-control" />
                                    <ErrorMessage name="provincia" component="div" className="text-danger" />
                                </BootstrapForm.Group>
                            </Col>
                            <Col xs={12} md={6}>
                                <BootstrapForm.Group>
                                    <BootstrapForm.Label>Teléfono *</BootstrapForm.Label>
                                    <Field name="telefono" type="tel" className="form-control" />
                                    <ErrorMessage name="telefono" component="div" className="text-danger" />
                                </BootstrapForm.Group>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col xs={12} md={6}>
                                <BootstrapForm.Group>
                                    <BootstrapForm.Label>Correo *</BootstrapForm.Label>
                                    <Field name="correo" type="email" className="form-control" />
                                    <ErrorMessage name="correo" component="div" className="text-danger" />
                                </BootstrapForm.Group>
                            </Col>
                            <Col xs={12} md={6}>
                                <BootstrapForm.Group>
                                    <BootstrapForm.Label>Modo de captación *</BootstrapForm.Label>
                                    <Field as="select" name="modoCaptacion" className="form-control">
                                        <option value="">Selecciona una opción</option>
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
                                    <Field name="observaciones" as="textarea" className="form-control" placeholder="Comenta alguna observación" />
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
