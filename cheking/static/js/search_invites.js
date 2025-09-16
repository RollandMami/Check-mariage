document.addEventListener("DOMContentLoaded", function () {

    // --- Variables et sélections DOM initiales ---
    const searchInput = document.getElementById('guestSearchInput');
    const tableButton = document.getElementById('tableButton');
    const presenceDropdownMenu = document.getElementById('presenceDropdownMenu');
    const abscentButton = document.getElementById("abscentButton");
    const items = document.querySelectorAll('#guestList li');

    const friendshipDropdownMenu = document.querySelector('#friendshipButton + .dropdown-menu');
    const friendshipButton = document.getElementById('friendshipButton');

    // variables pour les boutton et leurs valeurs par défaut ;
    // Bouton de présence
    const defaultPresence = {
        text: 'Presence',
        iconClass: 'fas fa-user me-2'
    };
    // Bouton lien d'amitié
    const defaultFriendship = {
        text: 'Lien d\'amitié',
        iconClass: 'fas fa-link me-2'
    };
    // État du filtre global
    const filters = {
        searchTerm: '',
        presence: 'all', // 'all', 'present', 'absent'
        friendship: 'all', // 'all', 'MARIEE', 'MARIE', 'AMIS - COLLEGUES', 'EGLISE', 'STAFF - LOGISTICS'
        table: 'all' // Nouveau filtre pour les tables
    };


    // --- Fonctions utilitaires ---

    /**
     * Récupère et filtre les données en fonction d'un attribut de données.
     * @param {string} filterName - Le nom de l'attribut data à filtrer (ex: 'table').
     * @param {NodeList} listToFilter - La liste des éléments DOM à parcourir.
     * @returns {Set<string>} Un Set contenant les valeurs de filtre uniques.
     */
    function getDataAndFilter(filterName, listToFilter) {
        const uniqueValues = new Set(['Tous']);
        listToFilter.forEach(item => {
            const data = item.dataset[filterName];
            if (data && typeof data === 'string' && !item.classList.contains('hidden')) {
                // IMPORTANT: On ne récupère que les données des items qui ne sont pas "hidden"
                uniqueValues.add(data.trim());
            }
        });
        return uniqueValues;
    }

    /**
     * Gère les interactions des menus déroulants de manière générique.
     * @param {Event} event - L'événement de clic.
     * @param {string} filterType - Le type de filtre à mettre à jour (ex: 'presence', 'friendship').
     * @param {object} defaultValues - Les valeurs (texte, icône) par défaut du bouton principal.
     */
    function handleDropdown(event, filterType, defaultValues) {
        const button = event.target.closest('.dropdown-item');
        if (!button) return;

        const buttonText = button.textContent.trim();
        const icon = button.querySelector("i");
        const filterValue = button.dataset[filterType]; // Utilisation de l'attribut data-* de manière dynamique
        const mainButton = document.querySelector(`.filter-btn[data-filter-type="${filterType}"]`);

        if (filterValue === 'all') {
            // Restaurer les valeurs par défaut
            mainButton.querySelector('i').className = defaultValues.iconClass;
            mainButton.childNodes[2].nodeValue = " " + defaultValues.text;
        } else {
            // Mettre à jour avec les valeurs du bouton sélectionné
            if (icon) {
                mainButton.querySelector('i').className = icon.className;
            }
            mainButton.childNodes[2].nodeValue = " " + buttonText;
        }

        // Mettre à jour le filtre global et appliquer les filtres
        filters[filterType] = filterValue || 'all';
        applyFilters();
    }

    /**
     * Applique tous les filtres actifs à la liste des invités.
     */
    function applyFilters() {
        items.forEach(item => {
            let isVisible = true;
            const guestNameElement = item.querySelector('.guest-name');
            const presenceSwitch = item.querySelector(".presence-switch");
            
            // Filtre de recherche
            if (filters.searchTerm) {
                if (guestNameElement) {
                    const itemText = guestNameElement.textContent.toLowerCase();
                    if (!itemText.includes(filters.searchTerm)) {
                        isVisible = false;
                    }
                }
            }

            // Filtre de présence
            if (isVisible && filters.presence !== 'all') {
                if (presenceSwitch) {
                    const isPresent = presenceSwitch.checked;
                    if (filters.presence === 'present' && !isPresent) {
                        isVisible = false;
                    }
                    if (filters.presence === 'absent' && isPresent) {
                        isVisible = false;
                    }
                }
            }

            // Filtre d'amitié
            if (isVisible && filters.friendship !== 'all') {
                const friendshipData = item.dataset.friendship || '';
                if (friendshipData !== filters.friendship) {
                    isVisible = false;
                }
            }
            
            // Filtre de table (cumulatif)
            if (isVisible && filters.table !== 'all') {
                const tableData = item.dataset.table || '';
                if (tableData !== filters.table) {
                    isVisible = false;
                }
            }

            // Mettre à jour la visibilité de l'élément
            item.classList.toggle('hidden', !isVisible);
        });
    }

    // --- Écouteurs d'événements ---

    // Écouteur pour la barre de recherche
    searchInput.addEventListener('keyup', function () {
        filters.searchTerm = this.value.toLowerCase();
        applyFilters();
    });

    // Écouteurs pour les boutons de présence
    if (presenceDropdownMenu && abscentButton) {
        presenceDropdownMenu.addEventListener('click', (event) => {
            handleDropdown(event, 'presence', defaultPresence);
        });
    }

    // Écouteur pour le bouton 'table' qui affiche la pop-up de filtre
    tableButton.addEventListener('click', function () {
        // IMPORTANT : On passe seulement les items qui sont actuellement visibles
        const visibleItems = document.querySelectorAll('#guestList li:not(.hidden)');
        const tableFilters = getDataAndFilter('table', visibleItems);
        
        // Supprimez les pop-ups existantes pour éviter les doublons
        const existingPopup = document.querySelector(".custom-popup-overlay");
        if (existingPopup) {
            existingPopup.remove();
        }

        let tableListHTML = '';
        tableFilters.forEach(table => {
            // Mettez à jour le data-table-filter pour correspondre au filtre que vous voulez appliquer
            const isActive = filters.table === table;
            const activeClass = isActive ? 'active' : '';
            tableListHTML += `<li class="list-group-item table-item ${activeClass}" data-table-filter="${table}">${table}</li>`;
        });

        const popupHTML = `
            <div class="custom-popup-overlay">
                <div class="custom-popup-content">
                    <h5 class="popup-title">Filtrer par table :</h5>
                    <hr>
                    <ul class="list-group table-list-container">
                        ${tableListHTML}
                    </ul>
                    <div class="d-flex justify-content-end mt-3">
                        <button class="btn btn-secondary me-2 cancel-filter-btn">Fermer</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', popupHTML);

        // Ajoute la classe 'show' pour déclencher l'affichage et les animations
        setTimeout(() => {
            const newPopup = document.querySelector(".custom-popup-overlay");
            if (newPopup) {
                newPopup.classList.add("show");
            }
        }, 10);
    });

    // Écouteurs pour le filtre 'friendship'
    if (friendshipDropdownMenu) {
        friendshipDropdownMenu.addEventListener('click', function (event) {
            handleDropdown(event, 'friendship', defaultFriendship);
        });
    }

    // --- LOGIQUE POUR LES CLICS SUR LA POP-UP DE TABLES ---
    document.addEventListener("click", function(event) {
        // Gère le clic sur un nom de table dans la pop-up
        if (event.target.classList.contains("table-item")) {
            const selectedTable = event.target.dataset.tableFilter;
            
            // Mise à jour du filtre de table global
            // Si l'utilisateur clique sur "Tous" ou la table déjà sélectionnée, on désactive le filtre
            filters.table = (selectedTable === 'Tous' || filters.table === selectedTable) ? 'all' : selectedTable;

            // Applique tous les filtres, y compris le nouveau filtre de table
            applyFilters();
            
            // Fermez la pop-up après la sélection
            const popup = event.target.closest(".custom-popup-overlay");
            if (popup) {
                popup.remove();
            }
        }
        
        // Gère le clic sur le bouton "Fermer"
        if (event.target.classList.contains("cancel-filter-btn")) {
            const popup = event.target.closest(".custom-popup-overlay");
            if (popup) {
                popup.remove();
            }
        }
    });

});