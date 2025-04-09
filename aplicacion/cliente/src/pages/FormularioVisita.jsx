import '../styles/Formularios.css';
import { useCallback, useMemo } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form as BootstrapForm, Button } from 'react-bootstrap';
import Axios from "../axiosConfig";
import useDocumentTitle from '../components/Titulo';
import { useIdTrabajador } from '../hooks/useIdTrabajador';
import { useAutocompletarCliente } from '../hooks/useAutocompletarCliente';
import { erroresSweetAlert2 } from '../utils/erroresSweetAlert2';
import LoadingSpinner from '../components/LoadingSpinner';
import CamposFormulario from '../components/CamposFormulario';

export default function FormularioVisita() {
    useDocumentTitle("Formulario de Visita");

    const navigate = useNavigate();
    const { idTrabajador, isLoading } = useIdTrabajador();
    const { obtenerCliente } = useAutocompletarCliente();

    const initialValues = useMemo(() => ({
        idTrabajador: idTrabajador || '', idCliente: '', nombre: '', telefono: '', correo: '', direccion: '', localidad: '', provincia: '',
        fecha: '', hora: '', numeroPersonas: '', numeroDecisores: '', tieneBombona: "Sin_datos", tieneGas: "Sin_datos", tieneTermo: "Sin_datos",
        tienePlacas: "Sin_datos", importeLuz: '', importeGas: '', observaciones: ''
    }), [idTrabajador]);

    const validationSchema = Yup.object({
        idCliente: Yup.number().integer().required('Este campo es obligatorio').min(1, 'El ID no es válido'),
        fecha: Yup.string().required('Este campo es obligatorio'),
        hora: Yup.string().required('Este campo es obligatorio'),
        numeroPersonas: Yup.number().min(1, 'Debe ser mayor a 0'),
        numeroDecisores: Yup.number().min(1, 'Debe ser mayor a 0').required('Este campo es obligatorio'),
        importeLuz: Yup.number().min(0, 'Debe ser mayor o igual a 0'),
        importeGas: Yup.number().min(0, 'Debe ser mayor o igual a 0')
    });

    const onSubmit = useCallback(async (values, { setSubmitting, resetForm }) => {
        if (values.importeLuz === '') values.importeLuz = 0;
        if (values.importeGas === '') values.importeGas = 0;

        try {
            const response = await Axios.post("/visitas", values);

            Swal.fire({
                icon: "success",
                title: `El código de la visita es: ${response.data.idVisita}`,
                text: "Visita registrada correctamente",
                confirmButtonText: "Vale"
            }).then(() => navigate('/captadores'));
            resetForm();
        } catch (error) {
            erroresSweetAlert2(error);
        } finally {
            setSubmitting(false);
        }
    }, [navigate]);

    if (isLoading) {
        return <LoadingSpinner message="Cargando formulario..." />;
    }

    return (
        <Container fluid="md" className="visita">
            <h1 className="text-center mb-4">Formulario de Visitas</h1>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit} enableReinitialize>
                {({ errors, touched, isSubmitting, setFieldValue, values, isValid }) => (
                    <Form as={BootstrapForm} className="p-4 border rounded shadow-sm bg-light" noValidate>
                        <Row className="mb-3">
                            <Col xs={12} md={6}>
                                <CamposFormulario label="ID de Trabajador *" name="idTrabajador" type="number" placeholder="Ej: 5" disabled={true}
                                    tooltip="Tu código de trabajador" errors={errors} touched={touched} />
                            </Col>
                            <Col xs={12} md={6}>
                                <BootstrapForm.Group>
                                    <BootstrapForm.Label>ID del Cliente *</BootstrapForm.Label>
                                    <Field name="idCliente" type="number" className={`form-control ${errors.idCliente && touched.idCliente ? "is-invalid" : ""}`} placeholder="Ej: 2" onChange={(e) => {
                                        const idCliente = e.target.value;
                                        setFieldValue("idCliente", idCliente);
                                        obtenerCliente(idCliente, setFieldValue);
                                    }} />
                                    <ErrorMessage name="idCliente" component="div" className="text-danger" />
                                </BootstrapForm.Group>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col xs={12} md={6}>
                                <CamposFormulario label="Nombre completo del cliente" name="nombre" disabled value={values.nombre} errors={errors} touched={touched} />
                            </Col>
                            <Col xs={12} md={6}>
                                <CamposFormulario label="Teléfono del cliente" name="telefono" disabled value={values.telefono} errors={errors} touched={touched} />
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col xs={12} md={6}>
                                <CamposFormulario label="Correo del cleinte" name="correo" disabled value={values.correo} errors={errors} touched={touched} />
                            </Col>
                            <Col xs={12} md={6}>
                                <CamposFormulario label="Dirección del cliente" name="direccion" disabled value={values.direccion} errors={errors} touched={touched} />
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col xs={12} md={6}>
                                <CamposFormulario label="Localidad del cliente" name="localidad" disabled value={values.localidad} errors={errors} touched={touched} />
                            </Col>
                            <Col xs={12} md={6}>
                                <CamposFormulario label="Provincia del cliente" name="provincia" disabled value={values.provincia} errors={errors} touched={touched} />
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col xs={12} md={6}>
                                <CamposFormulario label="Fecha de la visita *" name="fecha" type="date" errors={errors} touched={touched} />
                            </Col>
                            <Col xs={12} md={6}>
                                <CamposFormulario label="Hora de la visita *" name="hora" type="time" errors={errors} touched={touched} />
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col xs={12} md={6}>
                                <CamposFormulario label="Número de Personas" name="numeroPersonas" type="number" placeholder="Ej: 4" errors={errors} touched={touched} tooltip="Introduce el número de personas que hay en la vivienda" />
                            </Col>
                            <Col xs={12} md={6}>
                                <CamposFormulario label="Número de Decisores *" name="numeroDecisores" type="number" placeholder="Ej: 2" errors={errors} touched={touched} tooltip="Introduce el número de decisores en la vivienda" />
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col xs={12} md={6}>
                                <CamposFormulario label="¿Tiene bombona?" name="tieneBombona" as="select"
                                    tooltip="Selecciona si el cliente tiene bombona" errors={errors} touched={touched} >
                                    <option value="Sin_datos">Sin datos</option>
                                    <option value="Si">Si</option>
                                    <option value="No">No</option>
                                </CamposFormulario>
                            </Col>
                            <Col xs={12} md={6}>
                                <CamposFormulario label="¿Tiene gas?" name="tieneGas" as="select"
                                    tooltip="Selecciona si el cliente tiene gas" errors={errors} touched={touched} >
                                    <option value="Sin_datos">Sin datos</option>
                                    <option value="Si">Si</option>
                                    <option value="No">No</option>
                                </CamposFormulario>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col xs={12} md={6}>
                                <CamposFormulario label="¿Tiene termo eléctrico?" name="tieneTermo" as="select"
                                    tooltip="Selecciona si el cliente tiene termo" errors={errors} touched={touched} >
                                    <option value="Sin_datos">Sin datos</option>
                                    <option value="Si">Si</option>
                                    <option value="No">No</option>
                                </CamposFormulario>
                            </Col>

                            <Col xs={12} md={6}>
                                <CamposFormulario label="¿Tiene placas térmicas?" name="tienePlacas" as="select"
                                    tooltip="Selecciona si el cliente tiene placas térmicas" errors={errors} touched={touched} >
                                    <option value="Sin_datos">Sin datos</option>
                                    <option value="Si">Si</option>
                                    <option value="No">No</option>
                                </CamposFormulario>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col xs={12} md={6}>
                                <CamposFormulario label="Importe Luz (€)" name="importeLuz" type="number" placeholder="Ej: 30,99" errors={errors} touched={touched} tooltip="Introduce el importe de luz de la última factura del cliente" />
                            </Col>
                            <Col xs={12} md={6}>
                                <CamposFormulario label="Importe Gas (€)" name="importeGas" type="number" placeholder="Ej: 20,99" errors={errors} touched={touched} tooltip="Introduce el importe de gas de la última factura del cliente" />
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col xs={12}>
                                <CamposFormulario label="Observaciones" name="observaciones" as="textarea" rows="3" errors={errors} touched={touched} />
                            </Col>
                        </Row>

                        <div className="d-flex justify-content-center">
                            <Button type="submit" className="mt-3" disabled={isSubmitting || !isValid} aria-label="Registrar visita" >
                                {isSubmitting ? "Enviando..." : "Registrar Feedback"}
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Container>
    );
}
