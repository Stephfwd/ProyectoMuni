import { loginUser } from './services/api.js';

document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // Fetch users from the database using imported service
        const users = await loginUser(email, password);

        if (users.length > 0) {
            const user = users[0];

            // Guardar sesión del usuario con el rol
            sessionStorage.setItem('currentUser', JSON.stringify({
                id: user.id,
                fullname: user.nombre || user.fullname, // Handle both naming conventions if present
                email: user.email,
                rol: user.rol // Crucial for admin check
            }));

            alert('Inicio de sesión exitoso. ¡Bienvenido ' + (user.nombre || user.fullname) + '!');
            window.location.href = 'index.html';
        } else {
            alert('Correo electrónico o contraseña incorrectos');
        }
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        alert("Error de conexión con el servidor.");
    }
});
