document.addEventListener("DOMContentLoaded", function() {

    // Créez une fonction pour récupérer et filtrer les données, et renvoyer une liste.
    function getDataAndFilter(filtre, listeAfiltrer) {
        // Initialiser un nouveau Set à chaque appel pour éviter d'avoir des valeurs obsolètes.
        const tempSet = new Set();
        tempSet.add('Tous');

        listeAfiltrer.forEach(item => {
            // Utiliser la notation par crochets pour accéder à la propriété data de manière dynamique.
            const data = item.dataset[filtre];

            // Vérifier si la valeur existe et est de type chaîne de caractères.
            if (data && typeof data === 'string') {
                const cleanData = data.trim();
                tempSet.add(cleanData);
            }
        });
        return tempSet;
    }

    // --- Sélection des éléments DOM ---
    const searchInput = document.getElementById('guestSearchInput');
    const tableButton = document.getElementById('tableButton');
    const abscentButton = document.getElementById("abscentButton");
    const lieuButton = document.getElementById("locationButton");
    const amitieButton = document.getElementById("friendshipButton");
    const items = document.querySelectorAll('#guestList li');

    // --- Variables pour les Sets de filtre ---
    let listeAmitie = new Set();
    let listeLieu = new Set();
    let listeTable = new Set();
    let listeAbsence = new Set();

    // --- Logique de la barre de recherche ---
    searchInput.addEventListener('keyup', function() {
        const searchTerm = searchInput.value.toLowerCase();

        items.forEach(item => {
            const guestNameElement = item.querySelector('.guest-name');
            if (guestNameElement) {
                const itemText = guestNameElement.textContent.toLowerCase();
                if (itemText.includes(searchTerm)) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            }
        });
    });

    // --- Actions sur les boutons de filtre ---

    // Action sur le bouton de filtre des tables
    tableButton.addEventListener('click', function() {
        // Obtenir les données filtrées et assigner le Set.
        const tempTable = getDataAndFilter('table', items);
        listeTable = tempTable;
        console.log(listeTable);
    });

    // Action sur le bouton de filtre des absents
    abscentButton.addEventListener('click', function() {

        // afficher une fenêtre modale pour choisir entre "Présents", "Absents" ou "Tous"
        

        items.forEach(item => {
            const abscenceSwitch = item.querySelector(".presence-switch");
            // Vérifier la présence en se basant sur la valeur de l'interrupteur
            const isPresent = abscenceSwitch.checked;

            if (isPresent) {
                 item.classList.add('hidden'); // Cacher si la personne est présente
            } else {
                item.classList.remove('hidden'); // Afficher si la personne est absente
            }
        });
    });

    // Note : Les autres boutons de filtre (lieu, amitié) peuvent être implémentés de la même manière que tableButton.
});