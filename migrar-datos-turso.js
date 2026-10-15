import dotenv from "dotenv";
import Database from "better-sqlite3";
import { createClient } from "@libsql/client";
import path from "path";

dotenv.config({ path: ".env.local" });

// Base de datos local
const rutaDB = path.join(process.cwd(), "seguros.db");
const dbLocal = new Database(rutaDB);

// Base de datos remota
const dbRemota = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const tablas = [
  {
    nombre: "cliente",
    columnas: [
      "id_cliente",
      "nombre",
      "apellido",
      "dni",
      "email",
      "telefono",
    ],
  },
  {
    nombre: "cobertura",
    columnas: ["id_cobertura", "nombre", "descripcion"],
  },
  {
    nombre: "poliza",
    columnas: [
      "id_poliza",
      "numero_poliza",
      "id_cliente",
      "fecha_inicio",
      "fecha_fin",
      "estado",
    ],
  },
  {
    nombre: "pago",
    columnas: [
      "id_pago",
      "id_poliza",
      "fecha",
      "importe",
      "estado",
    ],
  },
  {
    nombre: "siniestro",
    columnas: [
      "id_siniestro",
      "id_poliza",
      "fecha",
      "tipo",
      "descripcion",
      "estado",
    ],
  },
  {
    nombre: "poliza_cobertura",
    columnas: ["id_poliza", "id_cobertura"],
  },
];

async function migrarDatos() {
  try {
    console.log("Iniciando migración de datos...");

    for (const tabla of tablas) {
      const registros = dbLocal
        .prepare(`SELECT * FROM ${tabla.nombre}`)
        .all();

      for (const registro of registros) {
        const columnas = tabla.columnas;
        const nombresSQL = columnas.join(", ");
        const parametros = columnas.map(() => "?").join(", ");
        const valores = columnas.map(
          (columna) => registro[columna]
        );

        await dbRemota.execute({
          sql: `INSERT INTO ${tabla.nombre} (${nombresSQL}) VALUES (${parametros})`,
          args: valores,
        });
      }

      console.log(
        `${tabla.nombre}: ${registros.length} registros copiados.`
      );
    }

    console.log("¡Migración terminada correctamente!");
  } catch (error) {
    console.error("Error durante la migración:", error.message);
  } finally {
    dbLocal.close();
    dbRemota.close();
  }
}

migrarDatos();