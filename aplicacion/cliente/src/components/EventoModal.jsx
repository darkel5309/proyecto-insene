import { Modal, Button, Row, Col } from 'react-bootstrap';
import { Formik, Form } from 'formik';
import dayjs from "dayjs";
import CamposFormulario from './CamposFormulario';
import Swal from 'sweetalert2';
import * as Yup from 'yup';

const EventoModal = ({ show, onHide, evento, onGuardar, onEliminar, trabajadores }) => {
    const validacionEvento = Yup.object().shape({
        title: Yup.string().required('Este campo es obligatorio'),
        descripcion: Yup.string().required('Este campo es obligatorio'),
        estado: Yup.string().required('Este campo es obligatorio'),
        start: Yup.string().required('Este campo es obligatorio'),
        end: Yup.string().required('Este campo es obligatorio').test('is-after-start', 'La fecha de fin debe ser posterior a la de inicio', function (value) {
            const { start } = this.parent;
            return dayjs(value).isAfter(dayjs(start));
        }),
        id_trabajador: Yup.number().typeError('Debe ser un número').required('Este campo es obligatorio').positive('Debe ser mayor a 0'),
        id_vivienda: Yup.number().typeError('Debe ser un número').required('Este campo es obligatorio').positive('Debe ser mayor a 0'),
    });

    const initialValues = {
        title: evento?.title || '',
        descripcion: evento?.descripcion || '',
        start: evento?.start ? dayjs(evento.start).format('YYYY-MM-DDTHH:mm') : '',
        end: evento?.end ? dayjs(evento.end).format('YYYY-MM-DDTHH:mm') : '',
        estado: evento?.estado || 'pendiente',
        id_trabajador: evento?.id_trabajador || '',
        id_vivienda: evento?.id_vivienda || ''
    };

    const handleSubmit = (values) => {
        onGuardar(values);
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" centered fullscreen="sm-down" >
            <Modal.Header closeButton className="bg-primary text-white">
                <Modal.Title>{evento?.id ? 'Editar Visita' : 'Crear Visita'}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="px-3 py-4">
                <Formik initialValues={initialValues} enableReinitialize={true} onSubmit={handleSubmit} validationSchema={validacionEvento}>
                    {({ errors, touched }) => (
                        <Form>
                            <div className="mb-3">
                                <CamposFormulario label="Título *" name="title" placeholder="Título de la visita" errors={errors} touched={touched} />
                            </div>
                            <div className="mb-3">
                                <CamposFormulario label="Descripción *" name="descripcion" placeholder="Descripción de la visita" as="textarea"
                                    rows="3" errors={errors} touched={touched} />
                            </div>

                            <Row>
                                <Col xs={12} md={6}>
                                    <div className="mb-3">
                                        <CamposFormulario label="Fecha inicio *" name="start" type="datetime-local" errors={errors} touched={touched} />
                                    </div>
                                </Col>
                                <Col xs={12} md={6}>
                                    <div className="mb-3">
                                        <CamposFormulario label="Fecha fin *" name="end" type="datetime-local" errors={errors} touched={touched} />
                                    </div>
                                </Col>
                            </Row>

                            <Row>
                                <Col xs={12} md={6}>
                                    <div className="mb-3">
                                        <CamposFormulario label="Comercial a asignar *" name="id_trabajador" as="select" errors={errors} touched={touched}>
                                            <option value="">Selecciona a un comercial</option>
                                            {trabajadores
                                                .filter(trabajador => trabajador.puesto === 'comercial')
                                                .map(trabajador => (
                                                    <option key={trabajador.id_trabajador} value={trabajador.id_trabajador}>
                                                        {trabajador.nombre}
                                                    </option>
                                                ))}
                                        </CamposFormulario>
                                    </div>
                                </Col>
                                <Col xs={12} md={6}>
                                    <div className="mb-3">
                                        <CamposFormulario label="ID vivienda *" name="id_vivienda" type="number" placeholder="Ej: 12" errors={errors} touched={touched} />
                                    </div>
                                </Col>
                            </Row>

                            <div className="mb-3">
                                <CamposFormulario label="Estado *" name="estado" as="select" errors={errors} touched={touched}>
                                    <option value="cancelada">Cancelada</option>
                                    <option value="completada">Completada</option>
                                    <option value="pendiente">Pendiente</option>
                                </CamposFormulario>
                            </div>

                            <div className="d-flex justify-content-center gap-5 mt-4 mb-4">
                                <Button variant="primary" type="submit">
                                    {evento?.id ? '⚠️ Modificar' : '✅ Registrar'}
                                </Button>

                                {evento?.id && (
                                    <Button variant="danger" type="button" onClick={() => {
                                        Swal.fire({
                                            title: '¿Estás seguro?',
                                            text: "¡Este evento será eliminado permanentemente!",
                                            icon: 'warning',
                                            showCancelButton: true,
                                            confirmButtonText: 'Sí, eliminar',
                                            cancelButtonText: 'Cancelar',
                                        }).then((result) => {
                                            if (result.isConfirmed) {
                                                onEliminar(evento.id);
                                                onHide();
                                            }
                                        });
                                    }}
                                    >
                                        <i className="bi bi-trash me-1"></i> ❌ Eliminar
                                    </Button>
                                )}
                            </div>
                        </Form>
                    )}
                </Formik>
            </Modal.Body>
        </Modal>
    );
};

export default EventoModal;