function handleReport(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const reportData = {
        id: Date.now().toString().slice(-4),
        tipo: formData.get('tipo'),
        ubicacion: formData.get('ubicacion'),
        descripcion: formData.get('descripcion'),
        reportado_por: formData.get('reportado_por') || 'Anónimo',
        prioridad: formData.get('prioridad'),
        fecha: new Date().toLocaleDateString(),
        estado: 'Pendiente',
        estado_slug: 'pending'
    };

    let reports = JSON.parse(localStorage.getItem('reports')) || [];
    reports.push(reportData);
    localStorage.setItem('reports', JSON.stringify(reports));

    alert('¡Reporte registrado correctamente!');
    window.location.href = 'reports.html';
}
