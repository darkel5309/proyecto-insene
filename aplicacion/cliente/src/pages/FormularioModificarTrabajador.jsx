import '../styles/Formularios.css';
import { useEffect, useMemo, useState, useCallback } from "react";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Row, Col, Form as BootstrapForm, Button } from 'react-bootstrap';
import Axios from "../axiosConfig";

export default function ModificarTrabajador() {
    useEffect(() => {
        document.title = "Modificación Trabajador";
    }, []);

    const { id_trabajador } = useParams();
    const [trabajador, setTrabajador] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const obtenerTrabajador = async () => {
            const { data } = await Axios.get(`/trabajadores/${id_trabajador}`);
            setTrabajador(data);
        };

        obtenerTrabajador();
    }, [id_trabajador]);

    const validationSchema = useMemo(() => Yup.object({
        nombre: Yup.string().required("Este campo es obligatorio"),
        contrasena: Yup.string().optional(),
        telefono: Yup.string().matches(/^\d{9}$/, "El teléfono debe tener 9 dígitos").required("Este campo es obligatorio"),
        rol: Yup.string().required("Este campo es obligatorio"),
        equipo: Yup.string().required("Este campo es obligatorio"),
        subequipo: Yup.string().required("Este campo es obligatorio"),
    }), []);

    const onSubmit = useCallback(async (values, { setSubmitting }) => {
        try {
            const trabajadorActualizado = {
                nombre: values.nombre,
                telefono: values.telefono,
                rol: values.rol,
                equipo: values.equipo,
                subequipo: values.subequipo,
            };

            if (values.contrasena) {
                trabajadorActualizado.contrasena = values.contrasena;
            }

            await Axios.put(`/trabajadores/${id_trabajador}`, trabajadorActualizado);
            Swal.fire({
                icon: "success",
                title: "Trabajador actualizado correctamente",
                confirmButtonText: "Vale",
            }).then(() => navigate("/administradores"));
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Ocurrió un error inesperado. Inténtalo de nuevo",
                confirmButtonText: "Vale",
            });
        } finally {
            setSubmitting(false);
        }
    }, []);

    return (
        <Container fluid="md" className="trabajador">
            <h1 className="text-center mb-4">Modificar Trabajador</h1>
            <Formik initialValues={{
                    nombre: trabajador.nombre || "",
                    telefono: trabajador.telefono || "",
                    rol: trabajador.rol || "",
                    equipo: trabajador.equipo || "",
                    subequipo: trabajador.subequipo || "",
                    contrasena: "",
                }} validationSchema={validationSchema} onSubmit={onSubmit} enableReinitialize
            >
                {({ errors, touched, isSubmitting }) => (
                    <Form as={BootstrapForm} className="p-4 border rounded shadow-sm bg-light">
                        <Row className="mb-3">
                            <Col xs={12} md={6}>
                                <BootstrapForm.Group>
                                    <BootstrapForm.Label>Nombre modificado</BootstrapForm.Label>
                                    <Field name="nombre" type="text" className={`form-control ${errors.nombre && touched.nombre ? "is-invalid" : ""}`} placeholder="Ej: Carlos Martínez Gómez" />
                                    <ErrorMessage name="nombre" component="div" className="text-danger" />
                                </BootstrapForm.Group>
                            </Col>
                            <Col xs={12} md={6}>
                                <BootstrapForm.Group>
                                    <BootstrapForm.Label>Contraseña modificada</BootstrapForm.Label>
                                    <Field name="contrasena" type="text" className={`form-control ${errors.contrasena && touched.contrasena ? "is-invalid" : ""}`} />
                                    <ErrorMessage name="contrasena" component="div" className="text-danger" />
                                </BootstrapForm.Group>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col xs={12} md={6}>
                                <BootstrapForm.Group>
                                    <BootstrapForm.Label>Teléfono modificado</BootstrapForm.Label>
                                    <Field name="telefono" type="tel" className={`form-control ${errors.telefono && touched.telefono ? "is-invalid" : ""}`} placeholder="Ej: 666555444" />
                                    <ErrorMessage name="telefono" component="div" className="text-danger" />
                                </BootstrapForm.Group>
                            </Col>
                            <Col xs={12} md={6}>
                                <BootstrapForm.Group>
                                    <BootstrapForm.Label>Equipo modificado</BootstrapForm.Label>
                                    <Field name="equipo" type="text" className={`form-control ${errors.equipo && touched.equipo ? "is-invalid" : ""}`} placeholder="Ej: Comercial" />
                                    <ErrorMessage name="equipo" component="div" className="text-danger" />
                                </BootstrapForm.Group>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col xs={12} md={6}>
                                <BootstrapForm.Group>
                                    <BootstrapForm.Label>Subequipo modificado</BootstrapForm.Label>
                                    <Field name="subequipo" type="text" className={`form-control ${errors.subequipo && touched.subequipo ? "is-invalid" : ""}`} placeholder="Ej: Telemarketing" />
                                    <ErrorMessage name="subequipo" component="div" className="text-danger" />
                                </BootstrapForm.Group>
                            </Col>
                            <Col xs={12} md={6}>
                                <BootstrapForm.Group>
                                    <BootstrapForm.Label>Rol modificado</BootstrapForm.Label>
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
                                {isSubmitting ? "Registrando..." : "Modificar Trabajador"}
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Container>
    );
}
