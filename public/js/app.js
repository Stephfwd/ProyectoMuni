import { getUsuarios, postUsuarios, putUsuarios, postReporte, deleteUsuarios } from './services/api.js';

// DOM Content Loaded Handler
document.addEventListener('DOMContentLoaded', async () => {

    // 1. Report Form Handling
    const reportForm = document.getElementById('reportForm');
    if (reportForm) {
        reportForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const tipo = document.getElementById('tipo').value;
            const ubicacion = document.getElementById('ubicacion').value;
            const descripcion = document.getElementById('descripcion').value;
            const reportado_por = document.getElementById('reportado_por').value;
            const prioridad = document.getElementById('prioridad').value;

            const newReport = {
                tipo,
                ubicacion,
                descripcion,
                reportado_por,
                prioridad,
                fecha: new Date().toLocaleDateString(),
                status: 'pending'
            };

            try {
                await postReporte(newReport);
                alert("¡Reporte registrado correctamente en la base de datos!");
                window.location.href = 'reports.html';
            } catch (error) {
                alert("Error al registrar el reporte.");
            }
        });
    }

    // 2. User Form Handling
    const userForm = document.getElementById('userForm');
    if (userForm) {
        userForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nombre = document.getElementById('nombre').value;
            const email = document.getElementById('email').value;
            const telefono = document.getElementById('telefono').value;
            const rol = document.getElementById('rol').value;
            const password = document.getElementById('password').value;
            const estado = document.getElementById('estado').value;

            const newUser = {
                nombre,
                email,
                telefono,
                rol,
                password,
                estado
            };

            try {
                await postUsuarios(newUser);
                alert("¡Usuario registrado correctamente en la base de datos!");
                window.location.href = 'users.html';
            } catch (error) {
                alert("Error al registrar el usuario. Verifique la consola.");
            }
        });
    }

    // 3. User List Population (users.html)
    const usersTableBody = document.getElementById('usersTableBody');
    if (usersTableBody) {
        const loadUsers = async () => {
            const usuarios = await getUsuarios();
            if (usuarios && usuarios.length > 0) {
                usersTableBody.innerHTML = '';
                usuarios.forEach(usuario => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${usuario.id || 'N/A'}</td>
                        <td>${usuario.nombre || 'N/A'}</td>
                        <td>${usuario.email || 'N/A'}</td>
                        <td>${usuario.rol || 'N/A'}</td>
                        <td><span class="status active">Activo</span></td>
                        <td>
                            <button class="btn-icon edit-btn" data-id="${usuario.id}" style="color: #3498db;"><i class="fas fa-edit"></i></button>
                            <button class="btn-icon delete-btn" data-id="${usuario.id}" style="color: #e74c3c;"><i class="fas fa-trash-alt"></i></button>
                        </td>
                    `;
                    usersTableBody.appendChild(row);
                });

                // Add event listeners for delete buttons
                document.querySelectorAll('.delete-btn').forEach(btn => {
                    btn.addEventListener('click', async (e) => {
                        const id = e.currentTarget.dataset.id;

                        // Admin Check
                        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
                        if (!currentUser || (currentUser.rol !== 'admin' && currentUser.rol !== 'administrador')) {
                            alert("Acceso denegado: Solo administradores pueden eliminar usuarios.");
                            return;
                        }

                        if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
                            try {
                                await deleteUsuarios(id);
                                alert('Usuario eliminado correctamente.');
                                loadUsers(); // Reload table
                            } catch (error) {
                                alert('Error al eliminar usuario.');
                            }
                        }
                    });
                });
            }
        };
        loadUsers();
    }
});
