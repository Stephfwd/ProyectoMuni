const calendarGrid = document.getElementById('calendarGrid');
const calendarTitle = document.getElementById('calendarTitle');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');

let currentDate = new Date();

function renderCalendar() {
    calendarGrid.innerHTML = '';

    // Headers
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    days.forEach(day => {
        const header = document.createElement('div');
        header.className = 'calendar-header-day';
        header.textContent = day;
        calendarGrid.appendChild(header);
    });

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    calendarTitle.textContent = currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

    // Empty days before first day of month
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day';
        calendarGrid.appendChild(emptyDay);
    }

    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];

    // Fill days with numbers and appointments
    for (let day = 1; day <= lastDate; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';

        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        dayElement.innerHTML = `<span class="day-number">${day}</span>`;

        // Filter appointments for this day
        const dayAppointments = appointments.filter(app => app.fecha === dateStr && app.status === 'active');

        dayAppointments.forEach(app => {
            const event = document.createElement('div');
            event.className = 'calendar-event';
            event.textContent = `${app.hora} - ${app.ciudadano}`;
            event.title = `${app.tramite}: ${app.notas || 'Sin notas'}`;
            dayElement.appendChild(event);
        });

        calendarGrid.appendChild(dayElement);
    }
}

prevMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

nextMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

document.addEventListener('DOMContentLoaded', renderCalendar);
