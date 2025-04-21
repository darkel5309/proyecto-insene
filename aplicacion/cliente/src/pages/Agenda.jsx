import '../styles/Agenda.css';
import '../styles/Formularios.css';
import { Card, Container, Row, Col, Badge, Button, Form } from 'react-bootstrap';
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
    const [eventosFiltrados, setEventosFiltrados] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [vistaActual, setVistaActual] = useState('dayGridMonth');
    const [trabajadores, setTrabajadores] = useState([]);
    const [filtroTrabajador, setFiltroTrabajador] = useState("todos");

    const obtenerColoresPorEstado = (estado) => {
        switch (estado) {
            case "Pendiente":
                return {
                    backgroundColor: "#facc15",
                    borderColor: "#eab308"
                };
            case "Completada":
                return {
                    backgroundColor: "#4ade80",
                    borderColor: "#22c55e"
                };
            case "Cancelada":
                return {
                    backgroundColor: "#f87171",
                    borderColor: "#dc2626"
                };
            default:
                return {
                    backgroundColor: "#d1d5db",
                    borderColor: "#9ca3af"
                };
        }
    };

    const cargarEventos = async () => {
        const [agendaRes, trabajadoresRes] = await Promise.all([
            axios.get("/agenda"),
            axios.get("/trabajadores")
        ]);

        const eventosTransformados = agendaRes.data.map(item => ({
            id: item.id_agenda,
            title: item.titulo,
            descripcion: item.descripcion,
            start: item.fecha_inicio_agenda,
            end: item.fecha_fin_agenda,
            estado: item.estado,
            id_trabajador: Number(item.id_trabajador),
            id_vivienda: item.id_vivienda,
            ...obtenerColoresPorEstado(item.estado),
        }));

        setEventos(eventosTransformados);
        setEventosFiltrados(filtroTrabajador === "todos"
            ? eventosTransformados
            : eventosTransformados.filter(e => e.id_trabajador === parseInt(filtroTrabajador))
        );
        setTrabajadores(trabajadoresRes.data);
    };

    useEffect(() => {
        cargarEventos();
    }, []);

    useEffect(() => {
        setEventosFiltrados(
            filtroTrabajador === "todos"
                ? eventos
                : eventos.filter(e => e.id_trabajador === parseInt(filtroTrabajador))
        );
    }, [filtroTrabajador, eventos]);

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

            if (modoEdicion) {
                await axios.put(`/agenda/${eventoSeleccionado.id}`, eventoConFechasFormateadas);
            } else {
                await axios.post('/agenda', eventoConFechasFormateadas);
            }

            await cargarEventos();

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
                await cargarEventos();

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
                            <Button variant="outline-light" size="sm" onClick={() => {
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
                            }}>
                                <i className="bi bi-plus-circle me-1"></i> Nuevo Evento
                            </Button>
                        </Col>
                    </Row>
                </Card.Header>

                <Card.Body className="p-3">
                    <Row className="mb-3">
                        <Col md={4}>
                            <Form.Select value={filtroTrabajador} onChange={(e) => setFiltroTrabajador(e.target.value)}>
                                <option value="todos">Todos los comerciales</option>
                                {trabajadores.filter(t => t.rol === 'Comercial').map(t => (
                                    <option key={t.id_trabajador} value={t.id_trabajador}>{t.nombre}</option>
                                ))}
                            </Form.Select>
                        </Col>
                    </Row>

                    <div className="calendar-container">
                        <FullCalendar
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                            initialView="dayGridMonth"
                            events={eventosFiltrados}
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
                                const estado = eventInfo.event.extendedProps.estado;
                                const colores = obtenerColoresPorEstado(estado);

                                return (
                                    <div className="event-content p-1 rounded d-flex align-items-center" style={{
                                        backgroundColor: colores.backgroundColor,
                                        color: "#333",
                                        borderLeft: `3px solid ${colores.borderColor}`,
                                        width: "100%"
                                    }}>
                                        <span className="event-title">
                                            {dayjs(eventInfo.event.start).format('HH:mm')} - {eventInfo.event.title}
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
                                <Badge bg="success" className="me-2">Completada</Badge>
                                <Badge bg="danger" className="me-2">Cancelada</Badge>
                                {eventosFiltrados.length} eventos en total
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

            <EventoModal
                show={mostrarModal}
                onHide={() => setMostrarModal(false)}
                evento={eventoSeleccionado}
                onGuardar={manejarGuardarEvento}
                onEliminar={manejarEliminarEvento}
                trabajadores={trabajadores}
            />
        </Container>
    );
};

export default Agenda;
