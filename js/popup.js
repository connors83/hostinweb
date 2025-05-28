let popupShown = false;

function openPopup() {
    const popup = document.getElementById("popup");
    if (popup) {
        popup.style.display = "block";
        setTimeout(closePopup, 3000);
    }
}

function closePopup() {
    const popup = document.getElementById("popup");
    if (popup) {
        popup.style.display = "none";
    }
}

window.addEventListener("scroll", function () {
    const scrollPosition = window.scrollY + window.innerHeight;
    const triggerPoint = document.body.scrollHeight * 0.4; // 40%

    if (!popupShown && scrollPosition >= triggerPoint) {
        popupShown = true;
        openPopup();
    }
});

