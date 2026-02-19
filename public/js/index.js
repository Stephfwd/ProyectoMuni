document.addEventListener('DOMContentLoaded', () => {
    // 1. Detección de Sesión
    const userSession = JSON.parse(sessionStorage.getItem('currentUser'));
    const navLinks = document.querySelector('.nav-links');

    if (userSession && navLinks) {
        // Reemplazar botón de Iniciar Sesión por Nombre + Logout
        const loginBtn = navLinks.querySelector('a[href="login.html"]');
        if (loginBtn) {
            loginBtn.remove();
        }

        const userDisplay = document.createElement('div');
        userDisplay.className = 'user-nav-display';
        userDisplay.style.display = 'flex';
        userDisplay.style.alignItems = 'center';
        userDisplay.style.gap = '1rem';
        userDisplay.innerHTML = `
            <span style="font-weight: 500; color: var(--primary-color);">Hola, ${userSession.fullname.split(' ')[0]}</span>
            <button id="logout-btn" class="btn btn-secondary" style="padding: 5px 15px; font-size: 0.85rem;">
                <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
            </button>
        `;
        navLinks.appendChild(userDisplay);

        // Lógica de Cerrar Sesión
        document.getElementById('logout-btn').addEventListener('click', () => {
            sessionStorage.removeItem('currentUser');
            window.location.reload();
        });
    }

    // 2. Efecto de Scroll en Navbar
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    });

    // 3. Menú Móvil
    const hamburger = document.querySelector('.hamburger');
    const navLinksContainer = document.querySelector('.nav-links');
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // 4. Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
                // Cerrar menú móvil si está abierto
                if (navLinksContainer.classList.contains('active')) {
                    navLinksContainer.classList.remove('active');
                    hamburger.classList.remove('active');
                }
            }
        });
    });

    // 5. Animaciones de Revelado (Intersection Observer)
    const revealElements = document.querySelectorAll('.card, .large-card, .news-item, .section-title');
    const observerOptions = {
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });

    // Añadir clase revealed por CSS dinámico si no existe
    const style = document.createElement('style');
    style.innerHTML = `
        .revealed {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        .navbar-scrolled {
            background: rgba(255, 255, 255, 0.98) !important;
            padding: 0.5rem 0 !important;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1) !important;
        }
        @media (max-width: 768px) {
            .nav-links.active {
                display: flex !important;
                flex-direction: column;
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: white;
                padding: 1rem;
                box-shadow: 0 5px 10px rgba(0,0,0,0.1);
            }
        }
    `;
    document.head.appendChild(style);
});
