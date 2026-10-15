import db from "../../../lib/db";

// Consultar todas las pólizas
export async function GET() {
  try {
    const resultado = await db.execute(`
      SELECT
        poliza.id_poliza,
        poliza.numero_poliza,
        poliza.id_cliente,
        cliente.nombre,
        cliente.apellido,
        poliza.fecha_inicio,
        poliza.fecha_fin,
        poliza.estado
      FROM poliza
      INNER JOIN cliente
        ON poliza.id_cliente = cliente.id_cliente
      ORDER BY poliza.id_poliza
    `);

    return Response.json(resultado.rows);
  } catch (error) {
    return Response.json(
      { error: "Error al consultar las pólizas" },
      { status: 500 }
    );
  }
}

// Registrar una póliza nueva
export async function POST(request) {
  try {
    const datos = await request.json();

    const resultado = await db.execute({
      sql: `INSERT INTO poliza (
        numero_poliza,
        id_cliente,
        fecha_inicio,
        fecha_fin,
        estado
      ) VALUES (?, ?, ?, ?, ?)`,
      args: [
        datos.numero_poliza,
        datos.id_cliente,
        datos.fecha_inicio,
        datos.fecha_fin,
        datos.estado,
      ],
    });

    return Response.json({
      mensaje: "Póliza creada correctamente",
      id_poliza: Number(resultado.lastInsertRowid),
    });
  } catch (error) {
    return Response.json(
      { error: "Error al crear la póliza" },
      { status: 500 }
    );
  }
}

// Modificar una póliza existente
export async function PUT(request) {
  try {
    const datos = await request.json();

    const resultado = await db.execute({
      sql: `UPDATE poliza
        SET numero_poliza = ?,
            id_cliente = ?,
            fecha_inicio = ?,
            fecha_fin = ?,
            estado = ?
        WHERE id_poliza = ?`,
      args: [
        datos.numero_poliza,
        datos.id_cliente,
        datos.fecha_inicio,
        datos.fecha_fin,
        datos.estado,
        datos.id_poliza,
      ],
    });

    if (Number(resultado.rowsAffected) === 0) {
      return Response.json(
        { mensaje: "No se encontró la póliza para modificar" },
        { status: 404 }
      );
    }

    return Response.json({
      mensaje: "Póliza actualizada correctamente",
    });
  } catch (error) {
    return Response.json(
      { error: "Error al actualizar la póliza" },
      { status: 500 }
    );
  }
}

// Eliminar una póliza existente
export async function DELETE(request) {
  try {
    const datos = await request.json();

    const poliza = await db.execute({
      sql: "SELECT id_poliza FROM poliza WHERE id_poliza = ?",
      args: [datos.id_poliza],
    });

    if (poliza.rows.length === 0) {
      return Response.json(
        { mensaje: "No se encontró la póliza" },
        { status: 404 }
      );
    }

    const siniestros = await db.execute({
      sql: "SELECT COUNT(*) AS cantidad FROM siniestro WHERE id_poliza = ?",
      args: [datos.id_poliza],
    });

    const pagos = await db.execute({
      sql: "SELECT COUNT(*) AS cantidad FROM pago WHERE id_poliza = ?",
      args: [datos.id_poliza],
    });

    if (
      Number(siniestros.rows[0].cantidad) > 0 ||
      Number(pagos.rows[0].cantidad) > 0
    ) {
      return Response.json(
        {
          mensaje:
            "No se puede eliminar esta póliza porque tiene pagos o siniestros asociados.",
        },
        { status: 409 }
      );
    }

    await db.execute({
      sql: "DELETE FROM poliza_cobertura WHERE id_poliza = ?",
      args: [datos.id_poliza],
    });

    await db.execute({
      sql: "DELETE FROM poliza WHERE id_poliza = ?",
      args: [datos.id_poliza],
    });

    return Response.json({
      mensaje: "Póliza eliminada correctamente",
    });
  } catch (error) {
    return Response.json(
      { error: "Error al eliminar la póliza" },
      { status: 500 }
    );
  }
}