import '../styles/Paneles.css';
import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { MaterialReactTable } from "material-react-table";
import Axios from "../axiosConfig";
import { Container, Row, Col, Button } from "react-bootstrap";
import useDocumentTitle from "../components/Titulo";
import LoadingSpinner from "../components/LoadingSpinner";

export default function PanelComercial() {
    useDocumentTitle("Panel de Comercial");

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const columns = useMemo(() => [
        { accessorKey: "id_cliente", header: "ID", size: 70 },
        { accessorKey: "nombre", header: "Cliente", size: 150 },
        { accessorKey: "telefono", header: "Teléfono", size: 130 },
    ], []);

    useEffect(() => {
        const obtenerClientes = async () => {
            try {
                setLoading(true);
                const { data } = await Axios.get("/obtenerClientesSimplificado");
                setData([...data].reverse());
            } finally {
                setLoading(false);
            }
        };
        obtenerClientes();
    }, []);

    const BotonesNavegacion = () => (
        <Row className="g-3 justify-content-center">
            <Col xs={12} sm={6} md={3} lg={3} className="d-flex justify-content-center">
                <Button as={Link} to="/comerciales/contacto" variant="primary" className="custom-button" aria-label="Registrar un nuevo contacto" >
                    Registrar Cliente
                </Button>
            </Col>
            <Col xs={12} sm={6} md={3} lg={3} className="d-flex justify-content-center">
                <Button as={Link} to="/comerciales/feedback" variant="primary" className="custom-button" aria-label="Registrar un nuevo feedback">
                    Registrar Feedback
                </Button>
            </Col>
        </Row>
    );

    const ClientesTable = () => (
        <Row>
            <Col>
                <h4 className="text-center mt-4">Lista de Clientes</h4>
                <div className="tabla border rounded shadow-sm p-3 bg-light mt-2 mb-4">
                    <MaterialReactTable
                        columns={columns}
                        data={data}
                        initialState={{ pagination: { pageIndex: 0, pageSize: 25 } }}
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
                    <ClientesTable />
                </>
            )}
        </Container>
    );
}
