import '../styles/Paneles.css';
import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "../axiosConfig";
import { Container, Row, Col, Form, Button, Card, Alert } from "react-bootstrap";
import useDocumentTitle from "../components/Titulo";
import LoadingSpinner from "../components/LoadingSpinner";
import dayjs from "dayjs";
import MRTTabla from "../utils/MRTTabla";

export default function InformacionClientes() {
    useDocumentTitle("Información de Clientes");
    const navigate = useNavigate();

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchLoading, setSearchLoading] = useState(false);
    const [error, setError] = useState(null);
    const [idCliente, setIdCliente] = useState("");
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
    const [actualizaciones, setActualizaciones] = useState([]);

    const formatFecha = useCallback(
        (fecha) => fecha ? dayjs(fecha).format("DD/MM/YYYY HH:mm") : "-",
        []
    );

    const renderFecha = useCallback(
        ({ cell }) => formatFecha(cell.getValue()),
        [formatFecha]
    );

    const renderBotonModificar = useCallback(
        ({ row }) => (
            <Button
                variant="primary"
                className="boton-modificar"
                onClick={() => navigate(`/administradores/modificarCliente/${row.original.id_cliente}`)}
                aria-label={`Modificar cliente ${row.original.nombre}`}
            >
                ✏️ Modificar
            </Button>
        ),
        [navigate]
    );

    const columns = useMemo(() => [
        { accessorKey: "id_cliente", header: "ID", size: 80 },
        { accessorKey: "nombre", header: "CLIENTE", size: 210 },
        { accessorKey: "telefono", header: "TELÉFONO", size: 150 },
        { accessorKey: "correo", header: "CORREO", size: 200 },
        { accessorKey: "dni", header: "DNI", size: 150 },
        { accessorKey: "fecha_alta", header: "FECHA ALTA", size: 150, Cell: renderFecha },
        { accessorKey: "direccion", header: "DIRECCIÓN", size: 250 },
        { accessorKey: "localidad", header: "LOCALIDAD", size: 200 },
        { accessorKey: "provincia", header: "PROVINCIA", size: 200 },
        { id: "modificar", header: "", size: 140, Cell: renderBotonModificar },
    ], [renderFecha, renderBotonModificar]);

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
            <Row className="gy-1">
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
            <h1 className="text-center mb-2">Información de Clientes</h1>

            {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}

            {loading ? (
                <LoadingSpinner message="Cargando datos de clientes..." />
            ) : (
                <>
                    <Row className="mb-4">
                        <MRTTabla
                            title="🗃️ Lista de clientes"
                            columns={columns}
                            data={data}
                            loading={false}
                            muiTableBodyRowProps={({ row }) => ({
                                onClick: () => handleRowClick(row.original.id_cliente.toString()),
                                sx: { cursor: "pointer" }
                            })}
                        />

                        <Form className="d-flex mb-4">
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
                                ) : "🔍 Buscar"}
                            </Button>
                        </Form>

                        <Card className="shadow-sm mb-4">
                            <Card.Header as="h5">Actualizaciones del Cliente</Card.Header>
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
                        </Card>
                    </Row>
                    {renderTarjetasCliente()}
                </>
            )}
        </Container>
    );
}
