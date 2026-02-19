// reports.js - Gestión completa de reportes: filtrar, cambiar estado, eliminar
const API_URL = 'http://localhost:3002';

let filterTipo = 'all';
let filterEstado = 'all';

// ─── Utilidades ───────────────────────────────────────────────
function cap(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// ─── Carga y renderizado ──────────────────────────────────────
async function loadReports() {
    const tbody = document.getElementById('reports-table-body');
    if (!tbody) return;

    try {
        const res = await fetch(`${API_URL}/reportes`);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();

        // Stats
        const today = new Date().toISOString().split('T')[0];
        const newTodayEl = document.getElementById('reports-new-today');
        const resolvedEl = document.getElementById('reports-resolved');
        const highPriorEl = document.getElementById('reports-high-priority');
        const inProcessEl = document.getElementById('reports-in-process');

        if (newTodayEl) newTodayEl.textContent = data.filter(r => r.fecha === today).length;
        if (resolvedEl) resolvedEl.textContent = data.filter(r => ['resuelto', 'cerrado', 'completado'].includes(r.estado)).length;
        if (highPriorEl) highPriorEl.textContent = data.filter(r => ['alta', 'critica'].includes(r.prioridad)).length;
        if (inProcessEl) inProcessEl.textContent = data.filter(r => r.estado === 'en proceso').length;

        // Aplicar filtros
        const filtered = data.filter(r => {
            const matchTipo = filterTipo === 'all' || (r.tipo && r.tipo.toLowerCase() === filterTipo);
            const matchEstado = filterEstado === 'all' || (r.estado && r.estado.toLowerCase() === filterEstado);
            return matchTipo && matchEstado;
        });

        // Render
        tbody.innerHTML = '';
        if (!filtered.length) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:2rem;color:#888;">
                No hay reportes que coincidan con el filtro seleccionado.</td></tr>`;
            return;
        }

        filtered.forEach(report => {
            const estado = report.estado || 'pendiente';

            // Botones de progresión de estado
            let progressBtn = '';
            if (estado === 'pendiente') {
                progressBtn = `<button class="btn-icon" title="Pasar a En Proceso"
                    onclick="updateEstado('${report.id}','en proceso')" style="color:#f59e0b;">
                    <i class="fas fa-play-circle"></i></button>`;
            } else if (estado === 'en proceso') {
                progressBtn = `<button class="btn-icon" title="Marcar como Resuelto"
                    onclick="updateEstado('${report.id}','resuelto')" style="color:#10b981;">
                    <i class="fas fa-check-circle"></i></button>`;
            } else {
                progressBtn = `<button class="btn-icon" title="Reabrir"
                    onclick="updateEstado('${report.id}','pendiente')" style="color:#6366f1;">
                    <i class="fas fa-redo"></i></button>`;
            }

            const statusClass = { pendiente: 'pending', 'en proceso': 'tasks', resuelto: 'active', cerrado: 'closed' }[estado] || 'pending';
            const statusLabel = { pendiente: 'Pendiente', 'en proceso': 'En Proceso', resuelto: 'Resuelto', cerrado: 'Cerrado' }[estado] || cap(estado);

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${report.id}</td>
                <td>${cap(report.tipo)}</td>
                <td>${(report.ubicacion || '').trim() || '<em style="color:#aaa">Sin ubicación</em>'}</td>
                <td>${(report.reportado_por || '').trim() || '<em style="color:#aaa">Anónimo</em>'}</td>
                <td>${report.fecha || '—'}</td>
                <td><span class="status ${statusClass}">${statusLabel}</span></td>
                <td style="display:flex;gap:.4rem;flex-wrap:wrap;">
                    ${progressBtn}
                    <button class="btn-icon" title="Ver detalles"
                        onclick='viewDetails(${JSON.stringify(report).replace(/'/g, "\\'")})'
                        style="color:#3b82f6;"><i class="fas fa-eye"></i></button>
                    <button class="btn-icon" title="Editar reporte"
                        onclick='openModal(${JSON.stringify(report).replace(/'/g, "\\'")})'
                        style="color:#10b981;"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon" title="Eliminar reporte"
                        onclick="deleteReport('${report.id}')"
                        style="color:#ef4444;"><i class="fas fa-trash"></i></button>
                </td>`;
            tbody.appendChild(tr);
        });

        // Resaltar filtros activos
        syncFilterButtons();

    } catch (err) {
        console.error(err);
        if (tbody) tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:2rem;color:#e74c3c;">
            Error al cargar datos. Verifica que json-server esté corriendo en el puerto 3002.</td></tr>`;
    }
}

// ─── Actualizar estado (flujo: Pendiente → En Proceso → Resuelto) ─────
async function updateEstado(id, nuevoEstado) {
    const labels = { pendiente: 'Pendiente', 'en proceso': 'En Proceso', resuelto: 'Resuelto' };
    const result = await Swal.fire({
        title: '¿Cambiar estado?',
        text: `El reporte pasará a: ${labels[nuevoEstado] || nuevoEstado}`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#10b981',
        cancelButtonColor: '#95a5a6',
        confirmButtonText: 'Sí, cambiar',
        cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;

    try {
        const res = await fetch(`${API_URL}/reportes/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado: nuevoEstado })
        });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        await loadReports();
        Swal.fire({ icon: 'success', title: 'Estado actualizado', timer: 1500, showConfirmButton: false });
    } catch (err) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo actualizar el estado.' });
    }
}

// ─── Eliminar reporte inválido ─────────────────────────────────
async function deleteReport(id) {
    const result = await Swal.fire({
        title: '¿Eliminar reporte?',
        text: 'Esta acción es irreversible.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#95a5a6',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;

    try {
        const res = await fetch(`${API_URL}/reportes/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        await loadReports();
        Swal.fire({ icon: 'success', title: 'Eliminado', timer: 1500, showConfirmButton: false });
    } catch (err) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo eliminar el reporte.' });
    }
}

// ─── Modal ────────────────────────────────────────────────────
let editingId = null;

function openModal(data = null) {
    editingId = data ? data.id : null;
    document.getElementById('rep-modal-title').textContent = data ? 'Editar Reporte' : 'Nuevo Reporte';

    document.getElementById('rep-tipo').value = data?.tipo || '';
    document.getElementById('rep-prioridad').value = data?.prioridad || 'media';
    document.getElementById('rep-ubicacion').value = data?.ubicacion || '';
    document.getElementById('rep-descripcion').value = data?.descripcion || '';
    document.getElementById('rep-nombre').value = data?.reportado_por || '';
    document.getElementById('rep-estado').value = data?.estado || 'pendiente';

    document.getElementById('rep-modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('rep-modal').style.display = 'none';
    editingId = null;
}

async function saveReport() {
    const tipo = document.getElementById('rep-tipo').value;
    const prioridad = document.getElementById('rep-prioridad').value;
    const ubicacion = document.getElementById('rep-ubicacion').value.trim();
    const descripcion = document.getElementById('rep-descripcion').value.trim();
    const nombre = document.getElementById('rep-nombre').value.trim();
    const estado = document.getElementById('rep-estado').value;

    if (!tipo || !ubicacion || !nombre) {
        Swal.fire({ icon: 'warning', title: 'Campos incompletos', text: 'Tipo, ubicación y remitente son obligatorios.' });
        return;
    }

    const payload = {
        tipo,
        prioridad,
        ubicacion,
        descripcion,
        reportado_por: nombre,
        estado,
        fecha: editingId ? undefined : new Date().toISOString().split('T')[0]
    };

    const btn = document.getElementById('rep-btn-guardar');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';

    try {
        const url = editingId ? `${API_URL}/reportes/${editingId}` : `${API_URL}/reportes`;
        const method = editingId ? 'PATCH' : 'POST';
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('HTTP ' + res.status);

        closeModal();
        await loadReports();
        Swal.fire({ icon: 'success', title: editingId ? '¡Actualizado!' : '¡Reporte Creado!', timer: 1500, showConfirmButton: false });
    } catch (err) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo guardar el reporte.' });
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-save"></i> Guardar';
    }
}

// ─── Ver detalles (modal SweetAlert2) ─────────────────────────
function viewDetails(report) {
    Swal.fire({
        title: `Reporte #${report.id}`,
        html: `
            <div style="text-align:left;line-height:1.8;font-size:.93rem;">
                <p><strong>Tipo:</strong> ${cap(report.tipo)}</p>
                <p><strong>Ubicación:</strong> ${report.ubicacion || 'N/A'}</p>
                <p><strong>Descripción:</strong> ${report.descripcion || 'N/A'}</p>
                <hr style="border:none;border-top:1px solid #eee;margin:8px 0;">
                <p><strong>Reportado por:</strong> ${report.reportado_por || 'Anónimo'}</p>
                ${report.usuario_email ? `<p><strong>Correo:</strong> <a href="mailto:${report.usuario_email}">${report.usuario_email}</a></p>` : ''}
                ${report.telefono_contacto && report.telefono_contacto !== 'No indicado'
                ? `<p><strong>Teléfono:</strong> ${report.telefono_contacto}</p>` : ''}
                <hr style="border:none;border-top:1px solid #eee;margin:8px 0;">
                <p><strong>Prioridad:</strong> ${cap(report.prioridad)}</p>
                <p><strong>Fecha:</strong> ${report.fecha || '—'}</p>
                <p><strong>Estado:</strong> ${cap(report.estado)}</p>
            </div>`,
        icon: 'info',
        confirmButtonText: 'Cerrar'
    });
}

// ─── Sincronizar estilos de botones de filtro ─────────────────
function syncFilterButtons() {
    document.querySelectorAll('[data-filter-tipo]').forEach(btn => {
        const v = btn.getAttribute('data-filter-tipo');
        btn.className = v === filterTipo ? 'btn btn-primary' : 'btn btn-secondary';
        btn.style.cssText = 'padding:5px 15px;font-size:.9em;';
    });
    document.querySelectorAll('[data-filter-estado]').forEach(btn => {
        const v = btn.getAttribute('data-filter-estado');
        btn.className = v === filterEstado ? 'btn btn-primary' : 'btn btn-secondary';
        btn.style.cssText = 'padding:5px 15px;font-size:.9em;';
    });
}

// ─── Exportar CSV ─────────────────────────────────────────────
async function exportCSV() {
    try {
        const res = await fetch(`${API_URL}/reportes`);
        const data = await res.json();
        const headers = ['ID', 'Tipo', 'Ubicación', 'Reportado Por', 'Fecha', 'Estado', 'Prioridad'];
        const rows = data.map(r => [r.id, r.tipo, r.ubicacion, r.reportado_por, r.fecha, r.estado, r.prioridad]);
        const csv = [headers, ...rows].map(r => r.map(v => `"${String(v || '').replace(/"/g, '""')}"`).join(',')).join('\n');
        const a = Object.assign(document.createElement('a'), {
            href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })),
            download: 'reportes.csv'
        });
        a.click();
        URL.revokeObjectURL(a.href);
    } catch (e) {
        Swal.fire('Error', 'No se pudo exportar.', 'error');
    }
}

// ─── Init ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    loadReports();

    // Filtros por tipo
    document.querySelectorAll('[data-filter-tipo]').forEach(btn => {
        btn.addEventListener('click', () => {
            filterTipo = btn.getAttribute('data-filter-tipo');
            loadReports();
        });
    });

    // Filtros por estado
    document.querySelectorAll('[data-filter-estado]').forEach(btn => {
        btn.addEventListener('click', () => {
            filterEstado = btn.getAttribute('data-filter-estado');
            loadReports();
        });
    });

    // Exportar
    document.querySelectorAll('button').forEach(btn => {
        if (btn.textContent.includes('Exportar')) btn.addEventListener('click', exportCSV);
    });
});
