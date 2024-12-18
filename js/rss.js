document.addEventListener('DOMContentLoaded', function() {
    const rssUrl = 'https://rss.app/feeds/_2eUq8N6nfsXzDYV0.xml';
    const rssContainer = document.getElementById('rss-feed');

    fetch(rssUrl)
        .then(response => response.text())
        .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
        .then(data => {
            const items = data.querySelectorAll("item");
            let html = '<div class="row">';
            items.forEach((el, index) => {
                if (index < 6) { // Limite à 6 articles
                    const title = el.querySelector("title").textContent;
                    const link = el.querySelector("link").textContent;
                    const description = el.querySelector("description").textContent;

                    // Créer un élément temporaire pour parser le HTML de la description
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = description;
                    const textDescription = tempDiv.textContent || tempDiv.innerText || "";

                    // Limiter la description à 100 caractères
                    const shortDescription = textDescription.length > 100 ? textDescription.substring(0, 100) + '...' : textDescription;

                    html += `
                        <div class="col-md-4 mb-3">
                            <div class="card h-100">
                                <div class="card-body">
                                    <h5 class="card-title">${title}</h5>
                                    <p class="card-text">${shortDescription}</p>
                                    <a href="${link}" target="_blank" class="btn btn-primary">Lire l'article</a>
                                </div>
                            </div>
                        </div>
                    `;
                }
            });
            html += '</div>';
            rssContainer.innerHTML = html;
        })
        .catch(error => {
            rssContainer.innerHTML = `<p class="text-danger">Erreur lors du chargement du flux RSS : ${error.message}</p>`;
        });
});
