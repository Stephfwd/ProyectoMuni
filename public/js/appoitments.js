function loadAppointments() {
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    const tableBody = document.getElementById('appointmentsTableBody');
    tableBody.innerHTML = '';

    appointments.forEach(app => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${app.fecha}</td>
            <td>${app.hora}</td>
            <td>${app.ciudadano}</td>
            <td>${app.tramite}</td>
            <td><span class="status ${app.status === 'active' ? 'active' : 'closed'}">${app.status === 'active' ? 'Confirmada' : 'Cancelada'}</span></td>
            <td>
                ${app.status === 'active' ?
                `<button class="btn-icon" style="color: #e74c3c;" onclick="cancelAppointment(${app.id})" title="Cancelar"><i class="fas fa-times"></i></button>` :
                `<i class="fas fa-ban" title="No disponible"></i>`}
                <button class="btn-icon" style="color: #3498db;" onclick="deleteAppointment(${app.id})" title="Eliminar"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

window.cancelAppointment = function (id) {
    let appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    appointments = appointments.map(app => {
        if (app.id === id) app.status = 'cancelled';
        return app;
    });
    localStorage.setItem('appointments', JSON.stringify(appointments));
    loadAppointments();
};

window.deleteAppointment = function (id) {
    if (confirm('¿Está seguro de eliminar esta cita?')) {
        let appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        appointments = appointments.filter(app => app.id !== id);
        localStorage.setItem('appointments', JSON.stringify(appointments));
        loadAppointments();
    }
};

document.addEventListener('DOMContentLoaded', loadAppointments);
