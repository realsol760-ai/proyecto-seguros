import db from "../../../lib/db";

export async function GET() {
  try {
    const resultado = await db.execute(
      "SELECT * FROM cliente ORDER BY id_cliente"
    );

    return Response.json(resultado.rows);
  } catch (error) {
    return Response.json(
      { error: "Error al consultar los clientes" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const datos = await request.json();

    const resultado = await db.execute({
      sql: `INSERT INTO cliente
        (nombre, apellido, dni, email, telefono)
        VALUES (?, ?, ?, ?, ?)`,
      args: [
        datos.nombre,
        datos.apellido,
        datos.dni,
        datos.email,
        datos.telefono,
      ],
    });

    return Response.json({
      mensaje: "Cliente creado correctamente",
      id_cliente: Number(resultado.lastInsertRowid),
    });
  } catch (error) {
    return Response.json(
      { error: "Error al crear el cliente" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const datos = await request.json();

    await db.execute({
      sql: `UPDATE cliente
        SET nombre = ?, apellido = ?, dni = ?, email = ?, telefono = ?
        WHERE id_cliente = ?`,
      args: [
        datos.nombre,
        datos.apellido,
        datos.dni,
        datos.email,
        datos.telefono,
        datos.id_cliente,
      ],
    });

    return Response.json({
      mensaje: "Cliente actualizado correctamente",
    });
  } catch (error) {
    return Response.json(
      { error: "Error al actualizar el cliente" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const datos = await request.json();

    await db.execute({
      sql: "DELETE FROM cliente WHERE id_cliente = ?",
      args: [datos.id_cliente],
    });

    return Response.json({
      mensaje: "Cliente eliminado correctamente",
    });
  } catch (error) {
    return Response.json(
      { error: "Error al eliminar el cliente" },
      { status: 500 }
    );
  }
}