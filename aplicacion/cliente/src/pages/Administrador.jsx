import React from 'react';
import '../styles/Administrador.css';
import { Link } from 'react-router-dom';

export default function Administrador() {
    return (
        <div className="administrador">
            <div className="contenedorAdministrador">
                <h1>Panel de Administradores</h1>
                <div className='enlaces'>
                    <Link to="/administradores/trabajador" className='enlace'>Crear Trabajador</Link><br></br>
                    <Link to="/captadores" className='enlace'>Panel de Captadores</Link><br></br>
                    <Link to="/comerciales" className='enlace'>Panel de Comerciales</Link><br></br>
                </div>
            </div>
        </div>
    )
}