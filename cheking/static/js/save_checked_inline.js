document.addEventListener("DOMContentLoaded", function () {
    const presenceSwitches = document.querySelectorAll(".presence-switch");

    presenceSwitches.forEach(function (switchElement) {
        switchElement.addEventListener("change", function (event) {
            const guestControlsContainer = event.target.closest(".guest-controls");
            const saveButton = guestControlsContainer.querySelector(".save-btn");
            
            // On masque l'éventuel conteneur d'input précédent
            const existingPopup = document.querySelector(".custom-popup-overlay");
            if (existingPopup) {
                existingPopup.remove();
            }

            // On affiche le bouton de sauvegarde pour toutes les modifications
            saveButton.classList.remove("hidden");
        });
    });

    // Écouteur global pour tous les clics dans le document
    document.addEventListener("click", function(event) {
        // Logique pour le bouton "Sauvegarder"
        if (event.target.closest(".save-btn")) {
            event.preventDefault();
            const saveButton = event.target.closest(".save-btn");
            const inviteNumber = parseInt(saveButton.dataset.inviteNumber, 10);
            
            // Si le nombre d'invités est >= 2, on affiche la pop-up
            if (inviteNumber >= 2) {
                showCountPopup(saveButton);
                return;
            }

            // Cas d'un invité unique
            const isPresent = saveButton.closest(".guest-controls").querySelector(".presence-switch").checked;
            const status = isPresent ? 'checked' : 'unchecked';
            const urlToSave = `${saveButton.dataset.baseUrl}?est_present=${status}`;

            sendAjaxRequest(urlToSave, function() {
                saveButton.classList.add("hidden");
            });
        }

        // Logique pour le bouton "Save" de la pop-up
        if (event.target.classList.contains("save-count-btn")) {
            const saveCountBtn = event.target;
            const popup = saveCountBtn.closest(".custom-popup-overlay");
            const inputElement = popup.querySelector(".invite-count-input");
            const realCount = inputElement.value;
            
            const isPresent = popup.dataset.isPresent === 'true'; // Récupération de l'état de la présence
            const urlToSave = `${inputElement.dataset.updateUrl}?count=${realCount}&est_present=${isPresent}`;

            sendAjaxRequest(urlToSave, function() {
                popup.remove();
            });
        }
        
        // Logique pour le bouton "Discard" de la pop-up
        if (event.target.classList.contains("cancel-count-btn")) {
            const popup = event.target.closest(".custom-popup-overlay");
            popup.remove();
        }
    });

    // Fonction pour afficher la pop-up
    function showCountPopup(saveButton) {
        const inviteId = saveButton.dataset.inviteId;
        const inviteNumber = saveButton.dataset.inviteNumber;
        const updateUrl = saveButton.dataset.updateUrl;
        const isPresent = saveButton.closest(".guest-controls").querySelector(".presence-switch").checked;

        // On récupère les nouvelles données ajoutées au bouton de sauvegarde
        const guestName = saveButton.dataset.guestName;
        const tableName = saveButton.dataset.tableName;

        // On vérifie si une pop-up existe déjà pour éviter les doublons
        const existingPopup = document.querySelector(".custom-popup-overlay");
        if (existingPopup) {
            existingPopup.remove();
        }

        const popupHTML = `
            <div class="custom-popup-overlay" data-invite-id="${inviteId}" data-is-present="${isPresent}">
                <div class="custom-popup-content">
                    <h5 class="popup-title">${guestName} - ${tableName}</h5>
                    <hr>
                    <p class="popup-subtitle">Nombre réel de présents :</p>
                    <input type="number" class="form-control invite-count-input" value="${inviteNumber}" min="0" max="${inviteNumber}" data-update-url="${updateUrl}">
                    <div class="d-flex justify-content-end mt-3">
                        <button class="btn btn-secondary me-2 cancel-count-btn">Annuler</button>
                        <button class="btn btn-primary save-count-btn">Sauvegarder</button>
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
    }

    // Fonction d'aide pour l'envoi de requêtes AJAX (commune aux deux cas)
    function sendAjaxRequest(url, successCallback = null) {
        fetch(url, {
            method: 'GET',
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(`Erreur HTTP: ${response.status}`);
        })
        .then(data => {
            if (data.status === 'success') {
                alert(data.message || "Mise à jour réussie ! ✅");
                if (successCallback) {
                    successCallback();
                }
            } else {
                alert("Erreur: " + data.message);
            }
        })
        .catch(error => {
            console.error("Erreur de requête AJAX:", error);
            alert("Une erreur est survenue lors de la mise à jour. ❌");
        });
    }
});