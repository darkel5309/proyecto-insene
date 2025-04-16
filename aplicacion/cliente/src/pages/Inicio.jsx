import '../styles/Formularios.css';
import { useMemo, useCallback } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form as BootstrapForm, Button } from 'react-bootstrap';
import { useContext } from 'react';
import { AuthContext } from "../context/AuthProvider";
import Axios from "../axiosConfig";
import useDocumentTitle from '../components/Titulo';
import { erroresSweetAlert2 } from '../utils/erroresSweetAlert2';
import CamposFormulario from '../components/CamposFormulario';

export default function Inicio() {
    useDocumentTitle("Inicio de Sesión");

    const navigate = useNavigate();
    const { iniciarSesion: iniciarSesionContext } = useContext(AuthContext);

    const initialValues = useMemo(() => ({
        idTrabajador: '', contrasena: ''
    }), []);

    const validationSchema = Yup.object({
        idTrabajador: Yup.number().integer().required("Este campo es obligatorio").min(1, "El ID no es válido"),
        contrasena: Yup.string().required("Este campo es obligatorio"),
    });

    const onSubmit = useCallback(async (values, { setSubmitting, resetForm }) => {
        try {
            const response = await Axios.post("/iniciarSesion", values, { withCredentials: true });

            iniciarSesionContext(response.data);
            resetForm();

            const tipoTrabajador = response.data.tipoTrabajador;

            if (tipoTrabajador === 'Captador') {
                navigate('/captadores');
            } else if (tipoTrabajador === 'Comercial') {
                navigate('/comerciales');
            } else if (tipoTrabajador === 'Administrador') {
                navigate('/administradores');
            } else if (tipoTrabajador === 'Coordinador') {
                navigate('/coordinadores');
            } else {
                navigate('/');
            }

        } catch (error) {
            erroresSweetAlert2(error);
        } finally {
            setSubmitting(false);
        }
    }, [navigate]);

    return (
        <Container fluid="md" className="inicioSesion">
            <h1 className="text-center mb-4">Inicio de Sesión</h1>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit} >
                {({ isSubmitting, errors, touched, isValid }) => (
                    <Form as={BootstrapForm} className="p-4 border rounded shadow-sm bg-light">
                        <Row className="mb-3">
                            <Col xs={12} md={6}>
                                <CamposFormulario label="ID de Trabajador *" name="idTrabajador" type="number" placeholder="Ej: 5"
                                    tooltip="Introduce tu código único de trabajador" errors={errors} touched={touched} />
                            </Col>
                            <Col xs={12} md={6}>
                                <CamposFormulario label="Contraseña *" name="contrasena" type="password"
                                    tooltip="Introduce tu contraseña" errors={errors} touched={touched} />
                            </Col>
                        </Row>

                        <div className="d-flex justify-content-center">
                            <Button type="submit" className="mt-3" disabled={isSubmitting || !isValid} aria-label="Registrar feedback" >
                                {isSubmitting ? "Iniciando sesión..." : "Iniciar Sesión"}
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Container>
    );
}
