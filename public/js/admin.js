/*
*************************************************************\
***** Funciones de la aplicacion en javascript***************\
**************************************************************\ 
 */
function showSection(sectionName) {
    const sections = document.querySelectorAll('.content-page');
    sections.forEach(section => {
        section.style.display = 'none';
    });

    const targetSection = document.getElementById(sectionName + '-section');
    if (targetSection) {
        targetSection.style.display = 'block';
    }

    const menuLinks = document.querySelectorAll('.menu-link');
    menuLinks.forEach(link => {
        link.classList.remove('active');
    });

    const activeLink = document.querySelector(`[onclick="showSection('${sectionName}')"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }

    if (window.innerWidth <= 1024) {
        toggleSidebar();
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('collapsed');
    sidebar.classList.toggle('open');
}

// Verificaion de cerrar sesion
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
                timer: 1500,
                timerProgressBar: true,
                showConfirmButton: false,
                willClose: () => {
                    // Al confirmar, redirigir al inicio de sesión
                    window.location.href = '/login';
                }
            });
        }
    });
}

// Edita usuario
function editarUsuario(cedula) {
    Swal.fire({
        title: 'Editar Usuario',
        text: `Editando usuario con cédula: ${cedula}`,
        icon: 'info'
    });
}

//Funcion para mostrar los datos de un usuario
function verUsuario(cedula) {
    const filas = document.querySelectorAll('tbody tr');
    let usuarioData = null;
    
    filas.forEach(fila => {
    const cedulaFila = fila.querySelector('td:nth-child(1)').textContent;
    if (cedulaFila === cedula) {
        usuarioData = {
        cedula: cedulaFila,
        nombre: fila.querySelector('td:nth-child(2)').textContent,
        email: fila.querySelector('td:nth-child(3)').textContent,
        puesto: fila.querySelector('td:nth-child(4)').textContent,
        faltas: fila.querySelector('td:nth-child(5)').textContent,
        asistencias: fila.querySelector('td:nth-child(6)').textContent,
        Activo: fila.querySelector('td:nth-child(7) .status-badge').textContent.trim() === 'Activo'
        };
    }
    });
    if (!usuarioData) {
    Swal.fire('Error', 'No se encontraron los datos del usuario', 'error');
    return;
    }
    Swal.fire({
    title: `Detalles de - ${usuarioData.nombre}`,
    html: `
        <div style="text-align: left; margin: 10px 0;">
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; width: 30%;">Cédula:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${usuarioData.cedula}</td>
            </tr>
            <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Nombre:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${usuarioData.nombre}</td>
            </tr>
            <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${usuarioData.email}</td>
            </tr>
            <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Puesto:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${usuarioData.puesto}</td>
            </tr>
            <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Faltas:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${usuarioData.faltas}</td>
            </tr>
            <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Asistencias:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${usuarioData.asistencias}</td>
            </tr>
            <tr>
            <td style="padding: 8px; font-weight: bold;">Estado:</td>
            <td style="padding: 8px;">
                <span style="color: ${usuarioData.Activo ? 'green' : 'red'};">
                ${usuarioData.Activo ? 'Activo' : 'Inactivo'}
                </span>
            </td>
            </tr>
        </table>
        </div>
    `,
    iconHtml: '<i class="fas fa-id-card" style="color: #36b9cc; font-size: 120px; line-height: 1;"></i>',
    customClass: {
        icon: 'sin-circulo'
    },
    confirmButtonText: 'Cerrar',
    width: '600px'
    });
}

// Menu toggle lateral
document.addEventListener('click', function(event) {
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.querySelector('.menu-toggle');
    
    if (window.innerWidth <= 1024 && 
        !sidebar.contains(event.target) && 
        !menuToggle.contains(event.target) &&
        (sidebar.classList.contains('open') || sidebar.classList.contains('collapsed'))) {
        sidebar.classList.remove('open');
        sidebar.classList.remove('collapsed');
    }
});

// Inicializar la paguina principal
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