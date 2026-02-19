// financiamiento.js — CRUD completo para solicitudes de financiamiento
const API_URL = 'http://localhost:3002';

let editingId = null; // null = crear, string = editar

// ─── Utilidades ───────────────────────────────────────────────
function fmt(n) {
    if (n == null || n === '') return '—';
    return '₡ ' + Number(n).toLocaleString('es-CR');
}
function cap(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}
function estadoClass(estado) {
    return { pendiente: 'pending', aprobado: 'active', rechazado: 'closed' }[estado] || 'pending';
}

// ─── Carga principal ──────────────────────────────────────────
async function loadFinanciamientos() {
    const tbody = document.getElementById('fin-table-body');
    if (!tbody) return;

    try {
        const res = await fetch(`${API_URL}/financiamientos`);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();

        // Stats
        document.getElementById('fin-total').textContent = data.length;
        document.getElementById('fin-pendientes').textContent = data.filter(f => f.estado === 'pendiente').length;
        document.getElementById('fin-aprobados').textContent = data.filter(f => f.estado === 'aprobado').length;
        document.getElementById('fin-rechazados').textContent = data.filter(f => f.estado === 'rechazado').length;

        // Tabla
        tbody.innerHTML = '';
        if (!data.length) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:2rem;color:#888;">
                No hay solicitudes registradas. Haga clic en <strong>Nueva Solicitud</strong> para comenzar.
            </td></tr>`;
            return;
        }

        data.forEach(f => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${f.nombre_proyecto}</strong></td>
                <td>${f.entidad_financiera || '—'}</td>
                <td>${fmt(f.monto_solicitado)}</td>
                <td>${fmt(f.monto_aprobado)}</td>
                <td><span class="status ${estadoClass(f.estado)}">${cap(f.estado)}</span></td>
                <td>${f.fecha_solicitud || '—'}</td>
                <td style="display:flex;gap:.5rem;">
                    <button class="btn-icon" onclick="openModal(${JSON.stringify(f).replace(/"/g, '&quot;')})"
                        title="Editar" style="color:#3b82f6;"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon" onclick="deleteFinanciamiento('${f.id}')"
                        title="Eliminar" style="color:#ef4444;"><i class="fas fa-trash"></i></button>
                </td>`;
            tbody.appendChild(tr);
        });

    } catch (err) {
        console.error(err);
        if (tbody) tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:2rem;color:#e74c3c;">
            Error al cargar datos. Verifique que json-server esté corriendo en el puerto 3002.
        </td></tr>`;
    }
}

// ─── Modal ────────────────────────────────────────────────────
function openModal(data = null) {
    editingId = data ? data.id : null;

    document.getElementById('modal-title').textContent = data ? 'Editar Financiamiento' : 'Nueva Solicitud';
    document.getElementById('fin-nombre').value = data?.nombre_proyecto || '';
    document.getElementById('fin-descripcion').value = data?.descripcion || '';
    document.getElementById('fin-monto-sol').value = data?.monto_solicitado || '';
    document.getElementById('fin-monto-apr').value = data?.monto_aprobado || '';
    document.getElementById('fin-entidad').value = data?.entidad_financiera || '';
    document.getElementById('fin-fecha-sol').value = data?.fecha_solicitud || '';
    document.getElementById('fin-fecha-apr').value = data?.fecha_aprobacion || '';
    document.getElementById('fin-estado').value = data?.estado || 'pendiente';

    document.getElementById('fin-modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('fin-modal').style.display = 'none';
    editingId = null;
}

// ─── Guardar (crear o editar) ─────────────────────────────────
async function saveFinanciamiento() {
    const nombre = document.getElementById('fin-nombre').value.trim();
    const descripcion = document.getElementById('fin-descripcion').value.trim();
    const montoSol = document.getElementById('fin-monto-sol').value;
    const montoApr = document.getElementById('fin-monto-apr').value;
    const entidad = document.getElementById('fin-entidad').value.trim();
    const fechaSol = document.getElementById('fin-fecha-sol').value;
    const fechaApr = document.getElementById('fin-fecha-apr').value;
    const estado = document.getElementById('fin-estado').value;

    if (!nombre || !montoSol || !entidad || !fechaSol) {
        Swal.fire({
            icon: 'warning', title: 'Campos incompletos',
            text: 'Complete: nombre del proyecto, monto solicitado, entidad financiera y fecha de solicitud.'
        });
        return;
    }

    const payload = {
        nombre_proyecto: nombre,
        descripcion: descripcion,
        monto_solicitado: Number(montoSol),
        monto_aprobado: montoApr !== '' ? Number(montoApr) : null,
        entidad_financiera: entidad,
        fecha_solicitud: fechaSol,
        fecha_aprobacion: fechaApr || null,
        estado
    };

    const btn = document.getElementById('btn-guardar');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';

    try {
        const url = editingId ? `${API_URL}/financiamientos/${editingId}` : `${API_URL}/financiamientos`;
        const method = editingId ? 'PUT' : 'POST';
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('HTTP ' + res.status);

        closeModal();
        await loadFinanciamientos();
        Swal.fire({
            icon: 'success', title: editingId ? '¡Actualizado!' : '¡Registrado!',
            text: `La solicitud fue ${editingId ? 'actualizada' : 'registrada'} correctamente.`,
            timer: 2000, showConfirmButton: false
        });
    } catch (err) {
        console.error(err);
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo guardar. Intente de nuevo.' });
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-save"></i> Guardar';
    }
}

// ─── Eliminar ─────────────────────────────────────────────────
async function deleteFinanciamiento(id) {
    const result = await Swal.fire({
        title: '¿Eliminar solicitud?',
        text: 'Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#95a5a6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;

    try {
        const res = await fetch(`${API_URL}/financiamientos/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        await loadFinanciamientos();
        Swal.fire({ icon: 'success', title: 'Eliminado', timer: 1500, showConfirmButton: false });
    } catch (err) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo eliminar.' });
    }
}

// ─── Init ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    loadFinanciamientos();

    // Cerrar modal al hacer clic fuera
    document.getElementById('fin-modal').addEventListener('click', function (e) {
        if (e.target === this) closeModal();
    });
});
