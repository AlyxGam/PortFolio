document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const messageDiv = document.getElementById('message');

    // Définition des identifiants (NE PAS FAIRE CECI DANS UN VRAI SYSTÈME)
    const VALID_USERNAME = "Ralyx";
    const VALID_PASSWORD = "RalyxPort";

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Réinitialiser le message
        messageDiv.textContent = '';
        messageDiv.className = 'alert mt-3';

        // Validation simple
        if (username.length < 3) {
            showMessage("Le nom d'utilisateur doit contenir au moins 3 caractères.", 'danger');
            return;
        }

        if (password.length < 6) {
            showMessage("Le mot de passe doit contenir au moins 6 caractères.", 'danger');
            return;
        }

        // Vérification des identifiants
        if (username === VALID_USERNAME && password === VALID_PASSWORD) {
            showMessage("Connexion réussie ! Redirection...", 'success');
            setTimeout(() => {
                window.location.href = './Accueil.html'; // Redirection vers la page d'accueil
            }, 1500);
        } else {
            showMessage("Nom d'utilisateur ou mot de passe incorrect.", 'danger');
        }
    });

    function showMessage(message, type) {
        messageDiv.textContent = message;
        messageDiv.className = `alert alert-${type} mt-3`;
    }
});