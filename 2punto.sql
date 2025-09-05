SELECT DISTINCT c.nombre, c.apellidos
FROM cliente c
JOIN inscripcion i ON c.id = i.idCliente
JOIN producto p ON i.idProducto = p.id
JOIN disponibilidad d ON p.id = d.idProducto
JOIN sucursal s ON d.idSucursal = s.id
JOIN visitan v ON v.idSucursal = s.id AND v.idCliente = c.id
WHERE NOT EXISTS (
    SELECT 1
    FROM disponibilidad d2
    JOIN sucursal s2 ON d2.idSucursal = s2.id
    WHERE d2.idProducto = p.id
      AND d2.idSucursal NOT IN (
          SELECT v2.idSucursal
          FROM visitan v2
          WHERE v2.idCliente = c.id
      )
);
