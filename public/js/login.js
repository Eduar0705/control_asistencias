// Toggle password visibility
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.querySelector('.password-toggle');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.textContent = '🙈';
    } else {
        passwordInput.type = 'password';
        toggleBtn.textContent = '👁️';
    }
}

// Validación en tiempo real para el email
document.getElementById('email').addEventListener('input', function(e) {
    const emailInput = e.target;
    // Permite letras (con acentos), números y caracteres especiales de email
    const emailRegex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ._%+-@]*$/;
    
    if (!emailRegex.test(emailInput.value)) {
        // Elimina el último caracter si no es válido
        emailInput.value = emailInput.value.slice(0, -1);
    }
    
    // Validación visual
    if (emailInput.value && !isValidEmail(emailInput.value)) {
        emailInput.style.borderColor = '#ef4444';
    } else if (emailInput.value) {
        emailInput.style.borderColor = '#10b981';
    } else {
        emailInput.style.borderColor = '#e2e8f0';
    }
});

// Función para validar email completo
function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ._%+-]+@[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

// Form submission handler
document.getElementById('loginForm').addEventListener('submit', function(e) {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const emailInput = document.getElementById('email');

    // Basic validation
    if (!email || !password) {
        e.preventDefault();
        Swal.fire({
            icon: 'error',
            title: 'Campos incompletos',
            text: 'Por favor, completa todos los campos.',
            confirmButtonColor: '#3b82f6',
            confirmButtonText: 'Entendido'
        });
        return;
    }

    // Email validation
    if (!isValidEmail(email)) {
        e.preventDefault();
        emailInput.style.borderColor = '#ef4444';
        Swal.fire({
            icon: 'error',
            title: 'Email inválido',
            html: 'Por favor, ingresa un email válido.<br>Ejemplo: usuario@dominio.com',
            confirmButtonColor: '#3b82f6',
            confirmButtonText: 'Entendido'
        });
        return;
    }
});

// Add input validation feedback for all inputs
const inputs = document.querySelectorAll('.form-input');
inputs.forEach(input => {
    // Skip email input as it has custom validation
    if (input.id === 'email') return;
    
    input.addEventListener('blur', function() {
        if (this.value && !this.checkValidity()) {
            this.style.borderColor = '#ef4444';
        } else if (this.value) {
            this.style.borderColor = '#10b981';
        } else {
            this.style.borderColor = '#e2e8f0';
        }
    });
    
    input.addEventListener('input', function() {
        if (this.style.borderColor === 'rgb(239, 68, 68)' && this.checkValidity()) {
            this.style.borderColor = '#e2e8f0';
        }
    });
});