const { verificarTrabajador, comprobarContrasena, generarToken, verificarToken } = require("../services/sesionService");

const iniciarSesion = async (req, res) => {
    const { idTrabajador, contrasena } = req.body;

    try {
        const trabajador = await verificarTrabajador(idTrabajador);
        if (!trabajador) {
            return res.status(400).json({ error: "El trabajador no existe" });
        }

        const esContrasenaValida = await comprobarContrasena(contrasena, trabajador.contrasena);
        if (!esContrasenaValida) {
            return res.status(400).json({ error: "Contraseña incorrecta" });
        }

        const token = generarToken(trabajador.id_trabajador, trabajador.rol);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            expires: new Date(Date.now() + 3600000),
        });

        res.json({
            success: true,
            tipoTrabajador: trabajador.rol,
        });

    } catch (err) {
        res.status(500).json({ error: "Error al iniciar sesión" });
    }
};

const verificarSesion = (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ error: "No hay ninguna sesión activa" });
    }

    const decoded = verificarToken(token);
    if (!decoded) {
        return res.status(401).json({ error: "La sesión no es válida" });
    }

    res.json({ id: decoded.id, rol: decoded.rol });
};

module.exports = { iniciarSesion, verificarSesion };
