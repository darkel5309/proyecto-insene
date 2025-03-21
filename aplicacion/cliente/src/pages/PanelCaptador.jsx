import "../styles/Paneles.css";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

export default function PanelCaptador() {
    useEffect(() => {
        document.title = "Panel de Captador";
    }, []);

    return (
        <Container fluid="md" className="captador">
            <h1 className="text-center mb-4">Panel de Captadores</h1>

            <Row className="g-3 justify-content-center">
                <Col xs={12} sm={6} md={3} lg={3} className="d-flex justify-content-center">
                    <Button as={Link} to="/captadores/contacto" variant="primary" className="custom-button" aria-label="Crear un nuevo contacto" > Crear Contacto </Button>
                </Col>
                <Col xs={12} sm={6} md={3} lg={3} className="d-flex justify-content-center">
                    <Button as={Link} to="/captadores/visita" variant="primary" className="custom-button" aria-label="Registrar una nueva visita" > Registrar Visita </Button>
                </Col>
            </Row>
        </Container>
    );
}
