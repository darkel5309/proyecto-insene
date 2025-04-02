import React, { useState, useEffect } from "react";
import Axios from "../axiosConfig";
import { DataGrid } from "@mui/x-data-grid";
import { esES } from "@mui/x-data-grid/locales";
import { Container, Row, Col, Form, Button, Spinner, Card } from "react-bootstrap";

const columnas = [
    { field: "id_cliente", headerName: "ID", flex: 0.5, minWidth: 90 },
    { field: "nombre", headerName: "Nombre", flex: 1, minWidth: 150 },
    { field: "telefono", headerName: "Teléfono", flex: 1, minWidth: 130 },
];

export default function InformacionClientes() {
    useEffect(() => {
        document.title = "Información de Clientes";
    }, []);

    const [filas, setFilas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [idCliente, setIdCliente] = useState("");
    const [datosCliente, setDatosCliente] = useState(null);
    const [actualizaciones, setActualizaciones] = useState([]);

    useEffect(() => {
        const obtenerTodosClientes = async () => {
            setLoading(true);
            try {
                const response = await Axios.get("/obtenerTodosClientes");
                setFilas(response.data.reverse());
            } finally {
                setLoading(false);
            }
        };
        obtenerTodosClientes();
    }, []);

    const handleBuscarCliente = async () => {
        if (!idCliente) return;
        
        setLoading(true);
        try {
            const responseCliente = await Axios.get(`/obtenerInformacionCliente/${idCliente}`);
            setDatosCliente(responseCliente.data);
            
            const responseActualizaciones = await Axios.get(`/mostrarActualizaciones/${idCliente}`);
            setActualizaciones(responseActualizaciones.data);
        } catch (error) {
            console.error("Error al buscar cliente:", error);
            setDatosCliente(null);
            setActualizaciones([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container fluid="md" className="informacion-clientes">
            <h1 className="text-center my-4">Información de Clientes</h1>

            {loading ? (
                <div className="d-flex justify-content-center align-items-center vh-100">
                    <Spinner animation="border" role="status" />
                    <span className="ms-2">Cargando...</span>
                </div>
            ) : (
                <>
                    <Row className="mb-4">
                        <Col md={6}>
                            <Card className="shadow-sm">
                                <Card.Header as="h5">Lista de Clientes</Card.Header>
                                <Card.Body>
                                    <div className="tabla border rounded shadow-sm p-3 bg-light">
                                        <DataGrid
                                            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                                            rows={filas}
                                            columns={columnas}
                                            pageSize={5}
                                            getRowId={(row) => row.id_cliente}
                                            autoHeight
                                            style={{ width: "100%" }}
                                            onRowClick={(params) => {
                                                setIdCliente(params.row.id_cliente.toString());
                                                handleBuscarCliente();
                                            }}
                                        />
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={6}>
                            {/* Botón de búsqueda arriba a la derecha */}
                            <div className="d-flex justify-content-end mb-3">
                                <Form.Control
                                    type="text"
                                    value={idCliente}
                                    onChange={(e) => setIdCliente(e.target.value)}
                                    placeholder="Ingrese ID del cliente"
                                    className="me-2"
                                />
                                <Button onClick={handleBuscarCliente} variant="primary">
                                    Buscar Cliente
                                </Button>
                            </div>
                            
                            {/* Tabla de actualizaciones debajo del botón */}
                            <Card className="shadow-sm mb-4">
                                <Card.Header as="h5">Actualizaciones del Cliente</Card.Header>
                                <Card.Body>
                                    {actualizaciones.length > 0 ? (
                                        <div className="table-responsive">
                                            <table className="table table-striped table-hover">
                                                <thead>
                                                    <tr>
                                                        <th>Fecha</th>
                                                        <th>Tipo de Actualización</th>
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
                                            Ingrese un ID de cliente para ver sus actualizaciones
                                        </div>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    {datosCliente && (
                        <Row>
                            <Col>
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
                            <Col>
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
                            <Col>
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
                    )}
                </>
            )}
        </Container>
    );
}