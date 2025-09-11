document.addEventListener("DOMContentLoaded",function(){
    // Étape 1 : Récupérer les éléments
    const searchInput = document.getElementById('guestSearchInput');
    const tableButton = document.getElementById('tableButton');
    const abscentButton = document.getElementById("abscentButton");
    const items = document.querySelectorAll('#guestList li');
    let listeTable = new Set();
    // const list = document.getElementById('guestList');
    //for (let i = 0; i < items.length; i++) {
    //        const guestNameElement = items[i].getElementsByTagName('h5')[0];
    //        if (guestNameElement) {
    //            console.log(guestNameElement.textContent);
    //        }
    //    }

    // Étape 2 : Écouter l'événement de frappe
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

    // action sur le bouton de filtre des tables
    tableButton.addEventListener('click', function(){
        items.forEach(item => {
            const tableElement = item.querySelector('.guest-table');
            if (tableElement){
                const tableText = tableElement.textContent.toLowerCase().replace(/table| : /g, '').trim();
                listeTable.add(tableText);
            }
        });

        console.log(listeTable);
    });

    // action sur le bouton de filtre des abscent;
    abscentButton.addEventListener('click', function(){
        items.forEach(item => {
            const abcence = item.querySelector(".presence-switch");
            const abscenceValue = abcence.checked;
            if (!abscenceValue){
                item.classList.remove('hidden');
            }else{
                item.classList.add('hidden');
            }
        });
    });
});
