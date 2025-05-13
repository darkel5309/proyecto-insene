import { lazy } from "react";

const PanelAdministrador = lazy(() => import("./pages/PanelAdministrador"));
const PanelCaptador = lazy(() => import("./pages/PanelCaptador"));
const PanelComercial = lazy(() => import("./pages/PanelComercial"));
const FormularioTrabajador = lazy(() => import("./pages/FormularioTrabajador"));
const FormularioContacto = lazy(() => import("./pages/FormularioContacto"));
const FormularioFeedback = lazy(() => import("./pages/FormularioFeedback"));
const InformacionClientes = lazy(() => import("./pages/InformacionClientes"));
const FormularioModificarTrabajador = lazy(() => import("./pages/FormularioModificarTrabajador"));
const FormularioModificarCliente = lazy(() => import("./pages/FormularioModificarCliente"));
const PanelCoordinador = lazy(() => import("./pages/PanelCoordinador"));
const InformacionAuditoria = lazy(() => import("./pages/InformacionAuditoria"));
const InformacionVentas = lazy(() => import("./pages/InformaciónVenta"));
const FormularioVenta = lazy(() => import("./pages/FormularioVenta"));
const FormularioModificarVenta = lazy(() => import("./pages/FormularioModificarVenta"));

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
    path: "/administradores/auditoria",
    element: <InformacionAuditoria />,
    roles: ["Administrador"],
  },
  {
    path: "/coordinadores",
    element: <PanelCoordinador />,
    roles: ["Coordinador", "Administrador"],
  },
  {
    path: "/coordinadores/ventas",
    element: <InformacionVentas />,
    roles: ["Coordinador", "Administrador"],
  },
  {
    path: "/coordinadores/registroVenta",
    element: <FormularioVenta />,
    roles: ["Coordinador", "Administrador"],
  },
  {
    path: "/coordinadores/modificarVenta/:id",
    element: <FormularioModificarVenta />,
    roles: ["Coordinador", "Administrador"],
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
