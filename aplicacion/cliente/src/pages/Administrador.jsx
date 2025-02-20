import { useState, useEffect } from 'react';
import '../styles/Administrador.css';
import { Link } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { esES } from '@mui/x-data-grid/locales';
import { CircularProgress } from '@mui/material';
import Axios from '../axiosConfig';

const columnas = [
    { field: 'id_trabajador', headerName: 'ID', width: 90 },
    { field: 'nombre', headerName: 'Trabajador', width: 150 },
    { field: 'rol', headerName: 'Rol', width: 130 },
    { field: 'telefono', headerName: 'Teléfono', width: 130 },
];

export default function Administrador() {
    useEffect(() => {
        document.title = "Administrador";
    }, []);

    const [filas, setFilas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const obtenerTrabajadores = async () => {
            setLoading(true);
            try {
                const {data} = await Axios.get('/obtenerTrabajadoresSimplificado');
                setFilas(data.reverse());
            } finally {
                setLoading(false);
            }
        };
        obtenerTrabajadores();
    }, []);

    if (loading) {
        return (
            <div className="cargando">
                <CircularProgress />
                <p>Cargando...</p>
            </div>
        );
    }

    return (
        <div className="administrador">
            <div className="contenedorAdministrador">
                <h1>Panel de Administradores</h1>
                <div className='enlaces'>
                    <Link to="/administradores/trabajador" className='enlace' aria-label="Crear un nuevo trabajador">Crear Trabajador</Link>
                    <Link to="/captadores" className='enlace' aria-label="Ir al panel de captadores">Panel de Captadores</Link>
                    <Link to="/comerciales" className='enlace' aria-label="Ir al panel de comerciales">Panel de Comerciales</Link>
                </div>

                <div className="tabla">
                    <DataGrid localeText={esES.components.MuiDataGrid.defaultProps.localeText} rows={filas} columns={columnas} pageSize={5} getRowId={(row) => row.id_trabajador} />
                </div>
            </div>
        </div>
    );
}