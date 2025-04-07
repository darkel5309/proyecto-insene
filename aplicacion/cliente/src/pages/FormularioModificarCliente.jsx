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
import { useDatosCliente } from '../hooks/useDatosCliente';

export default function ModificarCliente() {
    useDocumentTitle("Modificación de Cliente");

    const { id_cliente } = useParams();
    const cliente = useDatosCliente(id_cliente);
    const navigate = useNavigate();

    const initialValues = useMemo(() => ({
        nombre: cliente.nombre || "",
        telefono: cliente.telefono || "",
        correo: cliente.correo || "",
        dni: cliente.dni || "",
        iban: cliente.iban || "",
        modo_captacion: cliente.modo_captacion || "",
        observaciones_cliente: cliente.observaciones_cliente || "",
        direccion: cliente.direccion || "",
        localidad: cliente.localidad || "",
        provincia: cliente.provincia || "",
    }), [cliente]);

    const validationSchema = Yup.object({
        nombre: Yup.string().required("Este campo es obligatorio"),
        telefono: Yup.string().matches(/^\d{9}$/, "El teléfono debe tener 9 dígitos").required("Este campo es obligatorio"),
        correo: Yup.string().email("Correo no válido").required("Este campo es obligatorio"),
        dni: Yup.string().required("Este campo es obligatorio"),
        iban: Yup.string().required("Este campo es obligatorio"),
        modo_captacion: Yup.string().required("Este campo es obligatorio"),
        direccion: Yup.string().required("Este campo es obligatorio"),
        localidad: Yup.string().required("Este campo es obligatorio"),
        provincia: Yup.string().required("Este campo es obligatorio"),
        observaciones_cliente: Yup.string(),
    });

    const onSubmit = useCallback(async (values, { setSubmitting }) => {
        try {
            await Axios.put(`/clientes/${id_cliente}`, values);
            Swal.fire({
                icon: "success",
                title: "Cliente actualizado correctamente",
                confirmButtonText: "Vale",
            }).then(() => navigate("/clientes"));
        } catch (error) {
            erroresSweetAlert2(error);
        } finally {
            setSubmitting(false);
        }
    }, [id_cliente, navigate]);

    const onDelete = useCallback(async () => {
        try {
            const confirmDelete = await Swal.fire({
                title: "¿Estás seguro de que deseas eliminar este cliente?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, eliminar",
                cancelButtonText: "Cancelar",
            });

            if (confirmDelete.isConfirmed) {
                await Axios.delete(`/clientes/${id_cliente}`);
                Swal.fire({
                    icon: "success",
                    title: "Cliente eliminado correctamente",
                    confirmButtonText: "Vale",
                }).then(() => navigate("/clientes"));
            }
        } catch (error) {
            erroresSweetAlert2(error);
        }
    }, [id_cliente, navigate]);

    return (
        <Container fluid="md" className="cliente">
            <h1 className="text-center mb-4">Modificar Cliente</h1>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit} enableReinitialize >
                {({ errors, touched, isSubmitting, isValid }) => (
                    <Form as={BootstrapForm} className="p-4 border rounded shadow-sm bg-light">
                        <Row className="mb-3">
                            <Col xs={12} md={6}>
                                <CamposFormulario label="Nombre del cliente *" name="nombre" type="text"
                                    tooltip="Introduce el nombre completo del cliente"
                                    errors={errors} touched={touched} />
                            </Col>
                            <Col xs={12} md={6}>
                                <CamposFormulario label="Teléfono del cliente *" name="telefono" type="tel"
                                    tooltip="Introduce el número de teléfono del cliente (9 dígitos)"
                                    errors={errors} touched={touched} />
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col xs={12} md={6}>
                                <CamposFormulario label="Correo del cliente *" name="correo" type="email"
                                    tooltip="Introduce un correo electrónico válido"
                                    errors={errors} touched={touched} />
                            </Col>
                            <Col xs={12} md={6}>
                                <CamposFormulario label="DNI del cliente *" name="dni" type="text"
                                    tooltip="Introduce el DNI del cliente"
                                    errors={errors} touched={touched} />
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col xs={12} md={6}>
                                <CamposFormulario label="IBAN del cliente *" name="iban" type="text"
                                    tooltip="Introduce el IBAN del cliente"
                                    errors={errors} touched={touched} />
                            </Col>
                            <Col xs={12} md={6}>
                                <CamposFormulario label="Modo de captación *" name="modo_captacion" type="text"
                                    tooltip="Introduce cómo se captó a este cliente"
                                    errors={errors} touched={touched} />
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col xs={12}>
                                <CamposFormulario label="Observaciones" name="observaciones_cliente" as="textarea" rows={3}
                                    tooltip="Observaciones adicionales sobre el cliente"
                                    errors={errors} touched={touched} />
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col xs={12} md={6}>
                                <CamposFormulario label="Dirección *" name="direccion" type="text"
                                    tooltip="Introduce la dirección del cliente"
                                    errors={errors} touched={touched} />
                            </Col>
                            <Col xs={12} md={3}>
                                <CamposFormulario label="Localidad *" name="localidad" type="text"
                                    tooltip="Introduce la localidad del cliente"
                                    errors={errors} touched={touched} />
                            </Col>
                            <Col xs={12} md={3}>
                                <CamposFormulario label="Provincia *" name="provincia" type="text"
                                    tooltip="Introduce la provincia del cliente"
                                    errors={errors} touched={touched} />
                            </Col>
                        </Row>

                        <div className="d-flex justify-content-center">
                            <Button type="submit" className="mt-3" disabled={isSubmitting || !isValid} aria-label="Modificar cliente">
                                {isSubmitting ? "Modificando..." : "Modificar cliente"}
                            </Button>
                        </div>

                        <div className="d-flex justify-content-center mt-3">
                            <Button variant="danger" onClick={onDelete} className="mt-3" aria-label="Eliminar cliente">
                                Eliminar Cliente
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Container>
    );
}
