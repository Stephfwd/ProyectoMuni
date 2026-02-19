import { postCita } from './services/api.js';

document.getElementById('appointmentForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const ciudadano = document.getElementById('ciudadano').value;
    const categoria = document.getElementById('categoria').value;
    const tramite = document.getElementById('tramite').value;
    const prioridad = document.getElementById('prioridad').value;
    const departamento = document.getElementById('departamento').value;
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;
    const notas = document.getElementById('notas').value;

    const newAppointment = {
        ciudadano,
        categoria,
        tramite,
        prioridad,
        departamento,
        fecha,
        hora,
        notas,
        estado: 'confirmada'
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
