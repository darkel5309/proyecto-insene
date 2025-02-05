const { query } = require("../models/db");

// creamos la peticion para el login
const iniciarSesion = async (req, res) => {

    // extraemos los datos recibidos del body
    const { idTrabajador, contrasena } = req.body;

    try {
        // consultamos si el trabajador existe
        const trabajador = await query('SELECT * FROM trabajador WHERE id_trabajador = ?', [idTrabajador]);

        if (trabajador.length === 0) {
            return res.status(400).json({ error: "El código de trabajador no existe" });
        }

        // obtenemos la informacion del trabajador
        const trabajadorInfo = trabajador[0];

        // comprobamos si la contraseña es valida
        if (trabajadorInfo.contrasena !== contrasena) {
            return res.status(400).json({ error: "Contraseña incorrecta" });
        }

        // una vez validada la contraseña, verificamos el rol del trabajador
        const tipoTrabajador = trabajadorInfo.rol;

        // devolvemos el tipo de trabajador
        res.json({
            success: true,
            tipoTrabajador: tipoTrabajador,
        });

    } catch (err) {
        console.error("Error al iniciar sesión:", err);
        res.status(500).json({ error: "Error al procesar la solicitud" });
    }
};

module.exports = { iniciarSesion };