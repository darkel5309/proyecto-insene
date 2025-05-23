import '../styles/Formularios.css';
import { useMemo, useCallback, useContext } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form as BootstrapForm, Button } from 'react-bootstrap';
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
            const { data } = await Axios.post("/iniciarSesion", values, { withCredentials: true });

            iniciarSesionContext(data);
            resetForm();

            const rutas = {
                captador: "/captadores",
                comercial: "/comerciales",
                administrador: "/administradores",
                coordinador: "/coordinadores",
            };
            navigate(rutas[data.tipoTrabajador] || "/");
        } catch (error) {
            erroresSweetAlert2(error);
        } finally {
            setSubmitting(false);
        }
    }, [navigate, iniciarSesionContext]);

    return (
        <Container fluid="md" className="inicioSesion">
            <h1 className="text-center mb-4">Inicio de Sesión</h1>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit} >
                {({ isSubmitting, errors, touched, isValid }) => (
                    <Form as={BootstrapForm} className="p-4 border rounded shadow-sm bg-light">
                        <Row className="mb-3">
                            <Col xs={12} md={6}>
                                <CamposFormulario label="ID de trabajador *" name="idTrabajador" type="number" placeholder="Ej: 5" tooltip="Introduce tu código único de trabajador" errors={errors} touched={touched} autoComplete="username" />
                            </Col>
                            <Col xs={12} md={6}>
                                <CamposFormulario label="Contraseña *" name="contrasena" type="password" tooltip="Introduce tu contraseña" errors={errors} touched={touched} autoComplete="current-password" />
                            </Col>
                        </Row>

                        <div className="d-flex justify-content-center">
                            <Button type="submit" className="mt-3" disabled={isSubmitting || !isValid} aria-label="Botón de inicio de sesión" >
                                {isSubmitting ? "Iniciando sesión..." : "Iniciar Sesión"}
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Container>
    );
}
