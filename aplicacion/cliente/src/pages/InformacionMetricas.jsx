import '../styles/Paneles.css';
import { useEffect, useState, useMemo } from 'react';
import Axios from '../axiosConfig';
import MRTTabla from '../utils/MRTTabla';
import useDocumentTitle from "../components/Titulo";
import LoadingSpinner from '../components/LoadingSpinner';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';

export default function InformacionMetricas() {
  useDocumentTitle("Información de Métricas");

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [mensajeError, setMensajeError] = useState('');

  const fondoVerdeClaro = {
    muiTableBodyCellProps: {
      sx: { backgroundColor: '#e6ffec' },
    },
    muiTableHeadCellProps: {
      sx: {
        fontSize: '15px',
        fontFamily: '"Roboto Condensed", Arial, sans-serif',
        backgroundColor: '#e6ffec'
      },
    },
  };

  const fondoVerdeOscuro = {
    muiTableBodyCellProps: {
      sx: { backgroundColor: '#84dcc6' },
    },
    muiTableHeadCellProps: {
      sx: {
        fontSize: '15px',
        fontFamily: '"Roboto Condensed", Arial, sans-serif',
        backgroundColor: '#84dcc6'
      },
    },
  };

  const fondoRojoClaro = {
    muiTableBodyCellProps: {
      sx: { backgroundColor: '#fce1e4' },
    },
    muiTableHeadCellProps: {
      sx: {
        fontSize: '15px',
        fontFamily: '"Roboto Condensed", Arial, sans-serif',
        backgroundColor: '#fce1e4'
      },
    },
  };

  const fondoRojoOscuro = {
    muiTableBodyCellProps: {
      sx: { backgroundColor: '#ffa69e' },
    },
    muiTableHeadCellProps: {
      sx: {
        fontSize: '15px',
        fontFamily: '"Roboto Condensed", Arial, sans-serif',
        backgroundColor: '#ffa69e'
      },
    },
  };

  const fondoMarron = {
    muiTableBodyCellProps: {
      sx: { backgroundColor: '#dddab9' },
      fontFamily: '"Roboto Condensed", Arial, sans-serif',
    },
    muiTableHeadCellProps: {
      sx: {
        fontSize: '15px',
        fontFamily: '"Roboto Condensed", Arial, sans-serif',
        backgroundColor: '#dddab9'
      },
    },
  };

  const fondoAzul = {
    muiTableBodyCellProps: {
      sx: {
        backgroundColor: '#d7e3fc'
      },
    },
    muiTableHeadCellProps: {
      sx: {
        fontSize: '15px',
        fontFamily: '"Roboto Condensed", Arial, sans-serif',
        backgroundColor: '#d7e3fc'
      }
    },
  };

  const columns = useMemo(() => [
    { accessorKey: "id_trabajador", header: "ID", size: 80, ...fondoAzul },
    { accessorKey: "nombre", header: "TRABAJADOR", size: 220, ...fondoAzul },
    { accessorKey: "equipo", header: "EQUIPO", size: 150, ...fondoAzul },
    { accessorKey: "feedbacks", header: "FEEDBACKS (SUMA DE TODO)", size: 170, ...fondoMarron },
    { accessorKey: "visitado_pdte_contestacion", header: "VISITADO PDTE CONTESTACIÓN", size: 170, ...fondoVerdeClaro },
    { accessorKey: "visitado_no_hacen_nada", header: "VISITADO NO HACEN NADA", size: 170, ...fondoVerdeClaro },
    { accessorKey: "firmada_no_financiable", header: "FIRMADA NO FINANCIABLE", size: 170, ...fondoVerdeClaro },
    { accessorKey: "venta", header: "VENTA", size: 170, ...fondoVerdeClaro },
    { accessorKey: "visitado_total", header: "VISITADO TOTAL", size: 170, ...fondoVerdeOscuro },
    { accessorKey: "recitar", header: "VOLVER A CITAR", size: 170, ...fondoRojoClaro },
    { accessorKey: "no_visitado", header: "NO VISITADO", size: 170, ...fondoRojoClaro },
    { accessorKey: "no_visitado_total", header: "NO VISITADO TOTAL", size: 170, ...fondoRojoOscuro },
    { accessorKey: "ventas_instaladas", header: "INSTALADAS", size: 170, ...fondoVerdeClaro },
    { accessorKey: "ventas_caidas", header: "CAÍDAS", size: 170, ...fondoRojoClaro },
    { accessorKey: "rentabilidad_feedbacks", header: "RENTABILIDAD DE FEEDBACKS", size: 170, ...fondoAzul },
    { accessorKey: "rentabilidad_visitados", header: "RENTABILIDAD DE VISITAS", size: 170, ...fondoAzul },
  ], []);

  const cargarMetricaComerciales = async (inicio = null, fin = null) => {
    try {
      setLoading(true);
      const params = {};
      if (inicio) params.fechaInicio = inicio;
      if (fin) params.fechaFin = fin;

      const { data } = await Axios.get("/metricaComercial", { params });
      setData(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarMetricaComerciales();
  }, []);

  const handleFiltrar = () => {
    if (fechaInicio && fechaFin && fechaInicio > fechaFin) {
      setMensajeError('La fecha de inicio no puede ser mayor que la fecha de fin.');
      return;
    }
    setMensajeError('');
    cargarMetricaComerciales(fechaInicio, fechaFin);
  };

  const handleLimpiarFiltros = () => {
    setFechaInicio('');
    setFechaFin('');
    cargarMetricaComerciales();
  };

  const formatearPeriodo = () => {
    if (fechaInicio && fechaFin) {
      return `Período: ${fechaInicio} al ${fechaFin}`;
    } else if (fechaInicio) {
      return `Desde: ${fechaInicio}`;
    } else if (fechaFin) {
      return `Hasta: ${fechaFin}`;
    }
    return 'Todos los períodos';
  };

  return (
    <Container fluid="md" className="metrica">
      <h1 className="text-center mb-4">Información de Métricas</h1>

      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">🗓️ Filtrar por fechas</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={4} className='mb-2'>
              <Form.Group>
                <Form.Label><strong>Fecha inicio</strong></Form.Label>
                <Form.Control
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4} className='mb-2'>
              <Form.Group>
                <Form.Label><strong>Fecha fin</strong></Form.Label>
                <Form.Control
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                />
              </Form.Group>
            </Col>

            <Col md={4} className="d-flex align-items-end gap-2 mt-3 mt-md-0 mb-2">
              <Button variant="primary" onClick={handleFiltrar}>
                🔍 Filtrar
              </Button>
              <Button variant="outline-secondary" onClick={handleLimpiarFiltros}>
                🗑️ Limpiar
              </Button>
            </Col>
          </Row>

          {mensajeError && (
            <Alert variant="danger" className="mt-3">
              {mensajeError}
            </Alert>
          )}

          {(fechaInicio || fechaFin) && (
            <Alert variant="info" className="mt-3 mb-0">
              <strong>📊 {formatearPeriodo()}</strong>
            </Alert>
          )}
        </Card.Body>
      </Card>

      {loading ? (
        <LoadingSpinner message="Cargando métricas del período..." />
      ) : (
        <MRTTabla
          title="Resumen de métricas por comercial"
          columns={columns}
          data={data}
          loading={loading}
        />
      )}
    </Container>
  );
}