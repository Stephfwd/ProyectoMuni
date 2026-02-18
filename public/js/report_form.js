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

        const newReport = {
            tipo: document.getElementById('tipo').value,
            ubicacion: document.getElementById('ubicacion').value,
            descripcion: document.getElementById('descripcion').value,
            reportado_por: document.getElementById('reportado_por').value,
            prioridad: document.getElementById('prioridad').value,
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

            alert('¡Reporte registrado correctamente!');
            window.location.href = 'reports.html';
        } catch (error) {
            console.error('Error al guardar reporte:', error);
            alert('Error al conectar con el servidor. Verifica que json-server esté corriendo en el puerto 3002.');
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-save"></i> Registrar Reporte';
        }
    });
});
