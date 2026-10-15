"use client";

import { useEffect, useState } from "react";

export default function Clientes() {
      const [clientes, setClientes] = useState([]);
      const [clienteEditando, setClienteEditando] = useState(null);

  useEffect(() => {
    fetch("/api/prueba-db")
      .then((respuesta) => respuesta.json())
      .then((datos) => setClientes(datos));
  }, []);
  const [formulario, setFormulario] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    email: "",
    telefono: "",
  });

  const manejarCambio = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value,
    });
  };

  const guardarCliente = async (e) => {
    e.preventDefault();

    const respuesta = await fetch("/api/prueba-db", {
      method: clienteEditando ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
  clienteEditando
    ? { ...formulario, id_cliente: clienteEditando.id_cliente }
    : formulario
),
    });

    const resultado = await respuesta.json();

    alert(resultado.mensaje);
    if (clienteEditando) {
  setClientes(
    clientes.map((cliente) =>
      cliente.id_cliente === clienteEditando.id_cliente
        ? { ...cliente, ...formulario }
        : cliente
    )
  );

  setClienteEditando(null);
} else {
  const respuestaClientes = await fetch("/api/prueba-db");
  const datosClientes = await respuestaClientes.json();
  setClientes(datosClientes);
}

    setFormulario({
      nombre: "",
      apellido: "",
      dni: "",
      email: "",
      telefono: "",
    });
  };

  return (
    <main>
      <h1>Clientes</h1>

      <p>En esta sección se gestionarán los clientes del sistema.</p>
      <h2>Clientes registrados</h2>

<ul>
  {clientes.map((cliente) => (
    <li key={cliente.id_cliente}>
  {cliente.nombre} {cliente.apellido} - DNI: {cliente.dni}

  <button
    type="button"
    onClick={() => {
  setClienteEditando(cliente);
  setFormulario({
    nombre: cliente.nombre,
    apellido: cliente.apellido,
    dni: cliente.dni,
    email: cliente.email,
    telefono: cliente.telefono,
  });
}}
  >
    Editar
  </button>
  <button
  type="button"
  onClick={async () => {
    const confirmar = window.confirm(
      `¿Estás seguro de que querés eliminar a ${cliente.nombre} ${cliente.apellido}?`
    );

    if (!confirmar) return;

    const respuesta = await fetch("/api/prueba-db", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_cliente: cliente.id_cliente,
      }),
    });

    const resultado = await respuesta.json();
    alert(resultado.mensaje);

    const respuestaClientes = await fetch("/api/prueba-db");
    const datosClientes = await respuestaClientes.json();
    setClientes(datosClientes);
  }}
>
  Eliminar
</button>
</li>
  ))}
</ul>

      <h2>Nuevo cliente</h2>
      {clienteEditando && (
  <p>
    Editando: {clienteEditando.nombre} {clienteEditando.apellido}
  </p>
)}

      <form onSubmit={guardarCliente}>
        <label>Nombre</label>
        <input
          type="text"
          name="nombre"
          value={formulario.nombre}
          onChange={manejarCambio}
          required
        />

        <label>Apellido</label>
        <input
          type="text"
          name="apellido"
          value={formulario.apellido}
          onChange={manejarCambio}
          required
        />

        <label>DNI</label>
        <input
          type="text"
          name="dni"
          value={formulario.dni}
          onChange={manejarCambio}
          required
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formulario.email}
          onChange={manejarCambio}
        />

        <label>Teléfono</label>
        <input
          type="text"
          name="telefono"
          value={formulario.telefono}
          onChange={manejarCambio}
        />

        <button type="submit">Guardar cliente</button>
      </form>
    </main>
  );
}