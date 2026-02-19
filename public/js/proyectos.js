import { postProyecto } from './services/api.js';

document.getElementById('proyectoForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const titulo = document.getElementById('titulo').value.trim();
    const tipo = document.getElementById('tipo').value.trim();
    const descripcion = document.getElementById('descripcion').value.trim();
    const contacto = document.getElementById('contacto').value.trim();

    if (!titulo || !tipo || !descripcion || !contacto) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos vacíos',
            text: 'Por favor, complete todos los campos requeridos.'
        });
        return;
    }

    const newProyecto = {
        titulo,
        tipo,
        descripcion,
        contacto,
        fecha: new Date().toISOString().split('T')[0],
        estado: 'pendiente'
    };

    try {
        await postProyecto(newProyecto);
        Swal.fire({
            icon: 'success',
            title: '¡Propuesta Enviada!',
            text: 'Su propuesta de proyecto ha sido registrada correctamente.',
            timer: 3000,
            showConfirmButton: false
        }).then(() => {
            window.location.href = 'index.html';
        });
    } catch (error) {
        console.error("Error:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error de Envío',
            text: 'No se pudo conectar con el servidor.'
        });
    }
});
