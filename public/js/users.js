document.addEventListener('DOMContentLoaded', () => {
    loadUsers();

    // Búsqueda
    const searchInput = document.querySelector('input[placeholder="Buscar usuario..."]');
    const searchBtn = document.querySelector('button.btn-secondary:has(i.fa-search)');

    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', () => filterUsers(searchInput.value));
        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') filterUsers(searchInput.value);
        });
    }
});

function loadUsers() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    renderUsers(users);
}

function renderUsers(users) {
    const tbody = document.querySelector('.activity-table tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No hay usuarios registrados.</td></tr>';
        return;
    }

    users.forEach(user => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>#USR-${user.id}</td>
            <td>${user.nombre}</td>
            <td>${user.email}</td>
            <td>${user.rol}</td>
            <td><span class="status ${user.estado.toLowerCase()}">${user.estado}</span></td>
            <td>
                <button class="btn-icon" style="color: #3498db;" onclick="editUser('${user.id}')"><i class="fas fa-edit"></i></button>
                <button class="btn-icon" style="color: #e74c3c;" onclick="deleteUser('${user.id}')"><i class="fas fa-trash-alt"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function filterUsers(query) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const filtered = users.filter(user =>
        user.nombre.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase()) ||
        user.rol.toLowerCase().includes(query.toLowerCase())
    );
    renderUsers(filtered);
}

function deleteUser(id) {
    Swal.fire({
        title: '¿Está seguro?',
        text: "Esta acción no se puede deshacer",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e74c3c',
        cancelButtonColor: '#3498db',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            let users = JSON.parse(localStorage.getItem('users')) || [];
            users = users.filter(user => user.id !== id);
            localStorage.setItem('users', JSON.stringify(users));
            loadUsers();

            Swal.fire(
                '¡Eliminado!',
                'El usuario ha sido eliminado correctamente.',
                'success'
            );
        }
    });
}

function editUser(id) {
    window.location.href = `user_form.html?id=${id}`;
}
