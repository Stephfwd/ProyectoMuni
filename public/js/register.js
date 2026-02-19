import { postUsuarios, checkEmailAvailability } from './services/api.js';

document.getElementById('registerForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const fullname = document.getElementById('fullname').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirm-password').value.trim();

    if (!fullname || !email || !password || !confirmPassword) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos vacíos',
            text: 'Todos los campos son obligatorios y no pueden contener solo espacios.'
        });
        return;
    }

    // Validación básica
    if (password !== confirmPassword) {
        Swal.fire({
            icon: 'warning',
            title: 'Contraseñas no coinciden',
            text: 'Por favor, asegúrese de que ambas contraseñas sean iguales.'
        });
        return;
    }

    try {
        // Verificar si el usuario ya existe (opcional, pero buena práctica)
        const existingUsers = await checkEmailAvailability(email);

        if (existingUsers.length > 0) {
            Swal.fire({
                icon: 'error',
                title: 'Usuario ya existe',
                text: 'Este correo electrónico ya está registrado en el sistema.'
            });
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

        Swal.fire({
            icon: 'success',
            title: '¡Registro Exitoso!',
            text: 'Su cuenta ha sido creada correctamente.',
            timer: 2000,
            showConfirmButton: false
        }).then(() => {
            window.location.href = 'login.html';
        });

    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error de Registro',
            text: 'Hubo un problema al crear su cuenta. Inténtelo de nuevo más tarde.'
        });
    }
});
