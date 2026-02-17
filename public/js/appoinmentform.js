document.getElementById('appointmentForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const ciudadano = document.getElementById('ciudadano').value;
    const tramite = document.getElementById('tramite').value;
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;
    const notas = document.getElementById('notas').value;

    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];

    const newAppointment = {
        id: Date.now(),
        ciudadano,
        tramite,
        fecha,
        hora,
        notas,
        status: 'active'
    };

    appointments.push(newAppointment);
    localStorage.setItem('appointments', JSON.stringify(appointments));

    Swal.fire({
        icon: 'success',
        title: 'Cita agendada',
        text: 'Su cita ha sido programada con éxito.',
        timer: 2000,
        showConfirmButton: false
    }).then(() => {
        window.location.href = 'appointments.html';
    });
});
