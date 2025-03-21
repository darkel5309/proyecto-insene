import '../styles/Paneles.css';
import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { esES } from "@mui/x-data-grid/locales";
import { CircularProgress } from "@mui/material";
import Axios from "../axiosConfig";
import { Container, Row, Col, Button } from "react-bootstrap";

export default function PanelAdministrador() {
    useEffect(() => {
        document.title = "Panel de Administrador";
    }, []);

    const [filas, setFilas] = useState([]);
    const [loading, setLoading] = useState(true);


    const columnas = useMemo(() => [
        { field: 'id_trabajador', headerName: 'ID', flex: 0.5, minWidth: 90, cellClassName: 'datagrid-cell' },
        { field: 'nombre', headerName: 'Trabajador', flex: 1, minWidth: 150, cellClassName: 'datagrid-cell' },
        { field: 'rol', headerName: 'Rol', flex: 1, minWidth: 130, cellClassName: 'datagrid-cell' },
        { field: 'telefono', headerName: 'Teléfono', flex: 1, minWidth: 130, cellClassName: 'datagrid-cell' },
    ], []);
    

    useEffect(() => {
        const obtenerTrabajadores = async () => {
            try {
                setLoading(true);
                const { data } = await Axios.get("/obtenerTrabajadoresSimplificado");
                setFilas(data.reverse());
            } finally {
                setLoading(false);
            }
        };
        obtenerTrabajadores();
    }, []);

    return (
        <Container fluid="md" className="administrador">
            <h1 className="text-center mb-4">Panel de Administradores</h1>

            {loading ? (
                <div className="d-flex justify-content-center align-items-center vh-100">
                    <CircularProgress />
                    <p className="ms-2">Cargando...</p>
                </div>
            ) : (
                <>
                    <Row className="g-3 justify-content-center">
                        <Col xs={12} sm={6} md={3} lg={3} className="d-flex justify-content-center">
                            <Button as={Link} to="/administradores/registroTrabajador" variant="primary" className="custom-button" aria-label="Crear un nuevo trabajador" > Crear Trabajador </Button>
                        </Col>
                        <Col xs={12} sm={6} md={3} lg={3} className="d-flex justify-content-center">
                            <Button as={Link} to="/captadores" variant="primary" className="custom-button" aria-label="Ir al panel de captadores" > Panel de Captadores </Button>
                        </Col>
                        <Col xs={12} sm={6} md={3} lg={3} className="d-flex justify-content-center">
                            <Button as={Link} to="/comerciales" variant="primary" className="custom-button" aria-label="Ir al panel de comerciales" > Panel de Comerciales </Button>
                        </Col>
                        <Col xs={12} sm={6} md={3} lg={3} className="d-flex justify-content-center">
                            <Button as={Link} to="/administradores/InformacionClientes" variant="primary" className="custom-button" aria-label="Ver información de los clientes" > Información de Clientes </Button>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                        <h4 className="text-center mt-4">Lista de Trabajadores</h4>
                            <div className="tabla border rounded shadow-sm p-3 bg-light mt-2 mb-4 ">
                                <DataGrid
                                    localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                                    rows={filas}
                                    columns={columnas}
                                    pageSize={5}
                                    getRowId={(row) => row.id_trabajador}
                                    autoHeight
                                />
                            </div>
                        </Col>
                    </Row>
                </>
            )
            }
        </Container >
    );
}
