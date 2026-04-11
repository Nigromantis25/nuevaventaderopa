/**
 * CHATBOT IA AVANZADO - 1807.studio
 * Funciona tanto para Admin como para Clientes
 * Integrado con Supabase para operaciones reales
 */

import { getProducts, getProductById, getCategories, getBrands, addToCart, getCartItems, removeFromCart, createOrder, getOrders } from './supabase.js'

// ============================================
// CONFIGURACIÓN DEL CHATBOT
// ============================================

let chatbotOpen = false;
let currentUser = null;
let userType = 'guest'; // 'admin', 'client', 'guest'
let conversationContext = {
    lastAction: null,
    pendingProduct: null,
    cartItems: [],
    currentCategory: null
};

// Detectar tipo de usuario
function detectUserType() {
    const currentUserData = JSON.parse(localStorage.getItem('1807_currentUser'));
    const url = window.location.pathname;

    if (url.includes('index.html') && currentUserData && currentUserData.role === 'admin') {
        userType = 'admin';
        currentUser = currentUserData;
    } else if (url.includes('tienda.html') && currentUserData) {
        userType = 'client';
        currentUser = currentUserData;
    } else {
        userType = 'guest';
        currentUser = null;
    }

    console.log(`👤 Usuario detectado: ${userType}`, currentUser);
}

// ============================================
// RESPUESTAS INTELIGENTES DEL CHATBOT
// ============================================

const chatbotResponses = {
    // Saludos contextuales
    greeting: {
        admin: "¡Hola Admin! 👋 Soy tu asistente inteligente. ¿Qué necesitas gestionar hoy?\n\nPuedo ayudarte con:\n• 📊 Ver estadísticas\n• 📦 Gestionar inventario\n• 👥 Administrar clientes\n• 📈 Ver reportes\n• 🛒 Gestionar compras directas\n• 💬 Atender consultas",
        client: "¡Hola! 👋 Bienvenido de vuelta a 1807.studio. Soy tu asistente personal de compras.\n\n¿En qué puedo ayudarte hoy?\n• 🛒 Ver productos disponibles\n• 📅 Reservar productos\n• 🛍️ Agregar al carrito\n• 👀 Ver mi carrito\n• 📋 Mis pedidos\n• 💬 Atender consultas\n\n🚀 *NUEVO:* Escribe 'quiero comprar algo' para ver todos los productos con números y comprar instantáneamente por WhatsApp.\n\n💡 También puedo conectarte directamente con nuestro WhatsApp para consultas personalizadas.",
        guest: "¡Hola! 👋 Bienvenido a 1807.studio. ¿Te gustaría crear una cuenta para disfrutar de mejores precios y seguimiento de pedidos?\n\nMientras tanto, puedo mostrarte nuestros productos. ¿Qué buscas?\n\n🚀 *COMPRA RÁPIDA:* Escribe 'quiero comprar algo' para ver todos nuestros productos con números y comprar instantáneamente por WhatsApp (sin necesidad de registrarte).\n\n💡 Regístrate para acceder a más funciones como carrito de compras y seguimiento de pedidos."
    },

    // Funcionalidades comunes
    help: {
        admin: "🤖 Funciones disponibles para Admin:\n\n📊 DASHBOARD\n• 'estadísticas' - Ver métricas\n• 'ventas hoy' - Ventas del día\n• 'productos bajos' - Stock bajo\n\n📦 INVENTARIO\n• 'agregar producto' - Nuevo producto\n• 'actualizar stock' - Modificar stock\n• 'productos' - Ver catálogo\n\n👥 CLIENTES\n• 'clientes nuevos' - Nuevos clientes\n• 'pedidos pendientes' - Órdenes pendientes\n\n� COMPRAS DIRECTAS\n• 'quiero comprar algo' - Ver productos con números\n• 'quiero esto [número]' - Enviar pedido directo por WhatsApp\n\n💬 SOPORTE\n• 'ayuda' - Este mensaje",
        client: "🛍️ Funciones disponibles para ti:\n\n🛒 PRODUCTOS\n• 'ver productos' - Mostrar catálogo completo\n• 'buscar [producto]' - Buscar producto específico\n• 'categorías' - Ver tipos de productos\n\n📅 RESERVAS\n• 'reservar [número]' - Reservar un producto\n• 'mis reservas' - Ver mis reservas activas\n• 'cancelar reserva' - Cancelar una reserva\n\n🛒 CARRITO\n• 'agregar [id]' - Agregar producto al carrito\n• 'carrito' - Ver productos en carrito\n• 'comprar' - Finalizar compra\n\n🛒 COMPRAS DIRECTAS\n• 'quiero comprar algo' - Ver TODOS los productos con números\n• 'quiero esto [número]' - COMPRA INSTANTÁNEA por WhatsApp\n\n📋 PEDIDOS\n• 'mis pedidos' - Historial de compras\n• 'estado pedido' - Seguimiento de envío\n\n💬 CONSULTAS\n• 'preguntar [mensaje]' - Consulta personalizada\n• 'whatsapp' - Contactar directamente\n• 'ayuda' - Este mensaje",
        guest: "🛍️ Funciones disponibles:\n\n🛒 EXPLORAR\n• 'ver productos' - Mostrar catálogo\n• 'categorías' - Ver tipos\n• 'buscar [producto]' - Buscar\n\n🛒 COMPRAS DIRECTAS\n• 'quiero comprar algo' - Ver TODOS los productos con números\n• 'quiero esto [número]' - COMPRA INSTANTÁNEA por WhatsApp\n\n👤 CUENTA\n• 'registrarme' - Crear cuenta\n• 'iniciar sesión' - Login\n\n💬 CONTACTO\n• 'whatsapp' - Contactar\n• 'ayuda' - Este mensaje"
    },

    // Respuestas específicas
    products: async () => {
        try {
            const res = await getProducts(10);
            if (!res.success) return "❌ Error al cargar productos. Intenta más tarde.";

            const products = res.data;
            let response = `🛍️ Nuestros productos disponibles:\n\n`;

            products.forEach((p, index) => {
                response += `${index + 1}. ${p.nombre}\n`;
                response += `   💰 ${formatPrice(p.precio)}\n`;
                response += `   📦 Stock: ${p.stock}\n`;
                if (p.descripcion) response += `   📝 ${p.descripcion.substring(0, 50)}...\n`;
                response += `\n`;
            });

            if (userType === 'client') {
                response += `💡 Escribe "agregar [número]" para añadir al carrito\n`;
                response += `💡 Escribe "reservar [número]" para reservar producto\n`;
                response += `💡 Escribe "detalles [número]" para más info`;
            } else if (userType === 'guest') {
                response += `💡 Regístrate para comprar o reservar productos\n`;
                response += `💡 Escribe "registrarme" para crear cuenta`;
            }

            return response;
        } catch (error) {
            return "❌ Error al cargar productos. Intenta más tarde.";
        }
    },

    categories: async () => {
        try {
            const res = await getCategories();
            if (!res.success) return "❌ Error al cargar categorías.";

            let response = `📂 Nuestras categorías:\n\n`;
            res.data.forEach((cat, index) => {
                response += `${index + 1}. ${cat.descripcion}\n`;
            });

            response += `\n💡 Escribe "productos [número]" para ver productos de esa categoría`;
            return response;
        } catch (error) {
            return "❌ Error al cargar categorías.";
        }
    },

    cart: async () => {
        if (userType === 'guest') {
            return "👤 Para usar el carrito necesitas iniciar sesión.\n\nEscribe 'registrarme' para crear una cuenta o 'login' para iniciar sesión.";
        }

        if (!currentUser) {
            return "❌ No se pudo identificar tu cuenta. Intenta recargar la página.";
        }

        try {
            // Buscar cliente por usuario
            const clienteRes = await supabase
                .from('cliente')
                .select('idcliente')
                .eq('idusuario', currentUser.id)
                .single();

            if (!clienteRes.data) {
                return "❌ No se encontró tu perfil de cliente.";
            }

            const cartRes = await getCartItems(clienteRes.data.idcliente);
            if (!cartRes.success) return "❌ Error al cargar carrito.";

            const items = cartRes.data;
            if (items.length === 0) {
                return "🛒 Tu carrito está vacío.\n\nEscribe 'productos' para ver nuestro catálogo.";
            }

            let response = `🛒 Tu carrito (${items.length} items):\n\n`;
            let total = 0;

            items.forEach((item, index) => {
                const subtotal = item.producto.precio * item.cantidad;
                total += subtotal;
                response += `${index + 1}. ${item.producto.nombre}\n`;
                response += `   Cantidad: ${item.cantidad}\n`;
                response += `   Precio: ${formatPrice(subtotal)}\n\n`;
            });

            response += `💰 Total: ${formatPrice(total)}\n\n`;
            response += `💡 Escribe "comprar" para confirmar\n`;
            response += `💡 Escribe "remover [número]" para quitar`;

            return response;
        } catch (error) {
            return "❌ Error al cargar carrito.";
        }
    },

    addToCart: async (productId) => {
        if (userType === 'guest') {
            return "👤 Para agregar al carrito necesitas una cuenta.\n\nEscribe 'registrarme' para crear una cuenta.";
        }

        try {
            // Buscar cliente
            const clienteRes = await supabase
                .from('cliente')
                .select('idcliente')
                .eq('idusuario', currentUser.id)
                .single();

            if (!clienteRes.data) {
                return "❌ No se encontró tu perfil de cliente.";
            }

            const res = await addToCart(clienteRes.data.idcliente, productId, 1);
            if (res.success) {
                conversationContext.cartItems.push(productId);
                return `✅ ¡Producto agregado al carrito!\n\nEscribe 'carrito' para ver tus items o 'comprar' para finalizar.`;
            } else {
                return `❌ Error al agregar al carrito: ${res.error}`;
            }
        } catch (error) {
            return "❌ Error al agregar producto.";
        }
    },

    buy: async () => {
        if (userType === 'guest') {
            return "👤 Para comprar necesitas iniciar sesión.\n\nEscribe 'login' para iniciar sesión.";
        }

        try {
            // Obtener carrito
            const clienteRes = await supabase
                .from('cliente')
                .select('idcliente')
                .eq('idusuario', currentUser.id)
                .single();

            const cartRes = await getCartItems(clienteRes.data.idcliente);
            if (!cartRes.success || cartRes.data.length === 0) {
                return "🛒 Tu carrito está vacío. Agrega productos primero.";
            }

            // Crear items para la orden
            const items = cartRes.data.map(item => ({
                idproducto: item.idproducto,
                cantidad: item.cantidad,
                total: item.producto.precio * item.cantidad
            }));

            const totalMonto = items.reduce((sum, item) => sum + item.total, 0);

            // Crear orden
            const orderRes = await createOrder(clienteRes.data.idcliente, items, totalMonto);
            if (!orderRes.success) {
                return `❌ Error al crear pedido: ${orderRes.error}`;
            }

            // Limpiar carrito
            for (const item of cartRes.data) {
                await removeFromCart(item.idcarrito);
            }

            return `🎉 ¡Compra realizada exitosamente!\n\n📋 Número de orden: ${orderRes.data.idcompra}\n💰 Total: ${formatPrice(totalMonto)}\n\n📦 Te contactaremos pronto para coordinar el envío.\n\nEscribe 'mis pedidos' para ver tu historial.`;

        } catch (error) {
            return "❌ Error al procesar compra.";
        }
    },

    orders: async () => {
        if (userType === 'guest') {
            return "👤 Para ver tus pedidos necesitas iniciar sesión.";
        }

        try {
            const clienteRes = await supabase
                .from('cliente')
                .select('idcliente')
                .eq('idusuario', currentUser.id)
                .single();

            const ordersRes = await getOrders(clienteRes.data.idcliente);
            if (!ordersRes.success || ordersRes.data.length === 0) {
                return "📋 No tienes pedidos aún.\n\nEscribe 'productos' para empezar a comprar.";
            }

            let response = `📋 Tus pedidos:\n\n`;
            ordersRes.data.forEach((order, index) => {
                response += `📦 Orden #${order.idcompra}\n`;
                response += `   📅 Fecha: ${new Date(order.fecharegistro).toLocaleDateString()}\n`;
                response += `   💰 Total: ${formatPrice(order.montototal)}\n`;
                response += `   📊 Productos: ${order.totalproducto}\n\n`;
            });

            return response;
        } catch (error) {
            return "❌ Error al cargar pedidos.";
        }
    },

    // Funcionalidades de reserva
    reserve: async (productId) => {
        if (userType === 'guest') {
            return "👤 Para reservar productos necesitas tener una cuenta.\n\nEscribe 'registrarme' para crear una cuenta gratuita.";
        }

        if (!currentUser) {
            return "❌ No se pudo identificar tu cuenta. Intenta recargar la página.";
        }

        try {
            // Obtener detalles del producto
            const productRes = await getProductById(productId);
            if (!productRes.success) {
                return "❌ No se encontró ese producto.";
            }

            const product = productRes.data;

            // Crear mensaje para WhatsApp con reserva
            const message = `📅 *SOLICITUD DE RESERVA - 1807.studio*

👤 *Cliente:* ${currentUser.name || currentUser.email}
📧 *Email:* ${currentUser.email}
📱 *ID Cliente:* ${currentUser.id}

🛍️ *Producto a Reservar:*
📦 ${product.nombre}
💰 Precio: ${formatPrice(product.precio)}
📝 ${product.descripcion || 'Sin descripción'}

⏰ *Fecha de Solicitud:* ${new Date().toLocaleString()}

💡 *Esta reserva será válida por 48 horas.*
📞 *Te contactaremos pronto para confirmar disponibilidad.*

_Por favor, responde a este mensaje para confirmar la reserva._`;

            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/59178810097?text=${encodedMessage}`;

            // Abrir WhatsApp
            window.open(whatsappUrl, '_blank');

            return `📅 ¡Reserva solicitada!\n\nProducto: ${product.nombre}\nPrecio: ${formatPrice(product.precio)}\n\n✅ Te he redirigido a WhatsApp (78810097) para completar tu reserva.\n\nNuestro equipo te contactará en breve para confirmar disponibilidad.`;

        } catch (error) {
            return "❌ Error al procesar la reserva. Intenta más tarde.";
        }
    },

    askQuestion: (question) => {
        if (userType === 'guest') {
            return "👤 Para consultas personalizadas, es mejor que te registres primero.\n\nEscribe 'registrarme' para crear una cuenta.";
        }

        const message = `❓ *CONSULTA DE CLIENTE - 1807.studio*

👤 *Cliente:* ${currentUser.name || currentUser.email}
📧 *Email:* ${currentUser.email}

💬 *Pregunta:* ${question}

⏰ *Fecha:* ${new Date().toLocaleString()}

_Por favor, responde a este mensaje para atender la consulta._`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/59178810097?text=${encodedMessage}`;

        window.open(whatsappUrl, '_blank');

        return `💬 ¡Consulta enviada!\n\n"${question}"\n\n✅ Te he conectado directamente con nuestro equipo de atención al cliente por WhatsApp (78810097).\n\nUn asesor te responderá en breve.`;
    },

    // Funcionalidad de compras directas
    buySomething: async () => {
        try {
            const res = await getProducts(50); // Obtener más productos
            if (!res.success) return "❌ Error al cargar productos. Intenta más tarde.";

            const products = res.data;
            let response = `🛍️ ¡Perfecto! Aquí tienes todos nuestros productos disponibles:\n\n`;

            products.forEach((p, index) => {
                const num = index + 1;
                response += `${num}. ${p.nombre}\n`;
                response += `   💰 ${formatPrice(p.precio)}\n`;
                response += `   📦 Stock: ${p.stock}\n`;
                if (p.descripcion) response += `   📝 ${p.descripcion.substring(0, 60)}...\n`;
                response += `\n`;
            });

            response += `💡 Para comprar escribe: "quiero esto [número]"\n`;
            response += `💡 Ejemplo: "quiero esto 1" para comprar el primer producto\n\n`;
            response += `⚠️ *IMPORTANTE:* Al enviar tu pedido, se notificará automáticamente a nuestro equipo por WhatsApp.`;

            return response;
        } catch (error) {
            return "❌ Error al cargar productos. Intenta más tarde.";
        }
    },

    buyThis: async (productNumber) => {
        try {
            const res = await getProducts(50);
            if (!res.success) return "❌ Error al cargar productos.";

            const products = res.data;
            const index = productNumber - 1;

            if (index < 0 || index >= products.length) {
                return `❌ Número de producto inválido. Debe ser entre 1 y ${products.length}.\n\nEscribe "quiero comprar algo" para ver todos los productos disponibles.`;
            }

            const product = products[index];

            // Crear mensaje de pedido para WhatsApp
            const message = `🚨 *NUEVO PEDIDO DIRECTO - 1807.studio*

👤 *Tipo de Usuario:* ${userType === 'admin' ? 'ADMINISTRADOR' : userType === 'client' ? 'CLIENTE REGISTRADO' : 'VISITANTE'}
${currentUser ? `📧 *Email:* ${currentUser.email}\n👤 *Nombre:* ${currentUser.name || 'No especificado'}` : '👤 *Usuario:* Visitante (sin cuenta)'}

🛍️ *PRODUCTO SOLICITADO:*
📦 *Nombre:* ${product.nombre}
💰 *Precio:* ${formatPrice(product.precio)}
📦 *Stock Disponible:* ${product.stock}
🏷️ *Categoría:* ${product.categoria?.descripcion || 'Sin categoría'}
🏭 *Marca:* ${product.marca?.descripcion || 'Sin marca'}
📝 *Descripción:* ${product.descripcion || 'Sin descripción'}

⏰ *Fecha y Hora del Pedido:* ${new Date().toLocaleString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
})}

💡 *ESTADO:* PENDIENTE DE CONFIRMACIÓN
📞 *CONTACTAR AL CLIENTE INMEDIATAMENTE*

_Por favor, confirma este pedido y coordina el pago y envío con el cliente._`;

            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/59178810097?text=${encodedMessage}`;

            // Abrir WhatsApp inmediatamente
            window.open(whatsappUrl, '_blank');

            return `🎉 ¡PEDIDO ENVIADO EXITOSAMENTE!\n\n🛍️ *Producto:* ${product.nombre}\n💰 *Precio:* ${formatPrice(product.precio)}\n\n✅ He enviado automáticamente una alerta de pedido a nuestro equipo de ventas por WhatsApp (78810097).\n\n📞 *Un asesor te contactará en los próximos minutos* para confirmar tu pedido, coordinar el pago y organizar el envío.\n\n⏰ *Tiempo de respuesta:* 2-5 minutos aproximadamente.\n\n💡 *Mientras tanto, puedes seguir explorando nuestros productos.*`;

        } catch (error) {
            return "❌ Error al procesar el pedido. Intenta más tarde.";
        }
    },
};

// ============================================
// FUNCIONES DEL CHATBOT
// ============================================

function toggleChatbot() {
    chatbotOpen = !chatbotOpen;
    const widget = document.getElementById('chatbotWidget');
    if (widget) {
        widget.classList.toggle('active', chatbotOpen);
        const badge = document.getElementById('chatbotBadge');
        if (badge) badge.textContent = '0';

        if (chatbotOpen && !document.querySelector('.chat-message')) {
            detectUserType();
            addBotMessage(chatbotResponses.greeting[userType]);
        }
    }
}

function addBotMessage(text) {
    const container = document.getElementById('chatbotMessages');
    if (!container) return;

    const msg = document.createElement('div');
    msg.className = 'chat-message bot';
    msg.innerHTML = text.replace(/\n/g, '<br>');
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;

    // Auto-scroll suave
    setTimeout(() => {
        container.scrollTop = container.scrollHeight;
    }, 100);
}

function addUserMessage(text) {
    const container = document.getElementById('chatbotMessages');
    if (!container) return;

    const msg = document.createElement('div');
    msg.className = 'chat-message user';
    msg.textContent = text;
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;
}

async function processChat(input) {
    const text = input.toLowerCase().trim();

    // Saludos
    if (text.includes('hola') || text.includes('buenos') || text.includes('hey') || text.includes('hi')) {
        return chatbotResponses.greeting[userType];
    }

    // Ayuda
    if (text.includes('ayuda') || text.includes('help') || text.includes('que puedes')) {
        return chatbotResponses.help[userType];
    }

    // Productos
    if (text.includes('producto') || text.includes('catalogo') || text.includes('ver producto')) {
        return await chatbotResponses.products();
    }

    // Categorías
    if (text.includes('categoria') || text.includes('categorías') || text.includes('tipos')) {
        return await chatbotResponses.categories();
    }

    // Carrito
    if (text.includes('carrito') || text.includes('ver carrito') || text.includes('mi carrito')) {
        return await chatbotResponses.cart();
    }

    // Agregar al carrito
    if (text.includes('agregar') || text.includes('añadir')) {
        const productMatch = text.match(/agregar\s+(\d+)/) || text.match(/añadir\s+(\d+)/);
        if (productMatch) {
            const productId = parseInt(productMatch[1]);
            return await chatbotResponses.addToCart(productId);
        }
        return "💡 Para agregar al carrito escribe: 'agregar [número del producto]'\n\nEjemplo: 'agregar 1'";
    }

    // Comprar
    if (text.includes('comprar') || text.includes('confirmar') || text.includes('finalizar')) {
        return await chatbotResponses.buy();
    }

    // Pedidos
    if (text.includes('pedido') || text.includes('orden') || text.includes('mis pedido')) {
        return await chatbotResponses.orders();
    }

    // Reservas
    if (text.includes('reservar') || text.includes('reserva')) {
        const productMatch = text.match(/reservar\s+(\d+)/) || text.match(/reserva\s+(\d+)/);
        if (productMatch) {
            const productId = parseInt(productMatch[1]);
            return await chatbotResponses.reserve(productId);
        }
        return "💡 Para reservar un producto escribe: 'reservar [número del producto]'\n\nEjemplo: 'reservar 1'\n\nPrimero escribe 'productos' para ver los números disponibles.";
    }

    // Mis reservas
    if (text.includes('mis reservas') || text.includes('ver reservas') || text.includes('reservas activas')) {
        return chatbotResponses.myReservations();
    }

    // Preguntas/Consultas
    if (text.includes('preguntar') || text.includes('consulta') || text.includes('tengo una duda')) {
        const questionMatch = text.match(/preguntar\s+(.+)/) || text.match(/consulta\s+(.+)/) || text.match(/duda\s+(.+)/);
        if (questionMatch) {
            return chatbotResponses.askQuestion(questionMatch[1]);
        }
        return "💡 Para hacer una consulta escribe: 'preguntar [tu pregunta]'\n\nEjemplo: 'preguntar ¿Tienen tallas grandes?'";
    }

    // Contacto
    if (text.includes('whatsapp') || text.includes('contacto') || text.includes('telefono')) {
        return "📱 Contactanos por WhatsApp: [78810097](https://wa.me/59178810097?text=Hola,%20quisiera%20consultar%20sobre%20sus%20productos)";
    }

    // Registro/Login
    if (text.includes('registrar') || text.includes('registro') || text.includes('crear cuenta')) {
        if (userType === 'guest') {
            return "👤 Para registrarte, haz clic en 'Crear Cuenta' en la parte superior.\n\nO escribe 'login' si ya tienes cuenta.";
        }
        return "✅ Ya tienes una cuenta activa.";
    }

    if (text.includes('login') || text.includes('iniciar') || text.includes('entrar')) {
        if (userType === 'guest') {
            return "🔐 Para iniciar sesión, haz clic en 'Iniciar Sesión' en la parte superior.";
        }
        return "✅ Ya estás conectado.";
    }

    // Compras directas
    if (text.includes('quiero comprar algo') || text.includes('comprar algo') || text.includes('ver productos para comprar')) {
        return await chatbotResponses.buySomething();
    }

    // Comprar producto específico
    if (text.includes('quiero esto')) {
        const productMatch = text.match(/quiero esto\s+(\d+)/);
        if (productMatch) {
            const productNumber = parseInt(productMatch[1]);
            return await chatbotResponses.buyThis(productNumber);
        }
        return "💡 Para comprar un producto específico escribe: 'quiero esto [número]'\n\nEjemplo: 'quiero esto 1'\n\nPrimero escribe 'quiero comprar algo' para ver los números de productos.";
    }
}

async function sendChatMessage() {
    const input = document.getElementById('chatbotInput');
    if (!input) return;

    const text = input.value.trim();
    if (!text) return;

    addUserMessage(text);
    input.value = '';

    // Mostrar "escribiendo..."
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message bot typing';
    typingDiv.innerHTML = '🤖 Escribiendo...';
    document.getElementById('chatbotMessages').appendChild(typingDiv);

    setTimeout(async () => {
        // Remover "escribiendo..."
        if (typingDiv.parentNode) {
            typingDiv.parentNode.removeChild(typingDiv);
        }

        // Procesar mensaje
        const response = await processChat(text);
        addBotMessage(response);
    }, 1000 + Math.random() * 1000); // Delay variable para simular IA
}

// ============================================
// FUNCIONES DE UTILIDAD
// ============================================

function formatPrice(price) {
    return new Intl.NumberFormat('es-BO', {
        style: 'currency',
        currency: 'BOB'
    }).format(price);
}

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    detectUserType();

    // Event listeners para el chatbot
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotSend = document.getElementById('chatbotSend');

    if (chatbotToggle) {
        chatbotToggle.addEventListener('click', toggleChatbot);
    }

    if (chatbotInput) {
        chatbotInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendChatMessage();
            }
        });
    }

    if (chatbotSend) {
        chatbotSend.addEventListener('click', sendChatMessage);
    }

    console.log('🤖 Chatbot IA inicializado para:', userType);
});

// ============================================
// EXPORTAR FUNCIONES GLOBALES
// ============================================

window.toggleChatbot = toggleChatbot;
window.sendChatMessage = sendChatMessage;