import PanelAdministrador from "./pages/PanelAdministrador";
import PanelCaptador from "./pages/PanelCaptador";
import PanelComercial from "./pages/PanelComercial";
import FormularioTrabajador from "./pages/FormularioTrabajador";
import FormularioContacto from "./pages/FormularioContacto";
import FormularioVisita from "./pages/FormularioVisita";
import FormularioFeedback from "./pages/FormularioFeedback";
import InformacionClientes from "./pages/InformacionClientes";
import FormularioModificarTrabajador from "./pages/FormularioModificarTrabajador";
import FormularioModificarCliente from "./pages/FormularioModificarCliente";
import Agenda from "./pages/Agenda";

const routes = [
    {
        path: "/administradores",
        element: <PanelAdministrador />,
        roles: ["Administrador"],
    },
    {
        path: "/administradores/RegistroTrabajador",
        element: <FormularioTrabajador />,
        roles: ["Administrador"],
    },
    {
        path: "/administradores/modificarTrabajador/:id",
        element: <FormularioModificarTrabajador />,
        roles: ["Administrador"],
    },
    {
        path: "/administradores/InformacionClientes",
        element: <InformacionClientes />,
        roles: ["Administrador"],
    },
    {
        path: "/administradores/modificarCliente/:id",
        element: <FormularioModificarCliente />,
        roles: ["Administrador"],
    },
    {
        path: "/coordinadores",
        element: <Agenda />,
        roles: ["Captador", "Administrador"],
    },
    {
        path: "/captadores",
        element: <PanelCaptador />,
        roles: ["Captador", "Administrador"],
    },
    {
        path: "/captadores/contacto",
        element: <FormularioContacto />,
        roles: ["Captador", "Administrador"],
    },
    {
        path: "/captadores/visita",
        element: <FormularioVisita />,
        roles: ["Captador", "Administrador"],
    },
    {
        path: "/comerciales",
        element: <PanelComercial />,
        roles: ["Comercial", "Administrador"],
    },
    {
        path: "/comerciales/contacto",
        element: <FormularioContacto />,
        roles: ["Comercial", "Administrador"],
    },
    {
        path: "/comerciales/feedback",
        element: <FormularioFeedback />,
        roles: ["Comercial", "Administrador"],
    },
];

export default routes;
