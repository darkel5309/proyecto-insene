import { Container } from 'react-bootstrap';

const LoadingSpinner = ({ message = "Cargando...", height = "50vh", fullWidth = true }) => {
    return (
        <Container className={`d-flex justify-content-center align-items-center ${fullWidth ? 'w-100' : ''}`}
            style={{ height }} role="status" aria-live="polite" >
            <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
                {message && <p className="mt-3 mb-0">{message}</p>}
            </div>
        </Container>
    );
};

export default LoadingSpinner;
