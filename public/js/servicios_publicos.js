// servicios_publicos.js — CRUD completo para servicios públicos
const API_URL = 'http://localhost:3002';

let editingId = null;

function cap(str) { return str ? str.charAt(0).toUpperCase() + str.slice(1) : ''; }
function estadoClass(e) {
    return { activo: 'active', inactivo: 'closed', mantenimiento: 'pending' }[e] || 'pending';
}

// ─── Carga ────────────────────────────────────────────────────
async function loadServicios() {
    const tbody = document.getElementById('sp-table-body');
    if (!tbody) return;

    try {
        const res = await fetch(`${API_URL}/servicios_publicos`);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();

        document.getElementById('sp-total').textContent = data.length;
        document.getElementById('sp-activos').textContent = data.filter(s => s.estado === 'activo').length;
        document.getElementById('sp-inactivos').textContent = data.filter(s => s.estado === 'inactivo').length;
        document.getElementById('sp-mantenimiento').textContent = data.filter(s => s.estado === 'mantenimiento').length;

        tbody.innerHTML = '';
        if (!data.length) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:2rem;color:#888;">
                No hay servicios registrados. Haga clic en <strong>Nuevo Servicio</strong>.</td></tr>`;
            return;
        }

        data.forEach(s => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${s.nombre}</strong></td>
                <td>${cap(s.categoria) || '—'}</td>
                <td>${s.descripcion ? s.descripcion.substring(0, 55) + (s.descripcion.length > 55 ? '…' : '') : '—'}</td>
                <td>${s.responsable || '—'}</td>
                <td><span class="status ${estadoClass(s.estado)}">${cap(s.estado)}</span></td>
                <td style="display:flex;gap:.4rem;">
                    <button class="btn-icon" onclick="openModal(${JSON.stringify(s).replace(/"/g, '&quot;')})"
                        title="Editar" style="color:#3b82f6;"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon" onclick="deleteServicio('${s.id}')"
                        title="Eliminar" style="color:#ef4444;"><i class="fas fa-trash"></i></button>
                </td>`;
            tbody.appendChild(tr);
        });

    } catch (err) {
        console.error(err);
        if (tbody) tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:2rem;color:#e74c3c;">
            Error al cargar datos. Verifica que json-server esté corriendo.</td></tr>`;
    }
}

// ─── Modal ────────────────────────────────────────────────────
function openModal(data = null) {
    editingId = data ? data.id : null;
    document.getElementById('sp-modal-title').textContent = data ? 'Editar Servicio' : 'Nuevo Servicio Público';
    document.getElementById('sp-nombre').value = data?.nombre || '';
    document.getElementById('sp-categoria').value = data?.categoria || '';
    document.getElementById('sp-descripcion').value = data?.descripcion || '';
    document.getElementById('sp-responsable').value = data?.responsable || '';
    document.getElementById('sp-telefono').value = data?.telefono || '';
    document.getElementById('sp-estado').value = data?.estado || 'activo';
    document.getElementById('sp-modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('sp-modal').style.display = 'none';
    editingId = null;
}

// ─── Guardar ──────────────────────────────────────────────────
async function saveServicio() {
    const nombre = document.getElementById('sp-nombre').value.trim();
    const categoria = document.getElementById('sp-categoria').value.trim();
    const descripcion = document.getElementById('sp-descripcion').value.trim();
    const responsable = document.getElementById('sp-responsable').value.trim();
    const telefono = document.getElementById('sp-telefono').value.trim();
    const estado = document.getElementById('sp-estado').value;

    if (!nombre || !categoria) {
        Swal.fire({ icon: 'warning', title: 'Campos incompletos', text: 'Nombre y categoría son obligatorios.' });
        return;
    }

    const payload = { nombre, categoria, descripcion, responsable, telefono, estado };
    const btn = document.getElementById('sp-btn-guardar');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';

    try {
        const url = editingId ? `${API_URL}/servicios_publicos/${editingId}` : `${API_URL}/servicios_publicos`;
        const method = editingId ? 'PUT' : 'POST';
        const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        closeModal();
        await loadServicios();
        Swal.fire({ icon: 'success', title: editingId ? '¡Actualizado!' : '¡Registrado!', timer: 1800, showConfirmButton: false });
    } catch (err) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo guardar.' });
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-save"></i> Guardar';
    }
}

// ─── Eliminar ─────────────────────────────────────────────────
async function deleteServicio(id) {
    const r = await Swal.fire({
        title: '¿Eliminar servicio?', text: 'Esta acción no se puede deshacer.',
        icon: 'warning', showCancelButton: true,
        confirmButtonColor: '#ef4444', cancelButtonColor: '#95a5a6',
        confirmButtonText: 'Eliminar', cancelButtonText: 'Cancelar'
    });
    if (!r.isConfirmed) return;
    try {
        const res = await fetch(`${API_URL}/servicios_publicos/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        await loadServicios();
        Swal.fire({ icon: 'success', title: 'Eliminado', timer: 1500, showConfirmButton: false });
    } catch (err) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo eliminar.' });
    }
}

// ─── Init ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    loadServicios();
    document.getElementById('sp-modal').addEventListener('click', function (e) {
        if (e.target === this) closeModal();
    });
});
