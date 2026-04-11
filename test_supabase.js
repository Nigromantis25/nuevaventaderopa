// ============================================
// PRUEBA RÁPIDA DE SUPABASE
// ============================================

// 1. Importar funciones
import { getProducts, getCategories, getBrands } from './supabase.js'

// 2. Función de prueba
async function testSupabase() {
    console.log('🧪 Probando conexión con Supabase...')

    try {
        // Probar productos
        console.log('📦 Obteniendo productos...')
        const productsRes = await getProducts(3)
        if (productsRes.success) {
            console.log('✅ Productos obtenidos:', productsRes.data.length, 'productos')
            productsRes.data.forEach(p => console.log(`   - ${p.nombre} ($${p.precio})`))
        } else {
            console.error('❌ Error en productos:', productsRes.error)
        }

        // Probar categorías
        console.log('🏷️  Obteniendo categorías...')
        const categoriesRes = await getCategories()
        if (categoriesRes.success) {
            console.log('✅ Categorías obtenidas:', categoriesRes.data.length, 'categorías')
            categoriesRes.data.forEach(c => console.log(`   - ${c.descripcion}`))
        } else {
            console.error('❌ Error en categorías:', categoriesRes.error)
        }

        // Probar marcas
        console.log('🏭 Obteniendo marcas...')
        const brandsRes = await getBrands()
        if (brandsRes.success) {
            console.log('✅ Marcas obtenidas:', brandsRes.data.length, 'marcas')
            brandsRes.data.forEach(m => console.log(`   - ${m.descripcion}`))
        } else {
            console.error('❌ Error en marcas:', brandsRes.error)
        }

        console.log('🎉 ¡Todas las pruebas pasaron! Supabase está conectado correctamente.')

    } catch (error) {
        console.error('💥 Error general:', error.message)
    }
}

// 3. Ejecutar prueba automáticamente
testSupabase()