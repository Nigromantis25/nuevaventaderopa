# 🚀 Integración Supabase - 1807.studio

## Información de Conexión

| Elemento | Valor |
|----------|-------|
| **URL del Proyecto** | `https://fohveedquqchtnzhkcyh.supabase.co` |
| **ID del Proyecto** | `fohveedquqchtnzhkcyh` |
| **Clave Publicable** | `sb_publishable_iKFVLsKK586dZTdzWJY6Tw_bByu2jFO` |
| **Base de Datos** | PostgreSQL |

---

## 📁 Archivos Configurados

### 1. `.env` - Variables de Entorno
- Contiene las credenciales de Supabase
- ⚠️ **NUNCA** comitear este archivo (está en `.gitignore`)
- Usado por la aplicación para conectarse

### 2. `supabase.js` - Cliente de Supabase
- Archivo principal de configuración
- Contiene todas las funciones para interactuar con la BD
- Importa la librería de Supabase desde CDN

### 3. `SUPABASE_EJEMPLOS.js` - Ejemplos Prácticos
- Código de ejemplo para usar todas las funciones
- Copia y pega lo que necesites en tu `app.js`

### 4. `.gitignore` - Seguridad
- Protege tus credenciales
- Excluye archivos sensibles del repositorio

---

## 🔐 Seguridad

### Claves Públicas vs Secretas
- **Clave Publicable** (en `.env`): Segura para usar en navegador
- **Clave Secreta**: Solo en backend/servidor (NO incluida aquí)

### RLS (Row Level Security)
- Ya está configurada en Supabase
- Controla quién puede ver/editar qué datos
- Revisa las políticas en tu dashboard de Supabase

---

## 📦 Tablas Disponibles

```
✅ Usuarios
   ├── usuario (ID, nombre, email, teléfono, etc)
   ├── cliente (información del cliente)
   └── empleado (información del empleado)

✅ Catálogo
   ├── marca (Premium, Estándar, etc)
   ├── categoria (Tote, Clutch, etc)
   └── producto (nombre, precio, stock, imagen)

✅ Proveedores
   ├── proveedor (nombre, contacto, email)
   ├── compra_proveedor (compras del negocio)
   └── detalle_compra_proveedor (items de cada compra)

✅ Ventas Online
   ├── compra (órdenes de clientes)
   ├── detallecompra (items de cada orden)
   └── carrito (carrito de compras)

✅ Ventas Físicas
   ├── ventafisico (ventas en tienda)
   └── detalleventafisico (items vendidos)
```

---

## 💡 Funciones Principales

### Autenticación
```javascript
signUpUser(email, password, nombre)     // Registrar user
signInUser(email, password)              // Iniciar sesión
signOutUser()                            // Cerrar sesión
```

### Productos
```javascript
getProducts(limit)                       // Todos los productos
getProductById(id)                       // Producto específico
getProductsByCategory(idcategoria)      // Por categoría
```

### Carrito
```javascript
addToCart(clienteId, productoId, cantidad)    // Agregar
getCartItems(clienteId)                       // Ver carrito
removeFromCart(carritoId)                     // Eliminar item
```

### Órdenes
```javascript
createOrder(clienteId, items, totalMonto)     // Crear compra
getOrders(clienteId)                          // Ver órdenes
```

### Catálogos
```javascript
getCategories()     // Obtener categorías
getBrands()         // Obtener marcas
```

### Real-Time
```javascript
subscribeToProductChanges(callback)     // Escuchar cambios
subscribeToCartChanges(clienteId, callback)
```

---

## 🚀 Cómo Usar

### 1. En tu `app.js`, importa las funciones:
```javascript
import { 
    supabase,
    getProducts, 
    getCartItems, 
    createOrder 
} from './supabase.js'
```

### 2. Usa las funciones:
```javascript
// Obtener productos
const res = await getProducts()
if (res.success) {
    console.log('Productos:', res.data)
} else {
    console.error('Error:', res.error)
}

// Agregar al carrito
await addToCart(clienteId, productoId, cantidad)

// Ver carrito
const carrito = await getCartItems(clienteId)
```

### 3. Manejo de errores:
```javascript
const res = await getProducts()
if (!res.success) {
    alert('Error: ' + res.error)
    return
}
// Procesar datos...
```

---

## 🔧 Conexión Directa a Supabase (SQL)

Si necesitas ejecutar SQL directamente:
1. Entra a: https://app.supabase.com
2. Selecciona tu proyecto
3. Ve a **SQL Editor**
4. Ejecuta consultas

Ejemplo:
```sql
SELECT * FROM producto WHERE estado = 1;
UPDATE producto SET stock = stock - 1 WHERE idproducto = 5;
```

---

## 📊 Dashboard Supabase

Accede a tu dashboard:
- **URL**: https://app.supabase.com
- **Proyecto**: fohveedquqchtnzhkcyh
- **Desde aquí puedes**:
  - Ver datos en tiempo real
  - Configurar RLS
  - Ver logs
  - Manejar backups

---

## 🐛 Solución de Problemas

### Error: "CORS policy"
- Es normal en desarrollo
- Supabase maneja automáticamente CORS

### Error: "No data returned"
```javascript
// Verifica que la tabla exista
const { data, error } = await supabase.from('producto').select('*')
if (error) console.error('Error:', error.message)
```

### Error: "Authentication required"
```javascript
// Revisa que hayas iniciado sesión
const user = await supabase.auth.getUser()
if (!user) window.location.href = 'login.html'
```

### Real-time no funciona
```javascript
// Verifica tu conexión a internet
// Abre console: F12 → Network tab
// Busca "realtime" en la lista de conexiones
```

---

## 📝 Notas Importantes

1. **Producciones**: Activa HTTPS en tu dominio
2. **Backups**: Supabase hace automáticamente
3. **Escalabilidad**: Supabase crece contigo
4. **Pricing**: Primeros $5 gratis/mes, luego módulo de pago
5. **Datos**: Alojados en múltiples regiones por seguridad

---

## 🆘 Soporte

- **Documentación oficial**: https://supabase.com/docs
- **Comunidad**: https://discord.supabase.com
- **Dashboard Supabase**: https://app.supabase.com

---

**Última actualización**: 11 de abril de 2026
**Proyecto**: 1807.studio
