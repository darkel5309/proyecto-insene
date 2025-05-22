import '../styles/Paneles.css';
import { useEffect, useState, useMemo } from 'react';
import Axios from '../axiosConfig';
import MRTTabla from '../utils/MRTTabla';
import useDocumentTitle from "../components/Titulo";
import LoadingSpinner from '../components/LoadingSpinner';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';

export default function InformacionMetricas() {
  useDocumentTitle("Información de métricas");

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
      sx: { backgroundColor: '#e6ffec' },
    },
  };

  const fondoVerdeOscuro = {
    muiTableBodyCellProps: {
      sx: { backgroundColor: '#84dcc6' },
    },
    muiTableHeadCellProps: {
      sx: { backgroundColor: '#84dcc6' },
    },
  };

  const fondoRojoClaro = {
    muiTableBodyCellProps: {
      sx: { backgroundColor: '#fce1e4' },
    },
    muiTableHeadCellProps: {
      sx: { backgroundColor: '#fce1e4' },
    },
  };

  const fondoRojoOscuro = {
    muiTableBodyCellProps: {
      sx: { backgroundColor: '#ffa69e' },
    },
    muiTableHeadCellProps: {
      sx: { backgroundColor: '#ffa69e' },
    },
  };

  const fondoMarron = {
    muiTableBodyCellProps: {
      sx: { backgroundColor: '#dddab9' },
    },
    muiTableHeadCellProps: {
      sx: { backgroundColor: '#dddab9' },
    },
  };

  const fondoAzul = {
    muiTableBodyCellProps: {
      sx: { backgroundColor: '#d7e3fc' },
    },
    muiTableHeadCellProps: {
      sx: { backgroundColor: '#d7e3fc' },
    },
  };

  const columns = useMemo(() => [
    { accessorKey: "id_trabajador", header: "ID", size: 80, ...fondoAzul },
    { accessorKey: "nombre", header: "TRABAJADOR", size: 200, ...fondoAzul },
    { accessorKey: "feedbacks", header: "FEEDBACKS", size: 200, ...fondoMarron },
    { accessorKey: "visitado_pdte_contestacion", header: "PDTE CONTESTACIÓN", size: 180, ...fondoVerdeClaro },
    { accessorKey: "visitado_no_hacen_nada", header: "NO HACEN NADA", size: 180, ...fondoVerdeClaro },
    { accessorKey: "firmada_no_financiable", header: "FIRM NO FINANCIABLE", size: 180, ...fondoVerdeClaro },
    { accessorKey: "venta", header: "VENTA", size: 180, ...fondoVerdeClaro },
    { accessorKey: "visitado_total", header: "VISITADO TOTAL", size: 180, ...fondoVerdeOscuro },
    { accessorKey: "recitar", header: "RECITAR", size: 180, ...fondoRojoClaro },
    { accessorKey: "no_visitado", header: "NO VISITADO", size: 180, ...fondoRojoClaro },
    { accessorKey: "no_visitado_total", header: "NO VISITADO TOTAL", size: 180, ...fondoRojoOscuro },
    { accessorKey: "ventas_instaladas", header: "INSTALADAS", size: 180, ...fondoVerdeClaro },
    { accessorKey: "ventas_caidas", header: "CAÍDAS", size: 180, ...fondoRojoClaro },
    { accessorKey: "rentabilidad_feedbacks", header: "RENTAB FEEDBACKS", size: 180, ...fondoAzul },
    { accessorKey: "rentabilidad_visitados", header: "RENTAB VISITAS", size: 180, ...fondoAzul },
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
      <h1 className="text-center mb-4">Métricas de Ventas</h1>

      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">🗓️ Filtrar por fechas</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={4}>
              <Form.Group>
                <Form.Label><strong>Fecha inicio</strong></Form.Label>
                <Form.Control
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label><strong>Fecha fin</strong></Form.Label>
                <Form.Control
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                />
              </Form.Group>
            </Col>

            <Col md={4} className="d-flex align-items-end gap-2 mt-3 mt-md-0">
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