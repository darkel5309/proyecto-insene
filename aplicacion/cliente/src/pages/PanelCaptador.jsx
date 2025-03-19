import { Link } from "react-router-dom";
import { useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

export default function PanelCaptador() {
    useEffect(() => {
        document.title = "Panel de Captador";
    }, []);

    return (
        <Container fluid="md" className="captador">
            <h1 className="text-center my-4">Panel de Captadores</h1>
            <Row className="justify-content-center mb-4">
                <Col xs={12} md={6} className="text-center">
                    <Button
                        as={Link}
                        to="/captadores/contacto"
                        variant="primary"
                        className="me-2"
                        aria-label="Crear un nuevo contacto"
                    >
                        Nuevo Contacto
                    </Button>
                    <Button
                        as={Link}
                        to="/captadores/visita"
                        variant="primary"
                        aria-label="Crear una nueva visita"
                    >
                        Nueva Visita
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}
