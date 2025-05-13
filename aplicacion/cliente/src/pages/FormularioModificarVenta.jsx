import '../styles/Formularios.css';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Axios from '../axiosConfig';
import Swal from 'sweetalert2';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Container, Row, Col, Button, Form as BootstrapForm } from 'react-bootstrap';
import CamposFormulario from '../components/CamposFormulario';
import useDocumentTitle from '../components/Titulo';
import dayjs from 'dayjs';
import { erroresSweetAlert2 } from '../utils/erroresSweetAlert2';

export default function ModificarVenta() {
    useDocumentTitle("Modificar Venta");

    const { id } = useParams();
    const navigate = useNavigate();
    const [venta, setVenta] = useState(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const obtenerVenta = async () => {
            try {
                const { data } = await Axios.get(`/ventas/${id}`);
                setVenta(data);
            } catch (err) {
                console.error("Error al cargar la venta", err);
            } finally {
                setCargando(false);
            }
        };
        obtenerVenta();
    }, [id]);

    const initialValues = useMemo(() => ({
        id_trabajador: venta?.id_trabajador || "",
        id_cliente: venta?.id_cliente || "",
        fecha_firma: venta ? dayjs(venta.fecha_firma).format("YYYY-MM-DD") : "",
        forma_pago: venta?.forma_pago || "",
        certificado_energetico: venta?.certificado_energetico || "",
        gestion_subvencion: venta?.gestion_subvencion || "",
        gestion_legalizacion: venta?.gestion_legalizacion || "",
        fecha_legalizacion: venta?.fecha_legalizacion ? dayjs(venta.fecha_legalizacion).format("YYYY-MM-DD") : "",
        estado_venta: venta?.estado_venta || ""
    }), [venta]);

    const validationSchema = Yup.object({
        id_trabajador: Yup.number("Este campo debe ser numérico").required("Este campo es obligatorio"),
        id_cliente: Yup.number("Este campo debe ser numérico").required("Este campo es obligatorio"),
        fecha_firma: Yup.date().required("Este campo es obligatorio"),
        forma_pago: Yup.string().required("Este campo es obligatorio"),
        certificado_energetico: Yup.string().required("Este campo es obligatorio"),
        gestion_subvencion: Yup.string().required("Este campo es obligatorio"),
        gestion_legalizacion: Yup.string(),
        fecha_legalizacion: Yup.date().when("gestion_legalizacion", {
            is: "Si",
            then: schema => schema.required("Este campo es obligatorio")
        }),
        estado_venta: Yup.string().required("Este campo es obligatorio"),
    });

    const onSubmit = useCallback(async (values, { setSubmitting }) => {
        try {
            await Axios.put(`/ventas/${id}`, values);
            Swal.fire({ icon: "success", title: "Venta modificada correctamente" })
                .then(() => navigate("/coordinadores/ventas"));
        } catch (error) {
            erroresSweetAlert2(error);
        } finally {
            setSubmitting(false);
        }
    }, [id, navigate]);

    const onDelete = useCallback(async () => {
        try {
            const confirmDelete = await Swal.fire({
                title: "¿Estás seguro de que deseas eliminar esta venta?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, eliminar",
                cancelButtonText: "Cancelar",
            });

            if (confirmDelete.isConfirmed) {
                await Axios.delete(`/ventas/${id}`);
                Swal.fire({
                    icon: "success",
                    title: "Venta eliminada correctamente",
                    confirmButtonText: "Vale",
                }).then(() => navigate("/coordinadores/ventas"));
            }
        } catch (error) {
            erroresSweetAlert2(error);
        }
    }, [id, navigate]);

    if (cargando) {
        return <p className="text-center">Cargando datos de la venta...</p>;
    }

    if (!venta) {
        return <p className="text-center">No se encontró la venta.</p>;
    }

    return (
        <Container className="venta">
            <h1 className="text-center mb-4">Modificar Venta</h1>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit} enableReinitialize>
                {({ errors, touched, isSubmitting, isValid }) => (
                    <Form as={BootstrapForm} className="p-4 border rounded bg-light">
                        <Row className="mb-3">
                            <Col md={6}>
                                <CamposFormulario name="id_trabajador" type="number" label="Nuevo ID trabajador *"
                                    tooltip="Introduce el nuevo id de trabajador" errors={errors} touched={touched} />
                            </Col>
                            <Col md={6}>
                                <CamposFormulario name="id_cliente" type="number" label="Nuevo ID cliente *"
                                    tooltip="Introduce el nuevo id de cliente" errors={errors} touched={touched} />
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={6}>
                                <CamposFormulario name="fecha_firma" type="date" label="Nueva fecha firma *"
                                    tooltip="Introduce la nueva fecha de firma" errors={errors} touched={touched} />
                            </Col>
                            <Col md={6}>
                                <CamposFormulario name="forma_pago" as="select" label="Nueva forma de pago *"
                                    tooltip="Selecciona la nueva forma de pago" errors={errors} touched={touched}>
                                    <option value="">Selecciona una opción</option>
                                    <option value="Financiado">Financiado</option>
                                    <option value="Transferencia">Transferencia</option>
                                    <option value="Efectivo">Efectivo</option>
                                </CamposFormulario>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={6}>
                                <CamposFormulario name="certificado_energetico" as="select" label="Nuevo certificado energético"
                                    tooltip="Selecciona el nuevo certificado energético" errors={errors} touched={touched}>
                                    <option value="">Selecciona una opción</option>
                                    <option value="En_cuotas">En cuotas</option>
                                    <option value="Por_transferencia">Por transferencia</option>
                                    <option value="No">No</option>
                                </CamposFormulario>
                            </Col>
                            <Col md={6}>
                                <CamposFormulario name="gestion_subvencion" as="select" label="¿Gestión de subvención?"
                                    tooltip="Selecciona si existe gestión de subvención" errors={errors} touched={touched}>
                                    <option value="">Selecciona una opción</option>
                                    <option value="Si">Sí</option>
                                    <option value="No">No</option>
                                </CamposFormulario>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={6}>
                                <CamposFormulario name="gestion_legalizacion" as="select" label="¿Gestión de legalización?"
                                    tooltip="Selecciona si existe gestión de legalización" errors={errors} touched={touched}>
                                    <option value="">Selecciona una opción</option>
                                    <option value="Si">Sí</option>
                                    <option value="No">No</option>
                                </CamposFormulario>
                            </Col>
                            <Col md={6}>
                                <CamposFormulario name="fecha_legalizacion" type="date" label="Nueva fecha legalización"
                                    tooltip="Introduce la nueva fecha de legalización" errors={errors} touched={touched} />
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={12}>
                                <CamposFormulario name="estado_venta" as="select" label="Nuevo estado de la venta *"
                                    tooltip="Selecciona el nuevo estado de la venta" errors={errors} touched={touched}>
                                    <option value="">Selecciona una opción</option>
                                    <option value="Instalada">Instalada</option>
                                    <option value="Caída">Caída</option>
                                </CamposFormulario>
                            </Col>
                        </Row>

                        <div className="text-center mt-4">
                            <Button type="submit" disabled={isSubmitting || !isValid}>
                                {isSubmitting ? "Modificando..." : "Modificar venta"}
                            </Button>
                        </div>
                        <div className="d-flex justify-content-center mt-3">
                            <Button variant="danger" onClick={onDelete} className="mt-3">
                                Eliminar venta
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Container>
    );
}
