document.addEventListener('DOMContentLoaded', () => {
    loadEpisodes();
});

const loadEpisodes = async (page = 1) => {
    const apiUrl = `https://rickandmortyapi.com/api/episode/?page=${page}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        displayEpisodes(data.results);
        setupPagination(data.info, page);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

const displayEpisodes = (episodes) => {
    const episodeList = document.getElementById('episodeList');
    episodeList.innerHTML = ''; 

    episodes.forEach(episode => {
        const episodeDiv = document.createElement('div');
        episodeDiv.className = 'col-md-4 mb-4 episode-card';

        episodeDiv.innerHTML = `
            <div class="card h-100 shadow-lg" onclick="showEpisodeDetails(${episode.id})">
                <div class="card-body">
                    <h5 class="card-title">${episode.name}</h5>
                    <button class="btn btn-primary view-detail" data-id="${episode.id}">Ver detalles</button>
                </div>
            </div>
        `;

        episodeList.appendChild(episodeDiv);
    });

    document.querySelectorAll('.view-detail').forEach(button => {
        button.addEventListener('click', (e) => {
            const episodeId = e.target.dataset.id;
            displayEpisodeDetail(episodeId);
        });
    });
};

function showEpisodeDetails(episodeId) {
    displayEpisodeDetail(episodeId);
}
const displayEpisodeDetail = async (id) => {
    const apiUrl = `https://rickandmortyapi.com/api/episode/${id}`;

    try {
        const response = await fetch(apiUrl);
        const episode = await response.json();

        const modalBody = document.getElementById('episodeDetailBody');
        modalBody.innerHTML = `
            <img src="https://decider.com/wp-content/uploads/2020/05/rick-and-morty-copy.jpg?quality=75&strip=all" alt="Rick and Morty" class="episode-modal-image">
            <div>
                <h4>${episode.name}</h4>
                <p><strong>Fecha de emisión:</strong> ${episode.air_date}</p>
                <p><strong>Código del episodio:</strong> ${episode.episode}</p>
                <p><strong>Personajes:</strong> ${episode.characters.length}</p>
            </div>
        `;

        $('#episodeDetailModal').modal('show');
    } catch (error) {
        console.error('Error fetching episode details:', error);
    }
};

const setupPagination = (info, currentPage) => {
    const paginationDiv = document.querySelector('.pagination');
    paginationDiv.innerHTML = '';

    if (currentPage > 1) {
        const prevPage = currentPage - 1;
        const prevLink = document.createElement('li');
        prevLink.className = 'page-item';
        prevLink.innerHTML = `<a class="page-link" href="#" data-page="${prevPage}">Anterior</a>`;
        paginationDiv.appendChild(prevLink);
    }

    for (let i = 1; i <= info.pages; i++) {
        const pageLink = document.createElement('li');
        pageLink.className = 'page-item' + (i === currentPage ? ' active' : '');
        pageLink.innerHTML = `<a class="page-link" href="#" data-page="${i}">${i}</a>`;
        paginationDiv.appendChild(pageLink);
    }

    if (currentPage < info.pages) {
        const nextPage = currentPage + 1;
        const nextLink = document.createElement('li');
        nextLink.className = 'page-item';
        nextLink.innerHTML = `<a class="page-link" href="#" data-page="${nextPage}">Siguiente</a>`;
        paginationDiv.appendChild(nextLink);
    }

    paginationDiv.addEventListener('click', (e) => {
        e.preventDefault();
        if (e.target.tagName === 'A' && e.target.dataset.page) {
            loadEpisodes(parseInt(e.target.dataset.page));
        }
    });
};
