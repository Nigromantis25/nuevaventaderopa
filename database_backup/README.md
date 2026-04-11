# Base de Datos Backup - Store Online

Esta carpeta contiene una copia completa y funcional de la base de datos para el sistema de tienda en línea.

## Archivos Disponibles

### 1. **schema_backup.sql**
Contiene la estructura completa de la base de datos `store_online_backup` con todas las tablas:

#### Tablas Principales
- **rol**: Almacena los roles del sistema (Administrador, Vendedor, etc.)
- **permiso**: Gestiona los permisos por rol
- **usuario**: Base para clientes y empleados
- **cliente**: Información de clientes
- **empleado**: Información de empleados

#### Tablas de Catálogo
- **marca**: Marcas de productos
- **categoria**: Categorías de productos
- **producto**: Productos del sistema

#### Tablas de Proveedores
- **proveedor**: Datos de proveedores
- **compra_proveedor**: Compras realizadas a proveedores
- **detalle_compra_proveedor**: Detalles de cada compra a proveedor

#### Tablas de Compras Online
- **compra**: Órdenes de compra de clientes
- **detallecompra**: Detalles de productos en compras online
- **carrito**: Sistema de carrito de compras

#### Tablas de Ventas Físicas
- **ventafisico**: Ventas presenciales en tienda
- **detalleventafisico**: Detalles de ventas físicas

### 2. **data_sample.sql**
Contiene datos de ejemplo para poblar la base de datos con:
- 5 usuarios de prueba
- 3 clientes
- 2 empleados
- 7 marcas de productos
- 7 categorías
- 8 productos
- 3 proveedores
- 3 compras a proveedores
- 3 compras online
- 2 ventas físicas

## Cómo Usar

### Crear la Base de Datos Vacía
```bash
mysql -u tu_usuario -p < schema_backup.sql
```

### Crear la Base de Datos con Datos de Ejemplo
```bash
mysql -u tu_usuario -p < schema_backup.sql
mysql -u tu_usuario -p < data_sample.sql
```

O ejecutar ambos en secuencia:
```bash
mysql -u tu_usuario -p -e "source schema_backup.sql; source data_sample.sql;"
```

## Características

✅ Estructura completa y funcional  
✅ Todas las relaciones y claves foráneas configuradas  
✅ Datos de ejemplo listos para pruebas  
✅ Compatible con MySQL 5.7+  
✅ Tablas con campos calculados (GENERATED AS)  
✅ Índices y restricciones apropiadas  

## Diferencias con la BD Original

Esta es una copia **idéntica** de `database/schema.sql` pero:
- Base de datos: **store_online_backup** (en lugar de store_online)
- Archivo de esquema: **schema_backup.sql**
- Incluye archivo adicional de datos de prueba: **data_sample.sql**

## Notas Importantes

- Los datos de ejemplo incluyen contraseñas encriptadas con SHA2
- Las fechas de ejemplo están en febrero-marzo de 2026
- El stock de productos en los ejemplos varía según las compras
- Todos los registros están marcados como activos (estado = 1)
