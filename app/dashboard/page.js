"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function Dashboard() {
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/dashboard")
      .then((respuesta) => {
        if (!respuesta.ok) {
          throw new Error("No se pudieron cargar los datos");
        }
        return respuesta.json();
      })
      .then((resultado) => setDatos(resultado))
      .catch(() => setError("Error al cargar el Dashboard"));
  }, []);

  if (error) {
    return <main><h1>{error}</h1></main>;
  }

  if (!datos) {
    return <main><h1>Cargando Dashboard...</h1></main>;
  }

  const indicadores = [
    {
      titulo: "Total de clientes",
      valor: datos.indicadores.totalClientes,
    },
    {
      titulo: "Pólizas activas",
      valor: datos.indicadores.polizasActivas,
    },
    {
      titulo: "Siniestros abiertos",
      valor: datos.indicadores.siniestrosAbiertos,
    },
    {
      titulo: "Siniestros cerrados",
      valor: datos.indicadores.siniestrosCerrados,
    },
  ];

  return (
    <main style={{ padding: "30px", fontFamily: "Arial, sans-serif" }}>
      <h1>Dashboard de Seguros</h1>
      <p>Indicadores generales del sistema de accidentes personales.</p>

      <h2>Indicadores principales</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          marginBottom: "40px",
        }}
      >
        {indicadores.map((indicador) => (
          <div
            key={indicador.titulo}
            style={{
              padding: "20px",
              border: "1px solid #ddd",
              borderRadius: "10px",
              background: "#f5f7fa",
            }}
          >
            <h3>{indicador.titulo}</h3>
            <p style={{ fontSize: "32px", fontWeight: "bold", margin: 0 }}>
              {indicador.valor}
            </p>
          </div>
        ))}
      </div>

      <section style={{ marginBottom: "40px" }}>
        <h2>Pólizas por estado</h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={datos.graficos.polizasPorEstado}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="estado" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="cantidad" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      <section style={{ marginBottom: "40px" }}>
        <h2>Siniestros por tipo</h2>

        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
  data={datos.graficos.siniestrosPorTipo}
  dataKey="cantidad"
  nameKey="tipo"
  cx="50%"
  cy="50%"
  outerRadius={110}
  label
>
  {datos.graficos.siniestrosPorTipo.map((item, indice) => (
    <Cell
      key={item.tipo}
      fill={["#2563eb", "#16a34a", "#f59e0b", "#dc2626", "#9333ea"][indice % 5]}
    />
  ))}
</Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </section>

      <section style={{ marginBottom: "40px" }}>
        <h2>Siniestros por mes</h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={datos.graficos.siniestrosPorMes}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="cantidad" fill="#16a34a" />
          </BarChart>
        </ResponsiveContainer>
      </section>
    </main>
  );
}