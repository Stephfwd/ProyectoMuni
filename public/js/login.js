import { loginUser } from './services/api.js';

document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!email || !password) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos vacíos',
            text: 'Por favor, complete todos los campos y evite usar solo espacios en blanco.'
        });
        return;
    }

    try {
        // Fetch users from the database using imported service
        const users = await loginUser(email, password);

        if (users.length > 0) {
            const user = users[0];

            // Guardar sesión del usuario con el rol
            sessionStorage.setItem('currentUser', JSON.stringify({
                id: user.id,
                fullname: user.nombre || user.fullname,
                email: user.email,
                rol: user.rol
            }));

            Swal.fire({
                icon: 'success',
                title: '¡Bienvenido!',
                text: 'Inicio de sesión exitoso. ¡Hola ' + (user.nombre || user.fullname) + '!',
                timer: 2000,
                showConfirmButton: false
            }).then(() => {
                // Redirigir según el rol: admin va al panel, el resto al index
                if (user.rol === 'admin') {
                    window.location.href = 'dashadmin.html';
                } else {
                    window.location.href = 'index.html';
                }
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Credenciales Incorrectas',
                text: 'Correo electrónico o contraseña incorrectos'
            });
        }
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error de Servidor',
            text: 'No se pudo conectar con el servidor. Verifique su conexión.'
        });
    }
});
