-- ============================================
-- BASE DE DATOS STORE ONLINE BACKUP
-- ============================================
CREATE DATABASE IF NOT EXISTS store_online_backup;
USE store_online_backup;

-- ============================================
-- TABLAS PRINCIPALES DEL SISTEMA
-- ============================================

-- 1. ROLES
CREATE TABLE rol (
    idrol INT PRIMARY KEY AUTO_INCREMENT,
    descripcion VARCHAR(100) NOT NULL,
    fecharegistro DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. PERMISOS POR ROL
CREATE TABLE permiso (
    idpermiso INT PRIMARY KEY AUTO_INCREMENT,
    idrol INT NOT NULL,
    acceso VARCHAR(100) NOT NULL,
    FOREIGN KEY (idrol) REFERENCES rol(idrol) ON DELETE CASCADE
);

-- 3. USUARIOS (BASE PARA CLIENTES Y EMPLEADOS)
CREATE TABLE usuario (
    idusuario INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    apellido_p VARCHAR(100),
    apellido_m VARCHAR(100),
    telefono VARCHAR(20),
    documento VARCHAR(50),
    correo VARCHAR(100) UNIQUE NOT NULL,
    clave VARBINARY(255) NOT NULL,
    estado TINYINT DEFAULT 1,
    fecharegistro DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. CLIENTES
CREATE TABLE cliente (
    idcliente INT PRIMARY KEY AUTO_INCREMENT,
    idusuario INT NOT NULL UNIQUE,
    FOREIGN KEY (idusuario) REFERENCES usuario(idusuario) ON DELETE CASCADE
);

-- 5. EMPLEADOS
CREATE TABLE empleado (
    idempleado INT PRIMARY KEY AUTO_INCREMENT,
    idusuario INT NOT NULL UNIQUE,
    idrol INT NOT NULL,
    FOREIGN KEY (idusuario) REFERENCES usuario(idusuario) ON DELETE CASCADE,
    FOREIGN KEY (idrol) REFERENCES rol(idrol)
);

-- ============================================
-- TABLAS DE CATALOGO DE PRODUCTOS
-- ============================================

-- 6. MARCAS
CREATE TABLE marca (
    idmarca INT PRIMARY KEY AUTO_INCREMENT,
    descripcion VARCHAR(100) NOT NULL,
    estado TINYINT DEFAULT 1,
    fecharegistro DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 7. CATEGORIAS
CREATE TABLE categoria (
    idcategoria INT PRIMARY KEY AUTO_INCREMENT,
    descripcion VARCHAR(100) NOT NULL,
    estado TINYINT DEFAULT 1,
    fecharegistro DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 8. PRODUCTOS (MODIFICADO: incluye idempleado_creador y sku)
CREATE TABLE producto (
    idproducto INT PRIMARY KEY AUTO_INCREMENT,
    idmarca INT NOT NULL,
    idcategoria INT NOT NULL,
    idempleado_creador INT NULL,
    nombre VARCHAR(100) NOT NULL,
    sku VARCHAR(50) UNIQUE,
    descripcion VARCHAR(200),
    precio DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0,
    imagen_url VARCHAR(200),
    estado TINYINT DEFAULT 1,
    fecharegistro DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idmarca) REFERENCES marca(idmarca),
    FOREIGN KEY (idcategoria) REFERENCES categoria(idcategoria),
    FOREIGN KEY (idempleado_creador) REFERENCES empleado(idempleado) ON DELETE SET NULL
);

-- ============================================
-- TABLAS DE PROVEEDORES
-- ============================================

-- 9. PROVEEDORES
CREATE TABLE proveedor (
    idproveedor INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    contacto VARCHAR(100),
    telefono VARCHAR(20),
    email VARCHAR(100),
    direccion VARCHAR(200),
    estado TINYINT DEFAULT 1,
    fecharegistro DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 10. COMPRAS A PROVEEDORES (INTEGRACION DE INVENTARIO POR EMPLEADO)
CREATE TABLE compra_proveedor (
    idcompraproveedor INT PRIMARY KEY AUTO_INCREMENT,
    idproveedor INT NOT NULL,
    idempleado INT NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10,2) DEFAULT 0,
    estado VARCHAR(20) DEFAULT 'pendiente',
    observaciones VARCHAR(200),
    FOREIGN KEY (idproveedor) REFERENCES proveedor(idproveedor),
    FOREIGN KEY (idempleado) REFERENCES empleado(idempleado)
);

-- 11. DETALLE DE COMPRAS A PROVEEDORES
CREATE TABLE detalle_compra_proveedor (
    iddetallecompraproveedor INT PRIMARY KEY AUTO_INCREMENT,
    idcompraproveedor INT NOT NULL,
    idproducto INT NOT NULL,
    cantidad INT NOT NULL,
    preciocompra DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) GENERATED ALWAYS AS (cantidad * preciocompra) STORED,
    FOREIGN KEY (idcompraproveedor) REFERENCES compra_proveedor(idcompraproveedor) ON DELETE CASCADE,
    FOREIGN KEY (idproducto) REFERENCES producto(idproducto)
);

-- ============================================
-- TABLAS DE COMPRAS ONLINE (CLIENTES)
-- ============================================

-- 12. COMPRAS ONLINE
CREATE TABLE compra (
    idcompra INT PRIMARY KEY AUTO_INCREMENT,
    idcliente INT NOT NULL,
    totalproducto INT,
    montototal DECIMAL(10,2),
    enviado TINYINT DEFAULT 0,
    fecharegistro DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idcliente) REFERENCES cliente(idcliente)
);

-- 13. DETALLE DE COMPRAS ONLINE
CREATE TABLE detallecompra (
    iddetallecompra INT PRIMARY KEY AUTO_INCREMENT,
    idcompra INT NOT NULL,
    idproducto INT NOT NULL,
    cantidad INT NOT NULL,
    total DECIMAL(10,2),
    tipopago VARCHAR(50),
    direccion VARCHAR(200),
    telefono VARCHAR(20),
    detallelugar VARCHAR(200),
    fecharegistro DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idcompra) REFERENCES compra(idcompra) ON DELETE CASCADE,
    FOREIGN KEY (idproducto) REFERENCES producto(idproducto)
);

-- 14. CARRITO DE COMPRAS
CREATE TABLE carrito (
    idcarrito INT PRIMARY KEY AUTO_INCREMENT,
    idcliente INT NOT NULL,
    idproducto INT NOT NULL,
    cantidad INT DEFAULT 1,
    FOREIGN KEY (idcliente) REFERENCES cliente(idcliente) ON DELETE CASCADE,
    FOREIGN KEY (idproducto) REFERENCIAS producto(idproducto) ON DELETE CASCADE
);

-- ============================================
-- TABLAS DE VENTAS FISICAS (EMPLEADO-CLIENTE)
-- ============================================

-- 15. VENTAS FISICAS (ATENDIDAS POR EMPLEADOS)
CREATE TABLE ventafisico (
    idventafisico INT PRIMARY KEY AUTO_INCREMENT,
    idcliente INT NOT NULL,
    idempleado INT NOT NULL,
    totalproducto INT,
    montototal DECIMAL(10,2),
    tipodocumento VARCHAR(50),
    numerodocumento VARCHAR(50),
    fecharegistro DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idcliente) REFERENCES cliente(idcliente),
    FOREIGN KEY (idempleado) REFERENCES empleado(idempleado)
);

-- 16. DETALLE DE VENTAS FISICAS
CREATE TABLE detalleventafisico (
    iddetalleventafisico INT PRIMARY KEY AUTO_INCREMENT,
    idventafisico INT NOT NULL,
    idproducto INT NOT NULL,
    cantidad INT NOT NULL,
    total DECIMAL(10,2),
    tipopago VARCHAR(50),
    direccion VARCHAR(200),
    telefono VARCHAR(20),
    detallelugar VARCHAR(200),
    fecharegistro DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idventafisico) REFERENCES ventafisico(idventafisico) ON DELETE CASCADE,
    FOREIGN KEY (idproducto) REFERENCES producto(idproducto)
);
