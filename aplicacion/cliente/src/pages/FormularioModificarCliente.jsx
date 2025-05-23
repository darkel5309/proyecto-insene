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
import dayjs from 'dayjs';

export default function FormularioModificarCliente() {
    useDocumentTitle("Modificación de Clientes");

    const { id } = useParams();
    const { cliente, cargando } = useDatosCliente(id);
    const navigate = useNavigate();

    const formatFechaDatetimeLocal = (fecha) => {
        return fecha ? dayjs(fecha).format('YYYY-MM-DDTHH:mm') : "";
    };

    const initialValues = useMemo(() => ({
        nombre: cliente?.nombre || "", telefono: cliente?.telefono || "", correo: cliente?.correo || "",
        dni: cliente?.dni || "", iban: cliente?.iban || "", modoCaptacion: cliente?.modo_captacion || "",
        observaciones: cliente?.observaciones || "", fechaAlta: formatFechaDatetimeLocal(cliente?.fecha_alta),
        direccion: cliente?.direccion || "", localidad: cliente?.localidad || "", provincia: cliente?.provincia || "",
    }), [cliente]);

    const validationSchema = Yup.object({
        nombre: Yup.string().required('Este campo es obligatorio'),
        telefono: Yup.string().matches(/^\d{9}$/, 'El teléfono debe tener 9 dígitos').required('Este campo es obligatorio'),
        correo: Yup.string().email('El correo no es válido').required('Este campo es obligatorio'),
        modoCaptacion: Yup.string().required('Este campo es obligatorio'),
        fechaAlta: Yup.date().required('Este campo es obligatorio'),
        direccion: Yup.string().required('Este campo es obligatorio'),
        localidad: Yup.string().required('Este campo es obligatorio'),
        provincia: Yup.string().required('Este campo es obligatorio'),
        dni: Yup.string().matches(/^\d{8}[A-Za-z]$/, 'El DNI debe tener 8 dígitos y una letra'),
        iban: Yup.string().matches(/^ES\d{2}[0-9A-Za-z]{20}$/, 'El IBAN no tiene el formato correcto'),
    });

    const onSubmit = useCallback(async (values, { setSubmitting }) => {
        try {
            await Axios.put(`/clientes/${id}`, values);
            Swal.fire({
                icon: "success",
                title: "Cliente actualizado correctamente",
                confirmButtonText: "OK",
            }).then(() => navigate("/administradores/InformacionClientes"));
        } catch (error) {
            erroresSweetAlert2(error);
        } finally {
            setSubmitting(false);
        }
    }, [id, navigate]);

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
                await Axios.delete(`/clientes/${id}`);
                Swal.fire({
                    icon: "success",
                    title: "Cliente eliminado correctamente",
                    confirmButtonText: "OK",
                }).then(() => navigate("/administradores/InformacionClientes"));
            }
        } catch (error) {
            erroresSweetAlert2(error);
        }
    }, [id, navigate]);

    if (cargando) {
        return <p className="text-center">Cargando datos del cliente...</p>;
    }

    if (!cliente) {
        return <p className="text-center">No se encontró el cliente.</p>;
    }

    return (
        <Container fluid="md" className="cliente">
            <h1 className="text-center mb-4">Modificación de Clientes</h1>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit} enableReinitialize >
                {({ errors, touched, isSubmitting, isValid }) => (
                    <Form as={BootstrapForm} className="p-4 border rounded shadow-sm bg-light">
                        <Row className="mb-3">
                            <Col xs={12} md={6}>
                                <CamposFormulario label="Nueva fecha de alta *" name="fechaAlta" type="datetime-local"
                                    tooltip="Introduce la nueva fecha de alta del cliente" errors={errors} touched={touched} />
                            </Col>
                            <Col xs={12} md={6}>
                                <CamposFormulario label="Nuevo nombre del cliente *" name="nombre" type="text"
                                    tooltip="Introduce el nuevo nombre y apellidos del cliente" errors={errors} touched={touched} />
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col xs={12} md={6}>
                                <CamposFormulario label="Nueva dirección del cliente *" name="direccion" type="text"
                                    tooltip="Introduce la nueva dirección del cliente" errors={errors} touched={touched} />
                            </Col>
                            <Col xs={12} md={6}>
                                <CamposFormulario label="Nueva localidad del cliente *" name="localidad" type="text"
                                    tooltip="Introduce la nueva localidad o municipio del cliente" errors={errors} touched={touched} />
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col xs={12} md={6}>
                                <CamposFormulario label="Nueva provincia del cliente *" name="provincia" type="text"
                                    tooltip="Introduce la nueva provincia del cliente" errors={errors} touched={touched} />
                            </Col>
                            <Col xs={12} md={6}>
                                <CamposFormulario label="Nuevo teléfono del cliente *" name="telefono" type="tel"
                                    tooltip="Introduce el nuevo número de teléfono del cliente" errors={errors} touched={touched} />
                            </Col>
                        </Row>

                        <div className="d-flex justify-content-center gap-5 mt-4">
                            <Button type="submit" disabled={isSubmitting || !isValid}>
                                {isSubmitting ? "Modificando..." : "⚠️ Modificar"}
                            </Button>
                            <Button variant="danger" onClick={onDelete}>
                                ❌ Eliminar
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Container>
    );
}
