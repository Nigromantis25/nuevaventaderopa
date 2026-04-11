/**
 * 💬 EJEMPLOS PRÁCTICOS - Chatbot IA 1807.studio
 * Copia estos ejemplos y pégalos en el chatbot
 */

// ============================================
// 📋 COMANDOS BÁSICOS (Funcionan para todos)
// ============================================

// Saludos
"hola"
"buenos días"
"hey asistente"

// Ayuda
"ayuda"
"help"
"que puedes hacer"

// Productos
"productos"
"ver productos"
"catalogo"
"mostrar productos"

// Categorías
"categorías"
"ver categorías"
"tipos de productos"

// Contacto
"whatsapp"
"contacto"
"hablar con vendedor"

// ============================================
// 🛒 COMANDOS PARA CLIENTES (Tienda)
// ============================================

// Ver productos y reservar
"productos"           // Muestra todos los productos
"reservar 1"         // Reserva el producto #1 (abre WhatsApp)
"reservar 2"         // Reserva el producto #2 (abre WhatsApp)
"mis reservas"       // Consulta reservas activas (abre WhatsApp)

// Agregar al carrito
"agregar 1"          // Agrega el producto #1 al carrito
"agregar 2"          // Agrega el producto #2 al carrito
"carrito"            // Muestra tu carrito actual
"ver carrito"        // Lo mismo que arriba

// Gestionar carrito
"remover 1"          // Remueve el item #1 del carrito
"vaciar carrito"     // Limpia todo el carrito

// Comprar
"comprar"            // Inicia proceso de compra
"confirmar compra"   // Confirma la orden
"finalizar"          // Completa la compra

// Consultas personalizadas
"preguntar ¿Tienen este producto en negro?"  // Consulta específica (abre WhatsApp)
"preguntar ¿Cuál es el tiempo de entrega?"   // Pregunta sobre envío
"consulta sobre tallas disponibles"          // Consulta sobre tallas

// Historial
"mis pedidos"        // Muestra tus órdenes anteriores
"pedidos"           // Lo mismo
"historial"         // Historial de compras

// ============================================
// 🔧 COMANDOS PARA ADMIN (Dashboard)
// ============================================

// Dashboard y estadísticas
"estadísticas"
"ver métricas"
"dashboard"

// Ventas
"ventas hoy"
"ventas de hoy"
"ventas del día"

// Inventario
"productos bajos"
"stock bajo"
"inventario bajo"

// Clientes
"clientes nuevos"
"nuevos clientes"

// Pedidos
"pedidos pendientes"
"órdenes pendientes"

// ============================================
// 🎯 EJEMPLOS DE CONVERSACIONES COMPLETAS
// ============================================

// CONVERSACIÓN TÍPICA DE CLIENTE:
// Usuario: "hola"
// Bot: "¡Hola! 👋 Bienvenido a 1807.studio..."
//
// Usuario: "productos"
// Bot: "🛍️ Nuestros productos disponibles:..."
//
// Usuario: "agregar 1"
// Bot: "✅ ¡Producto agregado al carrito!..."
//
// Usuario: "carrito"
// Bot: "🛒 Tu carrito (1 items):..."
//
// Usuario: "comprar"
// Bot: "🎉 ¡Compra realizada exitosamente!..."

// CONVERSACIÓN TÍPICA DE ADMIN:
// Usuario: "estadísticas"
// Bot: "📊 Dashboard de 1807.studio..."
//
// Usuario: "productos bajos"
// Bot: "📦 Productos con stock bajo:..."
//
// Usuario: "pedidos pendientes"
// Bot: "📋 Órdenes pendientes:..."

// ============================================
// 💡 TIPS PARA USAR EL CHATBOT
// ============================================

/*
1. ESCRIBE EN LENGUAJE NATURAL
   ✅ "muéstrame los productos"
   ✅ "quiero ver el catálogo"
   ✅ "dame los precios"

2. USA NÚMEROS PARA ACCIONES RÁPIDAS
   ✅ "agregar 3" (agrega producto #3)
   ✅ "detalles 5" (muestra info de producto #5)

3. EL BOT ENTIENDE VARIACIONES
   ✅ "productos", "catalogo", "ver productos"
   ✅ "carrito", "mi carrito", "ver carrito"
   ✅ "comprar", "confirmar", "finalizar compra"

4. PIDE AYUDA SIEMPRE
   ✅ "ayuda" - Muestra todas las opciones
   ✅ "que puedes hacer" - Lo mismo

5. CONTACTO DIRECTO
   ✅ "whatsapp" - Te lleva directo al vendedor
   ✅ "contacto" - Información de contacto

6. PARA INVITADOS (sin cuenta)
   ✅ Solo pueden ver productos y contactar
   ✅ Para comprar necesitan registrarse
   ✅ "registrarme" - Inicia proceso de registro
*/

// ============================================
// 🔧 TESTING Y DEBUGGING
// ============================================

/*
// Para probar la conexión en consola:
import { getProducts } from './supabase.js'
const res = await getProducts(5)
console.log('Test productos:', res)

// Para ver tipo de usuario detectado:
console.log('Tipo de usuario:', userType)
console.log('Usuario actual:', currentUser)

// Para probar respuestas del bot:
processChat("productos")  // Simula mensaje
processChat("ayuda")      // Simula mensaje
*/

// ============================================
// 🎨 PERSONALIZACIÓN DE RESPUESTAS
// ============================================

/*
// Para cambiar saludos en chatbot.js:
const chatbotResponses = {
    greeting: {
        admin: "¡Hola Jefe! 👋 ¿Qué gestionamos hoy?",
        client: "¡Hola Cliente! 👋 ¿En qué te ayudo?",
        guest: "¡Hola Visitante! 👋 ¿Buscas algo especial?"
    }
}
*/

// ============================================
// 📈 MÉTRICAS Y ANALYTICS
// ============================================

/*
// El chatbot registra automáticamente:
// - Conversaciones iniciadas
// - Comandos más usados
// - Tasa de conversión (visitas → compras)
// - Satisfacción del usuario
// - Tiempo promedio de respuesta

// Para ver métricas en Supabase:
// SELECT * FROM chatbot_metrics ORDER BY created_at DESC
*/

console.log('📚 Guía de comandos del chatbot cargada. Escribe "ayuda" en el chat para ver opciones.');