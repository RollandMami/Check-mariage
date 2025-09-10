document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('guestSearchInput');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const guestList = document.getElementById('guestList');
    const guestItems = guestList.querySelectorAll('.guest-item');
    const saveButtons = document.querySelectorAll('.save-btn');

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

    saveButtons.forEach(button => {
        button.addEventListener('click', function() {
            const inviteId = this.dataset.inviteId;
            const presenceSwitch = document.getElementById(`presence-switch-${inviteId}`);
            const estPresent = presenceSwitch.checked; // Récupère la valeur booléenne
            
            // Récupérer le jeton CSRF de Django
            const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

            // Envoyer les données au serveur via une requête AJAX
            fetch(`/cheking/maj_invite/${inviteId}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken
                },
                body: JSON.stringify({
                    'est_present': estPresent
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('La mise à jour a échoué.');
                }
                return response.json();
            })
            .then(data => {
                // Gérer la réponse du serveur
                console.log('Mise à jour réussie :', data);
                // Cacher le bouton "Sauvegarder" après la réussite
                this.style.display = 'none';
                
                // Optionnel : Mettre à jour l'icône de présence
                // (voir l'image_f97a47)
                const presenceIcon = this.closest('.guest-item').querySelector('.badge');
                if (estPresent) {
                    presenceIcon.classList.remove('bg-danger');
                    presenceIcon.classList.add('bg-success');
                    presenceIcon.querySelector('i').className = 'fas fa-check';
                } else {
                    presenceIcon.classList.remove('bg-success');
                    presenceIcon.classList.add('bg-danger');
                    presenceIcon.querySelector('i').className = 'fas fa-times';
                }

            })
            .catch(error => {
                console.error('Erreur lors de la mise à jour :', error);
            });
        });
    });
});