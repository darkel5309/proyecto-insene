import '../styles/Paneles.css';
import { useEffect, useState, useMemo } from "react";
import { MaterialReactTable } from 'material-react-table';
import Axios from "../axiosConfig";
import { Container, Row, Col } from "react-bootstrap";
import useDocumentTitle from '../components/Titulo';
import LoadingSpinner from "../components/LoadingSpinner";
import dayjs from 'dayjs';

export default function InformacionAuditoria() {
    useDocumentTitle("Información de Auditoría");

    const [registros, setRegistros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const formatFecha = (fecha) => fecha ? dayjs(fecha).format("DD/MM/YYYY HH:mm:ss") : "-";

    const columns = useMemo(() => [
        { accessorKey: 'fecha', header: 'FECHA', size: 150, Cell: ({ cell }) => formatFecha(cell.getValue()), },
        { accessorKey: 'nombre', header: 'AUTOR', size: 150, Cell: ({ row }) => `${row.original.nombre}`, },
        { accessorKey: 'descripcion', header: 'SEGUIMIENTO', size: 200, },
    ], []);

    useEffect(() => {
        const cargarRegistros = async () => {
            try {
                setLoading(true);
                const { data } = await Axios.get('/registros');
                setRegistros(data);
                setError(null);
            } catch (error) {
                setError("Error al cargar los registros de auditoría.");
            } finally {
                setLoading(false);
            }
        };
        cargarRegistros();
    }, []);

    return (
        <Container fluid="md" className="administrador">
            <h1 className="text-center mb-4">Información de Auditoría</h1>

            {loading && <LoadingSpinner message="Cargando información de Auditoría..." />}

            {error && (
                <Alert variant="danger" className="text-center">
                    {error}
                </Alert>
            )}

            {!loading && !error && (
                <Row>
                    <Col>
                        <div className="tabla border rounded shadow-sm p-3 bg-light mt-2 mb-4">
                            <MaterialReactTable
                                columns={columns}
                                data={registros}
                                enableColumnFilterModes={true}
                                enableDensityToggle={false}
                                enableColumnPinning={true}
                                initialState={{
                                    density: "compact",
                                    pagination: { pageIndex: 0, pageSize: 25 },
                                    showColumnFilters: true,
                                }}
                            />
                        </div>
                    </Col>
                </Row>
            )}
        </Container>
    );
}

