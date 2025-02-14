import { React, useState, useEffect } from 'react';
import '../styles/Administrador.css';
import { Link } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { esES } from '@mui/x-data-grid/locales';
import axios from 'axios';

export default function Administrador() {
    const [filas, setFilas] = useState([]);

    const columnas = [
        { field: 'id_trabajador', headerName: 'Id', width: 90 },
        { field: 'nombre', headerName: 'Nombre', width: 150 },
        { field: 'rol', headerName: 'Rol', width: 130 },
        { field: 'telefono', headerName: 'Teléfono', width: 130 },
    ];

    useEffect(() => {
        axios.get('http://localhost:5174/api/obtenerTrabajadoresSimplificado')
            .then(response => {
                const datosAlReves = [...response.data].reverse();
                setFilas(datosAlReves);
            })
    }, []);

    return (
        <div className="administrador">
            <div className="contenedorAdministrador">
                <h1>Panel de Administradores</h1>
                <div className='enlaces'>
                    <Link to="/administradores/trabajador" className='enlace'>Crear Trabajador</Link><br></br>
                    <Link to="/captadores" className='enlace'>Panel de Captadores</Link><br></br>
                    <Link to="/comerciales" className='enlace'>Panel de Comerciales</Link><br></br>
                </div>

                <div className="tabla">
                    <DataGrid localeText={esES.components.MuiDataGrid.defaultProps.localeText} rows={filas} columns={columnas} pageSize={5} getRowId={(row) => row.id_trabajador} />
                </div>
            </div>
        </div>
    )
}