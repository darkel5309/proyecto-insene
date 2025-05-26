import '../styles/Paneles.css';
import { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import Axios from "../axiosConfig";
import { Container, Row, Col, Button } from "react-bootstrap";
import useDocumentTitle from "../components/Titulo";
import LoadingSpinner from "../components/LoadingSpinner";
import dayjs from 'dayjs';
import MRTTabla from "../utils/MRTTabla";

export default function InformacionVentas() {
    useDocumentTitle("Información de Ventas");

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const formatFecha = useCallback(
        (fecha) => fecha ? dayjs(fecha).format("DD/MM/YYYY") : "-",
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
                onClick={() => navigate(`/coordinadores/modificarVenta/${row.original.id_venta}`)}
                aria-label={`Modificar venta ${row.original.id_venta}`}
            >
                ✏️ Modificar
            </Button>
        ),
        [navigate]
    );

    const columns = useMemo(() => [
        { accessorKey: "id_venta", header: "ID", size: 80 },
        { accessorKey: "nombre_trabajador", header: "TRABAJADOR", size: 220 },
        { accessorKey: "nombre_cliente", header: "CLIENTE", size: 220 },
        { accessorKey: "estado_venta", header: "ESTADO", size: 130 },
        { accessorKey: "fecha_firma", header: "FECHA FIRMA", size: 150, Cell: renderFecha },
        { accessorKey: "forma_pago", header: "FORMA PAGO", size: 150 },
        { accessorKey: "certificado_energetico", header: "CERTIFICADO\nENERGÉTICO", size: 180 },
        { accessorKey: "gestion_subvencion", header: "SUBVENCIÓN", size: 150 },
        { accessorKey: "gestion_legalizacion", header: "LEGALIZACIÓN", size: 160 },
        { accessorKey: "fecha_legalizacion", header: "FECHA DE\nLEGALIZACIÓN", size: 160, Cell: renderFecha, },
        { id: "modificar", header: "", size: 140, Cell: renderBotonModificar },
    ], [renderFecha, renderBotonModificar]);

    useEffect(() => {
        const cargarVentas = async () => {
            try {
                setLoading(true);
                const { data } = await Axios.get("/ventas");
                setData(data);
            } finally {
                setLoading(false);
            }
        };
        cargarVentas();
    }, []);

    const BotonesNavegacion = useMemo(() => (
        <>
            <Row className="g-3 justify-content-center">
                {[
                    { path: "/coordinadores/registroVenta", label: "Registrar Venta 📝" },
                ].map(({ path, label }) => (
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
                backgroundColor: {
                    "instalada": "#e6ffec",
                    "caida": "#ffe6e6",
                }[row.original.estado_venta] || "transparent",
            },
        }),
        []
    );

    return (
        <Container fluid="md" className="ventas">
            <h1 className="text-center mb-4">Información de Ventas</h1>

            {loading ? (
                <LoadingSpinner message="Cargando datos de ventas..." />
            ) : (
                <>
                    {BotonesNavegacion}
                    <MRTTabla
                        title="🗃️ Lista de ventas"
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
