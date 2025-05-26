import { lazy } from "react";

const PanelAdministrador = lazy(() => import("./pages/PanelAdministrador"));
const PanelCaptador = lazy(() => import("./pages/PanelCaptador"));
const PanelComercial = lazy(() => import("./pages/PanelComercial"));
const FormularioTrabajador = lazy(() => import("./pages/FormularioTrabajador"));
const FormularioCliente = lazy(() => import("./pages/FormularioCliente"));
const FormularioFeedback = lazy(() => import("./pages/FormularioFeedback"));
const InformacionClientes = lazy(() => import("./pages/InformacionClientes"));
const FormularioModificarTrabajador = lazy(() => import("./pages/FormularioModificarTrabajador"));
const FormularioModificarCliente = lazy(() => import("./pages/FormularioModificarCliente"));
const PanelCoordinador = lazy(() => import("./pages/PanelCoordinador"));
const InformacionAuditoria = lazy(() => import("./pages/InformacionAuditoria"));
const InformacionVentas = lazy(() => import("./pages/InformaciónVenta"));
const FormularioVenta = lazy(() => import("./pages/FormularioVenta"));
const FormularioModificarVenta = lazy(() => import("./pages/FormularioModificarVenta"));
const InformacionMetricas = lazy(() => import("./pages/InformacionMetricas"));

const routes = [
  {
    path: "/administradores",
    element: <PanelAdministrador />,
    roles: ["administrador"],
  },
  {
    path: "/administradores/RegistroTrabajador",
    element: <FormularioTrabajador />,
    roles: ["administrador"],
  },
  {
    path: "/administradores/modificarTrabajador/:id",
    element: <FormularioModificarTrabajador />,
    roles: ["administrador"],
  },
  {
    path: "/administradores/InformacionClientes",
    element: <InformacionClientes />,
    roles: ["administrador"],
  },
  {
    path: "/administradores/modificarCliente/:id",
    element: <FormularioModificarCliente />,
    roles: ["administrador"],
  },
  {
    path: "/administradores/auditoria",
    element: <InformacionAuditoria />,
    roles: ["administrador"],
  },
  {
    path: "/coordinadores",
    element: <PanelCoordinador />,
    roles: ["coordinador", "administrador"],
  },
  {
    path: "/coordinadores/metricas",
    element: <InformacionMetricas />,
    roles: ["coordinador", "administrador"],
  },
  {
    path: "/coordinadores/ventas",
    element: <InformacionVentas />,
    roles: ["coordinador", "administrador"],
  },
  {
    path: "/coordinadores/registroVenta",
    element: <FormularioVenta />,
    roles: ["coordinador", "administrador"],
  },
  {
    path: "/coordinadores/modificarVenta/:id",
    element: <FormularioModificarVenta />,
    roles: ["coordinador", "administrador"],
  },
  {
    path: "/captadores",
    element: <PanelCaptador />,
    roles: ["captador", "administrador"],
  },
  {
    path: "/captadores/cliente",
    element: <FormularioCliente />,
    roles: ["captador", "administrador"],
  },
  {
    path: "/comerciales",
    element: <PanelComercial />,
    roles: ["comercial", "administrador"],
  },
  {
    path: "/comerciales/cliente",
    element: <FormularioCliente />,
    roles: ["comercial", "administrador"],
  },
  {
    path: "/comerciales/feedback",
    element: <FormularioFeedback />,
    roles: ["comercial", "administrador"],
  },
];

export default routes;
