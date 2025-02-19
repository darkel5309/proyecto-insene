import { React, useState, useEffect } from 'react';
import '../styles/Administrador.css';
import { Link } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { esES } from '@mui/x-data-grid/locales';
import Axios from '../axiosConfig';

export default function Administrador() {
    const [filas, setFilas] = useState([]);
    const [loading, setLoading] = useState(true);

    const columnas = [
        { field: 'id_trabajador', headerName: 'ID', width: 90 },
        { field: 'nombre', headerName: 'Trabajador', width: 150 },
        { field: 'rol', headerName: 'Rol', width: 130 },
        { field: 'telefono', headerName: 'Teléfono', width: 130 },
    ];

    useEffect(() => {
        const obtenerTrabajadores = async () => {
            try {
                const response = await Axios.get('/obtenerTrabajadoresSimplificado');
                setFilas(response.data.reverse());
            } finally {
                setLoading(false);
            }
        };
        obtenerTrabajadores();
    }, []);

    if (loading) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="administrador">
            <div className="contenedorAdministrador">
                <h1>Panel de Administradores</h1>
                <div className='enlaces'>
                    <Link to="/administradores/trabajador" className='enlace'>Crear Trabajador</Link>
                    <Link to="/captadores" className='enlace'>Panel de Captadores</Link>
                    <Link to="/comerciales" className='enlace'>Panel de Comerciales</Link>
                </div>

                <div className="tabla">
                    <DataGrid localeText={esES.components.MuiDataGrid.defaultProps.localeText} rows={filas} columns={columnas} pageSize={5} getRowId={(row) => row.id_trabajador} />
                </div>
            </div>
        </div>
    );
}