// reports.js - Loads and displays reports from json-server
const API_URL = "http://localhost:3002";

let currentFilter = 'all';

async function loadReports() {
    const tableBody = document.getElementById('reports-table-body');
    if (!tableBody) return;

    try {
        const response = await fetch(`${API_URL}/reportes`);
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        const reports = await response.json();

        // Update stats
        const today = new Date().toISOString().split('T')[0];
        const newTodayEl = document.getElementById('reports-new-today');
        const resolvedEl = document.getElementById('reports-resolved');
        const highPriorityEl = document.getElementById('reports-high-priority');

        if (newTodayEl) newTodayEl.textContent = reports.filter(r => r.fecha === today).length;
        if (resolvedEl) resolvedEl.textContent = reports.filter(r => ['resuelto', 'cerrado', 'completado'].includes(r.estado)).length;
        if (highPriorityEl) highPriorityEl.textContent = reports.filter(r => r.prioridad === 'alta' || r.prioridad === 'critica').length;

        // Filter
        const filtered = reports.filter(r => {
            if (currentFilter === 'all') return true;
            return r.tipo && r.tipo.toLowerCase() === currentFilter.toLowerCase();
        });

        // Render table
        tableBody.innerHTML = '';
        if (filtered.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding: 2rem; color: #888;">No hay reportes para mostrar.</td></tr>';
            return;
        }

        filtered.forEach(report => {
            const row = document.createElement('tr');
            let actionButtons = '';
            if (report.estado === 'pendiente' || report.estado === 'en proceso') {
                actionButtons = `
                    <button class="btn-icon" onclick="updateStatus('${report.id}', 'cerrado')" title="Marcar como resuelto" style="color: #10b981;">
                        <i class="fas fa-check-circle"></i>
                    </button>
                    <button class="btn-icon" onclick="viewDetails(${JSON.stringify(report).replace(/"/g, '&quot;')})" title="Ver detalles" style="color: #3b82f6;">
                        <i class="fas fa-eye"></i>
                    </button>
                `;
            } else {
                actionButtons = `
                    <button class="btn-icon" onclick="updateStatus('${report.id}', 'pendiente')" title="Reabrir" style="color: #f59e0b;">
                        <i class="fas fa-redo"></i>
                    </button>
                    <button class="btn-icon" onclick="viewDetails(${JSON.stringify(report).replace(/"/g, '&quot;')})" title="Ver detalles" style="color: #3b82f6;">
                        <i class="fas fa-eye"></i>
                    </button>
                `;
            }

            const statusClass = { pendiente: 'pending', cerrado: 'closed', resuelto: 'active', completado: 'active' }[report.estado] || 'pending';
            row.innerHTML = `
                <td>${report.id}</td>
                <td>${capitalize(report.tipo)}</td>
                <td>${report.ubicacion}</td>
                <td>${report.reportado_por || 'N/A'}</td>
                <td>${report.fecha}</td>
                <td><span class="status ${statusClass}">${capitalize(report.estado)}</span></td>
                <td style="display: flex; gap: 0.5rem;">${actionButtons}</td>
            `;
            tableBody.appendChild(row);
        });

        // Update filter buttons
        document.querySelectorAll('.report-filters button').forEach(btn => {
            const f = btn.getAttribute('data-filter');
            if (f === currentFilter) {
                btn.classList.add('btn-primary'); btn.classList.remove('btn-secondary');
            } else {
                btn.classList.add('btn-secondary'); btn.classList.remove('btn-primary');
            }
        });

    } catch (error) {
        console.error('Error cargando reportes:', error);
        if (tableBody) tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding: 2rem; color: #e74c3c;">Error al cargar datos. Verifica que json-server esté corriendo.</td></tr>';
    }
}

async function updateStatus(id, newStatus) {
    const msg = newStatus === 'cerrado' ? '¿Marcar este reporte como resuelto?' : '¿Reabrir este reporte?';

    Swal.fire({
        title: '¿Confirmar acción?',
        text: msg,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#10b981',
        cancelButtonColor: '#95a5a6',
        confirmButtonText: 'Sí, proceder',
        cancelButtonText: 'Cancelar'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const response = await fetch(`${API_URL}/reportes/${id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ estado: newStatus })
                });
                if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
                loadReports();
                Swal.fire('¡Éxito!', 'El estado del reporte ha sido actualizado.', 'success');
            } catch (error) {
                console.error('Error actualizando reporte:', error);
                Swal.fire('Error', 'No se pudo actualizar el reporte.', 'error');
            }
        }
    });
}

function viewDetails(report) {
    Swal.fire({
        title: 'Detalles del Reporte',
        html: `
            <div style="text-align: left; line-height: 1.6;">
                <p><strong>ID:</strong> ${report.id}</p>
                <p><strong>Tipo:</strong> ${capitalize(report.tipo)}</p>
                <p><strong>Ubicación:</strong> ${report.ubicacion}</p>
                <p><strong>Descripción:</strong> ${report.descripcion || 'N/A'}</p>
                <p><strong>Reportado por:</strong> ${report.reportado_por || 'N/A'}</p>
                <p><strong>Prioridad:</strong> <span class="priority-${report.prioridad}">${capitalize(report.prioridad)}</span></p>
                <p><strong>Fecha:</strong> ${report.fecha}</p>
                <p><strong>Estado:</strong> ${capitalize(report.estado)}</p>
            </div>
        `,
        icon: 'info',
        confirmButtonText: 'Cerrar'
    });
}

function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Export button
document.addEventListener('DOMContentLoaded', () => {
    loadReports();

    // Filter buttons
    document.querySelectorAll('.report-filters button').forEach(btn => {
        btn.addEventListener('click', () => {
            currentFilter = btn.getAttribute('data-filter') || 'all';
            loadReports();
        });
    });

    // Export button
    const exportBtn = document.querySelector('.btn-secondary[class*="download"], button');
    document.querySelectorAll('button').forEach(btn => {
        if (btn.textContent.includes('Exportar')) {
            btn.addEventListener('click', exportCSV);
        }
    });
});

async function exportCSV() {
    try {
        const response = await fetch(`${API_URL}/reportes`);
        const reports = await response.json();
        const headers = ['ID', 'Tipo', 'Ubicación', 'Reportado Por', 'Fecha', 'Estado', 'Prioridad'];
        const rows = reports.map(r => [r.id, r.tipo, r.ubicacion, r.reportado_por, r.fecha, r.estado, r.prioridad]);
        const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'reportes.csv'; a.click();
        URL.revokeObjectURL(url);
    } catch (e) {
        Swal.fire('Error', 'No se pudo exportar los datos.', 'error');
    }
}
