import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import Logo from "../images/logo.png";

function Header() {
    const { cerrarSesion, authData } = useContext(AuthContext);
    const esAdministrador = authData?.tipoTrabajador === "administrador";

    return (
        <div className="cabecera d-flex align-items-center">
            <div className="columna home">
                {esAdministrador && (
                    <Link to="/administradores" className="boton-icono" aria-label="Ir al panel de administradores">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="20" height="20">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75L12 3l9 6.75M4.5 10.5V21h15v-10.5" />
                        </svg>

                    </Link>
                )}
            </div>

            <div className="columna logo">
                <img src={Logo} alt="Logo de Insene" />
            </div>

            <div className="columna sesion ms-auto">
                {authData && (
                    <button
                        className="boton-icono"
                        onClick={cerrarSesion}
                        aria-label="Cerrar sesión"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="20" height="20">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3H6.75A2.25 2.25 0 004.5 5.25v13.5A2.25 2.25 0 006.75 21h6.75a2.25 2.25 0 002.25-2.25V15M18 12H9m0 0l3-3m-3 3l3 3" />
                        </svg>

                    </button>
                )}
            </div>

        </div>
    );
}

export default Header;
