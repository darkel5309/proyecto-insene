import { query } from '../models/db.js';

export const obtenerTodasComercial = async (fechaInicio = null, fechaFin = null) => {
  let filtroVentas = '';
  let filtroVisitas = "WHERE resultado != 'Venta'";
  
  if (fechaInicio && fechaFin) {
    filtroVentas = `WHERE fecha_firma BETWEEN '${fechaInicio}' AND '${fechaFin}'`;
    filtroVisitas = `WHERE resultado != 'Venta' AND fecha BETWEEN '${fechaInicio}' AND '${fechaFin}'`;
  } else if (fechaInicio) {
    filtroVentas = `WHERE fecha_firma >= '${fechaInicio}'`;
    filtroVisitas = `WHERE resultado != 'Venta' AND fecha >= '${fechaInicio}'`;
  } else if (fechaFin) {
    filtroVentas = `WHERE fecha_firma <= '${fechaFin}'`;
    filtroVisitas = `WHERE resultado != 'Venta' AND fecha <= '${fechaFin}'`;
  }

  const sql = `
    SELECT 
      t.id_trabajador,
      t.nombre,

      -- tabla venta
      COALESCE(v.venta_total, 0) AS venta,
      COALESCE(v.ventas_instaladas, 0) AS ventas_instaladas,
      COALESCE(v.ventas_caidas, 0) AS ventas_caidas,

      -- tabla feedback
      COALESCE(vi.visitado_pdte, 0) AS visitado_pdte_contestacion,
      COALESCE(vi.no_hacen_nada, 0) AS visitado_no_hacen_nada,
      COALESCE(vi.no_financiable, 0) AS firmada_no_financiable,
      COALESCE(vi.recitar, 0) AS recitar,
      COALESCE(vi.no_visitado, 0) AS no_visitado,

      -- totales
      COALESCE(vi.visitado_pdte, 0) + 
      COALESCE(vi.no_hacen_nada, 0) +
      COALESCE(vi.no_financiable, 0) + 
      COALESCE(v.venta_total, 0) 
      AS visitado_total,

      COALESCE(vi.recitar, 0) +
      COALESCE(vi.no_visitado, 0) 
      AS no_visitado_total,

      COALESCE(vi.visitado_pdte, 0) + 
      COALESCE(vi.no_hacen_nada, 0) + 
      COALESCE(vi.no_financiable, 0) + 
      COALESCE(vi.recitar, 0) + 
      COALESCE(vi.no_visitado, 0) + 
      COALESCE(v.venta_total, 0) 
      AS feedbacks,

      -- rentabilidades
      CASE 
        WHEN (
          COALESCE(vi.visitado_pdte, 0) + 
          COALESCE(vi.no_hacen_nada, 0) + 
          COALESCE(vi.no_financiable, 0) + 
          COALESCE(vi.recitar, 0) + 
          COALESCE(vi.no_visitado, 0) + 
          COALESCE(v.venta_total, 0)
        ) = 0 THEN '0.00%'
        ELSE CONCAT(
          ROUND(
            100.0 * COALESCE(v.ventas_instaladas, 0) / (
              COALESCE(vi.visitado_pdte, 0) + 
              COALESCE(vi.no_hacen_nada, 0) + 
              COALESCE(vi.no_financiable, 0) + 
              COALESCE(vi.recitar, 0) + 
              COALESCE(vi.no_visitado, 0) + 
              COALESCE(v.venta_total, 0)
            ), 2
          ), '%'
        )
      END AS rentabilidad_feedbacks,

      CASE 
        WHEN (
          COALESCE(vi.visitado_pdte, 0) + 
          COALESCE(vi.no_hacen_nada, 0) + 
          COALESCE(vi.no_financiable, 0) + 
          COALESCE(v.venta_total, 0)
        ) = 0 THEN '0.00%'
        ELSE CONCAT(
          ROUND(
            100.0 * COALESCE(v.ventas_instaladas, 0) / (
              COALESCE(vi.visitado_pdte, 0) + 
              COALESCE(vi.no_hacen_nada, 0) + 
              COALESCE(vi.no_financiable, 0) + 
              COALESCE(v.venta_total, 0)
            ), 2
          ), '%'
        )
      END AS rentabilidad_visitados

    FROM trabajador t

    -- filtro de ventas y visitas por fecha
    LEFT JOIN (
      SELECT 
        id_trabajador,
        COUNT(*) AS venta_total,
        SUM(estado_venta = 'Instalada') AS ventas_instaladas,
        SUM(estado_venta = 'Caída') AS ventas_caidas
      FROM venta
      ${filtroVentas}
      GROUP BY id_trabajador
    ) v ON t.id_trabajador = v.id_trabajador

    LEFT JOIN (
      SELECT 
        id_trabajador,
        SUM(resultado = 'Visitado_pdte_contestacion') AS visitado_pdte,
        SUM(resultado = 'Visitado_no_hacen_nada') AS no_hacen_nada,
        SUM(resultado = 'Firmada_no_financiable') AS no_financiable,
        SUM(resultado = 'Recitar') AS recitar,
        SUM(resultado = 'No_visita') AS no_visitado
      FROM visita
      ${filtroVisitas}
      GROUP BY id_trabajador
    ) vi ON t.id_trabajador = vi.id_trabajador

    WHERE t.puesto = 'Comercial'
    ORDER BY 
    ROUND(
      100.0 * COALESCE(v.ventas_instaladas, 0) / (
        COALESCE(vi.visitado_pdte, 0) + 
        COALESCE(vi.no_hacen_nada, 0) + 
        COALESCE(vi.no_financiable, 0) + 
        COALESCE(v.venta_total, 0)
      ), 2
    ) DESC;
  `;

  return await query(sql);
};