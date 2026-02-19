import { postReporte } from './services/api.js';

document.getElementById('servicioForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const servicio = document.getElementById('servicio').value.trim();
    const ubicacion = document.getElementById('ubicacion').value.trim();
    const detalle = document.getElementById('detalle').value.trim();

    if (!servicio || !ubicacion || !detalle) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos vacíos',
            text: 'Por favor, complete todos los campos requeridos.'
        });
        return;
    }

    const newReporte = {
        tipo: servicio,
        ubicacion: ubicacion,
        descripcion: detalle,
        reportado_por: 'Usuario Ciudadano',
        prioridad: 'media',
        fecha: new Date().toISOString().split('T')[0],
        estado: 'pendiente'
    };

    try {
        await postReporte(newReporte);
        Swal.fire({
            icon: 'success',
            title: '¡Solicitud Recibida!',
            text: 'Su reporte de servicio público ha sido registrado.',
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
            text: 'Hubo un error al procesar su solicitud.'
        });
    }
});
