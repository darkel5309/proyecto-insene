import '../styles/Captador.css';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

export default function Captador() {
    useEffect(() => {
        document.title = "Panel de captador";
    }, []);

    return (
        <div className="captador">
            <div className="contenedorCaptador">
                <h1>Panel de Captadores</h1>
                <div className='enlaces'>
                    <Link to="/captadores/contacto" className='enlace' aria-label="Crear un nuevo contacto">Nuevo contacto</Link>
                    <Link to="/captadores/visita" className='enlace' aria-label="Crear una nueva visita">Nueva visita</Link>
                </div>
            </div>
        </div>
    );
}