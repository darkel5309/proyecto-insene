import '../styles/Formularios.css';
import { useMemo, useCallback } from "react";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Row, Col, Form as BootstrapForm, Button } from 'react-bootstrap';
import Axios from "../axiosConfig";
import useDocumentTitle from '../components/Titulo';
import { erroresSweetAlert2 } from '../utils/erroresSweetAlert2';
import CamposFormulario from '../components/CamposFormulario';
import { useDatosTrabajador } from '../hooks/useDatosTrabajador';

export default function ModificarTrabajador() {
    useDocumentTitle("Modificación de Trabajador");

    const { id } = useParams();
    const trabajador = useDatosTrabajador(id);
    const navigate = useNavigate();

    const initialValues = useMemo(() => ({
        nombre: trabajador.nombre || "", contrasena: "", telefono: trabajador.telefono || "", rol: trabajador.rol || "",
        equipo: trabajador.equipo || "", subequipo: trabajador.subequipo || "",
    }), [trabajador]);

    const validationSchema = Yup.object({
        nombre: Yup.string().required("Este campo es obligatorio"),
        contrasena: Yup.string().optional(),
        telefono: Yup.string().matches(/^\d{9}$/, "El teléfono debe tener 9 dígitos").required("Este campo es obligatorio"),
        rol: Yup.string().required("Este campo es obligatorio"),
        equipo: Yup.string().required("Este campo es obligatorio"),
        subequipo: Yup.string().required("Este campo es obligatorio"),
    });

    const onSubmit = useCallback(async (values, { setSubmitting }) => {
        try {
            const trabajadorActualizado = { ...values };
            if (!values.contrasena) delete trabajadorActualizado.contrasena;

            await Axios.put(`/trabajadores/${id}`, trabajadorActualizado);
            Swal.fire({
                icon: "success",
                title: "Trabajador actualizado correctamente",
                confirmButtonText: "Vale",
            }).then(() => navigate("/administradores"));
        } catch (error) {
            erroresSweetAlert2(error);
        } finally {
            setSubmitting(false);
        }
    }, [id, navigate]);

    const onDelete = useCallback(async () => {
        try {
            const confirmDelete = await Swal.fire({
                title: "¿Estás seguro de que deseas eliminar este trabajador?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, eliminar",
                cancelButtonText: "Cancelar",
            });

            if (confirmDelete.isConfirmed) {
                await Axios.delete(`/trabajadores/${id}`);
                Swal.fire({
                    icon: "success",
                    title: "Trabajador eliminado correctamente",
                    confirmButtonText: "Vale",
                }).then(() => navigate("/administradores"));
            }
        } catch (error) {
            erroresSweetAlert2(error);
        }
    }, [id, navigate]);

    return (
        <Container fluid="md" className="trabajador">
            <h1 className="text-center mb-4">Modificar Trabajador</h1>
            <Formik initialValues={{ ...initialValues, ...trabajador, contrasena: "", }}
                validationSchema={validationSchema} onSubmit={onSubmit} enableReinitialize >
                {({ errors, touched, isSubmitting, isValid }) => (
                    <Form as={BootstrapForm} className="p-4 border rounded shadow-sm bg-light">
                        <Row className="mb-3">
                            <Col xs={12} md={6}>
                                <CamposFormulario label="Nuevo nombre del trabajador *" name="nombre" type="text" placeholder="Ej: Carlos Martínez Gómez"
                                    tooltip="Introduce el nuevo nombre y apellidos del trabajador" errors={errors} touched={touched} />
                            </Col>
                            <Col xs={12} md={6}>
                                <CamposFormulario label="Nueva contraseña para el trabajador" name="contrasena" type="text"
                                    tooltip="Introduce la nueva contraseña que tendrá el trabajador" errors={errors} touched={touched} />
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col xs={12} md={6}>
                                <CamposFormulario label="Nuevo teléfono del trabajador *" name="telefono" type="tel" placeholder="Ej: 600000000"
                                    tooltip="Introduce el nuevo número de teléfono del trabajador (9 dígitos)" errors={errors} touched={touched} />
                            </Col>
                            <Col xs={12} md={6}>
                                <CamposFormulario label="Nuevo equipo del trabajador *" name="equipo" type="text" placeholder="Ej: Equipo 1"
                                    tooltip="Introduce el nuevo equipo al que pertenecerá el trabajador" errors={errors} touched={touched} />
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col xs={12} md={6}>
                                <CamposFormulario label="Nuevo subequipo del trabajador *" name="subequipo" type="text" placeholder="Ej: Subequipo 1"
                                    tooltip="Introduce el nuevo subequipo al que pertenecerá el trabajador" errors={errors} touched={touched} />
                            </Col>
                            <Col xs={12} md={6}>
                                <CamposFormulario label="Nuevo rol para el trabajador *" name="rol" as="select"
                                    tooltip="Selecciona el nuevo rol que tendrá el trabajador" errors={errors} touched={touched} >
                                    <option value="">Selecciona una opción</option>
                                    <option value="Administrador">Administrador</option>
                                    <option value="Captador">Captador</option>
                                    <option value="Comercial">Comercial</option>
                                    <option value="Coordinador">Coordinador</option>
                                    <option value="Instalador">Instalador</option>
                                    <option value="Recursos_Humanos">Recursos Humanos</option>
                                    <option value="Tramitador">Tramitador</option>
                                </CamposFormulario>
                            </Col>
                        </Row>

                        <div className="d-flex justify-content-center">
                            <Button type="submit" className="mt-3" disabled={isSubmitting || !isValid} aria-label="Modificar trabajador" >
                                {isSubmitting ? "Modificando..." : "Modificar trabajador"}
                            </Button>
                        </div>

                        <div className="d-flex justify-content-center mt-3">
                            <Button variant="danger" onClick={onDelete} className="mt-3" aria-label="Eliminar trabajador" >
                                Eliminar Trabajador
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Container>
    );
}
