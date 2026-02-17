// Manejo del formulario de Login
function handleLogin(event) {
    event.preventDefault();
    // Aquí iría la lógica de validación o llamada al backend
    // Por ahora, simulamos éxito y redirigimos
    Swal.fire({
        icon: 'success',
        title: '¡Inicio de sesión exitoso!',
        timer: 1500,
        showConfirmButton: false
    }).then(() => {
        window.location.href = 'dashadmin.html';
    });
}

// Manejo del formulario de Registro
function handleRegister(event) {
    event.preventDefault();
    // Lógica de registro...
    Swal.fire({
        icon: 'success',
        title: '¡Registro completado!',
        text: 'Por favor inicie sesión.',
        timer: 2000,
        showConfirmButton: false
    }).then(() => {
        window.location.href = 'login.html';
    });
}

// Manejo del formulario de Reportes
function handleReport(event) {
    event.preventDefault();
    // Lógica para guardar reporte...
    Swal.fire({
        icon: 'success',
        title: '¡Reporte registrado!',
        timer: 2000,
        showConfirmButton: false
    }).then(() => {
        window.location.href = 'reports.html';
    });
}

// Manejo del formulario de Usuarios
function handleUser(event) {
    event.preventDefault();
    // Lógica para guardar usuario...
    Swal.fire({
        icon: 'success',
        title: '¡Usuario registrado!',
        timer: 2000,
        showConfirmButton: false
    }).then(() => {
        window.location.href = 'users.html';
    });
}

// Manejo del formulario de Citas
function handleAppointment(event) {
    event.preventDefault();
    // Lógica para agendar cita...
    Swal.fire({
        icon: 'success',
        title: '¡Cita agendada!',
        timer: 2000,
        showConfirmButton: false
    }).then(() => {
        window.location.href = 'appointments.html';
    });
}
