-- 1. Mostrar todos los clientes

SELECT *
FROM cliente;
-- 2. Mostrar todos los clientes ordenados alfabéticamente por apellido

SELECT *
FROM cliente
ORDER BY apellido ASC;
-- 3. Mostrar clientes cuyo apellido comienza con A

SELECT *
FROM cliente
WHERE apellido LIKE 'A%';
-- 4. Buscar una póliza por su número

SELECT *
FROM poliza
WHERE numero_poliza = 'POL-1005';
-- 5. Contar la cantidad total de clientes

SELECT COUNT(*) AS cantidad_clientes
FROM cliente;
-- 6. Contar la cantidad de pólizas activas

SELECT COUNT(*) AS cantidad_polizas_activas
FROM poliza
WHERE estado = 'ACTIVA';
-- 7. Contar la cantidad total de siniestros

SELECT COUNT(*) AS cantidad_siniestros
FROM siniestro;
-- 8. Calcular el promedio de los pagos

SELECT AVG(importe) AS promedio_pagos
FROM pago;
-- 9. Mostrar cada cliente junto con sus pólizas

SELECT
    cliente.nombre,
    cliente.apellido,
    cliente.dni,
    poliza.numero_poliza,
    poliza.fecha_inicio,
    poliza.fecha_fin,
    poliza.estado
FROM cliente
JOIN poliza
    ON cliente.id_cliente = poliza.id_cliente;

    -- 10. Mostrar cada póliza junto con sus siniestros

SELECT
    poliza.numero_poliza,
    poliza.estado AS estado_poliza,
    siniestro.fecha,
    siniestro.tipo,
    siniestro.descripcion,
    siniestro.estado AS estado_siniestro
FROM poliza
JOIN siniestro
    ON poliza.id_poliza = siniestro.id_poliza;
    -- 11. Mostrar clientes, sus pólizas y los siniestros asociados

SELECT
    cliente.nombre,
    cliente.apellido,
    cliente.dni,
    poliza.numero_poliza,
    poliza.estado AS estado_poliza,
    siniestro.fecha,
    siniestro.tipo,
    siniestro.descripcion,
    siniestro.estado AS estado_siniestro
FROM cliente
JOIN poliza
    ON cliente.id_cliente = poliza.id_cliente
JOIN siniestro
    ON poliza.id_poliza = siniestro.id_poliza;