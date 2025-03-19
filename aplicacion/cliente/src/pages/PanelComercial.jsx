import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { esES } from "@mui/x-data-grid/locales";
import Axios from "../axiosConfig";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";

export default function PanelComercial() {
    useEffect(() => {
        document.title = "Panel de Comercial";
    }, []);

    const [filas, setFilas] = useState([]);
    const [loading, setLoading] = useState(true);

    const columnas = [
        { field: "id_cliente", headerName: "ID", flex: 0.5, minWidth: 90 },
        { field: "nombre", headerName: "Cliente", flex: 1, minWidth: 150 },
        { field: "telefono", headerName: "Teléfono", flex: 1, minWidth: 130 },
    ];

    useEffect(() => {
        const obtenerClientes = async () => {
            try {
                const { data } = await Axios.get("/obtenerClientesSimplificado");
                setFilas(data.reverse());
            } finally {
                setLoading(false);
            }
        };
        obtenerClientes();
    }, []);

    return (
        <Container fluid="md" className="comercial">
            <h1 className="text-center my-4">Panel de Comerciales</h1>

            {loading ? (
                <div className="d-flex justify-content-center align-items-center vh-100">
                    <Spinner animation="border" role="status" />
                    <span className="ms-2">Cargando...</span>
                </div>
            ) : (
                <>
                    <Row className="mb-4">
                        <Col>
                            <Button
                                as={Link}
                                to="/comerciales/contacto"
                                variant="primary"
                                className="me-2"
                                aria-label="Crear un nuevo contacto"
                            >
                                Nuevo Contacto
                            </Button>
                            <Button
                                as={Link}
                                to="/comerciales/feedback"
                                variant="success"
                                aria-label="Crear un nuevo feedback"
                            >
                                Nuevo Feedback
                            </Button>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <div
                                className="tabla border rounded shadow-sm p-3 bg-light"
                                style={{ width: "100%" }}
                            >
                                <DataGrid
                                    localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                                    rows={filas}
                                    columns={columnas}
                                    pageSize={5}
                                    getRowId={(row) => row.id_cliente}
                                    autoHeight
                                    style={{ width: "100%" }}
                                />
                            </div>
                        </Col>
                    </Row>
                </>
            )}
        </Container>
    );
}
