import { React, useState, useEffect } from 'react';
import '../styles/Comercial.css';
import { Link } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { esES } from '@mui/x-data-grid/locales';
import axios from 'axios';

export default function Comercial() {
    const [filas, setFilas] = useState([]);

    const columnas = [
        { field: 'id_cliente', headerName: 'Id', width: 90 },
        { field: 'nombre', headerName: 'Nombre', width: 150 },
        { field: 'telefono', headerName: 'Teléfono', width: 130 },
    ];

    useEffect(() => {
        axios.get('http://localhost:5174/api/obtenerContactosSimplificado')
            .then(response => {
                const datosAlReves = [...response.data].reverse();
                setFilas(datosAlReves);
            })
    }, []);

    return (
        <div className="comercial">
            <div className="contenedorComercial">
                <h1>Panel de Comerciales</h1>
                <div className="enlaces">
                    <Link to="/comerciales/contacto" className='enlace'>Nuevo contacto</Link><br></br>
                    <Link to="/comerciales/feedback" className='enlace'>Nuevo feedback</Link><br></br>
                </div>

                <div className="tabla">
                    <DataGrid localeText={esES.components.MuiDataGrid.defaultProps.localeText} rows={filas} columns={columnas} pageSize={5} getRowId={(row) => row.id_cliente} />
                </div>
            </div>
        </div>
    )
}