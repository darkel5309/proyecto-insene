import { Modal, Button } from 'react-bootstrap';
import { Formik, Form } from 'formik';
import dayjs from 'dayjs';
import CamposFormulario from './CamposFormulario';
import * as Yup from 'yup';

const EventoModal = ({ show, onHide, evento, onGuardar }) => {
    const validacionEvento = Yup.object().shape({
        title: Yup.string().required('El título es obligatorio'),
        descripcion: Yup.string().required('La descripción es obligatoria'),
        estado: Yup.string().required('El estado es obligatorio'),
        start: Yup.string().required('La fecha de inicio es obligatoria'),
        end: Yup.string().required('La fecha de fin es obligatoria').test('is-after-start', 'La fecha de fin debe ser posterior a la de inicio', function (value) {
            const { start } = this.parent;
            return dayjs(value).isAfter(dayjs(start));
        }),
        id_trabajador: Yup.number().typeError('Debe ser un número').required('El ID del trabajador es obligatorio').positive('Debe ser mayor a 0'),
        id_vivienda: Yup.number().typeError('Debe ser un número').required('El ID de la vivienda es obligatorio').positive('Debe ser mayor a 0'),
    });

    const initialValues = {
        title: evento?.title || '',
        start: evento?.start ? dayjs(evento.start).format('YYYY-MM-DDTHH:mm') : '',
        end: evento?.end ? dayjs(evento.end).format('YYYY-MM-DDTHH:mm') : '',
        estado: evento?.estado || 'Pendiente',
        descripcion: evento?.descripcion || '',
        id_trabajador: evento?.id_trabajador || '',
        id_vivienda: evento?.id_vivienda || ''
    };

    const handleSubmit = (values) => {
        onGuardar(values);
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>{evento?.id ? 'Editar Evento' : 'Crear Evento'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Formik initialValues={initialValues} enableReinitialize={true} onSubmit={handleSubmit} validationSchema={validacionEvento}>
                    {({ errors, touched }) => (
                        <Form>
                            <CamposFormulario label="Título" name="title" placeholder="Título del evento" errors={errors} touched={touched} />
                            <CamposFormulario label="Descripción" name="descripcion" placeholder="Descripción del evento" errors={errors} touched={touched} />
                            <CamposFormulario label="Estado" name="estado" as="select" errors={errors} touched={touched}>
                                <option value="Pendiente">Pendiente</option>
                                <option value="Completada">Completada</option>
                                <option value="Cancelada">Cancelada</option>
                            </CamposFormulario>
                            <CamposFormulario label="Fecha Inicio" name="start" type="datetime-local" errors={errors} touched={touched} />
                            <CamposFormulario label="Fecha Fin" name="end" type="datetime-local" errors={errors} touched={touched} />
                            <CamposFormulario label="ID Trabajador" name="id_trabajador" type="number" errors={errors} touched={touched} />
                            <CamposFormulario label="ID Vivienda" name="id_vivienda" type="number" errors={errors} touched={touched} />

                            <Button variant="primary" type="submit">
                                {evento?.id ? 'Guardar Cambios' : 'Crear Evento'}
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Modal.Body>
        </Modal>
    );
};

export default EventoModal;
