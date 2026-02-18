import { postCita } from './services/api.js';

document.getElementById('appointmentForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const ciudadano = document.getElementById('ciudadano').value;
    const tramite = document.getElementById('tramite').value;
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;
    const notas = document.getElementById('notas').value;

    const newAppointment = {
        ciudadano,
        tramite,
        fecha,
        hora,
        notas,
        estado: 'confirmada' // Coincide con la estructura de db.json
    };

    try {
        await postCita(newAppointment);
        Swal.fire({
            icon: 'success',
            title: '¡Cita Agendada!',
            text: 'La cita se ha guardado correctamente en el servidor.',
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
            text: 'No se pudo guardar la cita en el servidor.'
        });
    }
});
