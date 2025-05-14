import '../styles/Paneles.css';
import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import Axios from "../axiosConfig";
import { Container, Row, Col, Button } from "react-bootstrap";
import useDocumentTitle from "../components/Titulo";
import LoadingSpinner from "../components/LoadingSpinner";
import MRTTabla from "../utils/MRTTabla";

export default function PanelComercial() {
    useDocumentTitle("Panel de Comercial");

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const columns = useMemo(() => [
        { accessorKey: "id_cliente", header: "ID", size: 70 },
        { accessorKey: "nombre", header: "CLIENTE", size: 150 },
        { accessorKey: "telefono", header: "TELÉFONO", size: 130 },
        { accessorKey: "correo", header: "CORREO", size: 130 },
        { accessorKey: "direccion", header: "DIRECCIÓN", size: 130 },
        { accessorKey: "localidad", header: "LOCALIDAD", size: 130 },
        { accessorKey: "provincia", header: "PROVINCIA", size: 130 },
    ], []);

    useEffect(() => {
        const cargarClientes = async () => {
            try {
                setLoading(true);
                const { data } = await Axios.get("/clientes");
                setData(data);
            } finally {
                setLoading(false);
            }
        };
        cargarClientes();
    }, []);

    const BotonesNavegacion = useMemo(() => (
        <>
            <Row className="g-3 justify-content-center">
                {[
                    { path: "/comerciales/contacto", label: "Registrar Cliente" },
                    { path: "/comerciales/feedback", label: "Registrar Feedback" },
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

    return (
        <Container fluid="md" className="comercial">
            <h1 className="text-center mb-4">Panel de Comerciales</h1>

            {loading ? (
                <LoadingSpinner message="Cargando datos de clientes..." />
            ) : (
                <>
                    {BotonesNavegacion}
                    <MRTTabla
                        title="Lista de clientes"
                        columns={columns}
                        data={data}
                        loading={loading}
                    />
                </>
            )}
        </Container>
    );
}
