import '../styles/Formularios.css';
import { useCallback, useMemo } from "react";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form as BootstrapForm, Button } from 'react-bootstrap';
import Axios from "../axiosConfig";
import useDocumentTitle from '../components/Titulo';
import { erroresSweetAlert2 } from '../utils/erroresSweetAlert2';
import CamposFormulario from '../components/CamposFormulario';

export default function FormularioVenta() {
    useDocumentTitle("Formulario de venta");

    const navigate = useNavigate();

    const initialValues = useMemo(() => ({
        id_trabajador: '', id_cliente: '', fecha_firma: '', forma_pago: '',
        certificado_energetico: '', gestion_subvencion: '', gestion_legalizacion: '', fecha_legalizacion: '',
        estado_venta: 'pendiente',
    }), []);

    const validationSchema = Yup.object({
        id_trabajador: Yup.number("Este campo debe ser numérico").required("Este campo es obligatorio"),
        id_cliente: Yup.number("Este campo debe ser numérico").required("Este campo es obligatorio"),
        fecha_firma: Yup.date().required("Este campo es obligatorio"),
        forma_pago: Yup.string().oneOf(['Financiado', 'Transferencia', 'Efectivo']).required('Este campo es obligatorio'),
        certificado_energetico: Yup.string().required("Este campo es obligatorio"),
        gestion_subvencion: Yup.string().required("Este campo es obligatorio"),
        gestion_legalizacion: Yup.string().required("Este campo es obligatorio"),
        fecha_legalizacion: Yup.date().when("gestion_legalizacion", {
            is: "si",
            then: schema => schema.required("Este campo es obligatorio")
        }),
        estado_venta: Yup.string().oneOf(['caida', 'instalada', 'pendiente']).required('Este campo es obligatorio'),
    });

    const onSubmit = useCallback(async (values, { setSubmitting, resetForm }) => {
        try {
            const datos = {
                ...values,
                fecha_legalizacion: values.gestion_legalizacion === 'si' ? values.fecha_legalizacion : null
            };
            const response = await Axios.post("/ventas", datos);
            Swal.fire({
                icon: "success",
                title: `Venta número ${response.data.id_venta} registrada`,
                confirmButtonText: "OK"
            }).then(() => navigate('/coordinadores/ventas'));
            resetForm();
        } catch (error) {
            erroresSweetAlert2(error);
        } finally {
            setSubmitting(false);
        }
    }, [navigate]);

    return (
        <Container fluid="md" className="venta">
            <h1 className="text-center mb-4">Registro de Ventas</h1>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit} enableReinitialize>
                {({ errors, touched, isSubmitting, isValid }) => (
                    <Form as={BootstrapForm} className="p-4 border rounded shadow-sm bg-light" noValidate>
                        <Row className="mb-3">
                            <Col xs={12} md={6}>
                                <CamposFormulario label="ID del trabajador *" name="id_trabajador" type="number" placeholder="Ej: 3"
                                    tooltip="Introduce el id del trabajador que ha realizado la venta" errors={errors} touched={touched} />
                            </Col>
                            <Col xs={12} md={6}>
                                <CamposFormulario label="ID del cliente *" name="id_cliente" type="number" placeholder="Ej: 2"
                                    tooltip="Introduce el id del cliente al que se le ha realizado la venta" errors={errors} touched={touched} />
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col xs={12} md={6}>
                                <CamposFormulario label="Fecha de firma *" name="fecha_firma" type="date"
                                    tooltip="Introduce la fecha de firma de la venta" errors={errors} touched={touched} />
                            </Col>
                            <Col xs={12} md={6}>
                                <CamposFormulario label="Forma de pago *" name="forma_pago" as="select"
                                    tooltip="Selecciona la forma de pago de la venta" errors={errors} touched={touched}>
                                    <option value="">Selecciona una opción</option>
                                    <option value="Financiado">Financiado</option>
                                    <option value="Transferencia">Transferencia</option>
                                    <option value="Efectivo">Efectivo</option>
                                </CamposFormulario>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col xs={12} md={6}>
                                <CamposFormulario label="Certificado energético *" name="certificado_energetico" as="select"
                                    tooltip="Selecciona el certificado energético" errors={errors} touched={touched}>
                                    <option value="">Selecciona una opción</option>
                                    <option value="En_cuotas">En cuotas</option>
                                    <option value="no">No</option>
                                    <option value="Por_transferencia">Por transferencia</option>
                                </CamposFormulario>
                            </Col>
                            <Col xs={12} md={6}>
                                <CamposFormulario label="Gestión de subvención *" name="gestion_subvencion" as="select"
                                    tooltip="Selecciona si existe gestión de subvención" errors={errors} touched={touched}>
                                    <option value="">Selecciona una opción</option>
                                    <option value="no">No</option>
                                    <option value="si">Sí</option>
                                </CamposFormulario>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={6}>
                                <CamposFormulario label="Gestión de legalización *" name="gestion_legalizacion" as="select"
                                    tooltip="Selecciona si existe gestión de legalización" errors={errors} touched={touched}>
                                    <option value="">Selecciona una opción</option>
                                    <option value="no">No</option>
                                    <option value="si">Sí</option>
                                </CamposFormulario>
                            </Col>
                            <Col md={6}>
                                <CamposFormulario label="Fecha de legalización" name="fecha_legalizacion" type="date"
                                    tooltip="Selecciona la fecha de legalización" errors={errors} touched={touched} />
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={12}>
                                <CamposFormulario label="Estado de la venta *" name="estado_venta" as="select"
                                    tooltip="Selecciona el estado de la venta" errors={errors} touched={touched}>
                                    <option value="">Selecciona una opción</option>
                                    <option value="pendiente">Pendiente</option>
                                    <option value="instalada">Instalada</option>
                                    <option value="caida">Caída</option>
                                </CamposFormulario>
                            </Col>
                        </Row>

                        <div className="d-flex justify-content-center">
                            <Button type="submit" className="mt-3" disabled={isSubmitting || !isValid}>
                                {isSubmitting ? "Registrando..." : "Registrar Venta"}
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Container>
    );
}
