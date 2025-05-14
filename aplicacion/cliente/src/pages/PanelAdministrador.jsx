import '../styles/Paneles.css';
import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MaterialReactTable } from 'material-react-table';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import Axios from "../axiosConfig";
import { Container, Row, Col, Button } from "react-bootstrap";
import useDocumentTitle from '../components/Titulo';
import LoadingSpinner from "../components/LoadingSpinner";
import dayjs from 'dayjs';

export default function PanelAdministrador() {
    useDocumentTitle("Panel de Administrador");

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const formatFecha = (fecha) => fecha ? dayjs(fecha).format("DD/MM/YYYY HH:mm") : "-";

    const columns = useMemo(() => [
        { accessorKey: 'id_trabajador', header: 'ID', size: 70 },
        { accessorKey: 'nombre', header: 'TRABAJADOR', size: 150 },
        { accessorKey: 'rol', header: 'ROL', size: 130 },
        { accessorKey: 'equipo', header: 'EQUIPO', size: 130 },
        { accessorKey: 'subequipo', header: 'SUBEQUIPO', size: 130 },
        { accessorKey: 'fecha_alta', header: 'FECHA DE ALTA', size: 130, Cell: ({ cell }) => formatFecha(cell.getValue()) },
        { accessorKey: 'fecha_baja', header: 'FECHA DE BAJA', size: 130, Cell: ({ cell }) => formatFecha(cell.getValue()) },
        {
            id: 'modificar', header: '', size: 100, Cell: ({ row }) => (
                <Button variant="warning" onClick={() => navigate(`/administradores/modificarTrabajador/${row.original.id_trabajador}`)} aria-label={`Modificar trabajador ${row.original.nombre}`} >
                    Modificar
                </Button>
            ),
        },
    ], []);

    useEffect(() => {
        const obtenerTrabajadores = async () => {
            try {
                setLoading(true);
                const { data } = await Axios.get("/trabajadores");
                setData(data.reverse());
            } finally {
                setLoading(false);
            }
        };
        obtenerTrabajadores();
    }, []);

    const BotonesNavegacion = () => (
        <>
            <Row className="g-3 justify-content-center">
                <Col xs={12} sm={6} md={3} lg={3} className="d-flex justify-content-center">
                    <Button as={Link} to="/administradores/registroTrabajador" variant="primary" className="custom-button" aria-label="Registrar un nuevo trabajador">
                        Registrar Trabajador
                    </Button>
                </Col>
                <Col xs={12} sm={6} md={3} lg={3} className="d-flex justify-content-center">
                    <Button as={Link} to="/captadores" variant="primary" className="custom-button" aria-label="Ir al panel de captadores">
                        Panel de Captadores
                    </Button>
                </Col>
                <Col xs={12} sm={6} md={3} lg={3} className="d-flex justify-content-center">
                    <Button as={Link} to="/comerciales" variant="primary" className="custom-button" aria-label="Ir al panel de comerciales">
                        Panel de Comerciales
                    </Button>
                </Col>
                <Col xs={12} sm={6} md={3} lg={3} className="d-flex justify-content-center">
                    <Button as={Link} to="/coordinadores" variant="primary" className="custom-button" aria-label="Ir al panel de rutas">
                        Panel Ruta
                    </Button>
                </Col>
            </Row>

            <Row className="g-3 justify-content-center mt-1">
                <Col xs={12} sm={6} md={3} lg={3} className="d-flex justify-content-center">
                    <Button as={Link} to="/administradores/InformacionClientes" variant="primary" className="custom-button" aria-label="Ver información de los clientes">
                        Información de Clientes
                    </Button>
                </Col>
                <Col xs={12} sm={6} md={3} lg={3} className="d-flex justify-content-center">
                    <Button as={Link} to="/administradores/auditoria" variant="primary" className="custom-button" aria-label="Ver información de auditoría">
                        Información de Auditoría
                    </Button>
                </Col>
            </Row>
        </>
    );

    const TrabajadoresTable = () => (
        <Row>
            <Col>
                <h4 className="text-center mt-4">Lista de Trabajadores</h4>
                <div className="tabla border rounded shadow-sm p-3 bg-light mt-2 mb-4">
                    <MaterialReactTable
                        localization={MRT_Localization_ES}
                        columns={columns}
                        data={data}
                        enableColumnFilterModes={true}
                        enableDensityToggle={false}
                        enableColumnPinning={true}
                        initialState={{
                            density: "compact",
                            pagination: { pageIndex: 0, pageSize: 25 },
                            showColumnFilters: true,
                        }}
                        muiTableBodyRowProps={({ row }) => {
                            const estado = row.original.fecha_baja;

                            const backgroundColor = {
                                null: "#daf7a6",
                            }[estado] || "#f8d7da";

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
    );

    return (
        <Container fluid="md" className="administrador">
            <h1 className="text-center mb-4">Panel de Administradores</h1>
            {loading ? (
                <LoadingSpinner message="Cargando datos de trabajadores..." />
            ) : (
                <>
                    <BotonesNavegacion />
                    <TrabajadoresTable />
                </>
            )}
        </Container>
    );
}