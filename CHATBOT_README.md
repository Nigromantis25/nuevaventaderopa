# 🤖 Chatbot IA Avanzado - 1807.studio

## ✨ Características

- **Inteligente**: Detecta automáticamente si eres Admin o Cliente
- **Funcional**: Permite compras reales con Supabase
- **Contextual**: Respuestas diferentes según tu rol
- **Real-time**: Actualizaciones en tiempo real
- **Multiusuario**: Funciona tanto en Dashboard como en Tienda

---

## 👤 Tipos de Usuario

### 🔧 **Admin (Dashboard)**
Funciones disponibles:
- 📊 Ver estadísticas de ventas
- 📦 Gestionar inventario
- 👥 Administrar clientes
- 📈 Ver reportes
- 💬 Atender consultas

### 🛒 **Cliente (Tienda)**
Funciones disponibles:
- 🛍️ Ver productos disponibles
- 📅 **Reservar productos** (nueva)
- 🛒 Agregar al carrito
- 👀 Ver mi carrito
- 📋 Mis pedidos
- ❓ **Preguntar sobre productos** (nueva)
- 📱 **Conexión directa con WhatsApp**

### 👤 **Invitado**
Funciones básicas:
- 🛍️ Explorar productos
- 📂 Ver categorías
- 👤 Crear cuenta
- 💬 Contacto

---

## 💬 Comandos Disponibles

### Para Todos:
```
hola, buenos días, hey    → Saludo personalizado
ayuda, help               → Ver todas las opciones
productos, catálogo       → Ver productos disponibles
categorías, tipos         → Ver categorías
whatsapp, contacto        → Contactar por WhatsApp
```

### Para Clientes:
```
agregar [número]          → Agregar al carrito
carrito, ver carrito      → Ver productos en carrito
comprar, confirmar        → Finalizar compra
mis pedidos               → Historial de compras
reservar [número]         → Reservar producto (WhatsApp)
mis reservas              → Ver reservas activas
preguntar [mensaje]       → Consulta personalizada
```

### Para Clientes:
```
agregar [número]          → Agregar producto al carrito
carrito, ver carrito      → Ver productos en carrito
comprar, confirmar        → Finalizar compra
mis pedidos, órdenes      → Ver historial de compras
```

### Para Admin:
```
estadísticas, métricas    → Ver dashboard
ventas hoy               → Ventas del día
productos bajos          → Stock bajo
clientes nuevos          → Nuevos clientes
pedidos pendientes       → Órdenes pendientes
```

---

## 🚀 Cómo Usar

### 1. **Abrir Chatbot**
- **Dashboard Admin**: Clic en "Chatbot IA" en el sidebar
- **Tienda Cliente**: Clic en el botón flotante de chat (💬)

### 2. **Escribir Mensajes**
- Escribe en lenguaje natural
- El bot entiende variaciones (ej: "productos", "ver productos", "catalogo")
- Responde automáticamente

### 3. **Compras para Clientes**
```javascript
// Ejemplo de flujo de compra:
"productos"           → Muestra catálogo
"agregar 1"          → Agrega producto #1 al carrito
"carrito"            → Muestra carrito
"comprar"            → Crea orden real en Supabase
```

### 4. **Reservas para Clientes**
```javascript
// Ejemplo de flujo de reserva:
"productos"           → Muestra catálogo
"reservar 1"         → Abre WhatsApp con solicitud de reserva
"preguntar ¿tienen en negro?" → Abre WhatsApp con consulta
"mis reservas"       → Consulta reservas activas
```

---

## 🔧 Configuración Técnica

### Archivos:
```
📄 chatbot.js           → Lógica principal del chatbot
📄 supabase.js          → Conexión a base de datos
📄 index.html           → Dashboard con chatbot admin
📄 tienda.html          → Tienda con chatbot cliente
📄 styles.css           → Estilos del chatbot
```

### Variables de Entorno:
```env
VITE_SUPABASE_URL=https://tu_proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_publicable
```

---

## 🎯 Funcionalidades Avanzadas

### 🤖 **IA Contextual**
- Detecta automáticamente el tipo de usuario
- Respuestas personalizadas según contexto
- Recordatorio de acciones anteriores

### 💰 **Compras Reales**
- Integración completa con Supabase
- Carrito persistente por usuario
- Órdenes con seguimiento
- Historial de compras

### 🔄 **Real-time Updates**
- Cambios en productos se reflejan automáticamente
- Notificaciones de stock bajo
- Actualizaciones de pedidos

### 📱 **Responsive**
- Funciona en desktop y móvil
- Diseño adaptativo
- Animaciones suaves

---

## 🛠️ Personalización

### Cambiar Respuestas:
```javascript
// En chatbot.js, modificar:
const chatbotResponses = {
    greeting: {
        admin: "¡Hola Admin! 👋 ...",
        client: "¡Hola! 👋 ...",
        guest: "¡Hola! 👋 ..."
    }
}
```

### Agregar Comandos:
```javascript
// En processChat():
if (text.includes('nuevo comando')) {
    return "Respuesta personalizada";
}
```

### Cambiar Apariencia:
```css
/* En styles.css */
.chatbot-widget {
    /* Personalizar colores, tamaño, etc. */
}
```

---

## 🔍 Solución de Problemas

### Chatbot no responde:
```javascript
// Verificar en consola:
console.log('Usuario detectado:', userType);
console.log('Current user:', currentUser);
```

### Error en Supabase:
```javascript
// Verificar conexión:
import { getProducts } from './supabase.js'
const res = await getProducts()
console.log(res)
```

### Mensajes no se muestran:
- Verificar que los IDs del HTML coincidan
- Revisar consola por errores de JavaScript
- Asegurar que los módulos se carguen correctamente

---

## 📊 Estadísticas de Uso

El chatbot registra automáticamente:
- Número de conversaciones
- Comandos más usados
- Tasa de conversión de compras
- Satisfacción del usuario

---

## 🎉 Próximas Funcionalidades

- [ ] Integración con WhatsApp Business API
- [ ] Recomendaciones de productos con IA
- [ ] Chat en múltiples idiomas
- [ ] Análisis de sentimientos
- [ ] Integración con redes sociales

---

**Versión**: 2.0.0
**Última actualización**: 11 de abril de 2026
**Proyecto**: 1807.studio
