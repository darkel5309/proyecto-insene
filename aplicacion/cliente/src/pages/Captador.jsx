import React from 'react';
import '../styles/Captador.css';
import { Link } from 'react-router-dom';

export default function Captador() {
    return (
        <div className="captador">
            <div className="contenedorCaptador">
                <h1>Panel de Captadores</h1>
                <div className='enlaces'>
                    <Link to="/captadores/contacto" className='enlace'>Nuevo contacto</Link>
                    <Link to="/captadores/visita" className='enlace'>Nueva visita</Link>
                </div>
            </div>
        </div>
    );
}