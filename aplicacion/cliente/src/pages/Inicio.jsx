import '../styles/Formularios.css';
import { useEffect, useMemo, useCallback } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form as BootstrapForm, Button } from 'react-bootstrap';
import { useContext } from 'react';
import { AuthContext } from "../context/AuthProvider";
import Axios from "../axiosConfig";

export default function Inicio() {
    const redirigir = useNavigate();

    const initialValues = { idTrabajador: '', contrasena: '' };

    const validationSchema = useMemo(() => Yup.object({
        idTrabajador: Yup.number().integer().required("Este campo es obligatorio").min(1, "El ID no es válido"),
        contrasena: Yup.string().required("Este campo es obligatorio"),
    }), []);

    const { iniciarSesion: iniciarSesionContext } = useContext(AuthContext);

    useEffect(() => {
        document.title = "Inicio de Sesión";
    }, []);

    const onSubmit = useCallback(async (values, { setSubmitting, resetForm }) => {
        try {
            const response = await Axios.post("/iniciarSesion", values, { withCredentials: true });

            iniciarSesionContext(response.data);
            resetForm();

            const tipoTrabajador = response.data.tipoTrabajador;

            if (tipoTrabajador === 'Captador') {
                redirigir('/captadores');
            } else if (tipoTrabajador === 'Comercial') {
                redirigir('/comerciales');
            } else if (tipoTrabajador === 'Administrador') {
                redirigir('/administradores');
            }
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
        <Container fluid="md" className="inicioSesion">
            <h1 className="text-center mb-4">Inicio de Sesión</h1>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit} >
                {({ isSubmitting, errors, touched }) => (
                    <Form as={BootstrapForm} className="p-4 border rounded shadow-sm bg-light">

                        <Row className="mb-3">
                            <Col xs={12} md={6}>
                                <BootstrapForm.Group>
                                    <BootstrapForm.Label>ID de Trabajador *</BootstrapForm.Label>
                                    <Field name="idTrabajador" type="number" className={`form-control ${errors.idTrabajador && touched.idTrabajador ? "is-invalid" : ""}`} placeholder="Ej: 4" />
                                    <ErrorMessage name="idTrabajador" component="div" className="text-danger" />
                                </BootstrapForm.Group>
                            </Col>
                            <Col xs={12} md={6}>
                                <BootstrapForm.Group>
                                    <BootstrapForm.Label>Contraseña *</BootstrapForm.Label>
                                    <Field name="contrasena" type="password" className={`form-control ${errors.contrasena && touched.contrasena ? "is-invalid" : ""}`} placeholder="Introduce tu contraseña" />
                                    <ErrorMessage name="contrasena" component="div" className="text-danger" />
                                </BootstrapForm.Group>
                            </Col>
                        </Row>

                        <div className="d-flex justify-content-center">
                            <Button type="submit" className="mt-3" disabled={isSubmitting}>
                                {isSubmitting ? "Cargando..." : "Iniciar Sesión"}
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Container>
    );
}
