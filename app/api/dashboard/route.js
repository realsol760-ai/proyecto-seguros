import db from "../../../lib/db";

export async function GET() {
  try {
    // Indicadores principales
    const clientes = await db.execute(`
      SELECT COUNT(*) AS total
      FROM cliente
    `);

    const polizasActivas = await db.execute(`
      SELECT COUNT(*) AS total
      FROM poliza
      WHERE estado = 'ACTIVA'
    `);

    const siniestrosAbiertos = await db.execute(`
      SELECT COUNT(*) AS total
      FROM siniestro
      WHERE estado = 'ABIERTO'
    `);

    const siniestrosCerrados = await db.execute(`
      SELECT COUNT(*) AS total
      FROM siniestro
      WHERE estado = 'CERRADO'
    `);

    // Gráfico 1: pólizas por estado
    const polizasPorEstado = await db.execute(`
      SELECT estado, COUNT(*) AS cantidad
      FROM poliza
      GROUP BY estado
    `);

    // Gráfico 2: siniestros por tipo
    const siniestrosPorTipo = await db.execute(`
      SELECT tipo, COUNT(*) AS cantidad
      FROM siniestro
      GROUP BY tipo
    `);

    // Gráfico 3: siniestros por mes
    const siniestrosPorMes = await db.execute(`
      SELECT
        strftime('%Y-%m', fecha) AS mes,
        COUNT(*) AS cantidad
      FROM siniestro
      GROUP BY strftime('%Y-%m', fecha)
      ORDER BY mes
    `);

    return Response.json({
      indicadores: {
        totalClientes: Number(clientes.rows[0].total),
        polizasActivas: Number(polizasActivas.rows[0].total),
        siniestrosAbiertos: Number(siniestrosAbiertos.rows[0].total),
        siniestrosCerrados: Number(siniestrosCerrados.rows[0].total),
      },
      graficos: {
        polizasPorEstado: polizasPorEstado.rows,
        siniestrosPorTipo: siniestrosPorTipo.rows,
        siniestrosPorMes: siniestrosPorMes.rows,
      },
    });
  } catch (error) {
    console.error("Error al consultar el dashboard:", error.message);

    return Response.json(
      { error: "No se pudo cargar el dashboard" },
      { status: 500 }
    );
  }
}