document.addEventListener('DOMContentLoaded', (event) => {
        const qrScannerModal = document.getElementById('qrScannerModal');
        const qrReaderDiv = document.getElementById('qr-reader');
        const resultContainer = document.getElementById('result-container');
        const scannedCodeSpan = document.getElementById('scanned-code');
        const sendButton = document.getElementById('send-button');

        let html5QrCode = null;

        function onScanSuccess(decodedText, decodedResult) {
            // Un seul scan est suffisant, on arrête le scanner.
            html5QrCode.stop().then(() => {
                // Cache le lecteur et affiche le résultat après l'arrêt complet
                qrReaderDiv.style.display = 'none';
                resultContainer.style.display = 'block';

                scannedCodeSpan.textContent = decodedText;
                const baseUrl = sendButton.dataset.url;
                const finalUrl = baseUrl.replace("___",decodedText);
                sendButton.href = finalUrl;
            }).catch(err => {
                console.error("Erreur lors de l'arrêt du scanner:", err);
            });
        }

        function onModalShown() {
            // Cache le résultat précédent si la modale est rouverte
            resultContainer.style.display = 'none';
            qrReaderDiv.style.display = 'block';
            
            html5QrCode = new Html5Qrcode("qr-reader");
            html5QrCode.start(
                { facingMode: "environment" },
                { fps: 10, qrbox: 250 },
                onScanSuccess
            ).catch(err => {
                console.error("Erreur au démarrage du scanner:", err);
            });
        }

        function onModalHidden() {
            // Arrête le scanner proprement à la fermeture de la modale
            if (html5QrCode && html5QrCode.isScanning) {
                html5QrCode.stop().catch(err => {
                    console.error("Erreur à l'arrêt du scanner:", err);
                });
            }
        }

        // Lier les fonctions aux événements de la modale
        qrScannerModal.addEventListener('shown.bs.modal', onModalShown);
        qrScannerModal.addEventListener('hidden.bs.modal', onModalHidden);
});