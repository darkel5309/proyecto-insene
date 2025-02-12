import { React, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';

export default function Comercial() {
    const [filas, setFilas] = useState([]);

    const columnas = [
        { field: 'id_cliente', headerName: 'Id', width: 90 },
        { field: 'nombre', headerName: 'Nombre', width: 160 },
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
        <div>
            <Link to="/comerciales/contacto">Registrar a un contacto</Link><br></br>
            <Link to="/comerciales/feedback">Registrar un feedback</Link><br></br>

            <p>
                Lista de clientes:
            </p>
            <div style={{ height: 450, width: '100%' }}>
                <DataGrid rows={filas} columns={columnas} pageSize={5} getRowId={(row) => row.id_cliente} />
            </div>
        </div>
    )
}