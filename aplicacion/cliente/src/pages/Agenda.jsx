import '../styles/Agenda.css';
import '../styles/Formularios.css';
import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "../axiosConfig";
import EventoModal from "../components/EventoModal";
import dayjs from 'dayjs';

const Agenda = () => {
    const [eventos, setEventos] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
    const [modoEdicion, setModoEdicion] = useState(false);

    useEffect(() => {
        const obtenerEventos = async () => {
            try {
                const response = await axios.get("/agenda");
                const eventosTransformados = response.data.map(item => ({
                    id: item.id_agenda,
                    title: item.motivo || `Agenda #${item.id_agenda}`,
                    start: item.fecha_inicio_agenda,
                    end: item.fecha_fin_agenda,
                    estado: item.estado,
                    descripcion: item.descripcion || 'Sin descripción',
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

    // Manejar el clic en un evento
    const manejarClickEvento = (info) => {
        const evento = {
            id: info.event.id,
            title: info.event.title,
            start: info.event.startStr,
            end: info.event.endStr,
            estado: info.event.extendedProps.estado,
            descripcion: info.event.extendedProps.descripcion
        };
        setEventoSeleccionado(evento);
        setModoEdicion(true);
        setMostrarModal(true);
    };

    // Manejar el clic en un día vacío (para crear un nuevo evento)
    const manejarClicDia = (info) => {
        const evento = {
            title: '',
            start: info.dateStr,
            end: info.dateStr,
            estado: 'Pendiente',
            descripcion: '',
            id_trabajador: '',
            id_vivienda: ''
        };
        setEventoSeleccionado(evento);
        setModoEdicion(false); // Estamos creando un evento nuevo
        setMostrarModal(true);
    };


    const manejarGuardarEvento = async (eventoModificado) => {
        try {
            // Formatear las fechas usando dayjs y renombrar los campos para que coincidan con lo que espera el backend
            const eventoConFechasFormateadas = {
                titulo: eventoModificado.title || 'Sin título',
                motivo: eventoModificado.descripcion || 'Sin descripción',
                fechaInicio: dayjs(eventoModificado.start).format('YYYY-MM-DD HH:mm:ss'),
                fechaFin: dayjs(eventoModificado.end).format('YYYY-MM-DD HH:mm:ss'),
                idTrabajador: parseInt(eventoModificado.id_trabajador),
                idVivienda: parseInt(eventoModificado.id_vivienda),
                estado: eventoModificado.estado
            };

            console.log("Datos a enviar:", eventoConFechasFormateadas);

            if (modoEdicion) {
                // Actualizar el evento existente
                await axios.put(`/agenda/${eventoSeleccionado.id}`, eventoConFechasFormateadas);
                setEventos(prevEventos =>
                    prevEventos.map(evento =>
                        evento.id === eventoSeleccionado.id ? { ...evento, ...eventoConFechasFormateadas } : evento
                    )
                );
            } else {
                // Crear un nuevo evento
                const response = await axios.post('/agenda', eventoConFechasFormateadas);
                const nuevoEvento = {
                    id: response.data.idAgenda,
                    ...eventoConFechasFormateadas,
                };
                setEventos(prevEventos => [...prevEventos, nuevoEvento]);
            }
            setMostrarModal(false); // Cerrar el modal después de guardar
        } catch (error) {
            console.error("Error al guardar el evento:", error);
            if (error.response) {
                console.error("Detalles del error:", error.response.data);
            }
        }
    };

    return (
        <div className="p-6 bg-white rounded-2xl shadow-xl">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">📅 Agenda de Trabajadores</h2>
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={eventos}
                eventClick={manejarClickEvento}
                dateClick={manejarClicDia} // Esta propiedad permite crear un evento al hacer clic en una fecha
                height="auto"
                headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "",
                }}
                dayMaxEvents={3}
                eventTimeFormat={{
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                }}
                editable={true}
            />

            <EventoModal show={mostrarModal} onHide={() => setMostrarModal(false)} evento={eventoSeleccionado} onGuardar={manejarGuardarEvento} />
        </div>
    );
};

export default Agenda;
