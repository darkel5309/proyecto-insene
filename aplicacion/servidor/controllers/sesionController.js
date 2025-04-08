import * as sesionService from "../services/sesionService.js";

export const iniciarSesion = async (req, res) => {
    const { idTrabajador, contrasena } = req.body;

    try {
        const trabajador = await sesionService.verificarTrabajadorYContrasena(idTrabajador, contrasena);

        if (!trabajador) {
            return res.status(400).json({ error: "Datos incorrectos" });
        }

        const token = sesionService.generarToken(trabajador.id_trabajador, trabajador.rol);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            expires: new Date(Date.now() + 3600000),
        });

        res.json({ success: true, tipoTrabajador: trabajador.rol });
    } catch {
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const verificarSesion = (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ error: "No hay ninguna sesión activa" });
    }

    try {
        const decoded = sesionService.verificarToken(token);
        if (!decoded) {
            return res.status(401).json({ error: "La sesión no es válida" });
        }
        res.json({ id: decoded.id, tipoTrabajador: decoded.rol });
    } catch {
        return res.status(401).json({ error: "Error al verificar el token" });
    }
};

export const cerrarSesion = (_req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
    });

    res.json({ success: true, message: "Sesión cerrada correctamente" });
};
