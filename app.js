/**
 * 1807.studio - Sistema de Venta de Bolsos
 * Aplicación JavaScript Principal con Chatbot IA
 */

// ========================================
// AUTENTICACIÓN
// ========================================
let currentUser = JSON.parse(localStorage.getItem('1807_currentUser'));

// Verificar si el usuario está autenticado y es admin
if (!currentUser || currentUser.role !== 'admin') {
    window.location.href = 'login.html';
}

function logout() {
    localStorage.removeItem('1807_currentUser');
    window.location.href = 'login.html';
}

function loadUserInfo() {
    if (currentUser) {
        const avatar = document.getElementById('navUserAvatar');
        const name = document.getElementById('navUserName');
        if (avatar) avatar.textContent = currentUser.name[0].toUpperCase();
        if (name) name.textContent = currentUser.name;
    }
}

// ========================================
// DATOS Y ESTADO
// ========================================
let products = JSON.parse(localStorage.getItem('1807_products')) || [];
let clients = JSON.parse(localStorage.getItem('1807_clients')) || [];
let orders = JSON.parse(localStorage.getItem('1807_orders')) || [];
let currentSection = 'dashboard';
let currentEditId = null;
let deleteProductId = null;
let pendingSales = [];

// Productos de ejemplo
const sampleProducts = [
    { id: 1, name: "Elegance Classic Tote", category: "Tote", sku: "ECT-001", price: 189.99, stock: 15, description: "Bolso tote de cuero genuino con acabados en oro.", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop" },
    { id: 2, name: "Urban Chic Crossbody", category: "Bolso de mano", sku: "UCC-002", price: 129.99, stock: 8, description: "Crossbody moderno con diseño minimalista.", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop" },
    { id: 3, name: "Executive Leather Bag", category: "Cartera", sku: "ELB-003", price: 249.99, stock: 3, description: "Cartera ejecutiva premium en cuero italiano.", image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=400&fit=crop" },
    { id: 4, name: "Mini Evening Clutch", category: "Clutch", sku: "MEC-004", price: 89.99, stock: 20, description: "Clutch elegante para eventos especiales.", image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400&h=400&fit=crop" },
    { id: 5, name: "Voyager Backpack", category: "Mochila", sku: "VBP-005", price: 169.99, stock: 12, description: "Mochila de viaje premium.", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop" },
    { id: 6, name: "Luxe Shoulder Bag", category: "Bolso de mano", sku: "LSB-006", price: 199.99, stock: 0, description: "Bolso de hombro de lujo.", image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=400&h=400&fit=crop" }
];

const sampleClients = [
    { id: 1, name: "María García", email: "maria@email.com", phone: "+1 234 567 890", address: "Calle Principal 123", orders: 5, spent: 850 },
    { id: 2, name: "Carlos López", email: "carlos@email.com", phone: "+1 234 567 891", address: "Av. Central 456", orders: 3, spent: 420 },
    { id: 3, name: "Ana Martínez", email: "ana@email.com", phone: "+1 234 567 892", address: "Plaza Mayor 789", orders: 8, spent: 1250 }
];

const sampleOrders = [
    { id: "ORD-001", clientName: "María García", clientEmail: "maria@email.com", items: [{ name: "Elegance Classic Tote", qty: 1, price: 189.99 }], total: 189.99, status: "pending", date: "2026-02-07" },
    { id: "ORD-002", clientName: "Carlos López", clientEmail: "carlos@email.com", items: [{ name: "Mini Evening Clutch", qty: 2, price: 89.99 }], total: 179.98, status: "completed", date: "2026-02-06" }
];

// Inicializar datos
if (products.length === 0) { products = sampleProducts; localStorage.setItem('1807_products', JSON.stringify(products)); }
if (clients.length === 0) { clients = sampleClients; localStorage.setItem('1807_clients', JSON.stringify(clients)); }
if (orders.length === 0) { orders = sampleOrders; localStorage.setItem('1807_orders', JSON.stringify(orders)); }

// ========================================
// UTILIDADES
// ========================================
const formatPrice = (price) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(price);
const generateId = () => Date.now() + Math.random().toString(36).substr(2, 9);
const getStockStatus = (stock) => stock === 0 ? { class: 'out-of-stock', text: 'Agotado' } : stock < 5 ? { class: 'low-stock', text: 'Stock bajo' } : { class: 'in-stock', text: 'En stock' };

function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span class="toast-message">${message}</span><button class="toast-close" onclick="this.parentElement.remove()">×</button>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}

// ========================================
// NAVEGACIÓN Y SECCIONES
// ========================================
function navigateTo(section) {
    currentSection = section;
    document.querySelectorAll('.nav-link, .sidebar-link').forEach(link => {
        link.classList.toggle('active', link.dataset.section === section);
    });
    renderSection(section);
}

function renderSection(section) {
    const mainContent = document.getElementById('mainContent');
    const sections = {
        dashboard: renderDashboard,
        products: renderProductsSection,
        orders: renderOrdersSection,
        sales: renderSalesSection,
        clients: renderClientsSection,
        reports: renderReportsSection,
        settings: renderSettingsSection,
        users: renderUsersSection
    };
    mainContent.innerHTML = sections[section] ? sections[section]() : renderDashboard();
    if (section === 'dashboard' || section === 'products') initProductEvents();
    if (section === 'clients') initClientEvents();
    if (section === 'orders') initOrderEvents();
}

// ========================================
// DASHBOARD
// ========================================
function renderDashboard() {
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
    const lowStock = products.filter(p => p.stock < 5).length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;

    return `
        <div class="dashboard-header">
            <div>
                <h1 class="dashboard-title">Dashboard</h1>
                <p class="dashboard-subtitle">Bienvenido de vuelta. Aquí está el resumen de tu tienda.</p>
            </div>
            <div class="dashboard-actions">
                <button class="btn btn-secondary" onclick="exportProducts()">📥 Exportar</button>
                <button class="btn btn-primary" onclick="openProductModal()">➕ Agregar Producto</button>
            </div>
        </div>
        <div class="stats-grid">
            <div class="stat-card"><div class="stat-icon gold">💰</div><div class="stat-value">${formatPrice(totalValue)}</div><div class="stat-label">Valor Inventario</div></div>
            <div class="stat-card"><div class="stat-icon green">📦</div><div class="stat-value">${products.length}</div><div class="stat-label">Productos</div></div>
            <div class="stat-card"><div class="stat-icon blue">📋</div><div class="stat-value">${pendingOrders}</div><div class="stat-label">Pedidos Pendientes</div></div>
            <div class="stat-card" onclick="navigateTo('users')" style="cursor: pointer;"><div class="stat-icon red">⚠️</div><div class="stat-value">${lowStock}</div><div class="stat-label">Stock Bajo</div></div>
            <div class="stat-card" onclick="navigateTo('users')" style="cursor: pointer;"><div class="stat-icon purple">👤</div><div class="stat-value">${JSON.parse(localStorage.getItem('1807_users') || '[]').length}</div><div class="stat-label">Usuarios Reg.</div></div>
        </div>
        
        ${lowStock > 0 ? `
        <div class="alert-banner low-stock-alert">
            <div class="alert-icon">⚠️</div>
            <div class="alert-message">
                <strong>Atención:</strong> Tienes ${lowStock} productos con stock crítico. 
                <span class="low-stock-list">${products.filter(p => p.stock < 5).map(p => p.name).slice(0, 3).join(', ')}${lowStock > 3 ? '...' : ''}</span>
            </div>
            <button class="btn btn-sm btn-outline-light" onclick="filterLowStock()">Ver Todo</button>
        </div>` : ''}

        <section class="products-section">
            <div class="products-header">
                <h2 class="products-title">Inventario de Productos</h2>
                <div class="products-filters">
                    <div class="search-box"><input type="text" id="searchInput" placeholder="🔍 Buscar productos..." oninput="filterProducts()"></div>
                    <select class="filter-select" id="categoryFilter" onchange="filterProducts()">
                        <option value="">Todas las categorías</option>
                        <option value="Bolso de mano">Bolso de mano</option>
                        <option value="Cartera">Cartera</option>
                        <option value="Mochila">Mochila</option>
                        <option value="Clutch">Clutch</option>
                        <option value="Tote">Tote</option>
                    </select>
                </div>
            </div>
            <div id="productsContainer">${renderProductsTable()}</div>
        </section>`;
}

function renderProductsTable() {
    const search = document.getElementById('searchInput')?.value?.toLowerCase() || '';
    const category = document.getElementById('categoryFilter')?.value || '';
    const filtered = products.filter(p => (!search || p.name.toLowerCase().includes(search) || p.sku.toLowerCase().includes(search)) && (!category || p.category === category));

    if (!filtered.length) return `<div class="empty-state"><h3>No hay productos</h3><p>Agrega tu primer producto</p></div>`;

    return `<table class="products-table">
        <thead><tr><th>Producto</th><th>SKU</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Acciones</th></tr></thead>
        <tbody>${filtered.map(p => {
        const status = getStockStatus(p.stock);
        return `<tr>
                <td><div class="product-cell"><img src="${p.image}" class="product-image" onerror="this.src='https://via.placeholder.com/60'"><div class="product-info"><h4>${p.name}</h4></div></div></td>
                <td>${p.sku}</td><td>${p.category}</td><td class="product-price">${formatPrice(p.price)}</td>
                <td>
                    <div class="stock-control">
                        <button class="stock-btn minus" onclick="updateStock('${p.id}', -1)">-</button>
                        <span class="stock-value"><span class="stock-indicator ${status.class}"></span> ${p.stock}</span>
                        <button class="stock-btn plus" onclick="updateStock('${p.id}', 1)">+</button>
                    </div>
                </td>
                <td><button class="action-btn edit" onclick="editProduct('${p.id}')">✏️</button><button class="action-btn delete" onclick="openDeleteModal('${p.id}')">🗑️</button></td>
            </tr>`;
    }).join('')}</tbody></table>`;
}

function filterProducts() { document.getElementById('productsContainer').innerHTML = renderProductsTable(); }

// ========================================
// PRODUCTOS CRUD
// ========================================
function openProductModal(id = null) {
    currentEditId = id;
    const modal = document.getElementById('productModal');
    const form = document.getElementById('productForm');
    form.reset();
    document.getElementById('modalTitle').textContent = id ? 'Editar Producto' : 'Agregar Nuevo Producto';

    if (id) {
        // Buscar por ID (pudiendo ser string o número)
        const p = products.find(x => String(x.id) === String(id));
        if (p) {
            document.getElementById('productId').value = p.id;
            document.getElementById('productName').value = p.name;
            document.getElementById('productCategory').value = p.category;
            document.getElementById('productSku').value = p.sku;
            document.getElementById('productPrice').value = p.price;
            document.getElementById('productStock').value = p.stock;
            document.getElementById('productDescription').value = p.description || '';

            if (p.image) {
                document.getElementById('previewImg').src = p.image;
                document.getElementById('imagePreview').classList.add('active');
                document.getElementById('imageUploadArea').style.display = 'none';
            }
        }
    } else {
        document.getElementById('productId').value = '';
        document.getElementById('previewImg').src = '';
        document.getElementById('imagePreview').classList.remove('active');
        document.getElementById('imageUploadArea').style.display = 'block';
    }
    modal.classList.add('active');
}

function closeProductModal() { document.getElementById('productModal').classList.remove('active'); currentEditId = null; }
function editProduct(id) { openProductModal(id); }
function openDeleteModal(id) { deleteProductId = id; document.getElementById('deleteModal').classList.add('active'); }
function closeDeleteModal() { document.getElementById('deleteModal').classList.remove('active'); deleteProductId = null; }

function saveProduct(e) {
    e.preventDefault();
    const productId = document.getElementById('productId').value;
    const data = {
        name: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        sku: document.getElementById('productSku').value || `SKU-${Date.now()}`,
        price: parseFloat(document.getElementById('productPrice').value),
        stock: parseInt(document.getElementById('productStock').value),
        description: document.getElementById('productDescription').value,
        image: document.getElementById('previewImg').src || 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop'
    };

    if (productId && productId !== "") {
        // Buscar por ID (string o número) o por SKU
        const idx = products.findIndex(p => String(p.id) === String(productId) || p.sku === productId);
        if (idx !== -1) {
            products[idx] = { ...products[idx], ...data };
            showToast('✅ Producto actualizado correctamente');
        }
    } else {
        const newProduct = { id: generateId(), ...data };
        products.push(newProduct);
        showToast('📦 Nuevo producto agregado con éxito');
    }

    // Sincronización crucial con localStorage
    localStorage.setItem('1807_products', JSON.stringify(products));
    closeProductModal();
    renderSection(currentSection);
}

function deleteProduct() {
    products = products.filter(p => String(p.id) !== String(deleteProductId));
    localStorage.setItem('1807_products', JSON.stringify(products));
    showToast('Producto eliminado');
    closeDeleteModal();
    renderSection(currentSection);
}

function exportProducts() {
    const csv = 'Nombre,Categoría,SKU,Precio,Stock\n' + products.map(p => `"${p.name}","${p.category}",${p.sku},${p.price},${p.stock}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = '1807_productos.csv'; a.click();
    showToast('Productos exportados');
}

function updateStock(id, delta) {
    const idx = products.findIndex(p => String(p.id) === String(id));
    if (idx !== -1) {
        const newStock = products[idx].stock + delta;
        if (newStock >= 0) {
            products[idx].stock = newStock;
            localStorage.setItem('1807_products', JSON.stringify(products));
            renderSection(currentSection);
            if (delta > 0) showToast('Stock incrementado');
            else showToast('Stock disminuido', 'warning');
        } else {
            showToast('El stock no puede ser negativo', 'error');
        }
    }
}

function filterLowStock() {
    navigateTo('dashboard');
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        // En un sistema real, esto aplicaría un filtro específico. 
        // Aquí simplemente mostraremos un toast informativo por ahora.
        showToast('Mostrando productos con bajo stock');
    }
}

// ========================================
// OTRAS SECCIONES
// ========================================
function renderProductsSection() { return renderDashboard(); }

function renderOrdersSection() {
    const pendingOrders = orders.filter(o => o.status === 'pending');
    return `
        <div class="dashboard-header"><div><h1 class="dashboard-title">Pedidos</h1><p class="dashboard-subtitle">${pendingOrders.length} pedidos pendientes</p></div></div>
        <div class="orders-grid">${orders.map(o => `
            <div class="order-card">
                <div class="order-card-header"><span class="order-id">${o.id}</span><span class="order-status ${o.status}">${o.status === 'pending' ? 'Pendiente' : 'Completado'}</span></div>
                <div class="order-card-body">
                    <div class="order-customer"><div class="order-customer-avatar">${o.clientName[0]}</div><div class="order-customer-info"><h4>${o.clientName}</h4><p>${o.clientEmail}</p></div></div>
                    <div class="order-items">${o.items.map(i => `<div class="order-item"><span>${i.name}</span><span>x${i.qty}</span></div>`).join('')}</div>
                    <div class="order-total"><span>Total:</span><span class="order-total-value">${formatPrice(o.total)}</span></div>
                </div>
                <div class="order-card-footer">
                    ${o.status === 'pending' ? `<button class="btn btn-success btn-sm" onclick="completeOrder('${o.id}')">✓ Completar</button>` : ''}
                    <button class="btn btn-secondary btn-sm" onclick="viewOrderDetails('${o.id}')">Ver Detalles</button>
                </div>
            </div>
        `).join('')}</div>`;
}

function renderSalesSection() {
    const totalSales = orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.total, 0);
    return `
        <div class="dashboard-header"><div><h1 class="dashboard-title">Ventas</h1><p class="dashboard-subtitle">Total vendido: ${formatPrice(totalSales)}</p></div></div>
        <div class="stats-grid">
            <div class="stat-card"><div class="stat-value">${formatPrice(totalSales)}</div><div class="stat-label">Ventas Totales</div></div>
            <div class="stat-card"><div class="stat-value">${orders.filter(o => o.status === 'completed').length}</div><div class="stat-label">Órdenes Completadas</div></div>
            <div class="stat-card"><div class="stat-value">${orders.filter(o => o.status === 'pending').length}</div><div class="stat-label">Pendientes</div></div>
        </div>
        <div class="orders-grid">${orders.filter(o => o.status === 'completed').map(o => `
            <div class="order-card"><div class="order-card-header"><span class="order-id">${o.id}</span><span class="order-status completed">Completado</span></div>
            <div class="order-card-body"><h4>${o.clientName}</h4><p class="order-total-value">${formatPrice(o.total)}</p></div></div>
        `).join('')}</div>`;
}

function renderClientsSection() {
    return `
        <div class="dashboard-header"><div><h1 class="dashboard-title">Clientes</h1><p class="dashboard-subtitle">${clients.length} clientes registrados</p></div>
        <button class="btn btn-primary" onclick="openClientModal()">➕ Nuevo Cliente</button></div>
        <div class="clients-grid">${clients.map(c => `
            <div class="client-card">
                <div class="client-avatar">${c.name[0]}</div>
                <h3 class="client-name">${c.name}</h3>
                <p class="client-email">${c.email}</p>
                <div class="client-stats">
                    <div class="client-stat"><div class="client-stat-value">${c.orders}</div><div class="client-stat-label">Pedidos</div></div>
                    <div class="client-stat"><div class="client-stat-value">${formatPrice(c.spent)}</div><div class="client-stat-label">Gastado</div></div>
                </div>
                <div class="client-actions">
                    <button class="btn btn-secondary btn-sm" onclick="editClient(${c.id})">✏️ Editar</button>
                    <button class="btn btn-secondary btn-sm" onclick="deleteClient(${c.id})">🗑️</button>
                </div>
            </div>
        `).join('')}</div>`;
}

function renderReportsSection() {
    return `
        <div class="dashboard-header"><div><h1 class="dashboard-title">Reportes</h1><p class="dashboard-subtitle">Análisis de ventas y estadísticas</p></div></div>
        <div class="reports-grid">
            <div class="report-card">
                <div class="report-card-header"><h3 class="report-card-title">Ventas Mensuales</h3><span class="report-period">Febrero 2026</span></div>
                <div class="chart-placeholder"><div class="chart-bars">${[60, 80, 45, 90, 70, 85, 95, 60, 75, 88, 92, 78].map(h => `<div class="chart-bar" style="height:${h}%"></div>`).join('')}</div></div>
                <div class="report-summary"><div class="report-summary-item"><div class="report-summary-value">${formatPrice(12500)}</div><div class="report-summary-label">Total</div></div>
                <div class="report-summary-item"><div class="report-summary-value">67</div><div class="report-summary-label">Transacciones</div></div>
                <div class="report-summary-item"><div class="report-summary-value">+15%</div><div class="report-summary-label">vs Mes Anterior</div></div></div>
            </div>
            <div class="report-card">
                <div class="report-card-header"><h3 class="report-card-title">Productos Más Vendidos</h3></div>
                <div style="padding:1rem 0">${products.slice(0, 4).map((p, i) => `<div style="display:flex;justify-content:space-between;padding:0.5rem 0;border-bottom:1px solid rgba(255,255,255,0.08)"><span>${i + 1}. ${p.name}</span><span style="color:var(--primary-gold)">${Math.floor(Math.random() * 50) + 10} vendidos</span></div>`).join('')}</div>
            </div>
        </div>`;
}

function renderSettingsSection() {
    return `
        <div class="dashboard-header"><div><h1 class="dashboard-title">Configuración</h1></div></div>
        <div class="settings-container">
            <div class="settings-section"><div class="settings-section-header"><h3 class="settings-section-title">Notificaciones</h3></div>
            <div class="settings-section-body">
                <div class="setting-row"><div class="setting-info"><h4>Alertas de venta</h4><p>Recibir alertas cuando hay ventas pendientes</p></div><label class="toggle-switch"><input type="checkbox" checked><span class="toggle-slider"></span></label></div>
                <div class="setting-row"><div class="setting-info"><h4>Stock bajo</h4><p>Alertar cuando un producto tiene poco stock</p></div><label class="toggle-switch"><input type="checkbox" checked><span class="toggle-slider"></span></label></div>
            </div></div>
            <div class="settings-section"><div class="settings-section-header"><h3 class="settings-section-title">Tienda</h3></div>
            <div class="settings-section-body">
                <div class="setting-row"><div class="setting-info"><h4>Nombre de la tienda</h4><p>1807.studio</p></div><button class="btn btn-secondary btn-sm">Editar</button></div>
                <div class="setting-row"><div class="setting-info"><h4>Moneda</h4><p>USD - Dólar estadounidense</p></div><button class="btn btn-secondary btn-sm">Cambiar</button></div>
            </div></div>
        </div>`;
}

// ========================================
// USUARIOS (ADMIN ONLY)
// ========================================
function renderUsersSection() {
    const allUsers = JSON.parse(localStorage.getItem('1807_users')) || [];

    return `
        <div class="dashboard-header">
            <div>
                <h1 class="dashboard-title">Registro de Cuentas</h1>
                <p class="dashboard-subtitle">Listado de todos los usuarios registrados en el sistema.</p>
            </div>
        </div>
        
        <div class="users-container">
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon blue">👥</div>
                    <div class="stat-value">${allUsers.length}</div>
                    <div class="stat-label">Total Usuarios</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon gold">👑</div>
                    <div class="stat-value">${allUsers.filter(u => u.role === 'admin').length}</div>
                    <div class="stat-label">Administradores</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon green">🛒</div>
                    <div class="stat-value">${allUsers.filter(u => u.role === 'vendedor').length}</div>
                    <div class="stat-label">Vendedores</div>
                </div>
            </div>

            <section class="products-section" style="margin-top: 2rem;">
                <table class="products-table">
                    <thead>
                        <tr>
                            <th>Usuario</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${allUsers.map(u => `
                            <tr>
                                <td>
                                    <div class="product-cell">
                                        <div class="user-avatar" style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: var(--primary-gold); color: var(--bg-dark); border-radius: 8px; font-weight: bold; margin-right: 1rem;">
                                            ${u.name ? u.name[0].toUpperCase() : 'U'}
                                        </div>
                                        <div class="product-info">
                                            <h4>${u.name || 'Sin nombre'}</h4>
                                        </div>
                                    </div>
                                </td>
                                <td>${u.email}</td>
                                <td>
                                    <span class="sidebar-badge" style="position: static; padding: 0.25rem 0.75rem; background: ${u.role === 'admin' ? 'rgba(201, 169, 98, 0.2)' : 'rgba(255, 255, 255, 0.1)'}; color: ${u.role === 'admin' ? 'var(--primary-gold)' : 'var(--text-secondary)'}">
                                        ${u.role.toUpperCase()}
                                    </span>
                                </td>
                                <td>
                                    <span style="color: var(--success); display: flex; align-items: center; gap: 0.5rem;">
                                        <span style="width: 8px; height: 8px; background: var(--success); border-radius: 50%;"></span>
                                        Activo
                                    </span>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </section>
        </div>`;
}

// ========================================
// CLIENTES
// ========================================
function openClientModal() { document.getElementById('clientModal').classList.add('active'); }
function closeClientModal() { document.getElementById('clientModal').classList.remove('active'); }
function saveClient(e) {
    e.preventDefault();
    clients.push({ id: generateId(), name: document.getElementById('clientName').value, email: document.getElementById('clientEmail').value, phone: document.getElementById('clientPhone').value, address: document.getElementById('clientAddress').value, orders: 0, spent: 0 });
    localStorage.setItem('1807_clients', JSON.stringify(clients));
    showToast('Cliente agregado');
    closeClientModal();
    renderSection('clients');
}
function deleteClient(id) { clients = clients.filter(c => c.id !== id); localStorage.setItem('1807_clients', JSON.stringify(clients)); showToast('Cliente eliminado'); renderSection('clients'); }

// ========================================
// ÓRDENES
// ========================================
function completeOrder(id) { const o = orders.find(x => x.id === id); if (o) { o.status = 'completed'; localStorage.setItem('1807_orders', JSON.stringify(orders)); showToast('Orden completada'); renderSection('orders'); updateBadges(); } }
function viewOrderDetails(id) { showToast(`Detalles de ${id}`); }

// ========================================
// CHATBOT IA
// ========================================
let chatbotOpen = false;
const chatResponses = {
    greeting: "¡Hola! 👋 Soy el asistente virtual de 1807.studio. ¿En qué puedo ayudarte hoy?",
    products: () => `Estos son nuestros productos disponibles:\n\n${products.filter(p => p.stock > 0).map(p => `• ${p.name} - ${formatPrice(p.price)}`).join('\n')}\n\n¿Te interesa alguno en particular?`,
    prices: () => `💰 Lista de precios:\n\n${products.map(p => `${p.name}: ${formatPrice(p.price)}`).join('\n')}`,
    buy: "¡Excelente elección! Para confirmar tu compra, escribe 'CONFIRMAR COMPRA' seguido del nombre del producto.",
    confirm: (product) => { triggerSaleAlert(product); return `✅ ¡Compra confirmada!\n\nProducto: ${product.name}\nPrecio: ${formatPrice(product.price)}\n\n🚀 Te estamos redirigiendo a nuestro WhatsApp oficial (78810097) para finalizar tu pedido.`; },
    whatsapp: "📱 Puedes contactarnos directamente por WhatsApp haciendo clic aquí: [Contactar al 78810097](https://wa.me/59178810097?text=Hola,%20quisiera%20consultar%20sobre%20tus%20productos)",
    categories: "📂 Nuestras categorías:\n• Bolsos de mano\n• Carteras\n• Mochilas\n• Clutch\n• Tote\n\n¿Qué tipo de bolso buscas?",
    help: "Puedo ayudarte con:\n• Ver productos disponibles\n• Consultar precios\n• Realizar una compra\n• Contactar por WhatsApp\n• Información sobre categorías\n\n¿Qué necesitas?"
};

function toggleChatbot() {
    chatbotOpen = !chatbotOpen;
    document.getElementById('chatbotWidget').classList.toggle('active', chatbotOpen);
    document.getElementById('chatbotBadge').textContent = '0';
    if (chatbotOpen && !document.querySelector('.chat-message')) addBotMessage(chatResponses.greeting);
}

function addBotMessage(text) {
    const container = document.getElementById('chatbotMessages');
    const msg = document.createElement('div');
    msg.className = 'chat-message bot';
    msg.innerHTML = text.replace(/\n/g, '<br>');
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;
}

function addUserMessage(text) {
    const container = document.getElementById('chatbotMessages');
    const msg = document.createElement('div');
    msg.className = 'chat-message user';
    msg.textContent = text;
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;
}

function processChat(input) {
    const text = input.toLowerCase().trim();

    if (text.includes('hola') || text.includes('buenos') || text.includes('hey')) return chatResponses.greeting;
    if (text.includes('producto') || text.includes('catalogo') || text.includes('ver')) return chatResponses.products();
    if (text.includes('precio') || text.includes('costo') || text.includes('cuanto')) return chatResponses.prices();
    if (text.includes('comprar') || text.includes('quiero') || text.includes('ordenar')) return chatResponses.buy;
    if (text.includes('whatsapp') || text.includes('contacto') || text.includes('vendedor') || text.includes('telefono')) return chatResponses.whatsapp;
    if (text.includes('categoria') || text.includes('tipo')) return chatResponses.categories;
    if (text.includes('ayuda') || text.includes('help')) return chatResponses.help;

    if (text.includes('confirmar compra')) {
        const productName = text.replace('confirmar compra', '').trim();
        const product = products.find(p => p.name.toLowerCase().includes(productName) || productName.includes(p.name.toLowerCase().split(' ')[0]));
        if (product) return chatResponses.confirm(product);
        return `No encontré ese producto. Escribe "ver productos" para ver el catálogo.`;
    }

    return `No entendí tu mensaje. Escribe "ayuda" para ver qué puedo hacer por ti, o "productos" para ver nuestro catálogo.`;
}

function sendChatMessage() {
    const input = document.getElementById('chatbotInput');
    const text = input.value.trim();
    if (!text) return;

    addUserMessage(text);
    input.value = '';

    setTimeout(() => addBotMessage(processChat(text)), 800);
}

function triggerSaleAlert(product) {
    const alertDetails = document.getElementById('saleAlertDetails');
    alertDetails.innerHTML = `
        <div class="detail-row"><span class="detail-label">Producto:</span><span>${product.name}</span></div>
        <div class="detail-row"><span class="detail-label">Precio:</span><span>${formatPrice(product.price)}</span></div>
        <div class="detail-row"><span class="detail-label">Fecha:</span><span>${new Date().toLocaleString()}</span></div>
        <div class="detail-row"><span class="detail-label">Total:</span><span>${formatPrice(product.price)}</span></div>`;

    document.getElementById('saleAlertModal').classList.add('active');
    document.getElementById('notificationBadge').textContent = parseInt(document.getElementById('notificationBadge').textContent || 0) + 1;
    document.getElementById('ordersBadge').textContent = parseInt(document.getElementById('ordersBadge').textContent || 0) + 1;

    // Agregar a órdenes
    orders.push({ id: `ORD-${Date.now()}`, clientName: "Cliente Chat", clientEmail: "chat@cliente.com", items: [{ name: product.name, qty: 1, price: product.price }], total: product.price, status: "pending", date: new Date().toISOString().split('T')[0] });
    localStorage.setItem('1807_orders', JSON.stringify(orders));

    // Redirección a WhatsApp con alerta para el vendedor
    const message = `🚨 *NUEVO PEDIDO DESDE EL CHATBOT*\n\n` +
        `*Producto:* ${product.name}\n` +
        `*Precio:* ${formatPrice(product.price)}\n` +
        `*Fecha:* ${new Date().toLocaleString()}\n\n` +
        `_Hola, confirmo que quiero este producto. Por favor, contácteme._`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/59178810097?text=${encodedMessage}`;

    setTimeout(() => {
        window.open(whatsappUrl, '_blank');
    }, 2000);
}

function closeSaleAlert() { document.getElementById('saleAlertModal').classList.remove('active'); }
function attendSale() { closeSaleAlert(); navigateTo('orders'); showToast('Atendiendo venta pendiente...'); }

function updateBadges() {
    const pending = orders.filter(o => o.status === 'pending').length;
    document.getElementById('ordersBadge').textContent = pending;
    document.getElementById('notificationBadge').textContent = pending;
}

// ========================================
// EVENTOS
// ========================================
function initProductEvents() {
    document.getElementById('productForm')?.addEventListener('submit', saveProduct);
}

function initClientEvents() {
    document.getElementById('clientForm')?.addEventListener('submit', saveClient);
}

function initOrderEvents() { }

document.addEventListener('DOMContentLoaded', () => {
    // Navegación
    document.querySelectorAll('[data-section]').forEach(el => el.addEventListener('click', (e) => { e.preventDefault(); navigateTo(el.dataset.section); }));

    // Modales
    document.getElementById('modalClose')?.addEventListener('click', closeProductModal);
    document.getElementById('cancelBtn')?.addEventListener('click', closeProductModal);
    document.getElementById('productForm')?.addEventListener('submit', saveProduct);
    document.getElementById('cancelDelete')?.addEventListener('click', closeDeleteModal);
    document.getElementById('confirmDelete')?.addEventListener('click', deleteProduct);
    document.getElementById('clientModalClose')?.addEventListener('click', closeClientModal);
    document.getElementById('cancelClientBtn')?.addEventListener('click', closeClientModal);
    document.getElementById('clientForm')?.addEventListener('submit', saveClient);
    document.getElementById('dismissAlert')?.addEventListener('click', closeSaleAlert);
    document.getElementById('attendSale')?.addEventListener('click', attendSale);

    // Chatbot
    document.getElementById('chatbotToggle')?.addEventListener('click', toggleChatbot);
    document.getElementById('minimizeChatbot')?.addEventListener('click', toggleChatbot);
    document.getElementById('openChatbotSidebar')?.addEventListener('click', (e) => { e.preventDefault(); toggleChatbot(); });
    document.getElementById('chatbotSend')?.addEventListener('click', sendChatMessage);
    document.getElementById('chatbotInput')?.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendChatMessage(); });

    // Cerrar modales con click fuera
    document.querySelectorAll('.modal-overlay').forEach(m => m.addEventListener('click', (e) => { if (e.target === m) m.classList.remove('active'); }));

    // Gestión de Carga de Imágenes
    const imageUploadArea = document.getElementById('imageUploadArea');
    const imageInput = document.getElementById('imageInput');
    const imagePreview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');
    const removeImage = document.getElementById('removeImage');

    if (imageUploadArea && imageInput) {
        imageUploadArea.addEventListener('click', () => imageInput.click());

        imageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    previewImg.src = event.target.result;
                    imagePreview.classList.add('active');
                    imageUploadArea.style.display = 'none';
                };
                reader.readAsDataURL(file);
            }
        });

        // Drag & Drop
        imageUploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            imageUploadArea.style.borderColor = 'var(--primary-gold)';
            imageUploadArea.style.background = 'rgba(201, 169, 98, 0.1)';
        });

        imageUploadArea.addEventListener('dragleave', () => {
            imageUploadArea.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            imageUploadArea.style.background = 'transparent';
        });

        imageUploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            imageUploadArea.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            imageUploadArea.style.background = 'transparent';

            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    previewImg.src = event.target.result;
                    imagePreview.classList.add('active');
                    imageUploadArea.style.display = 'none';
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (removeImage) {
        removeImage.addEventListener('click', () => {
            previewImg.src = '';
            imagePreview.classList.remove('active');
            imageUploadArea.style.display = 'block';
            imageInput.value = '';
        });
    }

    // Menú Móvil - Dashboard
    const navbar = document.getElementById('navbar');
    const sidebar = document.getElementById('sidebar');
    const mobileToggle = document.createElement('button');
    mobileToggle.className = 'mobile-toggle';
    mobileToggle.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
        </svg>`;

    if (navbar) {
        navbar.prepend(mobileToggle);
        mobileToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            document.querySelector('.navbar-nav')?.classList.toggle('active');
        });
    }

    // Render inicial - RESTAURADO
    loadUserInfo();
    renderSection('dashboard');
    updateBadges();

    console.log('🛍️ 1807.studio initialized with Chatbot IA & Responsive Engine');
});

// Exponer funciones globales
window.openProductModal = openProductModal;
window.editProduct = editProduct;
window.openDeleteModal = openDeleteModal;
window.filterProducts = filterProducts;
window.exportProducts = exportProducts;
window.openClientModal = openClientModal;
window.editClient = (id) => showToast('Editando cliente...');
window.deleteClient = deleteClient;
window.completeOrder = completeOrder;
window.viewOrderDetails = viewOrderDetails;
window.navigateTo = navigateTo;
window.logout = logout;
window.updateStock = updateStock;
window.filterLowStock = filterLowStock;

