import React from 'react';
import { Container } from 'react-bootstrap';

const LoadingSpinner = ({ message = "Cargando...", height = "50vh", fullWidth = true }) => {
    return (
        <Container className={`d-flex justify-content-center align-items-center ${fullWidth ? 'w-100' : ''}`} style={{ height }}>
            <div className="text-center" role="status" aria-live="polite">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-3">{message}</p>
            </div>
        </Container>
    );
};

export default LoadingSpinner;