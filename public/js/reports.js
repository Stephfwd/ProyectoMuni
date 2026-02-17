document.addEventListener('DOMContentLoaded', () => {
    loadReports();

    // Filtros de categoría
    const filterButtons = document.querySelectorAll('.report-filters button');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Cambiar clase activa
            filterButtons.forEach(b => {
                b.classList.remove('btn-primary');
                b.classList.add('btn-secondary');
            });
            btn.classList.remove('btn-secondary');
            btn.classList.add('btn-primary');

            filterReports(btn.textContent);
        });
    });
});

function loadReports() {
    const reports = JSON.parse(localStorage.getItem('reports')) || [];
    renderReports(reports);
}

function renderReports(reports) {
    const tbody = document.querySelector('.activity-table tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (reports.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No hay reportes registrados.</td></tr>';
        return;
    }

    reports.forEach(report => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>#REP-${report.id}</td>
            <td>${report.tipo}</td>
            <td>${report.ubicacion}</td>
            <td>${report.reportado_por}</td>
            <td>${report.fecha}</td>
            <td><span class="status ${report.estado_slug}">${report.estado}</span></td>
            <td><button class="btn btn-secondary" style="padding: 5px 10px;" onclick="viewReport('${report.id}')">Ver</button></td>
        `;
        tbody.appendChild(tr);
    });
}

function filterReports(category) {
    const reports = JSON.parse(localStorage.getItem('reports')) || [];
    if (category === 'Todos') {
        renderReports(reports);
        return;
    }

    const filtered = reports.filter(r => r.tipo.toLowerCase().includes(category.toLowerCase()));
    renderReports(filtered);
}

function viewReport(id) {
    alert('Detalles del reporte #' + id + ' (Funcionalidad en desarrollo)');
}
