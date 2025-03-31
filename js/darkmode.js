document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.querySelector('.theme-toggle');
    const mainDiv = document.querySelector('div[style*="flex: 1"]');
    const icon = themeToggle.querySelector('i');

    // État initial
    themeToggle.style.background = '#87CEEB';

    // Fonction pour changer les couleurs
    function updateTheme(isDark) {
        themeToggle.style.background = isDark ? '#191970' : '#87CEEB';
        themeToggle.style.transition = 'background-color 0.3s ease';
        
        if (isDark) {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            mainDiv.classList.add('bg-dark');
            mainDiv.classList.add('text-white');
        } else {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            mainDiv.classList.remove('bg-dark');
            mainDiv.classList.remove('text-white');
        }
    }

    // Observer les changements de classe sur mainDiv
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const isDark = mainDiv.classList.contains('bg-dark');
                themeToggle.style.background = isDark ? '#191970' : '#87CEEB';
            }
        });
    });

    observer.observe(mainDiv, { attributes: true });
});
