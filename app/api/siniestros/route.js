import db from "../../../lib/db";

// Consultar todos los siniestros
export async function GET() {
  const siniestros = db.prepare(`
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
  `).all();

  return Response.json(siniestros);
}

// Registrar un siniestro nuevo
export async function POST(request) {
  const datos = await request.json();

  const resultado = db.prepare(`
    INSERT INTO siniestro (
      id_poliza,
      fecha,
      tipo,
      descripcion,
      estado
    )
    VALUES (?, ?, ?, ?, ?)
  `).run(
    datos.id_poliza,
    datos.fecha,
    datos.tipo,
    datos.descripcion,
    datos.estado
  );

  return Response.json({
    mensaje: "Siniestro registrado correctamente",
    id_siniestro: resultado.lastInsertRowid
  });
}
// Modificar un siniestro existente
export async function PUT(request) {
  const datos = await request.json();

  const resultado = db.prepare(`
    UPDATE siniestro
    SET
      id_poliza = ?,
      fecha = ?,
      tipo = ?,
      descripcion = ?,
      estado = ?
    WHERE id_siniestro = ?
  `).run(
    datos.id_poliza,
    datos.fecha,
    datos.tipo,
    datos.descripcion,
    datos.estado,
    datos.id_siniestro
  );

  if (resultado.changes === 0) {
    return Response.json(
      { mensaje: "No se encontró el siniestro para modificar" },
      { status: 404 }
    );
  }

  return Response.json({
    mensaje: "Siniestro actualizado correctamente",
  });
}
// Eliminar un siniestro existente
export async function DELETE(request) {
  const datos = await request.json();

  const resultado = db.prepare(`
    DELETE FROM siniestro
    WHERE id_siniestro = ?
  `).run(datos.id_siniestro);

  if (resultado.changes === 0) {
    return Response.json(
      { mensaje: "No se encontró el siniestro" },
      { status: 404 }
    );
  }

  return Response.json({
    mensaje: "Siniestro eliminado correctamente",
  });
}