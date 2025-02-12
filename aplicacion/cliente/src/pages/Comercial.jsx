import React from 'react';
import { Link } from 'react-router-dom';

export default function Comercial() {
    return (
        <div>
            <Link to="/comerciales/contacto">Registrar a un contacto</Link><br></br>
            <Link to="/comerciales/feedback">Registrar un feedback</Link><br></br>

            <p>
                Lista de clientes:
            </p>
        </div>
    )
}
