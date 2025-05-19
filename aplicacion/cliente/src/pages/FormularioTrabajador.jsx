import '../styles/Formularios.css';
import { useCallback, useMemo, useEffect, useState } from "react";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form as BootstrapForm, Button } from 'react-bootstrap';
import Axios from "../axiosConfig";
import useDocumentTitle from '../components/Titulo';
import { erroresSweetAlert2 } from '../utils/erroresSweetAlert2';
import CamposFormulario from '../components/CamposFormulario';

export default function FormularioTrabajador() {
    useDocumentTitle("Formulario de Trabajador");

    const navigate = useNavigate();

    const [coordinadores, setCoordinadores] = useState([]);

    const initialValues = useMemo(() => ({
        nombre: "", contrasena: "", telefono: "", puesto: "", departamento: "", equipo: "",
    }), []);

    const validationSchema = Yup.object({
        nombre: Yup.string().required("Este campo es obligatorio"),
        contrasena: Yup.string().required("Este campo es obligatorio"),
        telefono: Yup.string().matches(/^\d{9}$/, "El teléfono debe tener 9 dígitos").required("Este campo es obligatorio"),
        puesto: Yup.string().required("Este campo es obligatorio"),
        departamento: Yup.string().required("Este campo es obligatorio"),
        equipo: Yup.string(),
    });

    const onSubmit = useCallback(async (values, { setSubmitting, resetForm }) => {
        try {
            const response = await Axios.post("/trabajadores", values);
            Swal.fire({
                icon: "success",
                title: `El ID de trabajador de ${response.data.nombreTrabajador} es: ${response.data.idTrabajador}`,
                text: "Datos registrados correctamente",
                confirmButtonText: "OK"
            }).then(() => navigate("/administradores"));
            resetForm();
        } catch (error) {
            erroresSweetAlert2(error);
        } finally {
            setSubmitting(false);
        }
    }, [navigate]);

    useEffect(() => {
        const obtenerCoordinadores = async () => {
            try {
                const response = await Axios.get("/coordinadoresActivos");
                setCoordinadores(response.data);
            } catch (error) {
                console.error("Error al cargar coordinadores:", error);
                erroresSweetAlert2(error);
            }
        };

        obtenerCoordinadores();
    }, []);

    return (
        <Container fluid="md" className="trabajador">
            <h1 className="text-center mb-4">Registrar un Trabajador</h1>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit} >
                {({ errors, touched, isSubmitting, isValid }) => (
                    <Form as={BootstrapForm} className="p-4 border rounded shadow-sm bg-light">
                        <Row className="mb-3">
                            <Col xs={12} md={6}>
                                <CamposFormulario label="Nombre completo del trabajador *" name="nombre" type="text" placeholder="Ej: Carlos Martínez Gómez"
                                    tooltip="Introduce el nombre y apellidos del trabajador" errors={errors} touched={touched} />
                            </Col>
                            <Col xs={12} md={6}>
                                <CamposFormulario label="Contraseña para el trabajador *" name="contrasena" type="text"
                                    tooltip="Introduce la contraseña que tendrá el trabajador" errors={errors} touched={touched} />
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col xs={12} md={6}>
                                <CamposFormulario label="Teléfono del trabajador *" name="telefono" type="tel" placeholder="Ej: 600000000"
                                    tooltip="Introduce el número de teléfono del trabajador (9 dígitos)" errors={errors} touched={touched} />
                            </Col>
                            <Col xs={12} md={6}>
                                <CamposFormulario label="Puesto del trabajador *" name="puesto" as="select"
                                    tooltip="Selecciona el puesto que tendrá el trabajador" errors={errors} touched={touched} >
                                    <option value="">Selecciona una opción</option>
                                    <option value="Administrador">Administrador/a</option>
                                    <option value="Administrativo">Administrativo/a</option>
                                    <option value="Captador">Captador/a</option>
                                    <option value="CEO">CEO</option>
                                    <option value="Comercial">Comercial</option>
                                    <option value="Coordinador">Coordinador/a</option>
                                    <option value="Ingeniero">Ingeniero/a</option>
                                    <option value="Instalador">Instalador/a</option>
                                    <option value="Limpiador">Limpiador/a</option>
                                    <option value="Mozo_almacen">Mozo/a de almacén</option>
                                    <option value="RRHH">Recursos Humanos</option>
                                    <option value="Tramitador">Tramitador/a</option>
                                </CamposFormulario>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col xs={12} md={6}>
                                <CamposFormulario label="Departamento del trabajador *" name="departamento" as="select"
                                    tooltip="Selecciona el departamento al que pertenecerá el trabajador" errors={errors} touched={touched} >
                                    <option value="">Selecciona una opción</option>
                                    <option value="Administracion">Administración</option>
                                    <option value="Comercial">Comercial</option>
                                    <option value="Gerencia">Gerencia</option>
                                    <option value="Instalaciones">Instalaciones</option>
                                    <option value="Limpieza">Limpieza</option>
                                    <option value="RRHH">RRHH</option>
                                </CamposFormulario>
                            </Col>
                            <Col xs={12} md={6}>
                                <CamposFormulario label="Equipo del trabajador" name="equipo" as="select"
                                    tooltip="Selecciona el equipo al que pertenecerá el trabajador" errors={errors} touched={touched} >
                                    <option value="">-</option>
                                    {coordinadores.map(coord => (
                                        <option key={coord.id_trabajador} value={coord.nombre}>
                                            {coord.nombre}
                                        </option>
                                    ))}
                                </CamposFormulario>
                            </Col>
                        </Row>

                        <div className="d-flex justify-content-center">
                            <Button type="submit" className="mt-3" disabled={isSubmitting || !isValid} aria-label="Registrar trabajador" >
                                {isSubmitting ? "Enviando..." : "Registrar Trabajador"}
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Container>
    );
}
