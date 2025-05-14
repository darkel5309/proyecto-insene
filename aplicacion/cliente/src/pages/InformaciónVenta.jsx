import '../styles/Paneles.css';
import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { MaterialReactTable } from "material-react-table";
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import Axios from "../axiosConfig";
import { Container, Row, Col, Alert, Button } from "react-bootstrap";
import useDocumentTitle from "../components/Titulo";
import LoadingSpinner from "../components/LoadingSpinner";
import dayjs from 'dayjs';

export default function InformacionVentas() {
    useDocumentTitle("Información de Ventas");

    const [ventas, setVentas] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const formatFecha = (fecha) => fecha ? dayjs(fecha).format("DD/MM/YYYY") : "-";

    const columns = useMemo(() => [
        { accessorKey: "id_venta", header: "ID", size: 80 },
        { accessorKey: "nombre_cliente", header: "CLIENTE", size: 100 },
        { accessorKey: "nombre_trabajador", header: "TRABAJADOR", size: 100 },
        { accessorKey: "estado_venta", header: "ESTADO", size: 100 },
        { accessorKey: "fecha_firma", header: "FECHA FIRMA", size: 110, Cell: ({ cell }) => formatFecha(cell.getValue()), },
        { accessorKey: "forma_pago", header: "FORMA PAGO", size: 130 },
        { accessorKey: "certificado_energetico", header: "CERT. ENERGÉTICO", size: 140 },
        { accessorKey: "gestion_subvencion", header: "SUBVENCIÓN", size: 110 },
        { accessorKey: "gestion_legalizacion", header: "LEGALIZACIÓN", size: 120 },
        { accessorKey: "fecha_legalizacion", header: "FECHA LEGALIZACIÓN", size: 130, Cell: ({ cell }) => formatFecha(cell.getValue()), },
        {
            id: 'modificar', header: '', size: 100, Cell: ({ row }) => (
                <Button variant="warning" onClick={() => navigate(`/coordinadores/modificarVenta/${row.original.id_venta}`)} aria-label={`Modificar venta ${row.original.id_venta}`} >
                    Modificar
                </Button>
            ),
        },
    ], []);

    useEffect(() => {
        const obtenerVentas = async () => {
            try {
                setLoading(true);
                const { data } = await Axios.get("/ventas");
                setVentas(data);
                setError(null);
            } catch (err) {
                setError("No se pudo cargar la lista de ventas.");
            } finally {
                setLoading(false);
            }
        };
        obtenerVentas();
    }, []);

    return (
        <Container fluid="md" className="ventas">
            <h1 className="text-center mb-4">Información de Ventas</h1>

            <Row className="g-3 justify-content-center mb-4">
                <Col xs={12} sm={6} md={3} lg={3} className="d-flex justify-content-center">
                    <Button as={Link} to="/coordinadores/registroVenta" variant="primary" className="custom-button" aria-label="Registrar una nueva venta">
                        Registrar Venta
                    </Button>
                </Col>
            </Row>

            {loading && <LoadingSpinner message="Cargando datos de ventas..." />}
            {error && <Alert variant="danger" className="text-center">{error}</Alert>}

            {!loading && !error && (
                <Row>
                    <Col>
                        <h4 className="text-center">Lista de Ventas</h4>
                        <div className="tabla border rounded shadow-sm p-3 bg-light mt-2 mb-4">
                            <MaterialReactTable
                                localization={MRT_Localization_ES}
                                columns={columns}
                                data={ventas}
                                enableColumnFilterModes
                                enableDensityToggle={false}
                                enableColumnPinning
                                initialState={{
                                    density: "compact",
                                    pagination: { pageIndex: 0, pageSize: 25 },
                                    showColumnFilters: true,
                                }}
                                muiTableBodyRowProps={({ row }) => {
                                    const estado = row.original.estado_venta;

                                    const backgroundColor = {
                                        "Instalada": "#daf7a6",
                                        "Caída": "#f8d7da",
                                    }[estado] || "transparent";

                                    return {
                                        sx: {
                                            backgroundColor: backgroundColor,
                                        }
                                    };
                                }}
                            />
                        </div>
                    </Col>
                </Row>
            )}
        </Container>
    );
}
