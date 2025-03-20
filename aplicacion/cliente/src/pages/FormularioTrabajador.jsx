import '../styles/FormularioTrabajador.css';
import { useEffect, useCallback, useMemo } from "react";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form as BootstrapForm, Button } from 'react-bootstrap';
import Axios from "../axiosConfig";

export default function FormularioTrabajador() {
    useEffect(() => {
        document.title = "Formulario de trabajador";
    }, []);

    const redirigir = useNavigate();

    const initialValues = { nombre: "", contrasena: "", telefono: "", rol: "", equipo: "", subequipo: "", };

    const validationSchema = useMemo(() => Yup.object({
        nombre: Yup.string().required("Este campo es obligatorio"),
        contrasena: Yup.string().required("Este campo es obligatorio"),
        telefono: Yup.string().matches(/^\d{9}$/, "El teléfono debe tener 9 dígitos").required("Este campo es obligatorio"),
        rol: Yup.string().required("Este campo es obligatorio"),
        equipo: Yup.string().required("Este campo es obligatorio"),
        subequipo: Yup.string().required("Este campo es obligatorio"),
    }), []);


    const onSubmit = useCallback(async (values, { setSubmitting, resetForm }) => {
        try {
            const response = await Axios.post("/registrarTrabajador", values);
            Swal.fire({
                icon: "success",
                title: `El ID de trabajador de ${response.data.nombreTrabajador} es: ${response.data.idTrabajador}`,
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
        <Container fluid="md" className="trabajador">
            <h1 className="text-center mb-4">Registrar un Trabajador</h1>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit} >
                {({ errors, touched, isSubmitting }) => (
                    <Form as={BootstrapForm} className="p-4 border rounded shadow-sm bg-light">
                        <Row className="mb-3">
                            <Col xs={12} md={6}>
                                <BootstrapForm.Group>
                                    <BootstrapForm.Label>Nombre completo del trabajador *</BootstrapForm.Label>
                                    <Field name="nombre" type="text" className={`form-control ${errors.nombre && touched.nombre ? "is-invalid" : ""}`} placeholder="Ej: Carlos Martínez Gómez" />
                                    <ErrorMessage name="nombre" component="div" className="text-danger" />
                                </BootstrapForm.Group>
                            </Col>
                            <Col xs={12} md={6}>
                                <BootstrapForm.Group>
                                    <BootstrapForm.Label>Contraseña *</BootstrapForm.Label>
                                    <Field name="contrasena" type="password" className={`form-control ${errors.contrasena && touched.contrasena ? "is-invalid" : ""}`} placeholder="Ej: 3jjh48721&nsk" />
                                    <ErrorMessage name="contrasena" component="div" className="text-danger" />
                                </BootstrapForm.Group>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col xs={12} md={6}>
                                <BootstrapForm.Group>
                                    <BootstrapForm.Label>Teléfono *</BootstrapForm.Label>
                                    <Field name="telefono" type="tel" className={`form-control ${errors.telefono && touched.telefono ? "is-invalid" : ""}`} placeholder="Ej: 666555444" />
                                    <ErrorMessage name="telefono" component="div" className="text-danger" />
                                </BootstrapForm.Group>
                            </Col>
                            <Col xs={12} md={6}>
                                <BootstrapForm.Group>
                                    <BootstrapForm.Label>Equipo *</BootstrapForm.Label>
                                    <Field name="equipo" type="text" className={`form-control ${errors.equipo && touched.equipo ? "is-invalid" : ""}`} placeholder="Ej: Comercial" />
                                    <ErrorMessage name="equipo" component="div" className="text-danger" />
                                </BootstrapForm.Group>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col xs={12} md={6}>
                                <BootstrapForm.Group>
                                    <BootstrapForm.Label>Subequipo *</BootstrapForm.Label>
                                    <Field name="subequipo" type="text" className={`form-control ${errors.subequipo && touched.subequipo ? "is-invalid" : ""}`} placeholder="Ej: Telemarketing" />
                                    <ErrorMessage name="subequipo" component="div" className="text-danger" />
                                </BootstrapForm.Group>
                            </Col>
                            <Col xs={12} md={6}>
                                <BootstrapForm.Group>
                                    <BootstrapForm.Label>Rol *</BootstrapForm.Label>
                                    <Field as="select" name="rol" className={`form-control ${errors.rol && touched.rol ? "is-invalid" : ""}`} >
                                        <option value="">Seleccione un rol</option>
                                        <option value="Administrador">Administrador</option>
                                        <option value="Captador">Captador</option>
                                        <option value="Comercial">Comercial</option>
                                        <option value="Coordinador">Coordinador</option>
                                        <option value="Instalador">Instalador</option>
                                        <option value="Recursos_Humanos">Recursos Humanos</option>
                                        <option value="Tramitador">Tramitador</option>
                                    </Field>
                                    <ErrorMessage name="rol" component="div" className="text-danger" />
                                </BootstrapForm.Group>
                            </Col>
                        </Row>

                        <div className="d-flex justify-content-center">
                            <Button type="submit" className="mt-3" disabled={isSubmitting}>
                                {isSubmitting ? "Registrando..." : "Registrar Trabajador"}
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Container>
    );
}
