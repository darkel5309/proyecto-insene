import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { esES } from "@mui/x-data-grid/locales";
import { CircularProgress } from "@mui/material";
import Axios from "../axiosConfig";
import { Container, Row, Col, Button } from "react-bootstrap";

const columnas = [
    { field: 'id_trabajador', headerName: 'ID', flex: 0.5, minWidth: 90 },
    { field: 'nombre', headerName: 'Trabajador', flex: 1, minWidth: 150 },
    { field: 'rol', headerName: 'Rol', flex: 1, minWidth: 130 },
    { field: 'telefono', headerName: 'Teléfono', flex: 1, minWidth: 130 },
];

export default function PanelAdministrador() {
    useEffect(() => {
        document.title = "Panel de Administrador";
    }, []);

    const [filas, setFilas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const obtenerTrabajadores = async () => {
            setLoading(true);
            try {
                const { data } = await Axios.get("/obtenerTrabajadoresSimplificado");
                setFilas(data.reverse());
            } finally {
                setLoading(false);
            }
        };
        obtenerTrabajadores();
    }, []);

    return (
        <Container fluid="md" className="administrador">
            <h1 className="text-center mb-4">Panel de Administradores</h1>

            {loading ? (
                <div className="d-flex justify-content-center align-items-center vh-100">
                    <CircularProgress />
                    <p className="ms-2">Cargando...</p>
                </div>
            ) : (
                <>
                    <Row className="mb-4">
                        <Col>
                            <Button
                                as={Link}
                                to="/administradores/registroTrabajador"
                                variant="primary"
                                className="me-2"
                                aria-label="Crear un nuevo trabajador"
                            >
                                Crear Trabajador
                            </Button>
                            <Button
                                as={Link}
                                to="/captadores"
                                variant="secondary"
                                className="me-2"
                                aria-label="Ir al panel de captadores"
                            >
                                Panel de Captadores
                            </Button>
                            <Button
                                as={Link}
                                to="/comerciales"
                                variant="secondary"
                                className="me-2"
                                aria-label="Ir al panel de comerciales"
                            >
                                Panel de Comerciales
                            </Button>
                            <Button
                                as={Link}
                                to="/administradores/InformacionClientes"
                                variant="info"
                                aria-label="Ver información de los clientes"
                            >
                                Información de Clientes
                            </Button>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <div className="tabla border rounded shadow-sm p-3 bg-light">
                                <DataGrid
                                    localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                                    rows={filas}
                                    columns={columnas}
                                    pageSize={5}
                                    getRowId={(row) => row.id_trabajador}
                                    autoHeight
                                />
                            </div>
                        </Col>
                    </Row>
                </>
            )}
        </Container>
    );
}
