import '../styles/Agenda.css';
import '../styles/Formularios.css';
import { Card, Container, Row, Col, Badge, Button } from 'react-bootstrap';
import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from '@fullcalendar/core/locales/es';
import axios from "../axiosConfig";
import Swal from 'sweetalert2';
import { erroresSweetAlert2 } from '../utils/erroresSweetAlert2';
import useDocumentTitle from '../components/Titulo';
import EventoModal from "../components/EventoModal";
import dayjs from 'dayjs';

const Agenda = () => {
    useDocumentTitle("Panel de Coordinadores");

    const [eventos, setEventos] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [vistaActual, setVistaActual] = useState('dayGridMonth');

    useEffect(() => {
        const obtenerEventos = async () => {
            try {
                const response = await axios.get("/agenda");
                const eventosTransformados = response.data.map(item => ({
                    id: item.id_agenda,
                    title: item.titulo,
                    descripcion: item.descripcion,
                    start: item.fecha_inicio_agenda,
                    end: item.fecha_fin_agenda,
                    estado: item.estado,
                    id_trabajador: item.id_trabajador,
                    id_vivienda: item.id_vivienda,
                    backgroundColor: item.estado === "Pendiente" ? "#facc15" : "#4ade80",
                    borderColor: "#000",
                }));
                setEventos(eventosTransformados);
            } catch (error) {
                console.error("Error al cargar la agenda:", error);
            }
        };

        obtenerEventos();
    }, []);

    const manejarClickEvento = (info) => {
        const evento = {
            id: info.event.id,
            title: info.event.title,
            descripcion: info.event.extendedProps.descripcion,
            start: info.event.startStr,
            end: info.event.endStr,
            estado: info.event.extendedProps.estado,
            id_trabajador: info.event.extendedProps.id_trabajador,
            id_vivienda: info.event.extendedProps.id_vivienda
        };
        setEventoSeleccionado(evento);
        setModoEdicion(true);
        setMostrarModal(true);
    };

    const manejarClicDia = (info) => {
        const evento = {
            title: '',
            descripcion: '',
            start: info.dateStr,
            end: info.dateStr,
            estado: 'Pendiente',
            id_trabajador: '',
            id_vivienda: '',
        };
        setEventoSeleccionado(evento);
        setModoEdicion(false);
        setMostrarModal(true);
    };

    const manejarGuardarEvento = async (eventoModificado) => {
        try {
            const eventoConFechasFormateadas = {
                titulo: eventoModificado.title || '',
                descripcion: eventoModificado.descripcion || '',
                fechaInicio: dayjs(eventoModificado.start).format('YYYY-MM-DD HH:mm:ss'),
                fechaFin: dayjs(eventoModificado.end).format('YYYY-MM-DD HH:mm:ss'),
                idTrabajador: parseInt(eventoModificado.id_trabajador),
                idVivienda: parseInt(eventoModificado.id_vivienda),
                estado: eventoModificado.estado
            };

            let nuevoEventoFormateado = null;

            if (modoEdicion) {
                await axios.put(`/agenda/${eventoSeleccionado.id}`, eventoConFechasFormateadas);

                nuevoEventoFormateado = {
                    id: eventoSeleccionado.id,
                    title: eventoConFechasFormateadas.titulo,
                    descripcion: eventoConFechasFormateadas.descripcion,
                    start: eventoConFechasFormateadas.fechaInicio,
                    end: eventoConFechasFormateadas.fechaFin,
                    estado: eventoConFechasFormateadas.estado,
                    id_trabajador: eventoConFechasFormateadas.idTrabajador,
                    id_vivienda: eventoConFechasFormateadas.idVivienda,
                    backgroundColor: eventoConFechasFormateadas.estado === "Pendiente" ? "#facc15" : "#4ade80",
                    borderColor: "#000",
                };

                setEventos(prevEventos =>
                    prevEventos.map(evento =>
                        evento.id === eventoSeleccionado.id ? nuevoEventoFormateado : evento
                    )
                );
            } else {
                const response = await axios.post('/agenda', eventoConFechasFormateadas);

                nuevoEventoFormateado = {
                    id: response.data.idAgenda,
                    title: eventoConFechasFormateadas.titulo,
                    descripcion: eventoConFechasFormateadas.descripcion,
                    start: eventoConFechasFormateadas.fechaInicio,
                    end: eventoConFechasFormateadas.fechaFin,
                    estado: eventoConFechasFormateadas.estado,
                    id_trabajador: eventoConFechasFormateadas.idTrabajador,
                    id_vivienda: eventoConFechasFormateadas.idVivienda,
                    backgroundColor: eventoConFechasFormateadas.estado === "Pendiente" ? "#facc15" : "#4ade80",
                    borderColor: "#000",
                };

                setEventos(prevEventos => [...prevEventos, nuevoEventoFormateado]);
            }

            Swal.fire({
                icon: "success",
                title: "Tarea guardada correctamente",
                confirmButtonText: "Vale"
            });

            setMostrarModal(false);

        } catch (error) {
            erroresSweetAlert2(error);
        }
    };

    const manejarEliminarEvento = async (eventoId) => {
        try {
            const respuesta = await axios.delete(`/agenda/${eventoId}`);
            if (respuesta.status === 200) {
                const response = await axios.get("/agenda");
                const eventosTransformados = response.data.map(item => ({
                    id: item.id_agenda,
                    title: item.titulo,
                    descripcion: item.descripcion,
                    start: item.fecha_inicio_agenda,
                    end: item.fecha_fin_agenda,
                    estado: item.estado,
                    id_trabajador: item.id_trabajador,
                    id_vivienda: item.id_vivienda,
                    backgroundColor: item.estado === "Pendiente" ? "#facc15" : "#4ade80",
                    borderColor: "#000",
                }));

                setEventos(eventosTransformados);

                Swal.fire({
                    icon: 'success',
                    title: 'Evento eliminado correctamente',
                    confirmButtonText: 'Aceptar',
                });
            }
        } catch (error) {
            erroresSweetAlert2(error);
        }
    };

    return (
        <Container fluid className="my-4 px-4">
            <Card className="shadow border-0 rounded-3">
                <Card.Header className="bg-primary bg-gradient text-white py-3">
                    <Row className="align-items-center">
                        <Col>
                            <h4 className="mb-0 d-flex align-items-center">
                                <i className="bi bi-calendar-week me-2 fs-3"></i>
                                Agenda de Comerciales
                            </h4>
                        </Col>
                        <Col xs="auto">
                            <Button variant="outline-light" size="sm"
                                onClick={() => {
                                    const evento = {
                                        title: '',
                                        descripcion: '',
                                        start: dayjs().format('YYYY-MM-DD'),
                                        end: dayjs().format('YYYY-MM-DD'),
                                        estado: 'Pendiente',
                                        id_trabajador: '',
                                        id_vivienda: ''
                                    };
                                    setEventoSeleccionado(evento);
                                    setModoEdicion(false);
                                    setMostrarModal(true);
                                }}
                            >
                                <i className="bi bi-plus-circle me-1"></i> Nuevo Evento
                            </Button>
                        </Col>
                    </Row>
                </Card.Header>
                <Card.Body className="p-0 p-md-3">
                    <div className="calendar-container">
                        <FullCalendar
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                            initialView="dayGridMonth"
                            events={eventos}
                            locales={[esLocale]}
                            locale="es"
                            eventClick={manejarClickEvento}
                            dateClick={manejarClicDia}
                            height="auto"
                            headerToolbar={{
                                left: 'prev,next today',
                                center: 'title',
                                right: 'dayGridMonth,timeGridWeek,timeGridDay'
                            }}
                            dayMaxEvents={3}
                            eventTimeFormat={{
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false,
                            }}
                            editable={true}
                            viewDidMount={(info) => setVistaActual(info.view.type)}
                            eventContent={(eventInfo) => {
                                const bgColor = eventInfo.event.extendedProps.estado === "Pendiente" ?
                                    "rgba(250, 204, 21, 0.85)" :
                                    "rgba(74, 222, 128, 0.85)";

                                return (
                                    <div className="event-content p-1 rounded d-flex align-items-center"
                                        style={{
                                            backgroundColor: bgColor,
                                            color: "#333",
                                            borderLeft: "3px solid " + (eventInfo.event.extendedProps.estado === "Pendiente" ? "#e9b800" : "#2fb062"),
                                            width: "100%"
                                        }}>
                                        <span className="event-title">
                                            {eventInfo.event.title}
                                        </span>
                                    </div>
                                );
                            }}
                        />
                    </div>
                </Card.Body>
                <Card.Footer className="bg-light p-3 border-0">
                    <Row className="g-2 align-items-center">
                        <Col>
                            <small className="text-muted">
                                <Badge bg="warning" className="me-2">Pendiente</Badge>
                                <Badge bg="success" className="me-2">Completado</Badge>
                                {eventos.length} eventos en total
                            </small>
                        </Col>
                        <Col xs="auto">
                            <div className="d-flex align-items-center">
                                <small className="text-muted me-2">Vista: </small>
                                <Badge bg="primary">{
                                    vistaActual === 'dayGridMonth' ? 'Mes' :
                                        vistaActual === 'timeGridWeek' ? 'Semana' : 'Día'
                                }</Badge>
                            </div>
                        </Col>
                    </Row>
                </Card.Footer>
            </Card>

            <EventoModal show={mostrarModal} onHide={() => setMostrarModal(false)} evento={eventoSeleccionado} onGuardar={manejarGuardarEvento} onEliminar={manejarEliminarEvento} />
        </Container>
    );
};

export default Agenda;
