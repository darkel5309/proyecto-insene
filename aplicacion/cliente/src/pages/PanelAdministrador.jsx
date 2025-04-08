import '../styles/Paneles.css';
import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MaterialReactTable } from 'material-react-table';
import Axios from "../axiosConfig";
import { Container, Row, Col, Button } from "react-bootstrap";
import useDocumentTitle from '../components/Titulo';
import LoadingSpinner from "../components/LoadingSpinner";
import PropTypes from 'prop-types';

export default function PanelAdministrador() {
    useDocumentTitle("Panel de Administrador");

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const handleModificar = (id_trabajador) => {
        navigate(`/administradores/modificarTrabajador/${id_trabajador}`);
    };

    const columns = useMemo(() => [
        { accessorKey: 'id_trabajador', header: 'ID', size: 70 },
        { accessorKey: 'nombre', header: 'TRABAJADOR', size: 150 },
        { accessorKey: 'rol', header: 'ROL', size: 130 },
        { accessorKey: 'telefono', header: 'TELÉFONO', size: 130 },
        {
            id: 'modificar', header: '', size: 100, Cell: ({ row }) => (
                <Button variant="warning" onClick={() => handleModificar(row.original.id_trabajador)}
                    aria-label={`Modificar trabajador ${row.original.nombre}`}> Modificar
                </Button>
            ),
        },
    ], [handleModificar]);

    useEffect(() => {
        const obtenerTrabajadores = async () => {
            try {
                setLoading(true);
                const { data } = await Axios.get("/obtenerTrabajadoresSimplificado");
                setData([...data].reverse());
            } finally {
                setLoading(false);
            }
        };
        obtenerTrabajadores();
    }, []);

    const BotonesNavegacion = () => (
        <Row className="g-3 justify-content-center">
            <Col xs={12} sm={6} md={3} lg={3} className="d-flex justify-content-center">
                <Button as={Link} to="/administradores/registroTrabajador" variant="primary" className="custom-button" aria-label="Crear un nuevo trabajador">
                    Registrar Trabajador
                </Button>
            </Col>
            <Col xs={12} sm={6} md={3} lg={3} className="d-flex justify-content-center">
                <Button as={Link} to="/captadores" variant="primary" className="custom-button" aria-label="Ir al panel de captadores">
                    Panel de Captadores
                </Button>
            </Col>
            <Col xs={12} sm={6} md={3} lg={3} className="d-flex justify-content-center">
                <Button as={Link} to="/comerciales" variant="primary" className="custom-button" aria-label="Ir al panel de comerciales">
                    Panel de Comerciales
                </Button>
            </Col>
            <Col xs={12} sm={6} md={3} lg={3} className="d-flex justify-content-center">
                <Button as={Link} to="/administradores/InformacionClientes" variant="primary" className="custom-button" aria-label="Ver información de los clientes">
                    Información de Clientes
                </Button>
            </Col>
        </Row>
    );

    const TrabajadoresTable = () => (
        <Row>
            <Col>
                <h4 className="text-center mt-4">Lista de Trabajadores</h4>
                <div className="tabla border rounded shadow-sm p-3 bg-light mt-2 mb-4">
                    <MaterialReactTable
                        columns={columns}
                        data={data}
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
    );

    return (
        <Container fluid="md" className="administrador">
            <h1 className="text-center mb-4">Panel de Administradores</h1>
            {loading ? (
                <LoadingSpinner message="Cargando datos de trabajadores..." />
            ) : (
                <>
                    <BotonesNavegacion />
                    <TrabajadoresTable />
                </>
            )}
        </Container>
    );
}

PanelAdministrador.propTypes = {
    row: PropTypes.shape({
        original: PropTypes.shape({
            id_trabajador: PropTypes.number.isRequired,
            nombre: PropTypes.string.isRequired,
            rol: PropTypes.string.isRequired,
            telefono: PropTypes.string.isRequired,
        }).isRequired,
    }),
};