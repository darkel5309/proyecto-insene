import '../styles/InformacionClientes.css';
import React, { useState, useEffect } from 'react';
import Axios from '../axiosConfig';
import { DataGrid } from '@mui/x-data-grid';
import { esES } from '@mui/x-data-grid/locales';

export default function InformacionClientes() {
    const [filas, setFilas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [idCliente, setIdCliente] = useState('');
    const [datosCliente, setDatosCliente] = useState(null);

    const columnas = [
        { field: 'id_cliente', headerName: 'ID', width: 90 },
        { field: 'nombre', headerName: 'Nombre', width: 150 },
        { field: 'telefono', headerName: 'Teléfono', width: 130 },
        { field: 'dni', headerName: 'DNI', width: 130 },
        { field: 'iban', headerName: 'IBAN', width: 250 },
        { field: 'correo', headerName: 'Correo', width: 200 },
        { field: 'modo_captacion', headerName: 'Modo de Captación', width: 150 },
        { field: 'observaciones_cliente', headerName: 'Observaciones', width: 250 },
    ];

    useEffect(() => {
        const obtenerClientes = async () => {
            try {
                const response = await Axios.get('/obtenerClientes');
                setFilas(response.data.reverse());
            } finally {
                setLoading(false);
            }
        };
        obtenerClientes();
    }, []);

    const handleBuscarCliente = async () => {
        try {
            const response = await Axios.get(`/obtenerCliente/${idCliente}`);
            setDatosCliente(response.data);
        } catch (error) {
            console.error('Error al obtener datos del cliente:', error);
        }
    };

    if (loading) {
        return <div>Cargando...</div>;
    }

    return (
        <div style={{ height: 600, width: '100%' }}>
            <DataGrid localeText={esES.components.MuiDataGrid.defaultProps.localeText} rows={filas} columns={columnas} pageSize={5} getRowId={(row) => row.id_cliente} />
            <div style={{ marginTop: 20 }}>
                <input
                    type="text"
                    value={idCliente}
                    onChange={(e) => setIdCliente(e.target.value)}
                    placeholder="Ingrese ID del cliente"
                />
                <button onClick={handleBuscarCliente}>Buscar Cliente</button>
            </div>
            {datosCliente && (
        <div className="three-columns-container">
            {/* Columna 1: Datos del cliente */}
            <div className="column">
                <h3>Datos del Cliente</h3>
                <p>ID: {datosCliente.id_cliente}</p>
                <p>Nombre: {datosCliente.nombre}</p>
                <p>Teléfono: {datosCliente.telefono}</p>
                <p>DNI: {datosCliente.dni}</p>
                <p>IBAN: {datosCliente.iban}</p>
                <p>Correo: {datosCliente.correo}</p>
                <p>Modo de Captación: {datosCliente.modo_captacion}</p>
                <p>Observaciones: {datosCliente.observaciones_cliente}</p>
            </div>

            {/* Columna 2: Venta */}
            <div className="column">
                <h3>Venta</h3>
                <p>Estado de Venta: {datosCliente.estado_venta}</p>
                <p>ID Trabajador: {datosCliente.id_trabajador}</p>
                <p>Fecha de Firma: {datosCliente.fecha_firma}</p>
                <p>Forma de Pago: {datosCliente.forma_pago}</p>
            </div>

            {/* Columna 3: Domicilio */}
            <div className="column">
                <h3>Domicilio</h3>
                <p>Dirección: {datosCliente.direccion}</p>
                <p>Localidad: {datosCliente.localidad}</p>
                <p>Provincia: {datosCliente.provincia}</p>
            </div>
        </div>
    )}
    </div>         
    );
}