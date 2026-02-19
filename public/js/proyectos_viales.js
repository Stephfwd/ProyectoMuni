// proyectos_viales.js — CRUD completo para proyectos viales
const API_URL = 'http://localhost:3002';

let editingId = null;

// ─── Utilidades ───────────────────────────────────────────────
function fmt(n) {
    if (n == null || n === '') return '—';
    return '₡ ' + Number(n).toLocaleString('es-CR');
}
function cap(str) { return str ? str.charAt(0).toUpperCase() + str.slice(1) : ''; }
function estadoClass(e) {
    return { pendiente: 'pending', 'en proceso': 'tasks', completado: 'active', cancelado: 'closed' }[e] || 'pending';
}

// ─── Carga ────────────────────────────────────────────────────
async function loadProyectos() {
    const tbody = document.getElementById('pv-table-body');
    if (!tbody) return;

    try {
        const res = await fetch(`${API_URL}/proyectos_viales`);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();

        // Stats
        document.getElementById('pv-total').textContent = data.length;
        document.getElementById('pv-en-proceso').textContent = data.filter(p => p.estado === 'en proceso').length;
        document.getElementById('pv-completados').textContent = data.filter(p => p.estado === 'completado').length;

        // Presupuesto total
        const presTotal = data.reduce((s, p) => s + Number(p.presupuesto || 0), 0);
        const presEl = document.getElementById('pv-presupuesto-total');
        if (presEl) presEl.textContent = '₡ ' + presTotal.toLocaleString('es-CR');

        // Filtro activo
        const filActivo = document.querySelector('[data-filter-pv].btn-primary')?.getAttribute('data-filter-pv') || 'all';
        const filtered = filActivo === 'all' ? data : data.filter(p => p.estado === filActivo);

        tbody.innerHTML = '';
        if (!filtered.length) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:2rem;color:#888;">
                No hay proyectos para mostrar. Haga clic en <strong>Nuevo Proyecto</strong>.</td></tr>`;
            return;
        }

        filtered.forEach(p => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${p.nombre}</strong></td>
                <td>${p.descripcion ? p.descripcion.substring(0, 50) + (p.descripcion.length > 50 ? '…' : '') : '—'}</td>
                <td>${fmt(p.presupuesto)}</td>
                <td>${p.fecha_inicio || '—'}</td>
                <td><span class="status ${estadoClass(p.estado)}">${cap(p.estado)}</span></td>
                <td style="display:flex;gap:.4rem;">
                    <button class="btn-icon" onclick="openModal(${JSON.stringify(p).replace(/"/g, '&quot;')})"
                        title="Editar" style="color:#3b82f6;"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon" onclick="deleteProyecto('${p.id}')"
                        title="Eliminar" style="color:#ef4444;"><i class="fas fa-trash"></i></button>
                </td>`;
            tbody.appendChild(tr);
        });

        // Sync filter buttons
        document.querySelectorAll('[data-filter-pv]').forEach(btn => {
            const v = btn.getAttribute('data-filter-pv');
            btn.className = v === filActivo ? 'btn btn-primary' : 'btn btn-secondary';
            btn.style.cssText = 'padding:5px 14px;font-size:.88em;';
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
    document.getElementById('pv-modal-title').textContent = data ? 'Editar Proyecto' : 'Nuevo Proyecto Vial';
    document.getElementById('pv-nombre').value = data?.nombre || '';
    document.getElementById('pv-descripcion').value = data?.descripcion || '';
    document.getElementById('pv-presupuesto').value = data?.presupuesto || '';
    document.getElementById('pv-fecha').value = data?.fecha_inicio || '';
    document.getElementById('pv-estado').value = data?.estado || 'pendiente';
    document.getElementById('pv-modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('pv-modal').style.display = 'none';
    editingId = null;
}

// ─── Guardar ──────────────────────────────────────────────────
async function saveProyecto() {
    const nombre = document.getElementById('pv-nombre').value.trim();
    const descripcion = document.getElementById('pv-descripcion').value.trim();
    const presupuesto = document.getElementById('pv-presupuesto').value;
    const fecha = document.getElementById('pv-fecha').value;
    const estado = document.getElementById('pv-estado').value;

    if (!nombre || !presupuesto || !fecha) {
        Swal.fire({
            icon: 'warning', title: 'Campos incompletos',
            text: 'Nombre, presupuesto y fecha de inicio son obligatorios.'
        });
        return;
    }

    const payload = { nombre, descripcion, presupuesto: Number(presupuesto), fecha_inicio: fecha, estado };
    const btn = document.getElementById('pv-btn-guardar');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';

    try {
        const url = editingId ? `${API_URL}/proyectos_viales/${editingId}` : `${API_URL}/proyectos_viales`;
        const method = editingId ? 'PUT' : 'POST';
        const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        closeModal();
        await loadProyectos();
        Swal.fire({ icon: 'success', title: editingId ? '¡Actualizado!' : '¡Creado!', timer: 1800, showConfirmButton: false });
    } catch (err) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo guardar.' });
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-save"></i> Guardar';
    }
}

// ─── Eliminar ─────────────────────────────────────────────────
async function deleteProyecto(id) {
    const r = await Swal.fire({
        title: '¿Eliminar proyecto?', text: 'Esta acción no se puede deshacer.',
        icon: 'warning', showCancelButton: true,
        confirmButtonColor: '#ef4444', cancelButtonColor: '#95a5a6',
        confirmButtonText: 'Eliminar', cancelButtonText: 'Cancelar'
    });
    if (!r.isConfirmed) return;
    try {
        const res = await fetch(`${API_URL}/proyectos_viales/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        await loadProyectos();
        Swal.fire({ icon: 'success', title: 'Eliminado', timer: 1500, showConfirmButton: false });
    } catch (err) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo eliminar.' });
    }
}

// ─── Init ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    loadProyectos();

    document.querySelectorAll('[data-filter-pv]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('[data-filter-pv]').forEach(b => {
                b.className = 'btn btn-secondary'; b.style.cssText = 'padding:5px 14px;font-size:.88em;';
            });
            btn.className = 'btn btn-primary'; btn.style.cssText = 'padding:5px 14px;font-size:.88em;';
            loadProyectos();
        });
    });

    document.getElementById('pv-modal').addEventListener('click', function (e) {
        if (e.target === this) closeModal();
    });
});
