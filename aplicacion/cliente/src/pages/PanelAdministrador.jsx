import '../styles/Paneles.css';
import { useEffect, useState, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import Axios from "../axiosConfig";
import { Container, Row, Col, Button } from "react-bootstrap";
import useDocumentTitle from '../components/Titulo';
import LoadingSpinner from "../components/LoadingSpinner";
import dayjs from 'dayjs';
import MRTTabla from "../utils/MRTTabla";

export default function PanelAdministrador() {
    useDocumentTitle("Panel de Administrador");

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const formatFecha = useCallback(
        (fecha) => fecha ? dayjs(fecha).format("DD/MM/YYYY HH:mm") : "-",
        []
    );

    const renderFecha = useCallback(
        ({ cell }) => formatFecha(cell.getValue()),
        [formatFecha]
    );

    const renderBotonModificar = useCallback(
        ({ row }) => (
            <Button
                variant="primary"
                className="boton-modificar"
                onClick={() => navigate(`/administradores/modificarTrabajador/${row.original.id_trabajador}`)}
                aria-label={`Modificar trabajador ${row.original.nombre}`}
            >
                Modificar
            </Button>
        ),
        [navigate]
    );

    const columns = useMemo(() => [
        { accessorKey: 'id_trabajador', header: 'ID', size: 80 },
        { accessorKey: 'nombre', header: 'TRABAJADOR', size: 200 },
        { accessorKey: 'puesto', header: 'PUESTO', size: 150 },
        { accessorKey: 'departamento', header: 'DEPARTAMENTO', size: 160 },
        { accessorKey: 'equipo', header: 'EQUIPO', size: 150 },
        { accessorKey: 'fecha_alta', header: 'F. ALTA', size: 150, Cell: renderFecha },
        { accessorKey: 'fecha_baja', header: 'F. BAJA', size: 150, Cell: renderFecha },
        { id: 'modificar', header: '', size: 100, Cell: renderBotonModificar },
    ], [renderFecha, renderBotonModificar]);

    useEffect(() => {
        const cargarTrabajadores = async () => {
            try {
                setLoading(true);
                const { data } = await Axios.get("/trabajadores");
                setData(data);
            } finally {
                setLoading(false);
            }
        };
        cargarTrabajadores();
    }, []);

    const BotonesNavegacion = useMemo(() => (
        <>
            <Row className="g-3 justify-content-center">
                {[
                    { path: "/administradores/registroTrabajador", label: "Registrar Trabajador" },
                    { path: "/captadores", label: "Panel de Captadores" },
                    { path: "/comerciales", label: "Panel de Comerciales" },
                    { path: "/coordinadores", label: "Panel Ruta" },
                ].map(({ path, label }) => (
                    <Col key={path} xs={12} sm={6} md={3} lg={3} className="d-flex justify-content-center">
                        <Button as={Link} to={path} variant="primary" className="boton-menu">
                            {label}
                        </Button>
                    </Col>
                ))}
            </Row>

            <Row className="g-3 justify-content-center mt-1">
                {[
                    { path: "/administradores/InformacionClientes", label: "Información de Clientes" },
                    { path: "/administradores/auditoria", label: "Información de Auditoría" },
                ]
                    .map(({ path, label }) => (
                        <Col key={path} xs={12} sm={6} md={3} lg={3} className="d-flex justify-content-center">
                            <Button as={Link} to={path} variant="primary" className="boton-menu">
                                {label}
                            </Button>
                        </Col>
                    ))}
            </Row>
        </>
    ), []);

    const rowStylesCallback = useMemo(
        () => (row) => ({
            sx: {
                backgroundColor: row.original.fecha_baja ? "#ffe6e6" : "#e6ffec",
            },
        }),
        []
    );

    return (
        <Container fluid="md" className="administrador">
            <h1 className="text-center mb-4">Panel de Administradores</h1>

            {loading ? (
                <LoadingSpinner message="Cargando datos de trabajadores..." />
            ) : (
                <>
                    {BotonesNavegacion}
                    <MRTTabla
                        title="Lista de trabajadores"
                        columns={columns}
                        data={data}
                        loading={loading}
                        rowStylesCallback={rowStylesCallback}
                    />
                </>
            )}
        </Container>
    );
}
