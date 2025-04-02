import React, { useState, useEffect, useCallback } from "react";
import Axios from "../axiosConfig";
import { DataGrid } from "@mui/x-data-grid";
import { esES } from "@mui/x-data-grid/locales";
import { Container, Row, Col, Form, Button, Card, Alert } from "react-bootstrap";
import useDocumentTitle from '../components/Titulo';
import LoadingSpinner from "../components/LoadingSpinner";

export default function InformacionClientes() {
    useDocumentTitle("Panel de Administrador");

    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [idCliente, setIdCliente] = useState("");
    const [datosCliente, setDatosCliente] = useState(null);
    const [actualizaciones, setActualizaciones] = useState([]);

    const columnas = [
        { field: "id_cliente", headerName: "ID", flex: 0.5, minWidth: 90 },
        { field: "nombre", headerName: "Nombre", flex: 1, minWidth: 150 },
        { field: "telefono", headerName: "Teléfono", flex: 1, minWidth: 130 },
    ];

    useEffect(() => {
        const abortController = new AbortController();

        const obtenerTodosClientes = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await Axios.get("/obtenerTodosClientes", {
                    signal: abortController.signal
                });
                setClientes([...response.data].reverse());
            } finally {
                if (!abortController.signal.aborted) {
                    setLoading(false);
                }
            }
        };
        obtenerTodosClientes();
        return () => abortController.abort();
    }, []);

    const cargarDatosCliente = useCallback(async (id) => {
        if (!id) return;

        setLoading(true);
        setError(null);
        try {
            const [responseCliente, responseActualizaciones] = await Promise.all([
                Axios.get(`/obtenerInformacionCliente/${id}`),
                Axios.get(`/mostrarActualizaciones/${id}`)
            ]);

            setDatosCliente(responseCliente.data);
            setActualizaciones(responseActualizaciones.data);
        } catch (err) {
            setError(`No se pudo encontrar el cliente con ID: ${id}`);
            setDatosCliente(null);
            setActualizaciones([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const renderClientesDataGrid = () => (
        <Card className="shadow-sm">
            <Card.Header as="h5">Lista de Clientes</Card.Header>
            <Card.Body>
                <div className="tabla border rounded shadow-sm p-3 bg-light">
                    <DataGrid
                        localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                        rows={clientes}
                        columns={columnas}
                        pageSize={5}
                        rowsPerPageOptions={[5, 10, 25]}
                        getRowId={(row) => row.id_cliente}
                        autoHeight
                        disableSelectionOnClick
                        style={{ width: "100%" }}
                        onRowClick={(params) => {
                            setIdCliente(params.row.id_cliente.toString());
                            cargarDatosCliente(params.row.id_cliente.toString());
                        }}
                        aria-label="Tabla de clientes"
                    />
                </div>
            </Card.Body>
        </Card>
    );

    const renderBuscador = () => (
        <div className="d-flex justify-content-end mb-3">
            <Form.Control type="text" value={idCliente} onChange={(e) => setIdCliente(e.target.value)} placeholder="Introduce el ID del cliente" className="me-2" aria-label="ID del cliente" />
            <Button onClick={() => cargarDatosCliente(idCliente)} variant="primary" aria-label="Buscar cliente" > Buscar Cliente </Button>
        </div>
    );

    const renderActualizaciones = () => (
        <Card className="shadow-sm mb-4">
            <Card.Header as="h5">Actualizaciones del Cliente</Card.Header>
            <Card.Body>
                {actualizaciones.length > 0 ? (
                    <div className="table-responsive">
                        <table className="table table-striped table-hover">
                            <thead>
                                <tr>
                                    <th scope="col">Fecha</th>
                                    <th scope="col">Tipo de Actualización</th>
                                </tr>
                            </thead>
                            <tbody>
                                {actualizaciones.map((act, index) => (
                                    <tr key={index}>
                                        <td>{act.fecha}</td>
                                        <td>{act.ultimas_actualizaciones}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : idCliente ? (
                    <div className="text-center p-3">
                        No hay actualizaciones para este cliente
                    </div>
                ) : (
                    <div className="text-center p-3">
                        Introduce un ID de cliente para ver sus actualizaciones
                    </div>
                )}
            </Card.Body>
        </Card>
    );

    const renderDetallesCliente = () => {
        if (!datosCliente) return null;

        return (
            <Row>
                <Col md={4}>
                    <Card className="mb-3">
                        <Card.Header as="h5">Datos del Cliente</Card.Header>
                        <Card.Body>
                            <Card.Text>
                                <strong>ID:</strong> {datosCliente.id_cliente} <br />
                                <strong>Nombre:</strong> {datosCliente.nombre} <br />
                                <strong>Teléfono:</strong> {datosCliente.telefono} <br />
                                <strong>DNI:</strong> {datosCliente.dni} <br />
                                <strong>IBAN:</strong> {datosCliente.iban} <br />
                                <strong>Correo:</strong> {datosCliente.correo} <br />
                                <strong>Modo de Captación:</strong> {datosCliente.modo_captacion} <br />
                                <strong>Observaciones:</strong> {datosCliente.observaciones_cliente}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="mb-3">
                        <Card.Header as="h5">Venta</Card.Header>
                        <Card.Body>
                            <Card.Text>
                                <strong>Estado de Venta:</strong> {datosCliente.estado_venta} <br />
                                <strong>ID Trabajador:</strong> {datosCliente.id_trabajador} <br />
                                <strong>Fecha de Firma:</strong> {datosCliente.fecha_firma} <br />
                                <strong>Forma de Pago:</strong> {datosCliente.forma_pago}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="mb-3">
                        <Card.Header as="h5">Domicilio</Card.Header>
                        <Card.Body>
                            <Card.Text>
                                <strong>Dirección:</strong> {datosCliente.direccion} <br />
                                <strong>Localidad:</strong> {datosCliente.localidad} <br />
                                <strong>Provincia:</strong> {datosCliente.provincia}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        );
    };

    return (
        <Container fluid="md" className="informacion-clientes">
            <h1 className="text-center my-4">Información de Clientes</h1>

            {error && (
                <Alert variant="danger" dismissible onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {loading ? (
                <LoadingSpinner message="Cargando información de clientes..." />
            ) : (
                <>
                    <Row className="mb-4">
                        <Col md={6}>
                            {renderClientesDataGrid()}
                        </Col>
                        <Col md={6}>
                            {renderBuscador()}
                            {renderActualizaciones()}
                        </Col>
                    </Row>
                    {renderDetallesCliente()}
                </>
            )}
        </Container>
    );
}