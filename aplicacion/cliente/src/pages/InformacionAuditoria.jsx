import '../styles/Paneles.css';
import { useEffect, useState, useMemo, useCallback } from "react";
import Axios from "../axiosConfig";
import { Container } from "react-bootstrap";
import useDocumentTitle from '../components/Titulo';
import LoadingSpinner from "../components/LoadingSpinner";
import dayjs from 'dayjs';
import MRTTabla from "../utils/MRTTabla";

export default function InformacionAuditoria() {
    useDocumentTitle("Información de Auditoría");

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const formatFecha = useCallback(
        (fecha) => fecha ? dayjs(fecha).format("DD/MM/YYYY HH:mm:ss") : "-",
        []
    );

    const renderFecha = useCallback(
        ({ cell }) => formatFecha(cell.getValue()),
        [formatFecha]
    );

    const columns = useMemo(() => [
        { accessorKey: 'fecha', header: 'FECHA', size: 160, Cell: renderFecha, },
        { accessorKey: 'nombre', header: 'AUTOR', size: 220 },
        { accessorKey: 'descripcion', header: 'SEGUIMIENTO', size: 400 },
    ], [renderFecha]);

    useEffect(() => {
        const cargarRegistros = async () => {
            try {
                setLoading(true);
                const { data } = await Axios.get('/registros');
                setData(data);
            } finally {
                setLoading(false);
            }
        };
        cargarRegistros();
    }, []);

    return (
        <Container fluid="md" className="administrador">
            <h1 className="text-center mb-4">Información de Auditoría</h1>

            {loading ? (
                <LoadingSpinner message="Cargando datos de autotoría..." />
            ) : (
                <>
                    <MRTTabla
                        title="🗃️ Lista de auditoría"
                        columns={columns}
                        data={data}
                        loading={loading}
                    />
                </>
            )}
        </Container>
    );
}
