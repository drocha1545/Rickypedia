document.addEventListener('DOMContentLoaded', () => {
    loadLocations();
});

const loadLocations = async (page = 1) => {
    const apiUrl = `https://rickandmortyapi.com/api/location/?page=${page}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        displayLocations(data.results);
        setupPagination(data.info, page);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

const displayLocations = (locations) => {
    const locationList = document.getElementById('locationList');
    locationList.innerHTML = ''; 

    // Parte modificada en displayLocations()
        // Parte modificada en displayLocations()
                  locations.forEach(location => {
                    const locationDiv = document.createElement('div');
                    locationDiv.className = 'col-md-4 mb-4';
                    locationDiv.innerHTML = `
                        <div class="card h-100 shadow-lg location-card" onclick="displayLocationDetail(${location.id})">
                            <img src="https://steamuserimages-a.akamaihd.net/ugc/782978849731797376/BFD2245A50178526DA6C12F5A804AEBA155D1828/" alt="${location.name}" class="card-img-top">
                            <div class="card-body">
                                <h5 class="card-title">${location.name}</h5>
                            </div>
                        </div>
                    `;
                    locationList.appendChild(locationDiv);
                });



    document.querySelectorAll('.view-detail').forEach(button => {
        button.addEventListener('click', (e) => {
            const locationId = e.target.dataset.id;
            displayLocationDetail(locationId);
        });
    });
};

const displayLocationDetail = async (id) => {
    const apiUrl = `https://rickandmortyapi.com/api/location/${id}`;

    try {
        const response = await fetch(apiUrl);
        const location = await response.json();

        const modalBody = document.getElementById('locationDetailBody');
        modalBody.innerHTML = `
            <h2 class="modal-location-title">${location.name}</h2>
            <div class="row mt-4">
                <div class="col-md-6">
                    <img src="https://i.pinimg.com/736x/52/f2/8d/52f28d2a3defc9cd88265c18c1f0a75f.jpg" alt="${location.name}" class="img-fluid modal-location-image">
                </div>
                <div class="col-md-6 modal-location-info">
                    <p><strong>Tipo:</strong> ${location.type}</p>
                    <p><strong>Dimensión:</strong> ${location.dimension}</p>
                    <p><strong>Residentes:</strong> ${location.residents.length}</p>
                </div>
            </div>
        `;

        $('#locationDetailModal').modal('show');
    } catch (error) {
        console.error('Error fetching location details:', error);
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
            loadLocations(parseInt(e.target.dataset.page));
        }
    });
};



 

