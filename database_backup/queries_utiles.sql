-- ============================================
-- COMANDOS UTILES PARA store_online_backup
-- ============================================

-- ============================================
-- SELECCIONAR/CONSULTAR DATOS
-- ============================================

-- Ver todos los productos disponibles
SELECT p.idproducto, p.nombre, m.descripcion AS marca, c.descripcion AS categoria, 
       p.precio, p.stock, p.estado
FROM producto p
JOIN marca m ON p.idmarca = m.idmarca
JOIN categoria c ON p.idcategoria = c.idcategoria
ORDER BY p.nombre;

-- Ver all clientes con sus datos
SELECT u.idusuario, u.nombre, u.apellido_p, u.apellido_m, u.correo, u.telefono
FROM usuario u
JOIN cliente cl ON u.idusuario = cl.idusuario
ORDER BY u.nombre;

-- Ver empleados con sus roles
SELECT e.idempleado, u.nombre, u.apellido_p, r.descripcion AS rol
FROM empleado e
JOIN usuario u ON e.idusuario = u.idusuario
JOIN rol r ON e.idrol = r.idrol
ORDER BY u.nombre;

-- Ver carrito de compras de un cliente
SELECT c.idcarrito, c.cantidad, p.nombre, p.precio, (c.cantidad * p.precio) AS total
FROM carrito c
JOIN producto p ON c.idproducto = p.idproducto
WHERE c.idcliente = 1;

-- Ver historial de compras online
SELECT co.idcompra, u.nombre, co.montototal, co.enviado, co.fecharegistro
FROM compra co
JOIN cliente cl ON co.idcliente = cl.idcliente
JOIN usuario u ON cl.idusuario = u.idusuario
ORDER BY co.fecharegistro DESC;

-- Ver detalles de una compra específica
SELECT dc.iddetallecompra, p.nombre, dc.cantidad, p.precio, dc.total, 
       dc.tipopago, dc.direccion, dc.telefono
FROM detallecompra dc
JOIN producto p ON dc.idproducto = p.idproducto
WHERE dc.idcompra = 1;

-- Ver ventas físicas
SELECT vf.idventafisico, u.nombre AS cliente, e.idempleado, 
       u2.nombre AS vendedor, vf.montototal, vf.tipodocumento, vf.fecharegistro
FROM ventafisico vf
JOIN cliente cl ON vf.idcliente = cl.idcliente
JOIN usuario u ON cl.idusuario = u.idusuario
JOIN empleado e ON vf.idempleado = e.idempleado
JOIN usuario u2 ON e.idusuario = u2.idusuario
ORDER BY vf.fecharegistro DESC;

-- Ver compras a proveedores
SELECT cp.idcompraproveedor, pr.nombre AS proveedor, u.nombre AS empleado, 
       cp.total, cp.estado, cp.fecha
FROM compra_proveedor cp
JOIN proveedor pr ON cp.idproveedor = pr.idproveedor
JOIN empleado e ON cp.idempleado = e.idempleado
JOIN usuario u ON e.idusuario = u.idusuario
ORDER BY cp.fecha DESC;

-- Ver productos por categoria
SELECT c.descripcion AS categoria, COUNT(p.idproducto) AS cantidad_productos,
       AVG(p.precio) AS precio_promedio, SUM(p.stock) AS stock_total
FROM categoria c
LEFT JOIN producto p ON c.idcategoria = p.idcategoria
GROUP BY c.idcategoria, c.descripcion
ORDER BY c.descripcion;

-- Ver stock disponible por marca
SELECT m.descripcion AS marca, COUNT(p.idproducto) AS cantidad_productos,
       SUM(p.stock) AS stock_total, AVG(p.precio) AS precio_promedio
FROM marca m
LEFT JOIN producto p ON m.idmarca = p.idmarca
GROUP BY m.idmarca, m.descripcion
ORDER BY stock_total DESC;

-- ============================================
-- ACTUALIZAR DATOS
-- ============================================

-- Actualizar stock de un producto
UPDATE producto SET stock = stock - 1 WHERE idproducto = 1;

-- Actualizar el estado de un usuario
UPDATE usuario SET estado = 1 WHERE idusuario = 1;

-- Actualizar el estado de una compra
UPDATE compra SET enviado = 1 WHERE idcompra = 1;

-- Actualizar estado de compra a proveedor
UPDATE compra_proveedor SET estado = 'completada' WHERE idcompraproveedor = 1;

-- ============================================
-- INSERTAR DATOS
-- ============================================

-- Insertar un nuevo usuario
INSERT INTO usuario (nombre, apellido_p, apellido_m, telefono, documento, correo, clave, estado)
VALUES ('Nuevo', 'Usuario', 'Apellido', '3001234567', '9999999999', 'nuevo@email.com', SHA2('password', 256), 1);

-- Agregar cliente nuevo
INSERT INTO cliente (idusuario) VALUES (6);

-- Insertar nuevo producto
INSERT INTO producto (idmarca, idcategoria, idempleado_creador, nombre, sku, descripcion, precio, stock, imagen_url, estado)
VALUES (1, 1, 2, 'Nuevo Producto', 'SKU-999', 'Descripcion del producto', 299.99, 50, 'imagen.jpg', 1);

-- Agregar a carrito
INSERT INTO carrito (idcliente, idproducto, cantidad) VALUES (1, 9, 2);

-- ============================================
-- ELIMINAR DATOS
-- ============================================

-- Eliminar un producto del carrito
DELETE FROM carrito WHERE idcarrito = 1;

-- Eliminar un cliente (borra en cascada sus compras)
DELETE FROM cliente WHERE idcliente = 1;

-- ============================================
-- REPORTES AVANZADOS
-- ============================================

-- Reporte de ventas totales por mes
SELECT DATE_FORMAT(co.fecharegistro, '%Y-%m') AS mes,
       COUNT(co.idcompra) AS cantidad_ordenes,
       SUM(co.montototal) AS ventas_totales,
       AVG(co.montototal) AS venta_promedio
FROM compra co
GROUP BY DATE_FORMAT(co.fecharegistro, '%Y-%m')
ORDER BY mes DESC;

-- Producto más vendido
SELECT p.idproducto, p.nombre, SUM(dc.cantidad) AS cantidad_vendida,
       SUM(dc.total) AS ingresos_totales
FROM detallecompra dc
JOIN producto p ON dc.idproducto = p.idproducto
GROUP BY p.idproducto, p.nombre
ORDER BY cantidad_vendida DESC
LIMIT 10;

-- Clientes con mayor gasto
SELECT u.idusuario, u.nombre, u.apellido_p,
       COUNT(co.idcompra) AS cantidad_compras,
       SUM(co.montototal) AS gasto_total
FROM usuario u
JOIN cliente cl ON u.idusuario = cl.idusuario
LEFT JOIN compra co ON cl.idcliente = co.idcliente
GROUP BY u.idusuario, u.nombre, u.apellido_p
ORDER BY gasto_total DESC;

-- Productos con bajo stock (menos de 10 unidades)
SELECT idproducto, nombre, sku, stock, precio
FROM producto
WHERE stock < 10 AND estado = 1
ORDER BY stock ASC;

-- Ingresos por tipo de pago (compras online)
SELECT tipopago, COUNT(*) AS cantidad_transacciones,
       SUM(total) AS total_ingresos
FROM detallecompra
GROUP BY tipopago
ORDER BY total_ingresos DESC;
