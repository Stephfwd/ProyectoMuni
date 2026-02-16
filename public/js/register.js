document.getElementById('registerForm').addEventListener('submit', function (e) {
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

    // Obtener usuarios existentes o inicializar lista
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Verificar si el usuario ya existe
    if (users.find(user => user.email === email)) {
        alert('Este correo electrónico ya está registrado');
        return;
    }

    // Crear nuevo usuario
    const newUser = {
        fullname,
        email,
        password // En un entorno real, la contraseña debe ser hasheada
    };

    // Guardar usuario
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    alert('Registro exitoso. Ahora puede iniciar sesión.');
    window.location.href = 'login.html';
});
