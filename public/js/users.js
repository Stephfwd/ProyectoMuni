// users.js - Loads and displays users from json-server
const API_URL = "http://localhost:3002";

async function loadUsers() {
    const tableBody = document.getElementById('users-table-body');
    if (!tableBody) return;

    try {
        const response = await fetch(`${API_URL}/users`);
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        const users = await response.json();

        // Update stats
        const today = new Date().toISOString().split('T')[0];
        const totalEl = document.getElementById('users-total');
        const newTodayEl = document.getElementById('users-new-today');
        const pendingEl = document.getElementById('users-pending');

        if (totalEl) totalEl.textContent = users.length;
        if (newTodayEl) newTodayEl.textContent = users.filter(u => u.fecha_registro === today).length;
        if (pendingEl) pendingEl.textContent = users.filter(u => u.estado === 'pendiente').length;

        // Render table
        tableBody.innerHTML = '';
        if (users.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 2rem; color: #888;">No hay usuarios registrados.</td></tr>';
            return;
        }

        users.forEach(user => {
            const row = document.createElement('tr');
            let actionButtons = '';
            if (user.estado === 'activo') {
                actionButtons = `
                    <button class="btn-icon" onclick="updateUserStatus('${user.id}', 'inactivo')" title="Desactivar" style="color: #ef4444;">
                        <i class="fas fa-ban"></i>
                    </button>
                    <button class="btn-icon" onclick="viewUserDetails(${JSON.stringify(user).replace(/"/g, '&quot;')})" title="Ver detalles" style="color: #3b82f6;">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon" onclick="deleteUser('${user.id}')" title="Eliminar" style="color: #dc2626;">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                `;
            } else if (user.estado === 'pendiente') {
                actionButtons = `
                    <button class="btn-icon" onclick="updateUserStatus('${user.id}', 'activo')" title="Activar" style="color: #10b981;">
                        <i class="fas fa-check"></i>
                    </button>
                    <button class="btn-icon" onclick="viewUserDetails(${JSON.stringify(user).replace(/"/g, '&quot;')})" title="Ver detalles" style="color: #3b82f6;">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon" onclick="deleteUser('${user.id}')" title="Eliminar" style="color: #dc2626;">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                `;
            } else {
                actionButtons = `
                    <button class="btn-icon" onclick="updateUserStatus('${user.id}', 'activo')" title="Reactivar" style="color: #f59e0b;">
                        <i class="fas fa-redo"></i>
                    </button>
                    <button class="btn-icon" onclick="viewUserDetails(${JSON.stringify(user).replace(/"/g, '&quot;')})" title="Ver detalles" style="color: #3b82f6;">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon" onclick="deleteUser('${user.id}')" title="Eliminar" style="color: #dc2626;">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                `;
            }

            const statusClass = { activo: 'active', pendiente: 'pending', inactivo: 'closed' }[user.estado] || 'pending';
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.nombre}</td>
                <td>${user.email}</td>
                <td>${capitalize(user.rol)}</td>
                <td><span class="status ${statusClass}">${capitalize(user.estado)}</span></td>
                <td style="display: flex; gap: 0.5rem;">${actionButtons}</td>
            `;
            tableBody.appendChild(row);
        });

        // Search functionality
        const searchInput = document.querySelector('input[placeholder="Buscar usuario..."]');
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                const query = searchInput.value.toLowerCase();
                tableBody.querySelectorAll('tr').forEach(row => {
                    row.style.display = row.textContent.toLowerCase().includes(query) ? '' : 'none';
                });
            });
        }

    } catch (error) {
        console.error('Error cargando usuarios:', error);
        if (tableBody) tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 2rem; color: #e74c3c;">Error al cargar datos. Verifica que json-server esté corriendo.</td></tr>';
    }
}

async function updateUserStatus(id, newStatus) {
    const msg = newStatus === 'activo' ? '¿Activar este usuario?' : '¿Desactivar este usuario?';
    if (!confirm(msg)) return;

    try {
        const response = await fetch(`${API_URL}/users/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado: newStatus })
        });
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        loadUsers();
    } catch (error) {
        console.error('Error actualizando usuario:', error);
        alert('Error al actualizar el usuario.');
    }
}

async function deleteUser(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.')) return;

    try {
        const response = await fetch(`${API_URL}/users/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        loadUsers();
    } catch (error) {
        console.error('Error eliminando usuario:', error);
        alert('Error al eliminar el usuario.');
    }
}

function viewUserDetails(user) {
    alert(`ID: ${user.id}\nNombre: ${user.nombre}\nEmail: ${user.email}\nTeléfono: ${user.telefono || 'N/A'}\nRol: ${capitalize(user.rol)}\nEstado: ${capitalize(user.estado)}\nFecha de Registro: ${user.fecha_registro || 'N/A'}`);
}

function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

document.addEventListener('DOMContentLoaded', () => {
    loadUsers();

    // Search button
    const searchBtn = document.querySelector('.btn-secondary');
    if (searchBtn && searchBtn.textContent.includes('Buscar')) {
        searchBtn.addEventListener('click', () => {
            const searchInput = document.querySelector('input[placeholder="Buscar usuario..."]');
            if (searchInput) searchInput.dispatchEvent(new Event('input'));
        });
    }
});
