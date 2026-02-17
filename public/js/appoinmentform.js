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
        status: 'active'
    };

    try {
        await postCita(newAppointment);
        alert('¡Cita agendada correctamente en la base de datos!');
        window.location.href = 'appointments.html';

    } catch (error) {
        console.error("Error:", error);
        alert("Error de conexión con el servidor.");
    }
});
