"use client";

import { useEffect, useState } from "react";

export default function Polizas() {
  const [clientes, setClientes] = useState([]);
  const [polizas, setPolizas] = useState([]);
  const [polizaEditando, setPolizaEditando] = useState(null);

  const [formulario, setFormulario] = useState({
    numero_poliza: "",
    id_cliente: "",
    fecha_inicio: "",
    fecha_fin: "",
    estado: "ACTIVA",
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    const respuestaClientes = await fetch("/api/prueba-db");
    const datosClientes = await respuestaClientes.json();
    setClientes(datosClientes);

    const respuestaPolizas = await fetch("/api/polizas");
    const datosPolizas = await respuestaPolizas.json();
    setPolizas(datosPolizas);
  };
  const editarPoliza = (poliza) => {
  setPolizaEditando(poliza);

  setFormulario({
    numero_poliza: poliza.numero_poliza,
    id_cliente: String(poliza.id_cliente),
    fecha_inicio: poliza.fecha_inicio,
    fecha_fin: poliza.fecha_fin,
    estado: poliza.estado,
  });
};

  const manejarCambio = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value,
    });
  };

  const guardarPoliza = async (e) => {
    e.preventDefault();

    const respuesta = await fetch("/api/polizas", {
      method: polizaEditando ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
  polizaEditando
    ? { ...formulario, id_poliza: polizaEditando.id_poliza }
    : formulario
),
    });

    const resultado = await respuesta.json();

alert(resultado.mensaje);

if (!respuesta.ok) {
  return;
}

setPolizaEditando(null);

setFormulario({
  numero_poliza: "",
  id_cliente: "",
  fecha_inicio: "",
  fecha_fin: "",
  estado: "ACTIVA",
});

await cargarDatos();

    setFormulario({
      numero_poliza: "",
      id_cliente: "",
      fecha_inicio: "",
      fecha_fin: "",
      estado: "ACTIVA",
    });

    cargarDatos();
  };

  return (
    <main>
      <h1>Pólizas</h1>

      <p>Gestión de pólizas de seguros de accidentes personales.</p>

      <h2>Nueva póliza</h2>

      <form onSubmit={guardarPoliza}>
        <label>Número de póliza</label>
        <input
          type="text"
          name="numero_poliza"
          value={formulario.numero_poliza}
          onChange={manejarCambio}
          required
        />

        <label>Cliente</label>
        <select
          name="id_cliente"
          value={formulario.id_cliente}
          onChange={manejarCambio}
          required
        >
          <option value="">Seleccionar cliente</option>

          {clientes.map((cliente) => (
            <option
              key={cliente.id_cliente}
              value={cliente.id_cliente}
            >
              {cliente.nombre} {cliente.apellido}
            </option>
          ))}
        </select>

        <label>Fecha de inicio</label>
        <input
          type="date"
          name="fecha_inicio"
          value={formulario.fecha_inicio}
          onChange={manejarCambio}
          required
        />

        <label>Fecha de fin</label>
        <input
          type="date"
          name="fecha_fin"
          value={formulario.fecha_fin}
          onChange={manejarCambio}
          required
        />

        <label>Estado</label>
        <select
          name="estado"
          value={formulario.estado}
          onChange={manejarCambio}
        >
          <option value="ACTIVA">ACTIVA</option>
          <option value="VENCIDA">VENCIDA</option>
        </select>

        <button type="submit">Guardar póliza</button>
      </form>

      <h2>Pólizas registradas</h2>

      <ul>
  {polizas.map((poliza) => (
    <li key={poliza.id_poliza}>
      {poliza.numero_poliza} — {poliza.nombre} {poliza.apellido}
      {" — "}Desde: {poliza.fecha_inicio}
      {" — "}Hasta: {poliza.fecha_fin}
      {" — "}Estado: {poliza.estado}

      <button
        type="button"
        onClick={() => editarPoliza(poliza)}
      >
        Editar
      </button>
      <button
  type="button"
  onClick={async () => {
    const confirmar = window.confirm(
      `¿Querés eliminar la póliza ${poliza.numero_poliza}?`
    );

    if (!confirmar) return;

    const respuesta = await fetch("/api/polizas", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_poliza: poliza.id_poliza,
      }),
    });

    const resultado = await respuesta.json();

    alert(resultado.mensaje);

    if (respuesta.ok) {
      await cargarDatos();
    }
  }}
>
  Eliminar
</button>
    </li>
  ))}
</ul>
    </main>
  );
}