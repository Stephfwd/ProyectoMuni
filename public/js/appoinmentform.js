import { postCita } from './services/api.js';

document.getElementById('appointmentForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const ciudadano = document.getElementById('ciudadano').value.trim();
    const tramite = document.getElementById('tramite').value.trim();
    const fecha = document.getElementById('fecha').value.trim();
    const hora = document.getElementById('hora').value.trim();
    const notas = document.getElementById('notas').value.trim();

    if (!ciudadano || !tramite || !fecha || !hora || !notas) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos vacíos',
            text: 'Todos los campos son obligatorios y no pueden contener solo espacios.'
        });
        return;
    }

    const newAppointment = {
        ciudadano,
        tramite,
        fecha,
        hora,
        notas,
        status: 'active'
    };

    try {
        await postCita(newAppointment);
        Swal.fire({
            icon: 'success',
            title: '¡Cita Agendada!',
            text: 'La cita se ha guardado correctamente.',
            timer: 2000,
            showConfirmButton: false
        }).then(() => {
            window.location.href = 'appointments.html';
        });

    } catch (error) {
        console.error("Error:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error de Conexión',
            text: 'No se pudo conectar con el servidor.'
        });
    }
});
