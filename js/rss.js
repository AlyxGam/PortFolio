document.addEventListener('DOMContentLoaded', function () {
    const rssFeeds = [
        { 
            url: 'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://www.developpez.com/index/rss'),
            topic: 'Vue.js 3',
            defaultImage: 'https://vuejs.org/images/logo.png'
        },
        { 
            url: 'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://laravel-news.com/feed'),
            topic: 'Laravel',
            defaultImage: 'https://laravel.com/img/logomark.min.svg'
        },
        { 
            url: 'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://www.developpez.com/index/rss/vuejs-nuxtjs'),
            topic: 'Nuxt.js',
            defaultImage: 'https://nuxtjs.org/design-kit/colored-logo.svg'
        }
    ];

    const rssContainer = document.getElementById('rss-feed');
    if (!rssContainer) return;

    let html = '<div class="container">';

    function isValidLanguage(text) {
        // Autorise uniquement les caractères latins et ponctuations courantes
        const latinRegex = /^[\p{Script=Latin}\p{P}\p{Z}\p{N}]+$/u;
        // Vérifie si le texte contient au moins 60% de caractères latins
        const latinChars = text.match(/[\p{Script=Latin}]/gu) || [];
        const ratio = latinChars.length / text.length;
        return ratio > 0.6;
    }

    function decodeHtmlEntities(text) {
        const textArea = document.createElement('textarea');
        textArea.innerHTML = text;
        return textArea.value;
    }

    function cleanText(text) {
        try {
            // Remplacer directement les caractères problématiques
            const replacements = {
                'é': 'é',
                'è': 'è',
                'à': 'à',
                'ê': 'ê',
                'û': 'û',
                'ô': 'ô',
                'î': 'î',
                'â': 'â',
                '�': 'é'
            };

            return text.replace(/[éèàêûôîâ�]/g, char => replacements[char] || char);
        } catch (e) {
            return text;
        }
    }

    function extractImageUrl(description, feed) {
        let imageUrl = feed.defaultImage;
        
        // Essayer d'extraire l'image depuis la description
        const imgMatch = description.match(/<img[^>]+src="([^">]+)"/);
        if (imgMatch && imgMatch[1]) {
            imageUrl = imgMatch[1];
            // Vérifier si l'URL est relative
            if (imageUrl.startsWith('/')) {
                imageUrl = 'https://www.developpez.com' + imageUrl;
            }
        }
        return imageUrl;
    }

    const fetchPromises = rssFeeds.map(feed =>
        fetch(feed.url)
            .then(response => response.text())
            .then(str => {
                const parser = new DOMParser();
                const xml = parser.parseFromString(str, "text/xml");
                
                // Détection et sélection des éléments selon le format du flux
                let items;
                let isDevTo = feed.url.includes('dev.to');
                
                if (isDevTo) {
                    items = xml.querySelectorAll('entry'); // Format Atom pour dev.to
                } else {
                    items = xml.querySelectorAll('item'); // Format RSS standard
                }

                html += `
                    <div class="mb-5">
                        <h3 class="text-primary mb-4">${feed.topic}</h3>
                        <div class="row">
                `;

                Array.from(items).slice(0, 3).forEach(item => {
                    let title, link, description, pubDate;

                    if (isDevTo) {
                        title = item.querySelector('title').textContent;
                        link = item.querySelector('link[rel="alternate"]')?.getAttribute('href') || 
                               item.querySelector('id').textContent;
                        description = item.querySelector('summary')?.textContent || 
                                    item.querySelector('content')?.textContent;
                        pubDate = item.querySelector('published').textContent;
                    } else {
                        title = cleanText(item.querySelector('title').textContent);
                        link = item.querySelector('link').textContent;
                        description = cleanText(item.querySelector('description').textContent);
                        pubDate = item.querySelector('pubDate').textContent;
                    }

                    let formattedDate;
                    if (feed.topic === 'IA en Programmation') {
                        // Traitement spécifique pour Le Monde Informatique
                        try {
                            const dateStr = pubDate.split(',')[1].trim();
                            const [day, month, year] = dateStr.split(' ');
                            const date = new Date(`${month} ${day} ${year}`);
                            formattedDate = date.toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            });
                        } catch (e) {
                            console.error('Erreur parsing date IA:', pubDate);
                            formattedDate = pubDate.split(',')[1]?.trim() || 'Date non disponible';
                        }
                    } else {
                        // Traitement standard pour les autres flux
                        try {
                            const date = new Date(pubDate);
                            formattedDate = date.toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            });
                        } catch (e) {
                            formattedDate = 'Date non disponible';
                        }
                    }

                    // Utiliser la nouvelle fonction d'extraction d'image
                    const imageUrl = extractImageUrl(description, feed);

                    const shortDesc = description.replace(/<[^>]*>/g, '').substring(0, 150) + '...';

                    html += `
                        <div class="col-md-4 mb-4">
                            <div class="card h-100 shadow-sm">
                                <img src="${imageUrl}" class="card-img-top" alt="${title}" 
                                     style="height: 200px; object-fit: cover;">
                                <div class="card-body d-flex flex-column">
                                    <h5 class="card-title">${title}</h5>
                                    <p class="card-text">${shortDesc}</p>
                                    <div class="mt-auto">
                                        <div class="d-flex justify-content-between align-items-center">
                                            <small class="text-muted">${formattedDate}</small>
                                            <a href="${link}" target="_blank" class="btn btn-primary">Lire l'article</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                });

                html += '</div></div>';
            })
            .catch(error => {
                console.error(`Erreur pour ${feed.topic}:`, error);
                html += `
                    <div class="mb-5">
                        <h3 class="text-primary mb-4">${feed.topic}</h3>
                        <div class="alert alert-info">
                            Les articles seront bientôt disponibles
                        </div>
                    </div>
                `;
            })
    );

    Promise.all(fetchPromises).then(() => {
        html += '</div>';
        rssContainer.innerHTML = html;
    });
});