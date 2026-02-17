document.getElementById('registerForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const fullname = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Validación básica
    if (password !== confirmPassword) {
        Swal.fire({
            icon: 'warning',
            title: 'Contraseñas no coinciden',
            text: 'Por favor, verifique que ambas contraseñas sean iguales'
        });
        return;
    }

    // Obtener usuarios existentes o inicializar lista
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Verificar si el usuario ya existe
    if (users.find(user => user.email === email)) {
        Swal.fire({
            icon: 'error',
            title: 'Correo duplicado',
            text: 'Este correo electrónico ya está registrado'
        });
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

    Swal.fire({
        icon: 'success',
        title: 'Registro exitoso',
        text: 'Ahora puede iniciar sesión con su nueva cuenta',
        timer: 3000,
        showConfirmButton: false
    }).then(() => {
        window.location.href = 'login.html';
    });
});
