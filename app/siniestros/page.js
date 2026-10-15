"use client";

import { useEffect, useState } from "react";

export default function Siniestros() {
  const [polizas, setPolizas] = useState([]);
  const [siniestros, setSiniestros] = useState([]);
  const [siniestroEditando, setSiniestroEditando] = useState(null);

  const [formulario, setFormulario] = useState({
    id_poliza: "",
    fecha: "",
    tipo: "",
    descripcion: "",
    estado: "ABIERTO",
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    const respuestaPolizas = await fetch("/api/polizas");
    const datosPolizas = await respuestaPolizas.json();
    setPolizas(datosPolizas);

    const respuestaSiniestros = await fetch("/api/siniestros");
    const datosSiniestros = await respuestaSiniestros.json();
    setSiniestros(datosSiniestros);
  };
  const editarSiniestro = (siniestro) => {
  setSiniestroEditando(siniestro);

  setFormulario({
    id_poliza: String(siniestro.id_poliza),
    fecha: siniestro.fecha,
    tipo: siniestro.tipo,
    descripcion: siniestro.descripcion || "",
    estado: siniestro.estado,
  });
};

  const manejarCambio = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value,
    });
  };

  const guardarSiniestro = async (e) => {
    e.preventDefault();

    const respuesta = await fetch("/api/siniestros", {
      method: siniestroEditando ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
  siniestroEditando
    ? { ...formulario, id_siniestro: siniestroEditando.id_siniestro }
    : formulario
),
    });

    const resultado = await respuesta.json();

    alert(resultado.mensaje);
    if (!respuesta.ok) {
  return;
}

setSiniestroEditando(null);

setFormulario({
  id_poliza: "",
  fecha: "",
  tipo: "",
  descripcion: "",
  estado: "ABIERTO",
});

await cargarDatos();

    if (!respuesta.ok) {
      return;
    }

    setFormulario({
      id_poliza: "",
      fecha: "",
      tipo: "",
      descripcion: "",
      estado: "ABIERTO",
    });

    await cargarDatos();
  };

  return (
    <main>
      <h1>Siniestros</h1>

      <p>Gestión de siniestros de seguros de accidentes personales.</p>

      <h2>Nuevo siniestro</h2>

      <form onSubmit={guardarSiniestro}>
        <label>Póliza</label>

        <select
          name="id_poliza"
          value={formulario.id_poliza}
          onChange={manejarCambio}
          required
        >
          <option value="">Seleccionar póliza</option>

          {polizas.map((poliza) => (
            <option key={poliza.id_poliza} value={poliza.id_poliza}>
              {poliza.numero_poliza} — {poliza.nombre} {poliza.apellido}
            </option>
          ))}
        </select>

        <label>Fecha</label>

        <input
          type="date"
          name="fecha"
          value={formulario.fecha}
          onChange={manejarCambio}
          required
        />

        <label>Tipo</label>

        <input
          type="text"
          name="tipo"
          value={formulario.tipo}
          onChange={manejarCambio}
          required
        />

        <label>Descripción</label>

        <textarea
          name="descripcion"
          value={formulario.descripcion}
          onChange={manejarCambio}
          required
        />

        <label>Estado</label>

        <select
          name="estado"
          value={formulario.estado}
          onChange={manejarCambio}
        >
          <option value="ABIERTO">ABIERTO</option>
          <option value="CERRADO">CERRADO</option>
        </select>

        <button type="submit">Guardar siniestro</button>
      </form>

      <h2>Siniestros registrados</h2>

      <ul>
  {siniestros.map((siniestro) => (
    <li key={siniestro.id_siniestro}>
      {siniestro.numero_poliza}
      {" — "}Fecha: {siniestro.fecha}
      {" — "}Tipo: {siniestro.tipo}
      {" — "}Descripción: {siniestro.descripcion}
      {" — "}Estado: {siniestro.estado}

      <button
        type="button"
        onClick={() => editarSiniestro(siniestro)}
      >
        Editar
      </button>
      <button
  type="button"
  onClick={async () => {
    const confirmar = window.confirm(
      `¿Querés eliminar el siniestro de la póliza ${siniestro.numero_poliza}?`
    );

    if (!confirmar) return;

    const respuesta = await fetch("/api/siniestros", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_siniestro: siniestro.id_siniestro,
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