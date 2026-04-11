/**
 * Configuración de Supabase
 * Conexión a base de datos para la tienda 1807.estudio
 */

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

// Obtener variables de entorno
const SUPABASE_URL = 'https://fohveedquqchtnzhkcyh.supabase.co'
const SUPABASE_KEY = 'sb_publishable_iKFVLsKK586dZTdzWJY6Tw_bByu2jFO'

// Crear cliente de Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// ============================================
// FUNCIONES DE AUTENTICACIÓN
// ============================================

export async function signUpUser(email, password, nombre) {
    try {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    nombre: nombre
                }
            }
        })
        if (error) throw error
        return { success: true, data }
    } catch (error) {
        console.error('Error en registro:', error.message)
        return { success: false, error: error.message }
    }
}

export async function signInUser(email, password) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        })
        if (error) throw error
        
        // Guardar en localStorage
        localStorage.setItem('1807_currentUser', JSON.stringify({
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata?.nombre || email
        }))
        
        return { success: true, data }
    } catch (error) {
        console.error('Error en login:', error.message)
        return { success: false, error: error.message }
    }
}

export async function signOutUser() {
    try {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        localStorage.removeItem('1807_currentUser')
        return { success: true }
    } catch (error) {
        console.error('Error en logout:', error.message)
        return { success: false, error: error.message }
    }
}

// ============================================
// FUNCIONES DE PRODUCTOS
// ============================================

export async function getProducts(limit = 100) {
    try {
        const { data, error } = await supabase
            .from('producto')
            .select('*, marca(descripcion), categoria(descripcion)')
            .eq('estado', 1)
            .limit(limit)
        
        if (error) throw error
        return { success: true, data }
    } catch (error) {
        console.error('Error al obtener productos:', error.message)
        return { success: false, error: error.message }
    }
}

export async function getProductById(id) {
    try {
        const { data, error } = await supabase
            .from('producto')
            .select('*, marca(descripcion), categoria(descripcion)')
            .eq('idproducto', id)
            .single()
        
        if (error) throw error
        return { success: true, data }
    } catch (error) {
        console.error('Error al obtener producto:', error.message)
        return { success: false, error: error.message }
    }
}

export async function getProductsByCategory(idcategoria) {
    try {
        const { data, error } = await supabase
            .from('producto')
            .select('*')
            .eq('idcategoria', idcategoria)
            .eq('estado', 1)
        
        if (error) throw error
        return { success: true, data }
    } catch (error) {
        console.error('Error al obtener productos por categoría:', error.message)
        return { success: false, error: error.message }
    }
}

// ============================================
// FUNCIONES DE CARRITO
// ============================================

export async function addToCart(clienteId, productoId, cantidad) {
    try {
        const { data, error } = await supabase
            .from('carrito')
            .insert([{
                idcliente: clienteId,
                idproducto: productoId,
                cantidad: cantidad
            }])
        
        if (error) throw error
        return { success: true, data }
    } catch (error) {
        console.error('Error al agregar al carrito:', error.message)
        return { success: false, error: error.message }
    }
}

export async function getCartItems(clienteId) {
    try {
        const { data, error } = await supabase
            .from('carrito')
            .select('*, producto(nombre, precio, imagen_url)')
            .eq('idcliente', clienteId)
        
        if (error) throw error
        return { success: true, data }
    } catch (error) {
        console.error('Error al obtener carrito:', error.message)
        return { success: false, error: error.message }
    }
}

export async function removeFromCart(carritoId) {
    try {
        const { error } = await supabase
            .from('carrito')
            .delete()
            .eq('idcarrito', carritoId)
        
        if (error) throw error
        return { success: true }
    } catch (error) {
        console.error('Error al eliminar del carrito:', error.message)
        return { success: false, error: error.message }
    }
}

// ============================================
// FUNCIONES DE ÓRDENES/COMPRAS
// ============================================

export async function createOrder(clienteId, items, totalMonto) {
    try {
        const { data: order, error: orderError } = await supabase
            .from('compra')
            .insert([{
                idcliente: clienteId,
                totalproducto: items.length,
                montototal: totalMonto
            }])
            .select()
        
        if (orderError) throw orderError
        
        // Crear detalles de la compra
        const detalles = items.map(item => ({
            idcompra: order[0].idcompra,
            idproducto: item.idproducto,
            cantidad: item.cantidad,
            total: item.total
        }))
        
        const { error: detalleError } = await supabase
            .from('detallecompra')
            .insert(detalles)
        
        if (detalleError) throw detalleError
        
        return { success: true, data: order[0] }
    } catch (error) {
        console.error('Error al crear orden:', error.message)
        return { success: false, error: error.message }
    }
}

export async function getOrders(clienteId) {
    try {
        const { data, error } = await supabase
            .from('compra')
            .select('*, detallecompra(*, producto(nombre, precio))')
            .eq('idcliente', clienteId)
            .order('fecharegistro', { ascending: false })
        
        if (error) throw error
        return { success: true, data }
    } catch (error) {
        console.error('Error al obtener órdenes:', error.message)
        return { success: false, error: error.message }
    }
}

// ============================================
// FUNCIONES DE CATEGORÍAS
// ============================================

export async function getCategories() {
    try {
        const { data, error } = await supabase
            .from('categoria')
            .select('*')
            .eq('estado', 1)
        
        if (error) throw error
        return { success: true, data }
    } catch (error) {
        console.error('Error al obtener categorías:', error.message)
        return { success: false, error: error.message }
    }
}

// ============================================
// FUNCIONES DE MARCAS
// ============================================

export async function getBrands() {
    try {
        const { data, error } = await supabase
            .from('marca')
            .select('*')
            .eq('estado', 1)
        
        if (error) throw error
        return { success: true, data }
    } catch (error) {
        console.error('Error al obtener marcas:', error.message)
        return { success: false, error: error.message }
    }
}

// ============================================
// REAL-TIME SUBSCRIPTIONS (OBSERVAR CAMBIOS)
// ============================================

export function subscribeToProductChanges(callback) {
    const subscription = supabase
        .channel('producto-changes')
        .on('postgres_changes', 
            { event: '*', schema: 'public', table: 'producto' },
            (payload) => {
                callback(payload)
            }
        )
        .subscribe()
    
    return subscription
}

export function subscribeToCartChanges(clienteId, callback) {
    const subscription = supabase
        .channel(`carrito-${clienteId}`)
        .on('postgres_changes',
            { event: '*', schema: 'public', table: 'carrito', filter: `idcliente=eq.${clienteId}` },
            (payload) => {
                callback(payload)
            }
        )
        .subscribe()
    
    return subscription
}
