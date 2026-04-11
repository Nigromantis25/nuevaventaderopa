/**
 * Inicialización de Supabase
 * Verificación de conexión y carga de datos
 */

import { supabase, getProducts, getCategories } from './supabase.js'

console.log('🚀 Iniciando Supabase...')

// Función para verificar conexión
export async function initSupabase() {
    try {
        console.log('🔗 Probando conexión con Supabase...')
        
        // Prueba simple de conexión
        const { data, error } = await supabase
            .from('producto')
            .select('COUNT(*)', { count: 'exact', head: true })
        
        if (error) {
            console.error('❌ Error de conexión:', error.message)
            return { success: false, error: error.message }
        }
        
        console.log('✅ Supabase conectado correctamente')
        return { success: true }
    } catch (error) {
        console.error('💥 Error al conectar Supabase:', error.message)
        return { success: false, error: error.message }
    }
}

// Función para cargar datos desde Supabase
export async function loadDataFromSupabase() {
    try {
        console.log('📦 Cargando datos desde Supabase...')
        
        const productsRes = await getProducts()
        const categoriesRes = await getCategories()
        
        if (productsRes.success && categoriesRes.success) {
            console.log('✅ Datos cargados:', {
                productos: productsRes.data.length,
                categorías: categoriesRes.data.length
            })
            return { 
                success: true, 
                products: productsRes.data,
                categories: categoriesRes.data
            }
        } else {
            throw new Error('Error al cargar datos')
        }
    } catch (error) {
        console.error('❌ Error cargando datos:', error.message)
        return { success: false, error: error.message }
    }
}

// Verificar conexión automáticamente
window.addEventListener('load', async () => {
    const result = await initSupabase()
    if (!result.success) {
        console.error('⚠️ No se pudo conectar a Supabase')
        // Mostrar alerta al usuario
        const alert = document.createElement('div')
        alert.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #F87171;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 9999;
            font-weight: 600;
        `
        alert.textContent = '⚠️ Error de conexión a Supabase. Usando modo sin conexión.'
        document.body.appendChild(alert)
        setTimeout(() => alert.remove(), 5000)
    }
})

console.log('✨ init-supabase.js cargado')
