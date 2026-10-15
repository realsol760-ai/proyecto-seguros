import db from "../../../lib/db";

// Consultar todos los siniestros
export async function GET() {
  try {
    const resultado = await db.execute(`
      SELECT
        siniestro.id_siniestro,
        siniestro.id_poliza,
        poliza.numero_poliza,
        siniestro.fecha,
        siniestro.tipo,
        siniestro.descripcion,
        siniestro.estado
      FROM siniestro
      INNER JOIN poliza
        ON siniestro.id_poliza = poliza.id_poliza
      ORDER BY siniestro.id_siniestro
    `);

    return Response.json(resultado.rows);
  } catch (error) {
    return Response.json(
      { error: "Error al consultar los siniestros" },
      { status: 500 }
    );
  }
}

// Registrar un siniestro nuevo
export async function POST(request) {
  try {
    const datos = await request.json();

    const resultado = await db.execute({
      sql: `INSERT INTO siniestro (
        id_poliza,
        fecha,
        tipo,
        descripcion,
        estado
      ) VALUES (?, ?, ?, ?, ?)`,
      args: [
        datos.id_poliza,
        datos.fecha,
        datos.tipo,
        datos.descripcion,
        datos.estado,
      ],
    });

    return Response.json({
      mensaje: "Siniestro registrado correctamente",
      id_siniestro: Number(resultado.lastInsertRowid),
    });
  } catch (error) {
    return Response.json(
      { error: "Error al registrar el siniestro" },
      { status: 500 }
    );
  }
}

// Modificar un siniestro existente
export async function PUT(request) {
  try {
    const datos = await request.json();

    const resultado = await db.execute({
      sql: `UPDATE siniestro
        SET id_poliza = ?,
            fecha = ?,
            tipo = ?,
            descripcion = ?,
            estado = ?
        WHERE id_siniestro = ?`,
      args: [
        datos.id_poliza,
        datos.fecha,
        datos.tipo,
        datos.descripcion,
        datos.estado,
        datos.id_siniestro,
      ],
    });

    if (Number(resultado.rowsAffected) === 0) {
      return Response.json(
        { mensaje: "No se encontró el siniestro para modificar" },
        { status: 404 }
      );
    }

    return Response.json({
      mensaje: "Siniestro actualizado correctamente",
    });
  } catch (error) {
    return Response.json(
      { error: "Error al actualizar el siniestro" },
      { status: 500 }
    );
  }
}

// Eliminar un siniestro existente
export async function DELETE(request) {
  try {
    const datos = await request.json();

    const resultado = await db.execute({
      sql: "DELETE FROM siniestro WHERE id_siniestro = ?",
      args: [datos.id_siniestro],
    });

    if (Number(resultado.rowsAffected) === 0) {
      return Response.json(
        { mensaje: "No se encontró el siniestro" },
        { status: 404 }
      );
    }

    return Response.json({
      mensaje: "Siniestro eliminado correctamente",
    });
  } catch (error) {
    return Response.json(
      { error: "Error al eliminar el siniestro" },
      { status: 500 }
    );
  }
}