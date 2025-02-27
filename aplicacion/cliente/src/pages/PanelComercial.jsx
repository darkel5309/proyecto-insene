import { useState, useEffect } from 'react';
import '../styles/Comercial.css';
import { Link } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { esES } from '@mui/x-data-grid/locales';
import Axios from '../axiosConfig';

export default function PanelComercial() {
    useEffect(() => {
        document.title = "Comercial";
    }, []);

    const [filas, setFilas] = useState([]);
    const [loading, setLoading] = useState(true);

    const columnas = [
        { field: 'id_cliente', headerName: 'ID', width: 90 },
        { field: 'nombre', headerName: 'Cliente', width: 150 },
        { field: 'telefono', headerName: 'Teléfono', width: 130 },
    ];

    useEffect(() => {
        const obtenerClientes = async () => {
            try {
                const { data } = await Axios.get('/obtenerContactosSimplificado');
                setFilas(data.reverse());
            } finally {
                setLoading(false);
            }
        };
        obtenerClientes();
    }, []);

    if (loading) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="comercial">
            <div className="contenedorComercial">
                <h1>Panel de Comerciales</h1>
                <div className="enlaces">
                    <Link to="/comerciales/contacto" className='enlace' aria-label="Crear un nuevo contacto">Nuevo contacto</Link>
                    <Link to="/comerciales/feedback" className='enlace' aria-label="Crear un nuevo feedback">Nuevo feedback</Link>
                </div>

                <div className="tabla">
                    <DataGrid localeText={esES.components.MuiDataGrid.defaultProps.localeText} rows={filas} columns={columnas} pageSize={5} getRowId={(row) => row.id_cliente} />
                </div>
            </div>
        </div>
    );
}