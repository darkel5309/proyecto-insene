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
    useDocumentTitle("Modificación de Cliente");

    const { id } = useParams();
    const cliente = useDatosCliente(id);
    const navigate = useNavigate();

    const formatFechaDatetimeLocal = (fecha) => {
        if (!fecha) return "";
        return dayjs(fecha).format('YYYY-MM-DDTHH:mm');
    };

    const initialValues = useMemo(() => ({
        nombre: cliente.nombre || "", telefono: cliente.telefono || "", correo: cliente.correo || "", dni: cliente.dni || "",
        iban: cliente.iban || "", modoCaptacion : cliente.modo_captacion || "", observaciones: cliente.observaciones || "",
        fechaAlta: formatFechaDatetimeLocal(cliente.fecha_alta), direccion: cliente.direccion || "", localidad: cliente.localidad || "",
        provincia: cliente.provincia || "",
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
            const clienteActualizado = { ...values };

            await Axios.put(`/clientes/${id}`, clienteActualizado);
            Swal.fire({
                icon: "success",
                title: "Cliente actualizado correctamente",
                confirmButtonText: "Vale",
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
                    confirmButtonText: "Vale",
                }).then(() => navigate("/administradores/InformacionClientes"));
            }
        } catch (error) {
            erroresSweetAlert2(error);
        }
    }, [id, navigate]);

    return (
        <Container fluid="md" className="cliente">
            <h1 className="text-center mb-4">Modificar Cliente</h1>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit} enableReinitialize >
                {({ errors, touched, isSubmitting, isValid }) => (
                    <Form as={BootstrapForm} className="p-4 border rounded shadow-sm bg-light">
                        <Row className="mb-3">
                            <Col xs={12} md={6}>
                                <CamposFormulario label="Nueva fecha de alta *" name="fechaAlta" type="datetime-local"
                                    tooltip="Introduce la nueva fecha de alta del cliente" errors={errors} touched={touched} />
                            </Col>
                            <Col xs={12} md={6}>
                                <CamposFormulario label="Nuevo nombre del cliente *" name="nombre" type="text" placeholder="Ej: Gabriel Ruíz Fernández"
                                    tooltip="Introduce el nuevo nombre y apellidos del cliente" errors={errors} touched={touched} />
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col xs={12} md={6}>
                                <CamposFormulario label="Nueva dirección del cliente *" name="direccion" type="text" placeholder="Ej: Calle Sevilla, 44"
                                    tooltip="Introduce la nueva dirección del cliente incluyendo número, piso, etc." errors={errors} touched={touched} />
                            </Col>
                            <Col xs={12} md={6}>
                                <CamposFormulario label="Nueva localidad del cliente *" name="localidad" placeholder="Ej: Mairena del Alcor"
                                    tooltip="Introduce la nueva localidad o municipio del cliente" errors={errors} touched={touched} />
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col xs={12} md={6}>
                                <CamposFormulario label="Nueva provincia del cliente *" name="provincia" type="text" placeholder="Ej: Sevilla"
                                    tooltip="Introduce la nueva provincia donde reside el cliente" errors={errors} touched={touched} />
                            </Col>
                            <Col xs={12} md={6}>
                                <CamposFormulario label="Nuevo teléfono del cliente *" name="telefono" type="tel" placeholder="Ej: 600000000"
                                    tooltip="Introduce el nuevo número de teléfono del cliente (9 dígitos)" errors={errors} touched={touched} />
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col xs={12} md={6}>
                                <CamposFormulario label="Nuevo DNI del cliente " name="dni" type="text" placeholder="Ej: 11111111A"
                                    tooltip="Introduce el nuevo DNI del cliente" errors={errors} touched={touched} />
                            </Col>
                            <Col xs={12} md={6}>
                                <CamposFormulario label="Nuevo IBAN del cliente " name="iban" type="text" placeholder="Ej: ES6000491500051234567892	"
                                    tooltip="Introduce el nuevo IBAN del cliente" errors={errors} touched={touched} />
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col xs={12} md={6}>
                                <CamposFormulario label="Nuevo correo del cliente *" name="correo" type="email" placeholder="Ej: gabriel@gmail.com"
                                    tooltip="Introduce el nuevo correo electrónico del cliente" errors={errors} touched={touched} />
                            </Col>
                            <Col xs={12} md={6}>
                                <CamposFormulario label="Nuevo modo de captación *" name="modoCaptacion" as="select"
                                    tooltip="Selecciona la nueva forma de captación del cliente" errors={errors} touched={touched} >
                                    <option value="">Selecciona una opción</option>
                                    <option value="Captador">Captador</option>
                                    <option value="Telemarketing">Telemarketing</option>
                                    <option value="Referido">Referido</option>
                                    <option value="Propia">Captación propia</option>
                                </CamposFormulario>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col>
                                <CamposFormulario label="Nuevas observaciones" name="observaciones" as="textarea" placeholder="Comenta alguna observación"
                                    tooltip="Añade cualquier nueva información adicional relevante sobre el cliente" errors={errors} touched={touched} />
                            </Col>
                        </Row>

                        <div className="d-flex justify-content-center">
                            <Button type="submit" className="mt-3" disabled={isSubmitting || !isValid} aria-label="Modificar cliente" >
                                {isSubmitting ? "Modificando..." : "Modificar cliente"}
                            </Button>
                        </div>

                        <div className="d-flex justify-content-center mt-3">
                            <Button variant="danger" onClick={onDelete} className="mt-3" aria-label="Eliminar cliente" >
                                Eliminar Cliente
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Container>
    );
}
