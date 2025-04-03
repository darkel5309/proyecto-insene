const { verificarTrabajadorYContrasena, generarToken, verificarToken } = require("../services/sesionService");

const iniciarSesion = async (req, res) => {
    const { idTrabajador, contrasena } = req.body;

    try {
        const trabajador = await verificarTrabajadorYContrasena(idTrabajador, contrasena);

        if (!trabajador) {
            return res.status(400).json({ error: "Datos incorrectos" });
        }

        const token = generarToken(trabajador.id_trabajador, trabajador.rol);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            expires: new Date(Date.now() + 3600000),
        });
        res.json({ success: true, tipoTrabajador: trabajador.rol });
    } catch (err) {
        res.status(500).json({ error: "Error al iniciar sesión" });
    }
};

const verificarSesion = (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ error: "No hay ninguna sesión activa" });
    }

    try {
        const decoded = verificarToken(token);
        if (!decoded) {
            return res.status(401).json({ error: "La sesión no es válida" });
        }
        res.json({ id: decoded.id, tipoTrabajador: decoded.rol });
    } catch (error) {
        return res.status(401).json({ error: "Error al verificar el token" });
    }
};

const cerrarSesion = (_req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
    });

    res.json({ success: true, message: "Sesión cerrada correctamente" });
};

module.exports = { iniciarSesion, verificarSesion, cerrarSesion };
