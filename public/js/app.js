// Manejo del formulario de Login
function handleLogin(event) {
    event.preventDefault();
    // Aquí iría la lógica de validación o llamada al backend
    // Por ahora, simulamos éxito y redirigimos
    alert("¡Inicio de sesión exitoso!");
    window.location.href = 'dashadmin.html';
}

// Manejo del formulario de Registro
function handleRegister(event) {
    event.preventDefault();
    // Lógica de registro...
    alert("¡Registro completado con éxito! Por favor inicie sesión.");
    window.location.href = 'login.html';
}

// Manejo del formulario de Reportes
function handleReport(event) {
    event.preventDefault();
    // Lógica para guardar reporte...
    alert("¡Reporte registrado correctamente!");
    window.location.href = 'reports.html';
}

// Manejo del formulario de Usuarios
function handleUser(event) {
    event.preventDefault();
    // Lógica para guardar usuario...
    alert("¡Usuario registrado correctamente!");
    window.location.href = 'users.html';
}

// Manejo del formulario de Citas
function handleAppointment(event) {
    event.preventDefault();
    // Lógica para agendar cita...
    alert("¡Cita agendada correctamente!");
    window.location.href = 'appointments.html';
}
