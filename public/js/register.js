import { postUsuarios, checkEmailAvailability } from './services/api.js';

document.getElementById('registerForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const fullname = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Validación básica
    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
    }

    try {
        // Verificar si el usuario ya existe (opcional, pero buena práctica)
        const existingUsers = await checkEmailAvailability(email);

        if (existingUsers.length > 0) {
            alert('Este correo electrónico ya está registrado');
            return;
        }

        // Crear nuevo usuario
        const newUser = {
            nombre: fullname, // Map fullname to nombre to match db convention
            email,
            password, // En un entorno real, la contraseña debe ser hasheada
            rol: 'ciudadano',
            estado: 'activo'
        };

        // Usar la función postUsuarios importada
        await postUsuarios(newUser);
        alert('¡Registro exitoso! Ahora puede iniciar sesión.');
        window.location.href = 'login.html';

    } catch (error) {
        alert("Error al registrar el usuario. Verifique la consola.");
    }
});
