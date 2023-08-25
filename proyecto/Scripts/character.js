document.addEventListener('DOMContentLoaded', () => {
    loadCharacters();
});

let activeFilters = {};

function loadCharacters(page = 1) {
    let filterString = '';
    for (let key in activeFilters) {
        filterString += `&${key}=${activeFilters[key]}`;
    }

    const apiUrl = `https://rickandmortyapi.com/api/character/?page=${page}${filterString}`;
    const request = new XMLHttpRequest();

    request.open('GET', apiUrl, true);
    request.onload = function () {
        if (this.status >= 200 && this.status < 400) {
            const data = JSON.parse(this.response);
            displayCharacters(data.results);
            setupPagination(data.info, page);
        } else {
            console.error('Server returned an error');
        }
    };

    request.onerror = function () {
        console.error('Request failed');
    };

    request.send();
}

function setupFilterListeners() {
    document.querySelectorAll('.filter-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            const filterType = e.target.getAttribute('data-filter');
            const filterValue = e.target.getAttribute('data-value');

            if (filterType === 'all') {
                activeFilters = {};
            } else {
                activeFilters[filterType] = filterValue;
            }

            loadCharacters(1, activeFilters);
        });
    });
}
function toggleDropdown() {
    const dropdownMenu = document.getElementById('dropdownMenu');
    if (dropdownMenu.style.display === "block") {
        dropdownMenu.style.display = "none";
    } else {
        dropdownMenu.style.display = "block";
    }
}

function handleItemClick(event) {
    event.preventDefault();
    
    const filterType = event.target.getAttribute('data-filter');
    if (filterType === 'all') {
        activeFilters = {}; // Reset active filters
        // Deselect all items
        document.querySelectorAll('.filter-item').forEach(item => item.classList.remove('selected-item'));
    } else {
        const category = event.target.closest('ul').querySelector(`[data-category="${filterType}"]`);
        if (category) {
            // Deselect other items in the same category
            category.nextElementSibling.querySelectorAll('.filter-item').forEach(item => {
                if(item !== event.target) { // Don't deselect the current item
                    item.classList.remove('selected-item');
                }
            });
        }

        // Toggle selected state for the current item
        if (event.target.classList.contains('selected-item')) {
            event.target.classList.remove('selected-item');
            delete activeFilters[filterType];
        } else {
            event.target.classList.add('selected-item');
            activeFilters[filterType] = event.target.getAttribute('data-value');
        }
    }
    loadCharacters(1, activeFilters);
}

document.querySelectorAll('.filter-item').forEach(item => {
    item.addEventListener('click', handleItemClick);
});

document.querySelector('[data-filter="all"]').addEventListener('click', function() {
    const items = document.querySelectorAll('.filter-item');
    items.forEach(item => item.classList.remove('selected-item'));
});

document.addEventListener('click', function(event) {
    const dropdownButton = document.getElementById('filterDropdown');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const isClickInside = dropdownButton.contains(event.target) || dropdownMenu.contains(event.target);

    if (!isClickInside) {
        dropdownMenu.style.display = "none";
    }
});

$('.dropdown').on('hide.bs.dropdown', function () {
    $(".dropdown-toggle").blur();
});


function nextPage() {
    currentPage += 1;
    loadCharacters(currentPage, activeFilters);
}

function displayCharacters(characters) {
    const characterList = document.getElementById('characterList');
    characterList.innerHTML = ''; // Limpiar el contenido actual

    characters.forEach(character => {
        const characterDiv = document.createElement('div');
        characterDiv.className = 'col-md-6 mb-4'; // Cambiado a col-md-6 para que ocupe la mitad del ancho y sea más horizontal
        characterDiv.innerHTML = `
            <div class="card h-100 shadow-lg character-card">
                <div class="row no-gutters">
                    <div class="col-md-4">
                        <img src="${character.image}" alt="${character.name}" class="card-img character-image">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title">${character.name}</h5>
                            <div class="character-details">
                                <p><strong>Estado:</strong> ${character.status}</p>
                                <p><strong>Especie:</strong> ${character.species}</p>
                                <p><strong>Género:</strong> ${character.gender}</p>
                            </div>
                            <button class="btn btn-primary view-detail" data-id="${character.id}">Ver detalles</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        characterList.appendChild(characterDiv);
    });
    // Agregar evento de clic a los botones "Ver detalles"
    document.querySelectorAll('.view-detail').forEach(button => {
        button.addEventListener('click', (e) => {
            const characterId = e.target.dataset.id;
            displayCharacterDetail(characterId);
        });
    });
}

function displayCharacterDetail(id) {
    const apiUrl = `https://rickandmortyapi.com/api/character/${id}`;
    const request = new XMLHttpRequest();

    request.open('GET', apiUrl, true);
    request.onload = function () {
        if (this.status >= 200 && this.status < 400) {
            const character = JSON.parse(this.response);
            const modalBody = document.getElementById('characterDetailBody');
            modalBody.innerHTML = `
                <div class="text-center">
                    <img src="${character.image}" alt="${character.name}" class="img-fluid mb-3 character-detail-image">
                </div>
                <h4 class="text-center">${character.name}</h4>
                <div class="row text-center character-info">
                    <div class="col-md-6">
                        <p><strong>Estado:</strong> ${character.status}</p>
                        <p><strong>Especie:</strong> ${character.species}</p>
                        <p><strong>Tipo:</strong> ${character.type || 'N/A'}</p>
                    </div>
                    <div class="col-md-6">
                        <p><strong>Género:</strong> ${character.gender}</p>
                        <p><strong>Origen:</strong> ${character.origin.name}</p>
                        <p><strong>Última ubicación:</strong> ${character.location.name}</p>
                    </div>
                </div>
                <div class="text-center">
                    <p><strong>Episodios:</strong> ${character.episode.length}</p>
                </div>
            `;

            $('#characterDetailModal').modal('show');
        } else {
            console.error('Server returned an error');
        }
    };

    request.onerror = function () {
        console.error('Request failed');
    };

    request.send();
}

function setupPagination(info, currentPage) {
    const paginationDiv = document.querySelector('.pagination');
    paginationDiv.innerHTML = ''; // Limpiar la paginación actual

    const totalPages = info.pages; // Total de páginas
    const maxPagesToShow = 7; // Número máximo de páginas a mostrar (puedes ajustar este valor)

    let startPage = 1;
    let endPage = totalPages;

    if (totalPages > maxPagesToShow) {
        const maxPagesBeforeCurrentPage = Math.floor(maxPagesToShow / 2);
        const maxPagesAfterCurrentPage = Math.ceil(maxPagesToShow / 2) - 1;

        if (currentPage <= maxPagesBeforeCurrentPage) {
            // Si la página actual está cerca del inicio
            endPage = maxPagesToShow;
        } else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
            // Si la página actual está cerca del final
            startPage = totalPages - maxPagesToShow + 1;
        } else {
            // Si la página actual está en el medio
            startPage = currentPage - maxPagesBeforeCurrentPage;
            endPage = currentPage + maxPagesAfterCurrentPage;
        }
    }

    // Botón Anterior
    if (currentPage > 1) {
        const prevPage = currentPage - 1;
        const prevLink = document.createElement('li');
        prevLink.className = 'page-item';
        prevLink.innerHTML = `<a class="page-link" href="#" data-page="${prevPage}">Anterior</a>`;
        paginationDiv.appendChild(prevLink);
    }

    // Números de página
    for (let i = startPage; i <= endPage; i++) {
        const pageLink = document.createElement('li');
        pageLink.className = 'page-item' + (i === currentPage ? ' active' : '');
        pageLink.innerHTML = `<a class="page-link" href="#" data-page="${i}">${i}</a>`;
        paginationDiv.appendChild(pageLink);
    }

    // Botón Siguiente
    if (currentPage < totalPages) {
        const nextPage = currentPage + 1;
        const nextLink = document.createElement('li');
        nextLink.className = 'page-item';
        nextLink.innerHTML = `<a class="page-link" href="#" data-page="${nextPage}">Siguiente</a>`;
        paginationDiv.appendChild(nextLink);
    }

    // Agregar eventos a los enlaces de paginación
    paginationDiv.addEventListener('click', (e) => {
        e.preventDefault();
        if (e.target.tagName === 'A' && e.target.dataset.page) {
            loadCharacters(parseInt(e.target.dataset.page));  // Aquí usamos la función modificada
        }
    });
}


