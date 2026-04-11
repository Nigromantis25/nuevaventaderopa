/**
 * EJEMPLOS DE USO - Supabase Integration
 * Copia y pega estos ejemplos en tu código app.js
 */

// ============================================
// 1. IMPORTAR FUNCIONES (al inicio de tu app.js)
// ============================================
import { 
    supabase,
    signUpUser, 
    signInUser, 
    signOutUser,
    getProducts,
    getProductById,
    getProductsByCategory,
    addToCart,
    getCartItems,
    removeFromCart,
    createOrder,
    getOrders,
    getCategories,
    getBrands,
    subscribeToProductChanges,
    subscribeToCartChanges
} from './supabase.js'

// ============================================
// 2. AUTENTICACIÓN
// ============================================

// Registrar nuevo usuario
async function registrarUsuario() {
    const res = await signUpUser('correo@ejemplo.com', 'contraseña123', 'Juan García')
    if (res.success) {
        console.log('Usuario registrado:', res.data)
    } else {
        console.error('Error:', res.error)
    }
}

// Iniciar sesión
async function iniciarSesion() {
    const res = await signInUser('admin@1807.studio', 'tucontraseña')
    if (res.success) {
        console.log('Login exitoso:', res.data)
        // Redirigir a dashboard
        window.location.href = 'index.html'
    } else {
        console.error('Error de login:', res.error)
    }
}

// Cerrar sesión
async function cerrarSesion() {
    const res = await signOutUser()
    if (res.success) {
        window.location.href = 'login.html'
    }
}

// ============================================
// 3. OBTENER PRODUCTOS
// ============================================

// Obtener todos los productos
async function cargarProductos() {
    const res = await getProducts(50)
    if (res.success) {
        console.log('Productos:', res.data)
        // Procesar y mostrar productos
        res.data.forEach(producto => {
            console.log(`${producto.nombre} - $${producto.precio}`)
        })
    }
}

// Obtener un producto específico
async function obtenerDetalleProducto(id) {
    const res = await getProductById(id)
    if (res.success) {
        console.log('Producto:', res.data)
        console.log(`Nombre: ${res.data.nombre}`)
        console.log(`Precio: $${res.data.precio}`)
        console.log(`Stock: ${res.data.stock}`)
    }
}

// Obtener productos por categoría
async function obtenerPorCategoria(idCategoria) {
    const res = await getProductsByCategory(idCategoria)
    if (res.success) {
        console.log(`Productos de categoría ${idCategoria}:`, res.data)
    }
}

// ============================================
// 4. CARRITO DE COMPRAS
// ============================================

// Agregar producto al carrito
async function agregarAlCarrito(clienteId, productoId, cantidad) {
    const res = await addToCart(clienteId, productoId, cantidad)
    if (res.success) {
        console.log('Producto agregado al carrito')
        // Actualizar interfaz
    }
}

// Obtener carrito
async function obtenerCarrito(clienteId) {
    const res = await getCartItems(clienteId)
    if (res.success) {
        console.log('Carrito:', res.data)
        res.data.forEach(item => {
            console.log(`${item.producto.nombre} x${item.cantidad} = $${item.producto.precio * item.cantidad}`)
        })
        return res.data
    }
}

// Eliminar del carrito
async function quitarDelCarrito(carritoId) {
    const res = await removeFromCart(carritoId)
    if (res.success) {
        console.log('Producto removido del carrito')
    }
}

// ============================================
// 5. CREAR ORDEN/COMPRA
// ============================================

// Crear nueva orden
async function crearPedido(clienteId, items) {
    // items debe ser un array como: 
    // [{ idproducto: 1, cantidad: 2, total: 400 }]
    
    const totalMonto = items.reduce((sum, item) => sum + item.total, 0)
    
    const res = await createOrder(clienteId, items, totalMonto)
    if (res.success) {
        console.log('Orden creada:', res.data.idcompra)
        return res.data
    }
}

// Obtener órdenes del cliente
async function obtenerMisOrdenes(clienteId) {
    const res = await getOrders(clienteId)
    if (res.success) {
        console.log('Tus órdenes:', res.data)
        res.data.forEach(orden => {
            console.log(`Orden #${orden.idcompra} - Total: $${orden.montototal}`)
        })
    }
}

// ============================================
// 6. CATEGORÍAS Y MARCAS
// ============================================

// Obtener todas las categorías
async function cargarCategorias() {
    const res = await getCategories()
    if (res.success) {
        console.log('Categorías:', res.data)
        res.data.forEach(cat => {
            console.log(`- ${cat.descripcion}`)
        })
    }
}

// Obtener todas las marcas
async function cargarMarcas() {
    const res = await getBrands()
    if (res.success) {
        console.log('Marcas:', res.data)
        res.data.forEach(marca => {
            console.log(`- ${marca.descripcion}`)
        })
    }
}

// ============================================
// 7. REAL-TIME UPDATES (Observar cambios)
// ============================================

// Escuchar cambios en productos
function escucharCambiosProductos() {
    const subscription = subscribeToProductChanges((payload) => {
        console.log('Cambio en producto:', payload)
        if (payload.eventType === 'INSERT') {
            console.log('Nuevo producto agregado')
        } else if (payload.eventType === 'UPDATE') {
            console.log('Producto actualizado')
        } else if (payload.eventType === 'DELETE') {
            console.log('Producto eliminado')
        }
    })
}

// Escuchar cambios en carrito
function escucharCambiosCarrito(clienteId) {
    const subscription = subscribeToCartChanges(clienteId, (payload) => {
        console.log('Cambio en carrito:', payload)
        obtenerCarrito(clienteId) // Recargar carrito
    })
}

// ============================================
// 8. CASOS DE USO PRÁCTICOS
// ============================================

// Flujo de compra completo
async function procesarCompra() {
    try {
        const clienteId = 1 // Obtener del usuario actual
        
        // 1. Obtener carrito
        const carritoRes = await getCartItems(clienteId)
        if (!carritoRes.success) throw new Error('Error al cargar carrito')
        
        const items = carritoRes.data.map(item => ({
            idproducto: item.idproducto,
            cantidad: item.cantidad,
            total: item.producto.precio * item.cantidad
        }))
        
        // 2. Crear orden
        const ordenRes = await createOrder(clienteId, items, 
            items.reduce((sum, i) => sum + i.total, 0)
        )
        
        if (!ordenRes.success) throw new Error('Error al crear orden')
        
        // 3. Vaciar carrito (eliminar todos los items)
        for (const item of carritoRes.data) {
            await removeFromCart(item.idcarrito)
        }
        
        console.log('✅ Compra realizada exitosamente')
        return ordenRes.data
        
    } catch (error) {
        console.error('❌ Error en compra:', error.message)
    }
}

// Buscar productos con filtros
async function buscarProductos(filtros = {}) {
    try {
        let query = supabase.from('producto').select('*').eq('estado', 1)
        
        if (filtros.nombre) {
            query = query.ilike('nombre', `%${filtros.nombre}%`)
        }
        if (filtros.idcategoria) {
            query = query.eq('idcategoria', filtros.idcategoria)
        }
        if (filtros.idmarca) {
            query = query.eq('idmarca', filtros.idmarca)
        }
        if (filtros.precioMin) {
            query = query.gte('precio', filtros.precioMin)
        }
        if (filtros.precioMax) {
            query = query.lte('precio', filtros.precioMax)
        }
        
        const { data, error } = await query
        
        if (error) throw error
        return { success: true, data }
        
    } catch (error) {
        console.error('Error en búsqueda:', error.message)
        return { success: false, error: error.message }
    }
}

// ============================================
// 9. EJECUTAR AL CARGAR LA PÁGINA
// ============================================

// Al iniciar la aplicación
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Aplicación iniciando...')
    
    // Cargar datos iniciales
    await cargarProductos()
    await cargarCategorias()
    await cargarMarcas()
    
    // Escuchar cambios en tiempo real
    escucharCambiosProductos()
    
    console.log('✅ Datos cargados')
})
