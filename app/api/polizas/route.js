import db from "../../../lib/db";

// Consultar todas las pólizas
export async function GET() {
  const polizas = db.prepare(`
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
  `).all();

  return Response.json(polizas);
}

// Registrar una póliza nueva
export async function POST(request) {
  const datos = await request.json();

  const resultado = db.prepare(`
    INSERT INTO poliza (
      numero_poliza,
      id_cliente,
      fecha_inicio,
      fecha_fin,
      estado
    )
    VALUES (?, ?, ?, ?, ?)
  `).run(
    datos.numero_poliza,
    datos.id_cliente,
    datos.fecha_inicio,
    datos.fecha_fin,
    datos.estado
  );

  return Response.json({
    mensaje: "Póliza creada correctamente",
    id_poliza: resultado.lastInsertRowid
  });
}
// Modificar una póliza existente
export async function PUT(request) {
  const datos = await request.json();

  const resultado = db.prepare(`
    UPDATE poliza
    SET
      numero_poliza = ?,
      id_cliente = ?,
      fecha_inicio = ?,
      fecha_fin = ?,
      estado = ?
    WHERE id_poliza = ?
  `).run(
    datos.numero_poliza,
    datos.id_cliente,
    datos.fecha_inicio,
    datos.fecha_fin,
    datos.estado,
    datos.id_poliza
  );

  if (resultado.changes === 0) {
    return Response.json(
      { mensaje: "No se encontró la póliza para modificar" },
      { status: 404 }
    );
  }

  return Response.json({
    mensaje: "Póliza actualizada correctamente",
  });
}
// Eliminar una póliza existente
export async function DELETE(request) {
  const datos = await request.json();

  const poliza = db.prepare(`
    SELECT id_poliza
    FROM poliza
    WHERE id_poliza = ?
  `).get(datos.id_poliza);

  if (!poliza) {
    return Response.json(
      { mensaje: "No se encontró la póliza" },
      { status: 404 }
    );
  }

  const siniestros = db.prepare(`
    SELECT COUNT(*) AS cantidad
    FROM siniestro
    WHERE id_poliza = ?
  `).get(datos.id_poliza);

  const pagos = db.prepare(`
    SELECT COUNT(*) AS cantidad
    FROM pago
    WHERE id_poliza = ?
  `).get(datos.id_poliza);

  if (siniestros.cantidad > 0 || pagos.cantidad > 0) {
    return Response.json(
      {
        mensaje:
          "No se puede eliminar esta póliza porque tiene pagos o siniestros asociados."
      },
      { status: 409 }
    );
  }

  db.prepare(`
    DELETE FROM poliza_cobertura
    WHERE id_poliza = ?
  `).run(datos.id_poliza);

  db.prepare(`
    DELETE FROM poliza
    WHERE id_poliza = ?
  `).run(datos.id_poliza);

  return Response.json({
    mensaje: "Póliza eliminada correctamente"
  });
}