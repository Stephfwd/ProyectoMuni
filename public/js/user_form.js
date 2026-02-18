// user_form.js - Handles user form submission to json-server
const API_URL = "http://localhost:3002";

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('userForm');
    if (!form) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';

        const newUser = {
            nombre: document.getElementById('nombre').value,
            email: document.getElementById('email').value,
            telefono: document.getElementById('telefono').value,
            rol: document.getElementById('rol').value,
            password: document.getElementById('password').value,
            estado: document.getElementById('estado').value,
            fecha_registro: new Date().toISOString().split('T')[0]
        };

        try {
            // Check if email already exists
            const checkRes = await fetch(`${API_URL}/users?email=${encodeURIComponent(newUser.email)}`);
            const existing = await checkRes.json();
            if (existing.length > 0) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Usuario Duplicado',
                    text: 'Ya existe un usuario con ese correo electrónico.'
                });
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-save"></i> Guardar Usuario';
                return;
            }

            const response = await fetch(`${API_URL}/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser)
            });

            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

            Swal.fire({
                icon: 'success',
                title: '¡Usuario Creado!',
                text: 'El usuario ha sido registrado correctamente.',
                timer: 2000,
                showConfirmButton: false
            }).then(() => {
                window.location.href = 'users.html';
            });
        } catch (error) {
            console.error('Error al guardar usuario:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error de Servidor',
                text: 'Error al conectar con el servidor. Verifica que json-server esté corriendo.'
            });
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-save"></i> Guardar Usuario';
        }
    });
});
