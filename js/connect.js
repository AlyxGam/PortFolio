document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const messageDiv = document.getElementById('message');

    // Identifiants
    const VALID_USERNAME = "RAlyx24";
    const VALID_PASSWORD = "PortF24RA*-";

    // Vérifier si déjà connecté
    if (sessionStorage.getItem('isLoggedIn') === 'true') {
        window.location.href = '/';
        return;
    }

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        messageDiv.textContent = '';
        messageDiv.className = 'alert mt-3';

        if (username === VALID_USERNAME && password === VALID_PASSWORD) {
            showMessage("Connexion réussie !", 'success');
            sessionStorage.setItem('isLoggedIn', 'true');
            setTimeout(() => {
                window.location.href = '/';
            }, 1000);
        } else {
            showMessage("Identifiants incorrects", 'danger');
        }
    });

    function showMessage(message, type) {
        messageDiv.textContent = message;
        messageDiv.className = `alert alert-${type} mt-3`;
    }
});