import { query } from "../models/db.js";

export const crear = async (feedback) => {
    const { idTrabajador, idCliente, fecha, hora, numeroPersonas, numeroDecisores, tieneBombona, tieneGas, tieneTermo, tienePlacas, importeLuz, importeGas, resultado, oferta, observaciones } = feedback;

    await query('START TRANSACTION');

    try {
        const [existeTrabajador] = await query('SELECT 1 FROM trabajador WHERE id_trabajador = ?', [idTrabajador]);
        if (!existeTrabajador) throw new Error("El trabajador no existe");

        const [existeContacto] = await query('SELECT 1 FROM cliente WHERE id_cliente = ?', [idCliente]);
        if (!existeContacto) throw new Error("El cliente no existe");

        let idVivienda;
        const [resultadoVivienda] = await query('SELECT id_vivienda FROM vivienda WHERE id_domicilio = ?', [idCliente]);

        if (!resultadoVivienda) {
            const [resultadoDomicilio] = await query('SELECT id_domicilio FROM domicilio WHERE id_cliente = ?', [idCliente]);
            if (!resultadoDomicilio) throw new Error("El cliente no tiene un domicilio registrado.");

            const idDomicilio = resultadoDomicilio.id_domicilio;
            const resultadoInserccionVivienda = await query('INSERT INTO vivienda (n_personas, n_decisores, tiene_bombona, tiene_gas, tiene_termo_electrico, tiene_placas_termicas, id_domicilio) VALUES (?, ?, ?, ?, ?, ?, ?)', [numeroPersonas, numeroDecisores, tieneBombona, tieneGas, tieneTermo, tienePlacas, idDomicilio]);
            idVivienda = resultadoInserccionVivienda.insertId;
        } else {
            idVivienda = resultadoVivienda.id_vivienda;
        }

        await query('INSERT INTO recibo (importe_luz, importe_gas, id_vivienda) VALUES (?, ?, ?)', [importeLuz, importeGas, idVivienda]);
        const resultadoVisita = await query('INSERT INTO visita (fecha, hora, resultado, oferta, observaciones_visita, id_vivienda, id_trabajador) VALUES (?, ?, ?, ?, ?, ?, ?)', [fecha, hora, resultado, oferta, observaciones, idVivienda, idTrabajador]);
        
        await query('COMMIT');
        return { message: "Feedback registrado correctamente", idVisita: resultadoVisita.insertId };

    } catch (error) {
        await query('ROLLBACK');
        throw new Error(error.message);
    }
};
