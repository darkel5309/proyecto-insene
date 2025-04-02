import '../styles/Paneles.css';
import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { esES } from "@mui/x-data-grid/locales";
import Axios from "../axiosConfig";
import { Container, Row, Col, Button } from "react-bootstrap";
import useDocumentTitle from '../components/Titulo';
import LoadingSpinner from "../components/LoadingSpinner";

export default function PanelComercial() {
    useDocumentTitle("Panel de Comercial");

    const [filas, setFilas] = useState([]);
    const [loading, setLoading] = useState(true);

    const columnas = useMemo(() => [
        { field: "id_cliente", headerName: "ID", flex: 0.5, minWidth: 90 },
        { field: "nombre", headerName: "Cliente", flex: 1, minWidth: 150 },
        { field: "telefono", headerName: "Teléfono", flex: 1, minWidth: 130 },
    ], []);

    useEffect(() => {
        const obtenerClientes = async () => {
            try {
                setLoading(true);
                const { data } = await Axios.get("/obtenerClientesSimplificado");
                setFilas([...data].reverse());
            } finally {
                setLoading(false);
            }
        };
        obtenerClientes();
    }, []);

    const BotonesNavegacion = () => (
        <Row className="g-3 justify-content-center">
            <Col xs={12} sm={6} md={3} lg={3} className="d-flex justify-content-center">
                <Button as={Link} to="/comerciales/contacto" variant="primary" className="custom-button" aria-label="Registrar un nuevo contacto" > Registrar Cliente </Button>
            </Col>
            <Col xs={12} sm={6} md={3} lg={3} className="d-flex justify-content-center">
                <Button as={Link} to="/comerciales/feedback" variant="primary" className="custom-button" aria-label="Registrar un nuevo feedback" > Registrar Feedback </Button>
            </Col>
        </Row>
    );

    const ClientesDataGrid = ({ filas, columnas }) => (
        <Row>
            <Col>
                <h4 className="text-center mt-4">Lista de Clientes</h4>
                <div className="tabla border rounded shadow-sm p-3 bg-light mt-2 mb-4 ">
                    <DataGrid
                        localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                        rows={filas}
                        columns={columnas}
                        pageSize={5}
                        getRowId={(row) => row.id_cliente}
                        autoHeight
                        aria-label="Tabla de Clientes"
                    />
                </div>
            </Col>
        </Row>
    );

    return (
        <Container fluid="md" className="comercial">
            <h1 className="text-center mb-4">Panel de Comerciales</h1>

            {loading ? (
                <LoadingSpinner message="Cargando datos de clientes..." />
            ) : (
                <>
                    <BotonesNavegacion />
                    <ClientesDataGrid filas={filas} columnas={columnas} />
                </>
            )
            }
        </Container>
    );
}
