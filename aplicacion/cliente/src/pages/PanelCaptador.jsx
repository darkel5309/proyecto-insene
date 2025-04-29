import "../styles/Paneles.css";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import useDocumentTitle from '../components/Titulo';

export default function PanelCaptador() {
    useDocumentTitle("Panel de Captador");

    const BotonesNavegacion = () => (
        <Row className="g-3 justify-content-center">
            <Col xs={12} sm={6} md={3} lg={3} className="d-flex justify-content-center">
                <Button as={Link} to="/captadores/contacto" variant="primary" className="custom-button" aria-label="Registrar un nuevo contacto" > Registrar Contacto </Button>
            </Col>
        </Row>
    );

    return (
        <Container fluid="md" className="captador">
            <h1 className="text-center mb-4">Panel de Captadores</h1>

            <BotonesNavegacion />
        </Container>
    );
}
