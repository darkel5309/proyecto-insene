import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "../axiosConfig";
import { MaterialReactTable } from "material-react-table";
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { Container, Row, Col, Form, Button, Card, Alert } from "react-bootstrap";
import useDocumentTitle from "../components/Titulo";
import LoadingSpinner from "../components/LoadingSpinner";
import dayjs from "dayjs";

export default function InformacionClientes() {
    useDocumentTitle("Panel de Clientes");

    const navigate = useNavigate();

    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchLoading, setSearchLoading] = useState(false);
    const [error, setError] = useState(null);
    const [idCliente, setIdCliente] = useState("");
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
    const [actualizaciones, setActualizaciones] = useState([]);

    const formatFecha = (fecha) => fecha ? dayjs(fecha).format("DD/MM/YYYY HH:mm") : "-";

    const handleModificar = (id) => {
        navigate(`/administradores/modificarCliente/${id}`);
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
        const cargarClientes = async () => {
            try {
                const { data } = await Axios.get("/clientes");
                setClientes(data.reverse());
            } catch {
                setError("No se pudo cargar la lista de clientes.");
            } finally {
                setLoading(false);
            }
        };
        cargarClientes();
    }, []);

    const buscarCliente = useCallback(async (id) => {
        if (!id) return;
        setSearchLoading(true);
        setError(null);
        setClienteSeleccionado(null);
        setActualizaciones([]);

        try {
            const [clienteRes, actualizacionesRes] = await Promise.all([
                Axios.get(`/clientes/${id}`),
                Axios.get(`/fechas/${id}`)
            ]);
            setClienteSeleccionado(clienteRes.data);
            setActualizaciones(actualizacionesRes.data);
        } catch {
            setError(`El cliente con ID ${id} no existe.`);
        } finally {
            setSearchLoading(false);
        }
    }, []);

    const handleSearch = () => buscarCliente(idCliente);
    const handleRowClick = (id) => {
        setIdCliente(id);
        buscarCliente(id);
    };

    const renderTarjetasCliente = () => {
        if (!clienteSeleccionado) return null;

        const secciones = [
            {
                titulo: "Datos del Cliente",
                campos: [
                    ["ID", clienteSeleccionado.id_cliente],
                    ["Nombre", clienteSeleccionado.nombre],
                    ["Teléfono", clienteSeleccionado.telefono],
                    ["Correo", clienteSeleccionado.correo],
                    ["DNI", clienteSeleccionado.dni],
                    ["IBAN", clienteSeleccionado.iban],
                    ["Modo de Captación", clienteSeleccionado.modo_captacion],
                    ["Observaciones", clienteSeleccionado.observaciones_cliente],
                ]
            },
            {
                titulo: "Domicilio",
                campos: [
                    ["Dirección", clienteSeleccionado.direccion],
                    ["Localidad", clienteSeleccionado.localidad],
                    ["Provincia", clienteSeleccionado.provincia],
                ]
            },
            {
                titulo: "Venta",
                campos: [
                    ["Estado de Venta", clienteSeleccionado.estado_venta],
                    ["ID Trabajador", clienteSeleccionado.id_trabajador],
                    ["Fecha de Firma", clienteSeleccionado.fecha_firma ? dayjs(clienteSeleccionado.fecha_firma).format("DD/MM/YYYY HH:mm:ss") : ""],
                    ["Forma de Pago", clienteSeleccionado.forma_pago],
                ]
            }
        ];

        return (
            <Row className="mt-4">
                {secciones.map(({ titulo, campos }, idx) => (
                    <Col md={4} key={idx}>
                        <Card className="mb-3">
                            <Card.Header as="h5">{titulo}</Card.Header>
                            <Card.Body>
                                {campos.map(([label, valor], i) => (
                                    <div key={i}>
                                        <strong>{label}:</strong> {valor || "-"}
                                    </div>
                                ))}
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

            {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}

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
                                        localization={MRT_Localization_ES}
                                        columns={columns}
                                        data={clientes}
                                        enableColumnFilterModes
                                        enableColumnPinning
                                        enableDensityToggle={false}
                                        initialState={{
                                            density: "compact",
                                            pagination: { pageIndex: 0, pageSize: 25 },
                                            showColumnFilters: true
                                        }}
                                        muiTableBodyRowProps={({ row }) => ({
                                            onClick: () => handleRowClick(row.original.id_cliente.toString()),
                                            sx: { cursor: "pointer" }
                                        })}
                                    />
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md={6}>
                            <Form className="d-flex mb-3">
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
                                    ) : "Buscar Cliente"}
                                </Button>
                            </Form>

                            <Card className="shadow-sm mb-4">
                                <Card.Header as="h5">Actualizaciones del Cliente</Card.Header>
                                <Card.Body>
                                    {actualizaciones.length > 0 ? (
                                        <div className="table-responsive">
                                            <table className="table table-striped">
                                                <thead>
                                                    <tr>
                                                        <th>Fecha</th>
                                                        <th>Tipo de Actualización</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {actualizaciones.map((act, idx) => (
                                                        <tr key={idx}>
                                                            <td>{act.fecha}</td>
                                                            <td>{act.ultimas_actualizaciones}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <p className="text-center">Sin actualizaciones</p>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    {renderTarjetasCliente()}
                </>
            )}
        </Container>
    );
}