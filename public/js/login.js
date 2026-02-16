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

        alert('Inicio de sesión exitoso. ¡Bienvenido ' + user.fullname + '!');
        window.location.href = 'index.html';
    } else {
        alert('Correo electrónico o contraseña incorrectos');
    }
});
