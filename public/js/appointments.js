const API_URL = "http://localhost:3002/citas";

async function loadAppointments() {
    try {
        const response = await fetch(API_URL);
        const appointments = await response.json();
        const tableBody = document.getElementById('appointments-table-body');
        if (!tableBody) return;
        tableBody.innerHTML = '';

        if (appointments.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 2rem; color: #888;">No hay citas agendadas.</td></tr>';
            return;
        }

        appointments.forEach(app => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${app.fecha}</td>
                <td>${app.hora}</td>
                <td>${app.ciudadano}</td>
                <td>${app.tramite}</td>
                <td><span class="badge" style="text-transform: capitalize;">${app.categoria || 'otro'}</span></td>
                <td><span class="status ${app.estado === 'confirmada' ? 'active' : 'closed'}">${app.estado === 'confirmada' ? 'Confirmada' : 'Cancelada'}</span></td>
                <td>
                    ${app.estado === 'confirmada' ?
                    `<button class="btn-icon" style="color: #e74c3c;" onclick="cancelAppointment('${app.id}')" title="Cancelar"><i class="fas fa-times"></i></button>` :
                    `<i class="fas fa-ban" title="No disponible"></i>`}
                    <button class="btn-icon" style="color: #3498db;" onclick="deleteAppointment('${app.id}')" title="Eliminar"><i class="fas fa-trash"></i></button>
                    <button class="btn-icon" style="color: #3b82f6;" onclick="viewAppointmentDetails('${app.id}')" title="Ver detalles"><i class="fas fa-eye"></i></button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error al cargar citas:", error);
    }
}

window.cancelAppointment = async function (id) {
    const { isConfirmed } = await Swal.fire({
        title: '¿Cancelar cita?',
        text: "¿Estás seguro de que deseas cancelar esta cita?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e74c3c',
        confirmButtonText: 'Sí, cancelar'
    });

    if (isConfirmed) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ estado: 'cancelada' })
            });
            if (response.ok) {
                loadAppointments();
                Swal.fire('¡Cancelada!', 'La cita ha sido cancelada.', 'success');
            }
        } catch (error) {
            console.error("Error al cancelar cita:", error);
        }
    }
};

window.deleteAppointment = function (id) {
    Swal.fire({
        title: '¿Eliminar cita?',
        text: '¿Deseas eliminar permanentemente esta cita?',
        icon: 'error',
        showCancelButton: true,
        confirmButtonColor: '#e74c3c',
        confirmButtonText: 'Sí, eliminar'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
                if (response.ok) {
                    loadAppointments();
                    Swal.fire('¡Eliminado!', 'La cita ha sido eliminada.', 'success');
                }
            } catch (error) {
                console.error("Error al eliminar cita:", error);
            }
        }
    });
};

window.viewAppointmentDetails = async function (id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const app = await response.json();

        Swal.fire({
            title: 'Detalles de la Cita',
            html: `
                <div style="text-align: left; line-height: 1.6;">
                    <p><strong>Ciudadano:</strong> ${app.ciudadano}</p>
                    <p><strong>Departamento:</strong> ${app.departamento || 'No especificado'}</p>
                    <p><strong>Trámite:</strong> ${app.tramite}</p>
                    <p><strong>Categoría:</strong> <span style="text-transform: capitalize;">${app.categoria || 'Otro'}</span></p>
                    <p><strong>Prioridad:</strong> <span style="color: ${app.prioridad === 'alta' ? 'red' : 'inherit'}; text-transform: capitalize;">${app.prioridad || 'Media'}</span></p>
                    <p><strong>Fecha/Hora:</strong> ${app.fecha} ${app.hora}</p>
                    <p><strong>Notas:</strong> ${app.notas || 'Sin notas'}</p>
                    <p><strong>Estado:</strong> ${app.estado === 'confirmada' ? 'Confirmada' : 'Cancelada'}</p>
                </div>
            `,
            icon: 'info'
        });
    } catch (error) {
        console.error("Error:", error);
    }
};

document.addEventListener('DOMContentLoaded', loadAppointments);
