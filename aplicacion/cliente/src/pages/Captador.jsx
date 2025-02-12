import React from 'react';
import { Link } from 'react-router-dom';

export default function Captador() {
    return (
        <div>
            <Link to="/captadores/contacto">Registrar a un contacto</Link><br></br>
            <Link to="/captadores/visita">Registrar una visita</Link><br></br>
        </div>
    )
}