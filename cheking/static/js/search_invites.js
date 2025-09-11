document.addEventListener("DOMContentLoaded",function(){
    // Étape 1 : Récupérer les éléments
    const searchInput = document.getElementById('guestSearchInput');
    const items = document.querySelectorAll('#guestList li');
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
});
