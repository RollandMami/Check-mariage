document.addEventListener('DOMContentLoaded', function() {
        const searchInput = document.getElementById('guestSearchInput');
        const filterButtons = document.querySelectorAll('.filter-btn');
        const guestList = document.getElementById('guestList');
        const guestItems = guestList.querySelectorAll('.guest-item');

        let activeFilterType = 'name'; // Filtre actif par défaut

        function filterGuests() {
            const searchTerm = searchInput.value.toLowerCase();

            guestItems.forEach(item => {
                let matchesSearch = false;
                
                // On vérifie le type de filtre actif
                if (activeFilterType === 'name') {
                    matchesSearch = item.dataset.name.toLowerCase().includes(searchTerm);
                } else if (activeFilterType === 'table') {
                    matchesSearch = item.dataset.table.toLowerCase().includes(searchTerm);
                } else if (activeFilterType === 'location') {
                    matchesSearch = item.dataset.location.toLowerCase().includes(searchTerm);
                } else if (activeFilterType === 'friendship') {
                    matchesSearch = item.dataset.friendship.toLowerCase().includes(searchTerm);
                }
                
                if (matchesSearch) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        }

        // Écouteur pour la recherche
        searchInput.addEventListener('keyup', filterGuests);

        // Écouteurs pour les boutons de filtre
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Mettre à jour la classe 'active'
                filterButtons.forEach(btn => {
                    btn.classList.remove('active', 'btn-primary');
                    btn.classList.add('btn-outline-secondary');
                });
                this.classList.add('active', 'btn-primary');
                this.classList.remove('btn-outline-secondary');
                
                // Mettre à jour le type de filtre actif
                activeFilterType = this.dataset.filterType;
                filterGuests(); // Appliquer le filtre
            });
        });
        
        // Initialiser les filtres au chargement
        filterGuests();
    });