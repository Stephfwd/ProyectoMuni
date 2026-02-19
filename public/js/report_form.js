// report_form.js - Handles report form submission to json-server
const API_URL = "http://localhost:3002";

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('reportForm');
    if (!form) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';

        const tipo = document.getElementById('tipo').value.trim();
        const ubicacion = document.getElementById('ubicacion').value.trim();
        const descripcion = document.getElementById('descripcion').value.trim();
        const reportado_por = document.getElementById('reportado_por').value.trim();
        const prioridad = document.getElementById('prioridad').value.trim();

        if (!tipo || !ubicacion || !descripcion || !reportado_por || !prioridad) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos vacíos',
                text: 'Por favor complete todos los campos y evite usar solo espacios.'
            });
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-save"></i> Registrar Reporte';
            return;
        }

        const newReport = {
            tipo,
            ubicacion,
            descripcion,
            reportado_por,
            prioridad,
            fecha: new Date().toISOString().split('T')[0],
            estado: 'pendiente'
        };

        try {
            const response = await fetch(`${API_URL}/reportes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newReport)
            });

            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

            Swal.fire({
                icon: 'success',
                title: '¡Reporte Enviado!',
                text: 'El reporte ha sido registrado correctamente.',
                timer: 2000,
                showConfirmButton: false
            }).then(() => {
                window.location.href = 'reports.html';
            });
        } catch (error) {
            console.error('Error al guardar reporte:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error de Envío',
                text: 'Error al conectar con el servidor. Verifica que json-server esté corriendo.'
            });
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-save"></i> Registrar Reporte';
        }
    });
});
