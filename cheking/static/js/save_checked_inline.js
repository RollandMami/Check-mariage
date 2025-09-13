document.addEventListener("DOMContentLoaded", function () {
    const presenceSwitches = document.querySelectorAll(".presence-switch");

    presenceSwitches.forEach(function (switchElement) {
        switchElement.addEventListener("change", function (event) {
            const guestControlsContainer = event.target.closest(".guest-controls");
            // Correction de la classe : .save-btn et non .save-link
            const saveButton = guestControlsContainer.querySelector(".save-btn");

            if (saveButton) {
                // Rendre le bouton visible en retirant la classe 'hidden'
                saveButton.classList.remove("hidden");
            }
        });
    });

    // Voici où vous devriez ajouter l'écouteur de clic pour le bouton de sauvegarde
    // Nous devons le faire de manière dynamique pour tous les boutons de sauvegarde
    const saveButtons = document.querySelectorAll(".save-btn");
    saveButtons.forEach(function (saveButton) {
        saveButton.addEventListener("click", function(event) {
            event.preventDefault(); // Empêche le rechargement de la page
            // Votre logique AJAX pour sauvegarder les données
        });
    });
});