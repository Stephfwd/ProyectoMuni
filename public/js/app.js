// Constantes para LocalStorage
const STORAGE_KEYS = {
    USERS: 'muni_users_live',
    REPORTS: 'muni_reports_live',
    APPOINTMENTS: 'muni_appointments_live'
};

// Estado de Filtros
let currentReportFilter = 'all';
let currentAppointmentFilter = 'today';


// Inicializar datos desde db.json
async function initStorage() {
    // Check if we already have data to avoid overwriting user changes in this session
    // For this demo, we can opt to always refresh from DB or only if empty. 
    // Let's try to load from DB and fill if empty.

    try {
        const response = await fetch('../data/db.json');
        if (!response.ok) throw new Error('Failed to load db.json');

        const dbData = await response.json();

        // Load Users
        if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
            localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(dbData.users));
        }

        // Load Reports
        if (!localStorage.getItem(STORAGE_KEYS.REPORTS)) {
            localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(dbData.reports));
        }

        // Load Appointments
        if (!localStorage.getItem(STORAGE_KEYS.APPOINTMENTS)) {
            localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(dbData.appointments));
        }

        // Trigger render after data load
        const path = window.location.pathname;
        if (path.includes('dashadmin.html')) renderDashboardStats();
        if (path.includes('reports.html')) renderReportsTable();
        if (path.includes('users.html')) renderUsersTable();
        if (path.includes('appointments.html')) renderAppointmentsTable();
        // We can add others if needed, but dashboard is the main one needing immediate stats

    } catch (error) {
        console.error('Error loading initial data:', error);
        // Fallback to empty arrays if DB load fails
        if (!localStorage.getItem(STORAGE_KEYS.USERS)) localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([]));
        if (!localStorage.getItem(STORAGE_KEYS.REPORTS)) localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify([]));
        if (!localStorage.getItem(STORAGE_KEYS.APPOINTMENTS)) localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify([]));
    }
}

// Funciones Helper de Storage
const getStoredData = (key) => JSON.parse(localStorage.getItem(key)) || [];
const setStoredData = (key, data) => localStorage.setItem(key, JSON.stringify(data));
const generateId = (prefix) => `${prefix}-${Math.floor(Math.random() * 9000) + 1000}`;

// --- Manejadores de Formularios ---

function handleLogin(event) {
    event.preventDefault();
    alert("¡Inicio de sesión exitoso!");
    window.location.href = 'dashadmin.html';
}

function handleRegister(event) {
    event.preventDefault();
    alert("¡Registro completado con éxito! Por favor inicie sesión.");
    window.location.href = 'login.html';
}

function handleReport(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newReport = {
        id: generateId('REP'),
        tipo: formData.get('tipo'),
        ubicacion: formData.get('ubicacion'),
        descripcion: formData.get('descripcion'),
        reportado_por: formData.get('reportado_por'),
        prioridad: formData.get('prioridad'),
        fecha: new Date().toISOString().split('T')[0],
        estado: 'pendiente'
    };

    const reports = getStoredData(STORAGE_KEYS.REPORTS);
    reports.unshift(newReport); // Agregar al inicio
    setStoredData(STORAGE_KEYS.REPORTS, reports);

    alert("¡Reporte registrado correctamente!");
    window.location.href = 'reports.html';
}

function handleUser(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newUser = {
        id: generateId('USR'),
        nombre: formData.get('nombre'),
        email: formData.get('email'),
        telefono: formData.get('telefono'),
        rol: formData.get('rol'),
        estado: formData.get('estado')
    };

    const users = getStoredData(STORAGE_KEYS.USERS);
    users.unshift(newUser);
    setStoredData(STORAGE_KEYS.USERS, users);

    alert("¡Usuario registrado correctamente!");
    window.location.href = 'users.html';
}

function handleAppointment(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newAppointment = {
        id: generateId('CIT'),
        ciudadano: formData.get('ciudadano'),
        tramite: formData.get('tramite'),
        departamento: formData.get('departamento'),
        fecha: formData.get('fecha'),
        hora: formData.get('hora'),
        estado: 'pendiente'
    };

    const appointments = getStoredData(STORAGE_KEYS.APPOINTMENTS);
    appointments.unshift(newAppointment);
    setStoredData(STORAGE_KEYS.APPOINTMENTS, appointments);

    alert("¡Cita agendada correctamente!");
    window.location.href = 'appointments.html';
}

// --- Funciones de Renderizado ---

function renderDashboardStats() {
    // Add small delay or check to ensure storage is populated if called immediately
    // Since initStorage is async, this might run before data is ready if not careful.
    // However, initStorage calls this function after fetching. 
    // We also keep the DOMContentLoaded listener.

    const users = getStoredData(STORAGE_KEYS.USERS);
    const reports = getStoredData(STORAGE_KEYS.REPORTS);
    const appointments = getStoredData(STORAGE_KEYS.APPOINTMENTS);

    // Actualizar contadores
    const userCountEl = document.getElementById('total-users-count');
    if (userCountEl) userCountEl.textContent = users.length;

    const reportCountEl = document.getElementById('active-reports-count');
    if (reportCountEl) reportCountEl.textContent = reports.filter(r => r.estado !== 'cerrado').length;

    const appointmentCountEl = document.getElementById('today-appointments-count');
    if (appointmentCountEl) {
        // For demo purposes, let's match the date in db.json for "today" or just count all pending
        // Or strictly match today's date.
        // Let's assume "2026-02-17" is today for the demo based on db.json data, 
        // OR we can just show "Pending Appointments" count if dates are stale.
        // Let's Stick to "Today" logic but be aware db.json has hardcoded dates.

        // Update: To make it look good for the user instantly, let's count appointments matching "2026-02-17"
        // since that's what I put in db.json. 
        // In a real app, `new Date().toISOString().split('T')[0]` is correct.
        const today = new Date().toISOString().split('T')[0];

        // Check if we have any for "today", if 0, maybe show all pending for better UX in a demo?
        // Let's stick to strict date for accuracy requested.
        const count = appointments.filter(a => a.fecha === today).length;

        // Fallback: If 0, and we have data, maybe showing 2 (from db.json hardcoded date) is better for the demo?
        // The user wants "guiadas por los datos del db.json". 
        // db.json has "2026-02-17". If today IS NOT 2026-02-17, it will show 0.
        // I will use strict logic.
        appointmentCountEl.textContent = count;

        // If we want to force show the demo data count regardless of actual day:
        // appointmentCountEl.textContent = appointments.filter(a => a.fecha === '2026-02-17').length; 
    }

    // Actualizar Eficiencia (Reportes Cerrados / Total Reportes)
    const efficiencyEl = document.getElementById('dashboard-efficiency');
    if (efficiencyEl) {
        let efficiency = 0;
        if (reports.length > 0) {
            const closedReports = reports.filter(r => r.estado === 'cerrado' || r.estado === 'completado').length;
            efficiency = Math.round((closedReports / reports.length) * 100);
        }
        efficiencyEl.textContent = `${efficiency}%`;
    }

    // Actualizar Fecha del Dashboard
    const dateEl = document.getElementById('dashboard-date');
    if (dateEl) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const todayStr = new Date().toLocaleDateString('es-ES', options);
        // Capitalize first letter
        dateEl.textContent = todayStr.charAt(0).toUpperCase() + todayStr.slice(1);
    }

    // Actualizar tabla de actividad reciente (mezclando reportes y citas recientes)
    const recentActivityTable = document.getElementById('recent-activity-body');
    if (recentActivityTable) {
        recentActivityTable.innerHTML = '';
        // Combinamos reportes y citas para mostrar actividad, o solo reportes por simplicidad si se prefiere
        // Vamos a mostrar los reportes más recientes
        reports.slice(0, 5).forEach(report => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${report.id}</td>
                <td>${report.reportado_por}</td>
                <td>${report.tipo}</td>
                <td>${report.fecha}</td>
                <td><span class="status ${getStatusClass(report.estado)}">${capitalize(report.estado)}</span></td>
                <td><a href="reports.html" class="btn btn-secondary" style="padding: 2px 8px; font-size: 0.8em;">Ver</a></td>
            `;
            recentActivityTable.appendChild(row);
        });
    }
}

function renderUsersTable() {
    const tableBody = document.getElementById('users-table-body');
    if (!tableBody) return;

    const users = getStoredData(STORAGE_KEYS.USERS);
    tableBody.innerHTML = '';

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.nombre}</td>
            <td>${user.email}</td>
            <td>${capitalize(user.rol)}</td>
            <td><span class="status ${user.estado === 'activo' ? 'active' : 'closed'}">${capitalize(user.estado)}</span></td>
            <td>
                <button class="btn-icon" style="color: #3498db;"><i class="fas fa-edit"></i></button>
                <button class="btn-icon" style="color: #e74c3c;"><i class="fas fa-trash-alt"></i></button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function renderReportsTable() {
    const tableBody = document.getElementById('reports-table-body');
    // We update stats even if table body is not found, just in case, but usually they go together in reports.html

    const reports = getStoredData(STORAGE_KEYS.REPORTS);

    // Initial Stats Calculation (using all reports)
    // --- Update Reports Page Stats ---
    const newTodayEl = document.getElementById('reports-new-today');

    const resolvedEl = document.getElementById('reports-resolved');
    const highPriorityEl = document.getElementById('reports-high-priority');

    if (newTodayEl || resolvedEl || highPriorityEl) {
        const today = new Date().toISOString().split('T')[0];

        if (newTodayEl) {
            const count = reports.filter(r => r.fecha === today).length;
            newTodayEl.textContent = count;
        }

        if (resolvedEl) {
            const count = reports.filter(r => ['resuelto', 'cerrado', 'completado'].includes(r.estado)).length;
            resolvedEl.textContent = count;
        }

        if (highPriorityEl) {
            const count = reports.filter(r => r.prioridad === 'alta').length;
            highPriorityEl.textContent = count;
        }
    }

    if (!tableBody) return;

    tableBody.innerHTML = '';

    // Filter reports for table
    const filteredReports = reports.filter(report => {
        if (currentReportFilter === 'all') return true;
        return report.tipo.toLowerCase() === currentReportFilter.toLowerCase();
    });

    updateFilterButtons('report-filters', currentReportFilter);

    filteredReports.forEach(report => {
        const row = document.createElement('tr');

        // Create action buttons based on current status
        let actionButtons = '';
        if (report.estado === 'pendiente' || report.estado === 'en proceso') {
            actionButtons = `
                <button class="btn-icon" onclick="updateReportStatus('${report.id}', 'cerrado')" title="Marcar como resuelto" style="color: #10b981;">
                    <i class="fas fa-check-circle"></i>
                </button>
                <button class="btn-icon" onclick="viewReportDetails('${report.id}')" title="Ver detalles" style="color: #3b82f6;">
                    <i class="fas fa-eye"></i>
                </button>
            `;
        } else {
            actionButtons = `
                <button class="btn-icon" onclick="updateReportStatus('${report.id}', 'pendiente')" title="Reabrir" style="color: #f59e0b;">
                    <i class="fas fa-redo"></i>
                </button>
                <button class="btn-icon" onclick="viewReportDetails('${report.id}')" title="Ver detalles" style="color: #3b82f6;">
                    <i class="fas fa-eye"></i>
                </button>
            `;
        }

        row.innerHTML = `
            <td>${report.id}</td>
            <td>${capitalize(report.tipo)}</td>
            <td>${report.ubicacion}</td>
            <td>${report.reportado_por}</td>
            <td>${report.fecha}</td>
            <td><span class="status ${getStatusClass(report.estado)}">${capitalize(report.estado)}</span></td>
            <td style="display: flex; gap: 0.5rem;">${actionButtons}</td>
        `;
        tableBody.appendChild(row);
    });
}

function renderUsersTable() {
    const tableBody = document.getElementById('users-table-body');

    const users = getStoredData(STORAGE_KEYS.USERS);

    // --- Update Users Page Stats ---
    const totalEl = document.getElementById('users-total');
    const newTodayEl = document.getElementById('users-new-today');
    const pendingEl = document.getElementById('users-pending');

    if (totalEl || newTodayEl || pendingEl) {
        const today = new Date().toISOString().split('T')[0];

        if (totalEl) {
            totalEl.textContent = users.length;
        }

        if (newTodayEl) {
            const count = users.filter(u => u.fecha_registro === today).length;
            newTodayEl.textContent = count;
        }

        if (pendingEl) {
            const count = users.filter(u => u.estado === 'pendiente').length;
            pendingEl.textContent = count;
        }
    }

    if (!tableBody) return;

    tableBody.innerHTML = '';

    users.forEach(user => {
        const row = document.createElement('tr');

        // Create action buttons based on current status
        let actionButtons = '';
        if (user.estado === 'activo') {
            actionButtons = `
                <button class="btn-icon" onclick="updateUserStatus('${user.id}', 'inactivo')" title="Desactivar" style="color: #ef4444;">
                    <i class="fas fa-ban"></i>
                </button>
                <button class="btn-icon" onclick="viewUserDetails('${user.id}')" title="Ver detalles" style="color: #3b82f6;">
                    <i class="fas fa-eye"></i>
                </button>
            `;
        } else if (user.estado === 'pendiente') {
            actionButtons = `
                <button class="btn-icon" onclick="updateUserStatus('${user.id}', 'activo')" title="Activar" style="color: #10b981;">
                    <i class="fas fa-check"></i>
                </button>
                <button class="btn-icon" onclick="viewUserDetails('${user.id}')" title="Ver detalles" style="color: #3b82f6;">
                    <i class="fas fa-eye"></i>
                </button>
            `;
        } else {
            actionButtons = `
                <button class="btn-icon" onclick="updateUserStatus('${user.id}', 'activo')" title="Reactivar" style="color: #f59e0b;">
                    <i class="fas fa-redo"></i>
                </button>
                <button class="btn-icon" onclick="viewUserDetails('${user.id}')" title="Ver detalles" style="color: #3b82f6;">
                    <i class="fas fa-eye"></i>
                </button>
            `;
        }

        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.nombre}</td>
            <td>${user.email}</td>
            <td>${capitalize(user.rol)}</td>
            <td><span class="status ${getStatusClass(user.estado)}">${capitalize(user.estado)}</span></td>
            <td style="display: flex; gap: 0.5rem;">${actionButtons}</td>
        `;
        tableBody.appendChild(row);
    });
}

function renderAppointmentsTable() {
    const tableBody = document.getElementById('appointments-table-body');

    const appointments = getStoredData(STORAGE_KEYS.APPOINTMENTS);

    // Initial Stats (using all appointments)
    // --- Update Appointments Page Stats ---

    const todayEl = document.getElementById('appointments-today');
    const weekEl = document.getElementById('appointments-week');
    const cancelledEl = document.getElementById('appointments-cancelled');

    if (todayEl || weekEl || cancelledEl) {
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];

        // Calculate start of week (Sunday)
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        // Calculate end of week (Saturday)
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        if (todayEl) {
            const count = appointments.filter(a => a.fecha === todayStr).length;
            todayEl.textContent = count;
        }

        if (weekEl) {
            const count = appointments.filter(a => {
                const aptDate = new Date(a.fecha);
                return aptDate >= startOfWeek && aptDate <= endOfWeek;
            }).length;
            weekEl.textContent = count;
        }

        if (cancelledEl) {
            const count = appointments.filter(a => a.estado === 'cancelada').length;
            cancelledEl.textContent = count;
        }
    }

    if (!tableBody) return;

    tableBody.innerHTML = '';

    // Filter logic
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    // Calculate start of week (Sunday)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    // Calculate end of week (Saturday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const filteredAppointments = appointments.filter(apt => {
        if (currentAppointmentFilter === 'today') {
            return apt.fecha === todayStr;
        } else if (currentAppointmentFilter === 'tomorrow') {
            return apt.fecha === tomorrowStr;
        } else if (currentAppointmentFilter === 'week') {
            const aptDate = new Date(apt.fecha + 'T00:00:00'); // Ensure time is not an issue
            return aptDate >= startOfWeek && aptDate <= endOfWeek;
        } else if (currentAppointmentFilter === 'all') {
            return true;
        }
        return true;
    });

    // Update filter buttons UI (if we had a container ID for them like report-filters, but we can target by ID directly)
    // We'll use a specific helper for appointments since they are individual IDs in a div
    ['filter-today', 'filter-tomorrow', 'filter-week'].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            const filterVal = btn.getAttribute('data-filter');
            if (filterVal === currentAppointmentFilter) {
                btn.classList.remove('btn-secondary');
                btn.classList.add('btn-primary');
            } else {
                btn.classList.add('btn-secondary');
                btn.classList.remove('btn-primary');
            }
        }
    });


    filteredAppointments.forEach(apt => {
        const row = document.createElement('tr');

        // Create action buttons based on current status
        let actionButtons = '';
        if (apt.estado === 'pendiente' || apt.estado === 'confirmada') {
            actionButtons = `
                <button class="btn-icon" onclick="updateAppointmentStatus('${apt.id}', 'completada')" title="Completar" style="color: #10b981;">
                    <i class="fas fa-check"></i>
                </button>
                <button class="btn-icon" onclick="updateAppointmentStatus('${apt.id}', 'cancelada')" title="Cancelar" style="color: #ef4444;">
                    <i class="fas fa-times"></i>
                </button>
                <button class="btn-icon" onclick="viewAppointmentDetails('${apt.id}')" title="Ver detalles" style="color: #3b82f6;">
                    <i class="fas fa-eye"></i>
                </button>
            `;
        } else {
            actionButtons = `
                <button class="btn-icon" onclick="viewAppointmentDetails('${apt.id}')" title="Ver detalles" style="color: #3b82f6;">
                    <i class="fas fa-eye"></i>
                </button>
            `;
        }

        row.innerHTML = `
            <td>${apt.hora}</td>
            <td>${apt.ciudadano}</td>
            <td>${apt.tramite}</td>
            <td>${apt.departamento}</td>
            <td><span class="status ${getStatusClass(apt.estado)}">${capitalize(apt.estado)}</span></td>
            <td style="display: flex; gap: 0.5rem;">${actionButtons}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Helpers Visuales
function getStatusClass(status) {
    switch (status) {
        case 'activo': return 'active';
        case 'confirmada': return 'active';
        case 'pendiente': return 'pending';
        case 'cerrado': return 'closed';
        case 'cancelada': return 'closed';
        case 'inactivo': return 'closed';
        default: return 'pending';
    }
}

function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// --- Status Management Functions ---

function updateReportStatus(reportId, newStatus) {
    const reports = getStoredData(STORAGE_KEYS.REPORTS);
    const reportIndex = reports.findIndex(r => r.id === reportId);

    if (reportIndex !== -1) {
        const oldStatus = reports[reportIndex].estado;
        const confirmMsg = newStatus === 'cerrado'
            ? '¿Marcar este reporte como resuelto?'
            : '¿Reabrir este reporte?';

        if (confirm(confirmMsg)) {
            reports[reportIndex].estado = newStatus;
            setStoredData(STORAGE_KEYS.REPORTS, reports);

            // Refresh the view
            renderReportsTable();
            if (document.getElementById('dashboard-efficiency')) {
                renderDashboardStats();
            }

            alert(`Reporte ${reportId} actualizado de "${oldStatus}" a "${newStatus}"`);
        }
    }
}

function viewReportDetails(reportId) {
    const reports = getStoredData(STORAGE_KEYS.REPORTS);
    const report = reports.find(r => r.id === reportId);

    if (report) {
        const details = `
ID: ${report.id}
Tipo: ${capitalize(report.tipo)}
Ubicación: ${report.ubicacion}
Descripción: ${report.descripcion || 'N/A'}
Reportado por: ${report.reportado_por}
Prioridad: ${capitalize(report.prioridad)}
Fecha: ${report.fecha}
Estado: ${capitalize(report.estado)}
        `;
        alert(details);
    }
}

function updateAppointmentStatus(appointmentId, newStatus) {
    const appointments = getStoredData(STORAGE_KEYS.APPOINTMENTS);
    const aptIndex = appointments.findIndex(a => a.id === appointmentId);

    if (aptIndex !== -1) {
        const confirmMsg = newStatus === 'completada'
            ? '¿Marcar esta cita como completada?'
            : '¿Cancelar esta cita?';

        if (confirm(confirmMsg)) {
            appointments[aptIndex].estado = newStatus;
            setStoredData(STORAGE_KEYS.APPOINTMENTS, appointments);

            // Refresh the view
            renderAppointmentsTable();
            if (document.getElementById('dashboard-efficiency')) {
                renderDashboardStats();
            }

            alert(`Cita ${appointmentId} actualizada a "${newStatus}"`);
        }
    }
    alert(details);
}

function updateUserStatus(userId, newStatus) {
    const users = getStoredData(STORAGE_KEYS.USERS);
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex !== -1) {
        const confirmMsg = newStatus === 'activo'
            ? '¿Activar este usuario?'
            : newStatus === 'inactivo'
                ? '¿Desactivar este usuario?'
                : '¿Cambiar estado del usuario?';

        if (confirm(confirmMsg)) {
            users[userIndex].estado = newStatus;
            setStoredData(STORAGE_KEYS.USERS, users);

            // Refresh the view
            renderUsersTable();
            if (document.getElementById('total-users-count')) {
                renderDashboardStats();
            }

            alert(`Usuario ${userId} actualizado a "${newStatus}"`);
        }
    }
}

function viewUserDetails(userId) {
    const users = getStoredData(STORAGE_KEYS.USERS);
    const user = users.find(u => u.id === userId);

    if (user) {
        const details = `
ID: ${user.id}
Nombre: ${user.nombre}
Email: ${user.email}
Rol: ${capitalize(user.rol)}
Estado: ${capitalize(user.estado)}
Fecha de Registro: ${user.fecha_registro || 'N/A'}
        `;
        alert(details);
    }
}

// --- Filter Event Setup ---
function setupFilters() {
    // Reports Logics
    const reportButtons = document.querySelectorAll('.report-filters button');
    reportButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const filter = e.target.getAttribute('data-filter');
            if (filter) {
                currentReportFilter = filter;
                renderReportsTable();
            }
        });
    });

    // Appointments Logic
    const ids = ['filter-today', 'filter-tomorrow', 'filter-week'];
    ids.forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');
                if (filter) {
                    currentAppointmentFilter = filter;
                    renderAppointmentsTable();
                }
            });
        }
    });
}

function updateFilterButtons(containerClass, activeFilter) {
    const buttons = document.querySelectorAll(`.${containerClass} button`);
    buttons.forEach(btn => {
        if (btn.getAttribute('data-filter') === activeFilter) {
            btn.classList.remove('btn-secondary');
            btn.classList.add('btn-primary');
        } else {
            btn.classList.add('btn-secondary');
            btn.classList.remove('btn-primary');
        }
    });
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    initStorage();
    setupFilters();

    const path = window.location.pathname;
    if (path.includes('dashadmin.html')) {
        renderDashboardStats();
    } else if (path.includes('users.html')) {
        renderUsersTable();
    } else if (path.includes('reports.html')) {
        renderReportsTable();
    } else if (path.includes('appointments.html')) {
        renderAppointmentsTable();
    }
});
