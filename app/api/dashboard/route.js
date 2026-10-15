import db from "../../../lib/db";

export async function GET() {
  // Indicadores principales
  const clientes = db.prepare(`
    SELECT COUNT(*) AS total
    FROM cliente
  `).get();

  const polizasActivas = db.prepare(`
    SELECT COUNT(*) AS total
    FROM poliza
    WHERE estado = 'ACTIVA'
  `).get();

  const siniestrosAbiertos = db.prepare(`
    SELECT COUNT(*) AS total
    FROM siniestro
    WHERE estado = 'ABIERTO'
  `).get();

  const siniestrosCerrados = db.prepare(`
    SELECT COUNT(*) AS total
    FROM siniestro
    WHERE estado = 'CERRADO'
  `).get();

  // Gráfico 1: pólizas por estado
  const polizasPorEstado = db.prepare(`
    SELECT estado, COUNT(*) AS cantidad
    FROM poliza
    GROUP BY estado
  `).all();

  // Gráfico 2: siniestros por tipo
  const siniestrosPorTipo = db.prepare(`
    SELECT tipo, COUNT(*) AS cantidad
    FROM siniestro
    GROUP BY tipo
  `).all();

  // Gráfico 3: siniestros por mes
  const siniestrosPorMes = db.prepare(`
    SELECT
      strftime('%Y-%m', fecha) AS mes,
      COUNT(*) AS cantidad
    FROM siniestro
    GROUP BY strftime('%Y-%m', fecha)
    ORDER BY mes
  `).all();

  return Response.json({
    indicadores: {
      totalClientes: clientes.total,
      polizasActivas: polizasActivas.total,
      siniestrosAbiertos: siniestrosAbiertos.total,
      siniestrosCerrados: siniestrosCerrados.total,
    },
    graficos: {
      polizasPorEstado,
      siniestrosPorTipo,
      siniestrosPorMes,
    },
  });
}