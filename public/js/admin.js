// Navigation functionality
    function showSection(sectionName) {
        // Hide all sections
        const sections = document.querySelectorAll('.content-page');
        sections.forEach(section => {
            section.style.display = 'none';
        });

        // Show selected section
        const targetSection = document.getElementById(sectionName + '-section');
        if (targetSection) {
            targetSection.style.display = 'block';
        }

        // Update active menu item
        const menuLinks = document.querySelectorAll('.menu-link');
        menuLinks.forEach(link => {
            link.classList.remove('active');
        });

        // Find and activate the clicked menu item
        const activeLink = document.querySelector(`[onclick="showSection('${sectionName}')"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        // Close sidebar on mobile after selection
        if (window.innerWidth <= 1024) {
            toggleSidebar();
        }
    }

    // Sidebar toggle for mobile
    function toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.toggle('open');
    }

    // Logout functionality with modern alert
    function logout() {
        Swal.fire({
            title: '¿Cerrar sesión?',
            text: "¿Estás seguro de que deseas salir de tu cuenta?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, cerrar sesión',
            cancelButtonText: 'Cancelar',
            backdrop: `
                rgba(0,0,0,0.4)
                url("/images/nyan-cat.gif")
                left top
                no-repeat
            `
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Sesión finalizada',
                    text: 'Cerrando tu sesión...',
                    icon: 'success',
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    willClose: () => {
                        // Here you would redirect to login page
                        window.location.href = 'login';
                    }
                });
            }
        });
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(event) {
        const sidebar = document.getElementById('sidebar');
        const menuToggle = document.querySelector('.menu-toggle');
        
        if (window.innerWidth <= 1024 && 
            !sidebar.contains(event.target) && 
            !menuToggle.contains(event.target) &&
            sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
        }
    });

    // Update time every second (for demo purposes)
    function updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('es-ES');
        const timeElement = document.getElementById('current-time');
        if (timeElement) {
            timeElement.textContent = timeString;
        }
    }

    // Notification example
    function showNotification() {
        const notification = document.createElement('div');
        notification.className = 'modern-notification';
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas fa-bell"></i>
            </div>
            <div class="notification-content">
                <div class="notification-title">Nueva actualización</div>
                <div class="notification-message">Tu sistema se ha actualizado a la versión 2.3</div>
            </div>
            <div class="notification-close">
                <i class="fas fa-times"></i>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
        
        // Close on click
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        });
    }

    // Initialize dashboard
    document.addEventListener('DOMContentLoaded', function() {
        showSection('dashboard');
        updateTime();
        setInterval(updateTime, 1000);
        
        // Show welcome message
        setTimeout(() => {
            Swal.fire({
                title: '¡Bienvenido de nuevo!',
                text: 'Has iniciado sesión correctamente en tu panel de control.',
                icon: 'success',
                confirmButtonText: 'Comenzar',
                timer: 3000,
                timerProgressBar: true,
                toast: true,
                position: 'top-end',
                showConfirmButton: false
            });
        }, 1000);
    });