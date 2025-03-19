import { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form as BootstrapForm, Button } from 'react-bootstrap';

const initialValues = {
    nombre: "",
    contrasena: "",
    telefono: "",
    rol: "",
    equipo: "",
    subequipo: "",
};

const validationSchema = Yup.object({
    nombre: Yup.string().required("Este campo es obligatorio"),
    contrasena: Yup.string().required("Este campo es obligatorio"),
    telefono: Yup.string()
        .matches(/^\d{9}$/, "Debe tener 9 dígitos")
        .required("Este campo es obligatorio"),
    rol: Yup.string().required("Este campo es obligatorio"),
    equipo: Yup.string().required("Este campo es obligatorio"),
    subequipo: Yup.string().required("Este campo es obligatorio"),
});

export default function FormularioTrabajador() {
    useEffect(() => {
        document.title = "Formulario de trabajador";
    }, []);

    const navigate = useNavigate();

    const onSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const response = await Axios.post("/registrarTrabajador", values);
            Swal.fire({
                icon: "success",
                title: `El ID de trabajador de ${response.data.nombreTrabajador} es: ${response.data.idTrabajador}`,
                text: "Datos registrados correctamente",
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
        <Container fluid="md" className="trabajador">
            <h1 className="text-center mb-4">Registrar un Trabajador</h1>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                {({ isSubmitting }) => (
                    <Form as={BootstrapForm} className="p-4 border rounded shadow-sm bg-light">
                        {/* Nombre y Contraseña */}
                        <Row className="mb-3">
                            <Col xs={12} md={6}>
                                <BootstrapForm.Group>
                                    <BootstrapForm.Label>Nombre completo del trabajador *</BootstrapForm.Label>
                                    <Field name="nombre" type="text" className="form-control" placeholder="Ej: Carlos Martínez Gómez" />
                                    <ErrorMessage name="nombre" component="div" className="text-danger" />
                                </BootstrapForm.Group>
                            </Col>
                            <Col xs={12} md={6}>
                                <BootstrapForm.Group>
                                    <BootstrapForm.Label>Contraseña *</BootstrapForm.Label>
                                    <Field name="contrasena" type="password" className="form-control" placeholder="Ej: 3jjh48721&nsk" />
                                    <ErrorMessage name="contrasena" component="div" className="text-danger" />
                                </BootstrapForm.Group>
                            </Col>
                        </Row>

                        {/* Teléfono y Equipo */}
                        <Row className="mb-3">
                            <Col xs={12} md={6}>
                                <BootstrapForm.Group>
                                    <BootstrapForm.Label>Teléfono *</BootstrapForm.Label>
                                    <Field name="telefono" type="tel" className="form-control" placeholder="Ej: 666555444" />
                                    <ErrorMessage name="telefono" component="div" className="text-danger" />
                                </BootstrapForm.Group>
                            </Col>
                            <Col xs={12} md={6}>
                                <BootstrapForm.Group>
                                    <BootstrapForm.Label>Equipo *</BootstrapForm.Label>
                                    <Field name="equipo" type="text" className="form-control" placeholder="Ej: Comercial" />
                                    <ErrorMessage name="equipo" component="div" className="text-danger" />
                                </BootstrapForm.Group>
                            </Col>
                        </Row>

                        {/* Subequipo y Rol */}
                        <Row className="mb-3">
                            <Col xs={12} md={6}>
                                <BootstrapForm.Group>
                                    <BootstrapForm.Label>Subequipo *</BootstrapForm.Label>
                                    <Field name="subequipo" type="text" className="form-control" placeholder="Ej: Telemarketing" />
                                    <ErrorMessage name="subequipo" component="div" className="text-danger" />
                                </BootstrapForm.Group>
                            </Col>
                            <Col xs={12} md={6}>
                                <BootstrapForm.Group>
                                    <BootstrapForm.Label>Rol *</BootstrapForm.Label>
                                    <Field as="select" name="rol" className="form-control">
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
