import '../styles/Formularios.css';
import { useCallback, useMemo } from "react";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form as BootstrapForm, Button } from 'react-bootstrap';
import Axios from "../axiosConfig";
import useDocumentTitle from '../components/Titulo';
import { useIdTrabajador } from '../hooks/useIdTrabajador';
import { erroresSweetAlert2 } from '../utils/erroresSweetAlert2';
import LoadingSpinner from '../components/LoadingSpinner';
import CamposFormulario from '../components/CamposFormulario';
import AutocompletarDireccion from '../components/AutocompletarDireccion';

export default function FormularioCliente() {
    useDocumentTitle("Formulario de Clientes");

    const navigate = useNavigate();
    const { idTrabajador, isLoading } = useIdTrabajador();

    const initialValues = useMemo(() => ({
        idTrabajador: idTrabajador || '',
        nombre: '',
        telefono: '',
        correo: '',
        modoCaptacion: '',
        observaciones: '',
        direccion: '',
        localidad: '',
        provincia: '',
    }), [idTrabajador]);

    const validationSchema = Yup.object({
        nombre: Yup.string().required('Este campo es obligatorio'),
        telefono: Yup.string().matches(/^\d{9}$/, 'El teléfono debe tener 9 dígitos').required('Este campo es obligatorio'),
        correo: Yup.string().email('El correo no es válido').required('Este campo es obligatorio'),
        modoCaptacion: Yup.string().required('Este campo es obligatorio'),
        direccion: Yup.string().required('Este campo es obligatorio'),
        localidad: Yup.string().required('Este campo es obligatorio'),
        provincia: Yup.string().required('Este campo es obligatorio'),
    });

    const onSubmit = useCallback(async (values, { setSubmitting, resetForm }) => {
        try {
            const response = await Axios.post("/clientes", values);
            Swal.fire({
                icon: "success",
                title: `Cliente nº ${response.data.idCliente} registrado`,
                text: "Datos registrados correctamente",
                confirmButtonText: "OK"
            }).then(() => navigate(-1));
            resetForm();
        } catch (error) {
            erroresSweetAlert2(error);
        } finally {
            setSubmitting(false);
        }
    }, [navigate]);

    const handleDireccionSelect = useCallback((sugerencia, setFieldValue) => {
        if (sugerencia.localidad) {
            setFieldValue('localidad', sugerencia.localidad);
        }
        if (sugerencia.provincia) {
            setFieldValue('provincia', sugerencia.provincia);
        }
    }, []);

    if (isLoading) {
        return <LoadingSpinner message="Cargando formulario..." />;
    }

    return (
        <Container fluid="md" className="cliente">
            <h1 className="text-center mb-4">Registro de Clientes</h1>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
                enableReinitialize
            >
                {({ errors, touched, isSubmitting, isValid, values, handleChange, setFieldValue }) => (
                    <Form as={BootstrapForm} className="p-4 border rounded shadow-sm bg-light" noValidate>
                        <Row className="mb-3">
                            <Col xs={12} md={6}>
                                <CamposFormulario
                                    label="ID de trabajador *"
                                    name="idTrabajador"
                                    type="number"
                                    placeholder="Ej: 5"
                                    tooltip="Tu código de trabajador"
                                    errors={errors}
                                    touched={touched}
                                    disabled
                                />
                            </Col>
                            <Col xs={12} md={6}>
                                <CamposFormulario
                                    label="Nombre completo del cliente *"
                                    name="nombre"
                                    placeholder="Ej: Gabriel Ruíz Fernández"
                                    tooltip="Introduce el nombre y apellidos del cliente"
                                    errors={errors}
                                    touched={touched}
                                />
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col xs={12} md={6}>
                                <AutocompletarDireccion
                                    label="Dirección del cliente (calle, número)*"
                                    name="direccion"
                                    placeholder="Ej: Calle Sevilla, 44"
                                    tooltip="Introduce la dirección del cliente (calle y número)"
                                    errors={errors.direccion}
                                    touched={touched.direccion}
                                    value={values.direccion}
                                    onChange={handleChange}
                                    onSelect={(sugerencia) => handleDireccionSelect(sugerencia, setFieldValue)}
                                />
                            </Col>
                            <Col xs={12} md={6}>
                                <CamposFormulario
                                    label="Localidad del cliente *"
                                    name="localidad"
                                    errors={errors}
                                    touched={touched}
                                    disabled
                                />
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col xs={12} md={6}>
                                <CamposFormulario
                                    label="Provincia del cliente *"
                                    name="provincia"
                                    errors={errors}
                                    touched={touched}
                                    disabled
                                />
                            </Col>
                            <Col xs={12} md={6}>
                                <CamposFormulario
                                    label="Teléfono del cliente *"
                                    name="telefono"
                                    type="tel"
                                    placeholder="Ej: 600000000"
                                    tooltip="Introduce el número de teléfono del cliente (9 dígitos)"
                                    errors={errors}
                                    touched={touched}
                                />
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col xs={12} md={6}>
                                <CamposFormulario
                                    label="Correo del cliente *"
                                    name="correo"
                                    type="email"
                                    placeholder="Ej: gabriel@gmail.com"
                                    tooltip="Introduce el correo electrónico del cliente"
                                    errors={errors}
                                    touched={touched}
                                />
                            </Col>
                            <Col xs={12} md={6}>
                                <CamposFormulario
                                    label="Modo de captación *"
                                    name="modoCaptacion"
                                    as="select"
                                    tooltip="Selecciona la forma de captación del cliente"
                                    errors={errors}
                                    touched={touched}
                                >
                                    <option value="">Selecciona una opción</option>
                                    <option value="propia">Captación propia</option>
                                    <option value="captador">Captador</option>
                                    <option value="referido">Referido</option>
                                    <option value="telemarketing">Telemarketing</option>
                                </CamposFormulario>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col>
                                <CamposFormulario
                                    label="Observaciones"
                                    name="observaciones"
                                    as="textarea"
                                    placeholder="Comenta alguna observación"
                                    tooltip="Añade cualquier información adicional relevante sobre el cliente"
                                    errors={errors}
                                    touched={touched}
                                />
                            </Col>
                        </Row>

                        <div className="d-flex justify-content-center">
                            <Button
                                type="submit"
                                className="mt-3"
                                disabled={isSubmitting || !isValid}
                                aria-label="Registrar datos de cliente"
                            >
                                {isSubmitting ? "Enviando..." : "✅ Registrar"}
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Container>
    );
}