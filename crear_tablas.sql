CREATE TABLE IF NOT EXISTS cliente (
    id_cliente INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    dni TEXT UNIQUE NOT NULL,
    email TEXT,
    telefono TEXT
);
CREATE TABLE  IF NOT EXISTS poliza (
    id_poliza INTEGER PRIMARY KEY AUTOINCREMENT,
    numero_poliza TEXT UNIQUE NOT NULL,
    id_cliente INTEGER NOT NULL,
    fecha_inicio TEXT NOT NULL,
    fecha_fin TEXT NOT NULL,
    estado TEXT NOT NULL,
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente)
);
CREATE TABLE IF NOT EXISTS cobertura (
    id_cobertura INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    descripcion TEXT
);
CREATE TABLE IF NOT EXISTS siniestro (
    id_siniestro INTEGER PRIMARY KEY AUTOINCREMENT,
    id_poliza INTEGER NOT NULL,
    fecha TEXT NOT NULL,
    tipo TEXT NOT NULL,
    descripcion TEXT,
    estado TEXT NOT NULL,
    FOREIGN KEY (id_poliza) REFERENCES poliza(id_poliza)
);
CREATE TABLE IF NOT EXISTS pago (
    id_pago INTEGER PRIMARY KEY AUTOINCREMENT,
    id_poliza INTEGER NOT NULL,
    fecha TEXT NOT NULL,
    importe REAL NOT NULL,
    estado TEXT NOT NULL,
    FOREIGN KEY (id_poliza) REFERENCES poliza(id_poliza)
);
CREATE TABLE IF NOT EXISTS poliza_cobertura (
    id_poliza INTEGER NOT NULL,
    id_cobertura INTEGER NOT NULL,
    PRIMARY KEY (id_poliza, id_cobertura),
    FOREIGN KEY (id_poliza) REFERENCES poliza(id_poliza),
    FOREIGN KEY (id_cobertura) REFERENCES cobertura(id_cobertura)
);