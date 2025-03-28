document.addEventListener('DOMContentLoaded', function () {
    const rssFeeds = [
        { 
            url: 'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://dev.to/feed/tag/vuejs'),
            topic: 'Vue.js 3',
            defaultImage: 'https://vuejs.org/images/logo.png'
        },
        { 
            url: 'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://laravel-news.com/feed'),
            topic: 'Laravel',
            defaultImage: 'https://laravel.com/img/logomark.min.svg'
        },
        { 
            url: 'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://dev.to/feed/tag/artificialintelligence'),
            topic: 'IA en Programmation',
            defaultImage: 'https://dev-to-uploads.s3.amazonaws.com/uploads/articles/6omk5v2kcc8kr5qr5m39.png'
        }
    ];

    const rssContainer = document.getElementById('rss-feed');
    if (!rssContainer) return;

    let html = '<div class="container">';
    
    const fetchPromises = rssFeeds.map(feed =>
        fetch(feed.url)
            .then(response => response.text())
            .then(str => {
                const parser = new DOMParser();
                const xml = parser.parseFromString(str, "text/xml");
                const items = xml.querySelectorAll("item");
                
                html += `
                    <div class="mb-5">
                        <h3 class="text-primary mb-4">${feed.topic}</h3>
                        <div class="row">
                `;
                
                Array.from(items).slice(0, 3).forEach(item => {
                    const title = item.querySelector("title").textContent;
                    const link = item.querySelector("link").textContent;
                    const description = item.querySelector("description").textContent;
                    const date = item.querySelector("pubDate")?.textContent || '';
                    
                    // Extraire l'image de la description si elle existe
                    let imageUrl = feed.defaultImage;
                    const imgMatch = description.match(/<img[^>]+src="([^">]+)"/);
                    if (imgMatch) {
                        imageUrl = imgMatch[1];
                    }

                    const formattedDate = new Date(date).toLocaleDateString('fr-FR');
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
                    <div class="alert alert-danger">
                        Impossible de charger les articles pour ${feed.topic}
                    </div>
                `;
            })
    );

    Promise.all(fetchPromises).then(() => {
        html += '</div>';
        rssContainer.innerHTML = html;
    });
});