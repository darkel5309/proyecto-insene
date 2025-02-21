import Captador from "./pages/Captador";
import Contacto from "./pages/Contacto";
import Visita from "./pages/Visita";
import Comercial from "./pages/Comercial";
import Feedback from "./pages/Feedback";
import RegistroTrabajador from "./pages/RegistroTrabajador";
import Administrador from "./pages/Administrador";

const routes = [
    {
        path: "/administradores",
        element: <Administrador />,
        roles: ["Administrador"],
    },
    {
        path: "/administradores/RegistroTrabajador",
        element: <RegistroTrabajador />,
        roles: ["Administrador"],
    },
    {
        path: "/captadores",
        element: <Captador />,
        roles: ["Captador", "Administrador"],
    },
    {
        path: "/captadores/contacto",
        element: <Contacto />,
        roles: ["Captador", "Administrador"],
    },
    {
        path: "/captadores/visita",
        element: <Visita />,
        roles: ["Captador", "Administrador"],
    },
    {
        path: "/comerciales",
        element: <Comercial />,
        roles: ["Comercial", "Administrador"],
    },
    {
        path: "/comerciales/contacto",
        element: <Contacto />,
        roles: ["Comercial", "Administrador"],
    },
    {
        path: "/comerciales/feedback",
        element: <Feedback />,
        roles: ["Comercial", "Administrador"],
    },
];

export default routes;
