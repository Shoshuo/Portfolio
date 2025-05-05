document.addEventListener("DOMContentLoaded", function () {
    const overlay = document.querySelector("[data-overlay]");

    // Ouvrir un modal
    document.querySelectorAll("[data-open-modal]").forEach(button => {
        button.addEventListener("click", function () {
            const modalId = this.getAttribute("data-open-modal");
            const modal = document.querySelector(`[data-modal="${modalId}"]`);

            if (modal) {
                modal.classList.add("active");
                overlay.classList.add("active");
            }
        });
    });

    // Fermer un modal
    document.querySelectorAll("[data-close-modal]").forEach(closeButton => {
        closeButton.addEventListener("click", function () {
            const modalId = this.getAttribute("data-close-modal");
            const modal = document.querySelector(`[data-modal="${modalId}"]`);

            if (modal) {
                modal.classList.remove("active");
                overlay.classList.remove("active");
            }
        });
    });

    // Fermer en cliquant sur l'overlay
    overlay.addEventListener("click", function () {
        document.querySelectorAll(".modal.active").forEach(modal => {
            modal.classList.remove("active");
        });
        overlay.classList.remove("active");
    });
});


// Modals pour PDF

document.getElementById("openModalPdf").addEventListener("click", function(event) {
    event.preventDefault();
    document.getElementById("modalPdf").classList.add("active");
    document.getElementById("overlayPdf").classList.add("active");
});

document.getElementById("closeModalPdf").addEventListener("click", function() {
    document.getElementById("modalPdf").classList.remove("active");
    document.getElementById("overlayPdf").classList.remove("active");
});

document.getElementById("overlayPdf").addEventListener("click", function() {
    document.getElementById("modalPdf").classList.remove("active");
    document.getElementById("overlayPdf").classList.remove("active");
});

document.getElementById("openModalPdfT").addEventListener("click", function(event) {
    event.preventDefault();
    document.getElementById("modalPdfT").classList.add("active");
    document.getElementById("overlayPdfT").classList.add("active");
});

document.getElementById("closeModalPdfT").addEventListener("click", function() {
    document.getElementById("modalPdfT").classList.remove("active");
    document.getElementById("overlayPdfT").classList.remove("active");
});

document.getElementById("overlayPdfT").addEventListener("click", function() {
    document.getElementById("modalPdfT").classList.remove("active");
    document.getElementById("overlayPdfT").classList.remove("active");
});