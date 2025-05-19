import '../styles/Formularios.css';
import { useMemo, useCallback, useEffect, useState } from "react";
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
import dayjs from 'dayjs';

export default function ModificarTrabajador() {
    useDocumentTitle("Modificación de Trabajador");

    const { id } = useParams();
    const { trabajador, cargando } = useDatosTrabajador(id);
    const navigate = useNavigate();
    const [coordinadores, setCoordinadores] = useState([]);

    const formatFechaDatetimeLocal = (fecha) => fecha ? dayjs(fecha).format('YYYY-MM-DDTHH:mm') : "";

    useEffect(() => {
        const obtenerCoordinadores = async () => {
            try {
                const response = await Axios.get("/coordinadoresActivos");
                setCoordinadores(response.data);
            } catch (error) {
                erroresSweetAlert2(error);
            }
        };
        obtenerCoordinadores();
    }, []);

    const initialValues = useMemo(() => ({
        nombre: trabajador?.nombre || "", contrasena: "", telefono: trabajador?.telefono || "", puesto: trabajador?.puesto || "",
        departamento: trabajador?.departamento || "", equipo: trabajador?.equipo || "", fechaAlta: formatFechaDatetimeLocal(trabajador?.fecha_alta),
        fechaBaja: formatFechaDatetimeLocal(trabajador?.fecha_baja)
    }), [trabajador]);

    const validationSchema = Yup.object({
        nombre: Yup.string().required("Este campo es obligatorio"),
        contrasena: Yup.string().optional(),
        telefono: Yup.string().matches(/^\d{9}$/, "El teléfono debe tener 9 dígitos").required("Este campo es obligatorio"),
        puesto: Yup.string().required("Este campo es obligatorio"),
        departamento: Yup.string().required("Este campo es obligatorio"),
        equipo: Yup.string(),
        fechaAlta: Yup.date().required("Este campo es obligatorio"),
        fechaBaja: Yup.date().optional()
    });

    const onSubmit = useCallback(async (values, { setSubmitting }) => {
        try {
            const trabajadorActualizado = { ...values };
            if (!values.contrasena) delete trabajadorActualizado.contrasena;
            trabajadorActualizado.fechaBaja = values.fechaBaja || null;

            await Axios.put(`/trabajadores/${id}`, trabajadorActualizado);
            Swal.fire({
                icon: "success",
                title: "Trabajador actualizado correctamente",
                confirmButtonText: "OK"
            })
                .then(() => navigate("/administradores"));
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
                    confirmButtonText: "OK",
                }).then(() => navigate("/administradores"));
            }
        } catch (error) {
            erroresSweetAlert2(error);
        }
    }, [id, navigate]);

    if (cargando) {
        return <p className="text-center">Cargando datos del trabajador...</p>;
    }

    if (!trabajador) {
        return <p className="text-center">No se encontró el trabajador.</p>;
    }

    return (
        <Container fluid="md" className="trabajador">
            <h1 className="text-center mb-4">Modificar Trabajador</h1>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit} enableReinitialize >
                {({ errors, touched, isSubmitting, isValid }) => (
                    <Form as={BootstrapForm} className="p-4 border rounded shadow-sm bg-light">
                        <Row className="mb-3">
                            <Col xs={12} md={6}>
                                <CamposFormulario label="Nuevo nombre del trabajador *" name="nombre" type="text"
                                    tooltip="Introduce el nuevo nombre y apellidos del trabajador" errors={errors} touched={touched} />
                            </Col>
                            <Col xs={12} md={6}>
                                <CamposFormulario label="Nueva contraseña para el trabajador" name="contrasena" type="password"
                                    tooltip="Introduce la nueva contraseña que tendrá el trabajador" errors={errors} touched={touched} />
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col xs={12} md={6}>
                                <CamposFormulario label="Nuevo teléfono del trabajador *" name="telefono" type="tel"
                                    tooltip="Introduce el nuevo número de teléfono del trabajador" errors={errors} touched={touched} />
                            </Col>
                            <Col xs={12} md={6}>
                                <CamposFormulario label="Nuevo puesto para el trabajador *" name="puesto" as="select"
                                    tooltip="Selecciona el nuevo puesto que tendrá el trabajador" errors={errors} touched={touched} >
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
                                <CamposFormulario label="Nuevo departamento del trabajador *" name="departamento" as="select"
                                    tooltip="Selecciona el nuevo departamento al que pertenecerá el trabajador" errors={errors} touched={touched} >
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
                                <CamposFormulario label="Nuevo equipo del trabajador" name="equipo" as="select"
                                    tooltip="Selecciona el nuevo equipo al que pertenecerá el trabajador" errors={errors} touched={touched} >
                                    <option value="">-</option>
                                    {coordinadores.map(coord => (
                                        <option key={coord.id_trabajador} value={coord.nombre}>
                                            {coord.nombre}
                                        </option>
                                    ))}
                                </CamposFormulario>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col xs={12} md={6}>
                                <CamposFormulario label="Nueva fecha de alta *" name="fechaAlta" type="datetime-local"
                                    tooltip="Introduce la nueva fecha de alta del trabajador" errors={errors} touched={touched} />
                            </Col>
                            <Col xs={12} md={6}>
                                <CamposFormulario label="Nueva fecha de baja" name="fechaBaja" type="datetime-local"
                                    tooltip="Introduce la nueva fecha de baja del trabajador" errors={errors} touched={touched} />
                            </Col>
                        </Row>

                        <div className="d-flex justify-content-center">
                            <Button type="submit" className="mt-3" disabled={isSubmitting || !isValid}>
                                {isSubmitting ? "Modificando..." : "Modificar trabajador"}
                            </Button>
                        </div>

                        <div className="d-flex justify-content-center mt-3">
                            <Button variant="danger" onClick={onDelete} className="mt-3">
                                Eliminar Trabajador
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Container>
    );
}
