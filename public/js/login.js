document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Obtener usuarios de localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Buscar el usuario
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        // Guardar sesión del usuario (opcional pero recomendado)
        sessionStorage.setItem('currentUser', JSON.stringify({
            fullname: user.fullname,
            email: user.email
        }));

        Swal.fire({
            icon: 'success',
            title: 'Inicio de sesión exitoso',
            text: '¡Bienvenido ' + user.fullname + '!',
            timer: 2000,
            showConfirmButton: false
        }).then(() => {
            window.location.href = 'index.html';
        });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Error de acceso',
            text: 'Correo electrónico o contraseña incorrectos'
        });
    }
});
