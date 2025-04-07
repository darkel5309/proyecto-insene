import React, { useState, useEffect, useCallback, useMemo } from "react";
import Axios from "../axiosConfig";
import { MaterialReactTable } from "material-react-table";
import { Container, Row, Col, Form, Button, Card, Alert } from "react-bootstrap";
import useDocumentTitle from "../components/Titulo";
import LoadingSpinner from "../components/LoadingSpinner";

export default function InformacionClientes() {
    useDocumentTitle("Panel de Administrador");

    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchLoading, setSearchLoading] = useState(false);
    const [error, setError] = useState(null);
    const [idCliente, setIdCliente] = useState("");
    const [datosCliente, setDatosCliente] = useState(null);
    const [actualizaciones, setActualizaciones] = useState([]);
    const [buscado, setBuscado] = useState(false);

    const columns = useMemo(() => [
        { accessorKey: "id_cliente", header: "ID", size: 80 },
        { accessorKey: "nombre", header: "Nombre", size: 150 },
        { accessorKey: "telefono", header: "Teléfono", size: 130 },
        { accessorKey: "localidad", header: "Localidad", size: 130 },
    ], []);

    useEffect(() => {
        const abortController = new AbortController();

        const obtenerTodosClientes = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await Axios.get("/obtenerTodosClientes", {
                    signal: abortController.signal,
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

        setSearchLoading(true);
        setError(null);
        setBuscado(true);
        
        try {
            const [responseCliente, responseActualizaciones] = await Promise.all([
                Axios.get(`/obtenerInformacionCliente/${id}`),
                Axios.get(`/mostrarActualizaciones/${id}`),
            ]);
            setDatosCliente(responseCliente.data);
            setActualizaciones(responseActualizaciones.data);
        } catch (err) {
            setError(`No se pudo encontrar el cliente con ID: ${id}`);
            setDatosCliente(null);
            setActualizaciones([]);
        } finally {
            setSearchLoading(false);
        }
    }, []);

    const handleIdChange = (e) => {
        setIdCliente(e.target.value);
        setBuscado(false);
        if (error) setError(null);
    };

    const renderClientesTable = () => (
        <Card className="shadow-sm">
            <Card.Header as="h5">Lista de Clientes</Card.Header>
            <Card.Body>
                <div className="tabla border rounded shadow-sm p-3 bg-light">
                    <MaterialReactTable
                        columns={columns}
                        data={clientes}
                        initialState={{ pagination: { pageIndex: 0, pageSize: 25 } }}
                        muiTableProps={{
                            sx: { width: "100%" },
                            "aria-label": "Tabla de clientes",
                        }}
                        muiTableContainerProps={{ sx: { width: "100%" } }}
                        muiTableBodyRowProps={({ row }) => ({
                            onClick: () => {
                                const id = row.original.id_cliente.toString();
                                setIdCliente(id);
                                setBuscado(false); 
                                setTimeout(() => {
                                    cargarDatosCliente(id);
                                }, 0);
                            },
                            sx: { cursor: "pointer" },
                        })}
                    />
                </div>
            </Card.Body>
        </Card>
    );

    const renderBuscador = () => (
        <div className="d-flex justify-content-end mb-3">
            <Form.Control 
                type="text" 
                value={idCliente} 
                onChange={handleIdChange} 
                placeholder="Introduce el ID del cliente"
                className="me-2" 
                aria-label="ID del cliente" 
            />
            <Button 
                onClick={() => cargarDatosCliente(idCliente)} 
                variant="primary" 
                aria-label="Buscar cliente"
                disabled={searchLoading}
            >
                {searchLoading ? (
                    <>
                        <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                        Buscando...
                    </>
                ) : (
                    "Buscar Cliente"
                )}
            </Button>
        </div>
    );

    const renderActualizaciones = () => (
        <Card className="shadow-sm mb-4">
            <Card.Header as="h5">Actualizaciones del Cliente</Card.Header>
            <Card.Body>
                {buscado ? (
                    actualizaciones.length > 0 ? (
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
                    ) : !error ? (
                        <div className="text-center p-3">
                            No hay actualizaciones para este cliente
                        </div>
                    ) : null
                ) : (
                    <div className="text-center p-3">
                        Introduce el ID del cliente y haz clic en "Buscar Cliente".
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
                                <strong>Modo de Captación:</strong> {datosCliente.modo_captacion}{" "} <br />
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
                        <Col md={6}>{renderClientesTable()}</Col>
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