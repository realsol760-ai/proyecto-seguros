import db from "../../../lib/db";

export async function GET() {
  const clientes = db
    .prepare("SELECT * FROM cliente")
    .all();

  return Response.json(clientes);
}
export async function POST(request) {
  const datos = await request.json();

  const resultado = db
    .prepare(`
      INSERT INTO cliente (nombre, apellido, dni, email, telefono)
      VALUES (?, ?, ?, ?, ?)
    `)
    .run(
      datos.nombre,
      datos.apellido,
      datos.dni,
      datos.email,
      datos.telefono
    );

  return Response.json({
    mensaje: "Cliente creado correctamente",
    id_cliente: resultado.lastInsertRowid
  });
}
export async function PUT(request) {
  const datos = await request.json();

  db.prepare(`
    UPDATE cliente
    SET nombre = ?, apellido = ?, dni = ?, email = ?, telefono = ?
    WHERE id_cliente = ?
  `).run(
    datos.nombre,
    datos.apellido,
    datos.dni,
    datos.email,
    datos.telefono,
    datos.id_cliente
  );

  return Response.json({
    mensaje: "Cliente actualizado correctamente",
  });
}
export async function DELETE(request) {
  const datos = await request.json();

  db.prepare(`
    DELETE FROM cliente
    WHERE id_cliente = ?
  `).run(datos.id_cliente);

  return Response.json({
    mensaje: "Cliente eliminado correctamente",
  });
}