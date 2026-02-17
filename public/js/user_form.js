document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');

    if (userId) {
        document.querySelector('h1').textContent = 'Editar Usuario';
        document.querySelector('.dashboard-date').textContent = 'Modifica la información del usuario.';
        loadUserData(userId);
    }
});

function loadUserData(id) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.id === id);

    if (user) {
        document.getElementById('nombre').value = user.nombre;
        document.getElementById('email').value = user.email;
        document.getElementById('telefono').value = user.telefono || '';
        document.getElementById('rol').value = user.rol.toLowerCase();
        document.getElementById('estado').value = user.estado.toLowerCase();
        // Password fields are usually not populated for security
    }
}

function handleUser(event) {
    event.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');

    const formData = new FormData(event.target);
    const userData = {
        nombre: formData.get('nombre'),
        email: formData.get('email'),
        telefono: formData.get('telefono'),
        rol: formData.get('rol'),
        estado: formData.get('estado'),
        id: userId || Date.now().toString()
    };

    let users = JSON.parse(localStorage.getItem('users')) || [];

    if (userId) {
        // Actualizar
        const index = users.findIndex(u => u.id === userId);
        if (index !== -1) {
            users[index] = { ...users[index], ...userData };
        }
    } else {
        // Crear
        users.push(userData);
    }

    localStorage.setItem('users', JSON.stringify(users));
    alert(userId ? 'Usuario actualizado correctamente.' : 'Usuario registrado correctamente.');
    window.location.href = 'users.html';
}
