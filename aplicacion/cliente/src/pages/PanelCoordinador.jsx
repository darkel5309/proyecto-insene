import '../styles/Agenda.css';
import '../styles/Formularios.css';
import '../styles/Paneles.css';
import { Card, Container, Row, Col, Badge, Button, Form } from 'react-bootstrap';
import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
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
import dayjs from "dayjs";

export default function PanelCoordinador() {
    useDocumentTitle("Panel de Rutas");

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
            case "cancelada":
                return {
                    backgroundColor: "#f87171",
                    borderColor: "#dc2626"
                };
            case "completada":
                return {
                    backgroundColor: "#4ade80",
                    borderColor: "#22c55e"
                };
            default:
                return {
                    backgroundColor: "#facc15",
                    borderColor: "#eab308"
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
            start: dayjs(info.event.start).format('YYYY-MM-DDTHH:mm'),
            end: dayjs(info.event.end).format('YYYY-MM-DDTHH:mm'),
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
            start: dayjs(info.dateStr).format('YYYY-MM-DDTHH:mm'),
            end: dayjs(info.dateStr).format('YYYY-MM-DDTHH:mm'),
            estado: 'pendiente',
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
                await axios.put(`/agenda/${eventoSeleccionado.id}`, {
                    ...eventoConFechasFormateadas,
                    id: parseInt(eventoSeleccionado.id)
                });
            } else {
                await axios.post('/agenda', eventoConFechasFormateadas);
            }

            await cargarEventos();

            Swal.fire({
                icon: "success",
                title: "Tarea guardada correctamente",
                confirmButtonText: "OK"
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
                    confirmButtonText: 'OK',
                });
            }
        } catch (error) {
            erroresSweetAlert2(error);
        }
    };

    const BotonesNavegacion = useMemo(() => (
        <>
            <Row className="g-3 justify-content-center">
                {[
                    { path: "/coordinadores/ventas", label: "Información de Ventas 💶" },
                    { path: "/coordinadores/metricas", label: "Información de Métricas 📈" },
                ]
                    .map(({ path, label }) => (
                        <Col key={path} xs={12} sm={6} md={3} lg={3} className="d-flex justify-content-center">
                            <Button
                                as={Link}
                                to={path}
                                variant="primary"
                                className="boton-menu"
                            >
                                {label}
                            </Button>
                        </Col>
                    ))}
            </Row>
        </>
    ), []);

    return (
        <Container fluid className="my-4 px-4">
            <h1 className="text-center mb-4">Panel de Rutas</h1>

            {BotonesNavegacion}
            <Card className="shadow border-0 rounded-3 mt-4">
                <Card.Header className="bg-primary bg-gradient text-white py-3">
                    <Row className="align-items-center">
                        <Col>
                            <h4 className="mb-0 d-flex align-items-center">
                                <i className="bi bi-calendar-week me-2 fs-3"></i>
                                🗓️ Agenda
                            </h4>
                        </Col>
                        <Col xs="auto">
                            <Button variant="outline-light" size="sm" onClick={() => {
                                const evento = {
                                    title: '',
                                    descripcion: '',
                                    start: dayjs().format('YYYY-MM-DD'),
                                    end: dayjs().format('YYYY-MM-DD'),
                                    estado: 'pendiente',
                                    id_trabajador: '',
                                    id_vivienda: ''
                                };
                                setEventoSeleccionado(evento);
                                setModoEdicion(false);
                                setMostrarModal(true);
                            }}>
                                <i className="bi bi-plus-circle me-1"></i> Nuevo Evento 📝
                            </Button>
                        </Col>
                    </Row>
                </Card.Header>

                <Card.Body className="p-3">
                    <Row className="mb-3">
                        <Col xs={12} md={4}>
                            <Form.Select
                                value={filtroTrabajador}
                                onChange={(e) => setFiltroTrabajador(e.target.value)}
                                className="mb-2 mb-md-0">
                                <option value="todos">Todos los comerciales </option>
                                {trabajadores.filter(t => t.puesto === 'comercial').map(t => (
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
                                left: 'dayGridMonth,timeGridWeek,timeGridDay',
                                center: 'title',
                                right: 'prev,next today'
                            }}
                            dayMaxEvents={window.innerWidth < 768 ? 1 : 3}
                            eventTimeFormat={{
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false,
                            }}
                            editable={false}
                            nowIndicator={true}
                            businessHours={{
                                daysOfWeek: [1, 2, 3, 4, 5],
                                startTime: '8:00',
                                endTime: '20:00',
                            }}
                            fixedWeekCount={false}
                            navLinks={true}
                            viewDidMount={(info) => setVistaActual(info.view.type)}
                            eventContent={(eventInfo) => {
                                const estado = eventInfo.event.extendedProps.estado;
                                const colores = obtenerColoresPorEstado(estado);

                                return (
                                    <div className="event-content p-1 rounded d-flex align-items-center" style={{
                                        backgroundColor: colores.backgroundColor,
                                        color: "#333",
                                        borderLeft: `3px solid ${colores.borderColor}`,
                                        width: "100%",
                                        whiteSpace: "normal",
                                        minHeight: "100%",
                                        textOverflow: "ellipsis",
                                        fontSize: window.innerWidth < 768 ? '12px' : '15px'
                                    }}>
                                        <span className="event-title text-truncate">
                                            {dayjs(eventInfo.event.start).format('HH:mm')}-{eventInfo.event.title}
                                        </span>
                                    </div>
                                );
                            }}
                        />
                    </div>
                </Card.Body>

                <Card.Footer className="bg-light p-2 p-md-3 border-0">
                    <Row className="g-2 align-items-center">
                        <Col xs={12} md={true} className="mb-2 mb-md-0">
                            <small className="text-muted d-flex flex-wrap gap-1">
                                <Badge bg="danger" className="me-1">Cancelada</Badge>
                                <Badge bg="success" className="me-1">Completada</Badge>
                                <Badge bg="warning" className="me-1">Pendiente</Badge>
                                <span>{eventosFiltrados.length} eventos</span>
                            </small>
                        </Col>
                        <Col xs={12} md="auto">
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
}