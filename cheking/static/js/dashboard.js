document.addEventListener("DOMContentLoaded", function() {
    const cardhusband = document.getElementById("guestCardhusband");
    const cardwife = document.getElementById("guestCardwife");
    const cardchurch = document.getElementById("guestCardchurch");
    const cardfriend = document.getElementById("guestCardfriend");
    const cardstaff = document.getElementById("guestCardstaff");

    if (cardhusband) {
        cardhusband.onclick = () => {
            window.location.href = cardhusband.dataset.url;
        };
    }

    if (cardwife) {
        cardwife.onclick = () => {
            window.location.href = cardwife.dataset.url;
        };
    }

    if (cardchurch) {
        cardchurch.onclick = () => {
            window.location.href = cardchurch.dataset.url;
        };
    }

    if (cardfriend) {
        cardfriend.onclick = () => {
            window.location.href = cardfriend.dataset.url;
        };
    }

    if (cardstaff) {
        cardstaff.onclick = () => {
            window.location.href = cardstaff.dataset.url;
        };
    }
});