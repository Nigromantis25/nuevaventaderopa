-- ============================================
-- DATOS DE EJEMPLO PARA store_online_backup
-- ============================================
USE store_online_backup;

-- ============================================
-- INSERTAR ROLES
-- ============================================
INSERT INTO rol (descripcion) VALUES 
('Administrador'),
('Vendedor'),
('Encargado de Inventario'),
('Gerente');

-- ============================================
-- INSERTAR MARCAS
-- ============================================
INSERT INTO marca (descripcion, estado) VALUES 
('Apple', 1),
('Samsung', 1),
('Sony', 1),
('LG', 1),
('Lenovo', 1),
('HP', 1),
('Dell', 1);

-- ============================================
-- INSERTAR CATEGORIAS
-- ============================================
INSERT INTO categoria (descripcion, estado) VALUES 
('Celulares', 1),
('Laptops', 1),
('Tablets', 1),
('Accesorios', 1),
('Monitores', 1),
('Auriculares', 1),
('Camaras', 1);

-- ============================================
-- INSERTAR USUARIOS
-- ============================================
INSERT INTO usuario (nombre, apellido_p, apellido_m, telefono, documento, correo, clave, estado) VALUES 
('Juan', 'Perez', 'Garcia', '3001234567', '1234567890', 'juan.perez@email.com', SHA2('password123', 256), 1),
('Maria', 'Lopez', 'Martinez', '3009876543', '0987654321', 'maria.lopez@email.com', SHA2('password123', 256), 1),
('Carlos', 'Rodriguez', 'Sanchez', '3005554444', '1111111111', 'carlos.rodriguez@email.com', SHA2('password123', 256), 1),
('Ana', 'Fernandez', 'Gomez', '3003332222', '2222222222', 'ana.fernandez@email.com', SHA2('password123', 256), 1),
('Luis', 'Torres', 'Ramirez', '3007776666', '3333333333', 'luis.torres@email.com', SHA2('password123', 256), 1);

-- ============================================
-- INSERTAR CLIENTES
-- ============================================
INSERT INTO cliente (idusuario) VALUES 
(1),
(2),
(3);

-- ============================================
-- INSERTAR EMPLEADOS
-- ============================================
INSERT INTO empleado (idusuario, idrol) VALUES 
(4, 1),
(5, 2);

-- ============================================
-- INSERTAR PERMISOS
-- ============================================
INSERT INTO permiso (idrol, acceso) VALUES 
(1, 'Ver Productos'),
(1, 'Crear Productos'),
(1, 'Editar Productos'),
(1, 'Eliminar Productos'),
(1, 'Ver Usuarios'),
(1, 'Crear Usuarios'),
(2, 'Ver Productos'),
(2, 'Realizar Ventas'),
(3, 'Ver Inventario'),
(3, 'Actualizar Stock');

-- ============================================
-- INSERTAR PROVEEDORES
-- ============================================
INSERT INTO proveedor (nombre, contacto, telefono, email, direccion, estado) VALUES 
('Proveedor Tech SA', 'John Smith', '3101111111', 'contacto@proveedortech.com', 'Calle 10 # 20-30, Bogota', 1),
('Distribuidora Global', 'Maria Angelica', '3102222222', 'info@distribuidora.com', 'Carrera 5 # 15-45, Medellin', 1),
('Tech World Importaciones', 'Roberto Lopez', '3103333333', 'sales@techworld.com', 'Avenida Principal 100, Cali', 1);

-- ============================================
-- INSERTAR PRODUCTOS
-- ============================================
INSERT INTO producto (idmarca, idcategoria, idempleado_creador, nombre, sku, descripcion, precio, stock, imagen_url, estado) VALUES 
(1, 1, 2, 'iPhone 14 Pro', 'SKU-001', 'Smartphone Apple ultima generacion', 1299.99, 15, 'iphone14.jpg', 1),
(2, 1, 2, 'Galaxy S23', 'SKU-002', 'Smartphone Samsung de gama alta', 899.99, 25, 'galaxy-s23.jpg', 1),
(1, 2, 2, 'MacBook Pro 14', 'SKU-003', 'Laptop profesional Apple', 1999.99, 8, 'macbook-pro.jpg', 1),
(6, 2, 2, 'HP Pavilion', 'SKU-004', 'Laptop versatil HP', 599.99, 12, 'hp-pavilion.jpg', 1),
(1, 3, 2, 'iPad Air', 'SKU-005', 'Tablet Apple de 10.9 pulgadas', 599.99, 10, 'ipad-air.jpg', 1),
(3, 6, 2, 'Sony WH-1000', 'SKU-006', 'Auriculares Noise Cancelling', 349.99, 30, 'sony-headphones.jpg', 1),
(4, 5, 2, 'Monitor LG 27', 'SKU-007', 'Monitor 4K 27 pulgadas', 449.99, 7, 'lg-monitor.jpg', 1),
(1, 4, 2, 'Lightning Cable', 'SKU-008', 'Cable cargador Apple', 29.99, 100, 'cable.jpg', 1);

-- ============================================
-- INSERTAR COMPRAS A PROVEEDORES
-- ============================================
INSERT INTO compra_proveedor (idproveedor, idempleado, fecha, total, estado, observaciones) VALUES 
(1, 2, '2026-02-15', 15000.00, 'completada', 'Compra de productos electronicos'),
(2, 2, '2026-02-20', 8500.00, 'completada', 'Compra de accesorios'),
(3, 2, '2026-03-01', 5200.00, 'pendiente', 'Pendiente de pago');

-- ============================================
-- INSERTAR DETALLE DE COMPRAS A PROVEEDORES
-- ============================================
INSERT INTO detalle_compra_proveedor (idcompraproveedor, idproducto, cantidad, preciocompra) VALUES 
(1, 1, 5, 900.00),
(1, 3, 3, 1500.00),
(2, 8, 50, 15.00),
(2, 6, 10, 200.00),
(3, 7, 4, 350.00);

-- ============================================
-- INSERTAR CARRITOS
-- ============================================
INSERT INTO carrito (idcliente, idproducto, cantidad) VALUES 
(1, 1, 1),
(1, 6, 2),
(2, 3, 1),
(3, 2, 1);

-- ============================================
-- INSERTAR COMPRAS ONLINE
-- ============================================
INSERT INTO compra (idcliente, totalproducto, montototal, enviado, fecharegistro) VALUES 
(1, 2, 1679.97, 1, '2026-02-10'),
(2, 1, 1999.99, 1, '2026-02-15'),
(1, 1, 899.99, 0, '2026-03-05');

-- ============================================
-- INSERTAR DETALLE DE COMPRAS ONLINE
-- ============================================
INSERT INTO detallecompra (idcompra, idproducto, cantidad, total, tipopago, direccion, telefono, detallelugar, fecharegistro) VALUES 
(1, 1, 1, 1299.99, 'Tarjeta Credito', 'Calle 50 # 10-30, Bogota', '3001234567', 'Apartamento 501', '2026-02-10'),
(1, 6, 1, 349.99, 'Tarjeta Credito', 'Calle 50 # 10-30, Bogota', '3001234567', 'Apartamento 501', '2026-02-10'),
(2, 3, 1, 1999.99, 'Transferencia', 'Carrera 7 # 20-50, Bogota', '3009876543', 'Casa', '2026-02-15'),
(3, 2, 1, 899.99, 'PSE', 'Avenida Principal 200, Bogota', '3001234567', 'Oficina', '2026-03-05');

-- ============================================
-- INSERTAR VENTAS FISICAS
-- ============================================
INSERT INTO ventafisico (idcliente, idempleado, totalproducto, montototal, tipodocumento, numerodocumento, fecharegistro) VALUES 
(1, 2, 1, 349.99, 'Factura', 'FAC-001-2026', '2026-02-12'),
(3, 2, 2, 2199.98, 'Factura', 'FAC-002-2026', '2026-02-18');

-- ============================================
-- INSERTAR DETALLE DE VENTAS FISICAS
-- ============================================
INSERT INTO detalleventafisico (idventafisico, idproducto, cantidad, total, tipopago, direccion, telefono, detallelugar, fecharegistro) VALUES 
(1, 6, 1, 349.99, 'Efectivo', 'Tienda Centro', '3101234567', 'Mostrador 1', '2026-02-12'),
(2, 1, 1, 1299.99, 'Tarjeta Debito', 'Tienda Centro', '3103333333', 'Mostrador 2', '2026-02-18'),
(2, 8, 10, 299.90, 'Tarjeta Debito', 'Tienda Centro', '3103333333', 'Mostrador 2', '2026-02-18');
