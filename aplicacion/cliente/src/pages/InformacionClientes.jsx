import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "../axiosConfig";
import { MaterialReactTable } from "material-react-table";
import { Container, Row, Col, Form, Button, Card, Alert } from "react-bootstrap";
import useDocumentTitle from "../components/Titulo";
import LoadingSpinner from "../components/LoadingSpinner";
import dayjs from "dayjs";

export default function InformacionClientes() {
    useDocumentTitle("Panel de Clientes");

    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchLoading, setSearchLoading] = useState(false);
    const [error, setError] = useState(null);
    const [idCliente, setIdCliente] = useState("");
    const [datosCliente, setDatosCliente] = useState(null);
    const [actualizaciones, setActualizaciones] = useState([]);
    const navigate = useNavigate();
    const formatFecha = (fecha) => fecha ? dayjs(fecha).format("DD/MM/YYYY HH:mm") : "-";

    const handleModificar = (id_cliente) => {
        navigate(`/administradores/modificarCliente/${id_cliente}`);
    };

    const columns = useMemo(() => [
        { accessorKey: "id_cliente", header: "ID", size: 60 },
        { accessorKey: "nombre", header: "CLIENTE", size: 150 },
        { accessorKey: "telefono", header: "TELÉFONO", size: 130 },
        { accessorKey: "correo", header: "CORREO", size: 130 },
        { accessorKey: "dni", header: "DNI", size: 130 },
        { accessorKey: "iban", header: "IBAN", size: 130 },
        { accessorKey: "modo_captacion", header: "MODO DE CAPTACIÓN", size: 130 },
        { accessorKey: "observaciones_cliente", header: "OBSERVACIONES", size: 130 },
        { accessorKey: "fecha_alta", header: "FECHA DE ALTA", size: 130, Cell: ({ cell }) => formatFecha(cell.getValue()) },
        { accessorKey: "direccion", header: "DIRECCIÓN", size: 130 },
        { accessorKey: "localidad", header: "LOCALIDAD", size: 130 },
        { accessorKey: "provincia", header: "PROVINCIA", size: 130 },
        {
            id: 'opciones', header: 'OPCIONES', size: 100, Cell: ({ row }) => (
                <Button variant="warning" onClick={() => handleModificar(row.original.id_cliente)}
                    aria-label={`Modificar cliente ${row.original.nombre}`}> Modificar
                </Button>
            ),
        },
    ], []);

    useEffect(() => {
        const fetchClientes = async () => {
            try {
                const { data } = await Axios.get("/clientes");
                setClientes([...data].reverse());
            } catch {
                setError("No se pudo cargar la lista de clientes.");
            } finally {
                setLoading(false);
            }
        };
        fetchClientes();
    }, []);

    const fetchClienteData = async (id) => {
        if (!id) return;
        setSearchLoading(true);
        setError(null);
        setDatosCliente(null);
        setActualizaciones([]);

        try {
            const [cliente, actualizaciones] = await Promise.all([
                Axios.get(`/clientes/${id}`),
                Axios.get(`/fechas/${id}`),
            ]);
            setDatosCliente(cliente.data);
            setActualizaciones(actualizaciones.data);
        } catch {
            setError(`El cliente con ID ${id} no existe.`);
        } finally {
            setSearchLoading(false);
        }
    };

    const handleSearch = () => fetchClienteData(idCliente);
    const handleRowClick = (id) => {
        setIdCliente(id);
        fetchClienteData(id);
    };

    const renderClienteData = () => {
        const sections = [
            {
                title: "Datos del Cliente", fields: [
                    { label: "ID", value: datosCliente?.id_cliente },
                    { label: "Nombre", value: datosCliente?.nombre },
                    { label: "Teléfono", value: datosCliente?.telefono },
                    { label: "Correo", value: datosCliente?.correo },
                    { label: "DNI", value: datosCliente?.dni },
                    { label: "IBAN", value: datosCliente?.iban },
                    { label: "Modo de Captación", value: datosCliente?.modo_captacion },
                    { label: "Observaciones", value: datosCliente?.observaciones_cliente }
                ]
            },
            {
                title: "Domicilio", fields: [
                    { label: "Dirección", value: datosCliente?.direccion },
                    { label: "Localidad", value: datosCliente?.localidad },
                    { label: "Provincia", value: datosCliente?.provincia }
                ]
            },
            {
                title: "Venta", fields: [
                    { label: "Estado de Venta", value: datosCliente?.estado_venta },
                    { label: "ID Trabajador", value: datosCliente?.id_trabajador },
                    { label: "Fecha de Firma", value: datosCliente?.fecha_firma ? dayjs(datosCliente.fecha_firma).format("DD/MM/YYYY HH:mm:ss") : null },
                    { label: "Forma de Pago", value: datosCliente?.forma_pago }
                ]
            },

        ];

        return (
            <Row>
                {sections.map(({ title, fields }, idx) => (
                    <Col md={4} key={idx}>
                        <Card className="mb-3">
                            <Card.Header as="h5">{title}</Card.Header>
                            <Card.Body>
                                <Card.Text>
                                    {fields.map(({ label, value }, i) => (
                                        <React.Fragment key={i}>
                                            <strong>{label}:</strong> {value || ""} <br />
                                        </React.Fragment>
                                    ))}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
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
                            <Card className="shadow-sm">
                                <Card.Header as="h5">Lista de Clientes</Card.Header>
                                <Card.Body>
                                    <MaterialReactTable
                                        columns={columns}
                                        data={clientes}
                                        enableColumnFilterModes
                                        enableDensityToggle={false}
                                        enableColumnPinning
                                        initialState={{
                                            density: "compact",
                                            pagination: { pageIndex: 0, pageSize: 25 },
                                            showColumnFilters: true,
                                        }}
                                        muiTableBodyRowProps={({ row }) => ({
                                            onClick: () => handleRowClick(row.original.id_cliente.toString()),
                                            sx: { cursor: "pointer" },
                                        })}
                                    />
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md={6}>
                            <div className="d-flex justify-content-end mb-3">
                                <Form.Control
                                    type="text"
                                    value={idCliente}
                                    onChange={(e) => setIdCliente(e.target.value)}
                                    placeholder="Introduce el ID del cliente"
                                    className="me-2"
                                />
                                <Button onClick={handleSearch} variant="primary" disabled={searchLoading}>
                                    {searchLoading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-1" role="status" />
                                            Buscando...
                                        </>
                                    ) : (
                                        "Buscar Cliente"
                                    )}
                                </Button>
                            </div>

                            <Card className="shadow-sm mb-4">
                                <Card.Header as="h5">Actualizaciones del Cliente</Card.Header>
                                <Card.Body>
                                    {actualizaciones.length ? (
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
                                    ) : (
                                        <div className="text-center p-3">Sin actualizaciones</div>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    {renderClienteData()}
                </>
            )}
        </Container>
    );
}
