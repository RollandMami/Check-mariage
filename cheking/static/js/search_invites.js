document.addEventListener("DOMContentLoaded", function() {

    // --- Variables et sélections DOM initiales ---
    const searchInput = document.getElementById('guestSearchInput');
    const tableButton = document.getElementById('tableButton');
    const presenceDropdownMenu = document.getElementById('presenceDropdownMenu');
    const abscentButton = document.getElementById("abscentButton");
    const items = document.querySelectorAll('#guestList li');
    
    const friendshipDropdownMenu = document.querySelector('#friendshipButton + .dropdown-menu');
    const friendshipButton = document.getElementById('friendshipButton');
    // État du filtre global
    const filters = {
        searchTerm: '',
        presence: 'all', // 'all', 'present', 'absent'
        friendship: 'all', // 'all', 'MARIEE', 'MARIE', 'AMIS - COLLEGUES', 'EGLISE', 'STAFF - LOGISTICS'
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
            if (data && typeof data === 'string') {
                uniqueValues.add(data.trim());
            }
        });
        return uniqueValues;
    }

    /**
     * Applique tous les filtres actifs à la liste des invités.
     */
    function applyFilters() {
        items.forEach(item => {
            let isVisible = true;
            const guestNameElement = item.querySelector('.guest-name');
            const presenceSwitch = item.querySelector(".presence-switch");
            const friendshipData = item.dataset.friendship;

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
            
            // --- NOUVEAU CODE POUR LE FILTRE D'AMITIÉ ---
            if (isVisible && filters.friendship !== 'all') {
                const friendshipData = item.dataset.friendship || ''; // S'assure que friendshipData est une chaîne, même si l'attribut est manquant
                if (friendshipData !== filters.friendship) {
                    isVisible = false;
                }
            }
            // --- FIN DU NOUVEAU CODE ---

            // Mettre à jour la visibilité de l'élément
            item.classList.toggle('hidden', !isVisible);
        });
    }

    // --- Écouteurs d'événements ---

    // Écouteur pour la barre de recherche
    searchInput.addEventListener('keyup', function() {
        filters.searchTerm = this.value.toLowerCase();
        applyFilters();
    });

    // Écouteurs pour les boutons de présence
    if (presenceDropdownMenu && abscentButton){
        presenceDropdownMenu.addEventListener('click', function(event){
            const button = event.target.closest('.dropdown-item');
            if (button){
                buttonText = button.textContent.trim();
                const icon = button.querySelector("i");
                const presenceDataValue = button.dataset.presence;

                // Mettre à jour le texte et l'icône du bouton principal;
                if (presenceDataValue === 'all') {
                    abscentButton.querySelector('i').className = 'fa-solid fa-user me-2';
                    abscentButton.childNodes[2].nodeValue = "Presence";
                }else{
                    if(icon){
                        abscentButton.querySelector('i').className = icon.className;
                    }
                    abscentButton.childNodes[2].nodeValue = " " + buttonText;
                }
                // Mettre à jour le filtre et appliquer les filtres
                filters.presence = presenceDataValue || 'all';
                applyFilters();
            }

        });
    }
    
    // Écouteur pour le bouton 'table' (mis à jour pour l'exemple)
    tableButton.addEventListener('click', function() {
        const tableFilters = getDataAndFilter('table', items);
        console.log("Filtres de table disponibles :", tableFilters);
        // Vous pouvez maintenant utiliser ce Set pour créer un menu déroulant dynamique.
    });

    // --- NOUVEAU CODE POUR LE DROPDOWN D'AMITIÉ ---
    if (friendshipDropdownMenu) {
        friendshipDropdownMenu.addEventListener('click', function(event) {
            const button = event.target.closest('.dropdown-item');
            if (button) {
                const buttonText = button.textContent.trim();
                const icon = button.querySelector('i');
                const friendshipDataValue = button.dataset.friendship;

                // Mettre à jour le texte et l'icône du bouton principal
                if (friendshipDataValue === 'all') {
                    friendshipButton.querySelector('i').className = 'fa-solid fa-link me-2';
                    friendshipButton.childNodes[2].nodeValue = "Lien d'amitié";
                }else{
                    if (icon) {
                        friendshipButton.querySelector('i').className = icon.className;
                    }
                    friendshipButton.childNodes[2].nodeValue = " " + buttonText;
                }

                // Mettre à jour le filtre et appliquer les filtres
                filters.friendship = friendshipDataValue || 'all';
                applyFilters();
            }
        });
    }
    // --- FIN DU NOUVEAU CODE ---
});